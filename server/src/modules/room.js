import crypto from 'crypto';
import { data, rotateArray, shuffleArray, insertRandom, addActions } from '../utils.js';
import { Instructions } from './instructions.js';

export class Room {
    constructor(maxPlayers) {
        this.maxPlayers = maxPlayers;
        this.deck = [];
        /**Used cards array */
        this.thrown = [];
        /**
         * players Map object
         * - key: socket ID
         * - publicId: UUID, used to select players on the client side
         * - readyFlag: used for game start
         * - cards: array of two-element arrays [<cardId>, <visible/not>]
         */
        this.players = new Map();
        this.roomClosed = false;
        this.gameActive = true;

        /**Determines the game order, consists of socket ID-s (strings) */
        this.queue = [];
        /**Points onto queue ID of player that currently has action to do */
        this.queuePointer = 0;
        /**Queue dir (used by reverse card) */
        this.queueDirection = true;
        /**Number of turns that player has to do before switching to another player */
        this.turns = 1;
        /**Temp field for counting the */
        this.turnsTemp = 0;
        /**Temp field to save the chosen person in sniper card action */
        this.queuePointerTemp = -1;

        /**Used to recover game state after usage of nu nu nu card */
        this.lastState = null;
        /**Determines whether last action can be recovered by nu nu nu card */
        this.negable = false;

        this.expectedAction = null;
        this.expectedActionPlayers = [];
        this.tempActionPlayer = null;
    }

    getPlayerList() {
        const list = [];
        for (const [id, player] of this.players.entries()) {
            list.push({ id, nickname: player.nickname });
        }
        return list;
    }

    // ? ========================== NOTE - PLAYER HANDLERS =============================

    addPlayer(id, nickname, name) {
        if (this.players.size < this.maxPlayers) {
            this.players.set(id, {
                publicId: crypto.randomUUID(),
                nickname: nickname,
                name: name,
                readyFlag: false,
                cards: []
            });
            return true;
        }
        return false;
    }

    _removeFromQueue(socketId) {
        const idx = this.queue.indexOf(socketId);
        if (idx === -1) return;
        if (idx < this.queuePointer) {
            this.queuePointer--;
        }
        this.queue.splice(idx, 1);
        if (this.queue.length > 0) {
            this.queuePointer = this.queuePointer % this.queue.length;
        } else {
            this.queuePointer = 0;
        }
    }

    /**
     * Handles HARD disconnect (tab closed).
     * Removes player from everywhere (Map and Queue).
     * @returns {Object} { wasPlayer: boolean, roomEmpty: boolean, gameActive: boolean }
     */
    disconnectPlayer(socketId) {
        if (!this.players.has(socketId)) {
            return { wasPlayer: false, roomEmpty: false, gameActive: false };
        }

        this._removeFromQueue(socketId);
        this.players.delete(socketId);

        return {
            wasPlayer: true,
            roomEmpty: this.players.size === 0,
            gameActive: this.roomClosed,
        };
    }

    /**
     * Handles Game Over for a player (Exploding Pig).
     * Removes from queue (cannot play), but keeps in Map (can spectate).
     */
    eliminatePlayer(socketId) {
        const p = this.players.get(socketId);
        if (!p) return false;
        this._removeFromQueue(socketId);
        return true;
    }

    /**Returns whether player is in the room */
    validatePlayer(playerId) {
        return this.players.has(playerId);
    }

    isGameOver() {
        if (this.queue.length === 1) {
            this.gameActive = false;
            return this.queue[0];
        }
        return false;
    }

    // ?  ======================= NOTE - NU NU NU SAVE HANDLERS =======================

    _getSnapshot() {
        const snapshot = {
            deck: [...this.deck],
            thrown: [...this.thrown],
            cards: {},

            queuePointer: this.queuePointer,
            queueDirection: this.queueDirection,
            turns: this.turns,
            turnsTemp: this.turnsTemp,
            queuePointerTemp: this.queuePointerTemp,

            expectedAction: this.expectedAction,
            expectedActionPlayers: [...this.expectedActionPlayers],
            tempActionPlayer: this.tempActionPlayer
        };

        for (const key of this.players.keys()) {
            snapshot.cards[key] = this.players.get(key).cards.map(card => [...card]);
        }

        return snapshot;
    }

    // ? ========================== NOTE - SAVE & SWAP ==========================

    /**Creates a game backup to restore after the usage of nu nu nu card */
    saveState() {
        this.lastState = this._getSnapshot();
        this.lastState.expectedAction = null;
    }

    swapStates(playerId) {
        // czy jest last state wogle
        if (!this.lastState) return false;

        // zapis aktualnego stanu
        const tempState = this._getSnapshot();

        const ls = this.lastState;

        this.deck = [...ls.deck];
        this.thrown = [...ls.thrown];
        this.queuePointer = ls.queuePointer;
        this.queueDirection = ls.queueDirection;
        this.turns = ls.turns;
        this.turnsTemp = ls.turnsTemp;
        this.queuePointerTemp = ls.queuePointerTemp;
        this.expectedAction = ls.expectedAction;
        this.expectedActionPlayers = [...ls.expectedActionPlayers];
        this.tempActionPlayer = ls.tempActionPlayer;

        for (const key of this.players.keys()) {
            if (ls.cards[key] && this.players.has(key)) {
                this.players.get(key).cards = ls.cards[key].map(card => [...card]);
            }
        }

        this.lastState = tempState;

        this.negable = true;

        return true;
    }

    // ? ========================= NOTE - HELPERS ================================

    indexesToCards(playerId, idx) {
        let cards = this.players.get(playerId).cards;
        return idx.map(x => cards[x][0]);
    }

    getQueueIndex(id) {
        return this.queue.indexOf(id);
    }

    getPlayerUuid(id) {
        const player = this.players.get(id);
        return player ? player.publicId : null;
    }

    getSocketIdByUuid(uuid) {
        for (const [socketId, player] of this.players.entries()) {
            if (player.publicId === uuid) return socketId;
        }
        return null;
    }

    isPlayerTurn(playerId) {
        return this.queue[this.queuePointer] === playerId && this.turns > 0;
    }

    // ? ============================ NOTE: GAME ACTIONS =====================================

    startGame() {
        let deck = [];
        Object.entries(data).forEach(([key, value]) => {
            if (key !== '1' && key !== '2') {
                deck = deck.concat(new Array(value.count).fill(key));
            }
        });
        shuffleArray(deck);
        for (const key of this.players.keys()) {
            let player = this.players.get(key);
            player.cards.push(['2', true]);
            for (let i = 0; i < 7; i++) {
                player.cards.push([deck.pop(), true]);
            }
            shuffleArray(player.cards);
            this.queue.push(key);
        }
        deck.push('2');
        for (const key of this.players.keys()) {
            deck.push('1');
        }
        shuffleArray(deck);
        this.deck = deck;
    }

    /**Gives a view of a game state based on player with the given id
     * @returns {{ [key: string]: string }}
     * - 'cards': queueID -> 'hand': cards, 'publicId', 'nickname'
     */
    serveCards(id) {
        if (!this.players.has(id)) return null;
        
        const res = {};
        res['deck'] = '0';
        res['thrown'] = this.thrown.length > 0 ? this.thrown.at(-1) : null;
        
        const cards = {};
        const isAlive = this.queue.includes(id);

        if (isAlive) {
            const index = this.queue.indexOf(id);
            const rotatedQueue = rotateArray(this.queue, index);

            for (let i = 0; i < rotatedQueue.length; i++) {
                const socketId = rotatedQueue[i];
                const player = this.players.get(socketId);
                
                const hand = [];
                for (const c of player.cards) {
                    hand.push(!c[1] || socketId === id ? c[0] : '0');
                }

                cards[i] = {
                    hand: hand,
                    publicId: player.publicId,
                    nickname: player.nickname,
                    isEliminated: false
                };
            }
        } else {
            const me = this.players.get(id);
            cards[0] = {
                hand: [],
                publicId: me.publicId,
                nickname: me.nickname,
            };

            for (let i = 0; i < this.queue.length; i++) {
                const socketId = this.queue[i];
                const player = this.players.get(socketId);
                
                const hand = [];
                for (const c of player.cards) {
                    hand.push('0');
                }

                cards[i + 1] = {
                    hand: hand,
                    publicId: player.publicId,
                    nickname: player.nickname
                };
            }
        }
        res['cards'] = cards;

        return res;
    }

    // Handles the queue direction, turns etc., should be runned after every change in this.turns
    handleQueue() {
        if (this.turns === 0) {
            if (this.queueDirection)
                this.queuePointer = (this.queuePointer + 1) % this.queue.length;
            else
                this.queuePointer = (this.queuePointer - 1 + this.queue.length) % this.queue.length;

            if (this.queuePointerTemp !== -1) this.queuePointer = this.queuePointerTemp;

            if (this.turnsTemp) this.turns = this.turnsTemp;
            else this.turns = 1;

            this.turnsTemp = 0;
            this.queuePointerTemp = -1;
        }
        // Return UUID for frontend consistency based on current pointer
        const currentSocketId = this.queue[this.queuePointer];
        const currentPublicId = this.players.get(currentSocketId).publicId;

        return [this.queuePointer, this.turns, currentPublicId];
    }

    modifyTurns(val) {
        this.turns = Math.max(0, this.turns + val);
    }

    setNegable(val) {
        this.negable = val;
    }

    removeCards(playerId, indexes) {
        const playerCards = this.players.get(playerId).cards;
        const sortedIndices = [...indexes].sort((a, b) => b - a);
        for (const c of sortedIndices) {
            const removedCard = playerCards.splice(c, 1)[0][0];
            this.thrown.push(removedCard);
        }
    }

    bombHandler(playerId) {
        console.log('player ' + playerId + ' got bomb uwu');
        const player = this.players.get(playerId);
        const idx = player.cards.findIndex(c => c[0] === '2');

        if (idx === -1) {
            while (player.cards.length > 0) {
                const cardTuple = player.cards.pop();
                this.thrown.push(cardTuple[0]);
            }
            this.thrown.push('1');

            this.eliminatePlayer(playerId);

            return {
                other: [Instructions.discard('1', this.getPlayerUuid(playerId)), Instructions.elimination(this.getPlayerUuid(playerId))],
                [playerId]: [Instructions.discard('1'), Instructions.elimination()]
            };
        } else {
            player.cards.splice(idx, 1);
            this.thrown.push('2');
            
            insertRandom(this.deck, '1');

            return {
                other: [Instructions.discard('2', this.getPlayerUuid(playerId))],
                [playerId]: [Instructions.discard('2')]
            };
        }
    }

    // ? ============================== NOTE: PLAYER SPECIAL ACTIONS HANDLERS =============================

    handlePlayerAction(playerId) {
        this.expectedActionPlayers = this.expectedActionPlayers.filter(p => p !== playerId);
        if (this.expectedActionPlayers.length === 0) {
            this.expectedAction = null;
            this.handleQueue();
        }
    }

    // ? ====== NOTE: PLAYER CARDS ACTIONS ======

    takeCardTop(playerId) {
        console.log('take top');
        if (this.deck.length > 0 && this.isPlayerTurn(playerId)) {
            this.setNegable(false);
            this.modifyTurns(-1);
            const card = this.deck.pop();
            let newActions = null;
            if (card === '1') newActions = this.bombHandler(playerId);
            else this.players.get(playerId).cards.push([card, true]);
            let actions = {
                [playerId]: [Instructions.move('deck', 'hand', card)],
                other: [Instructions.move('deck', playerId, '0')],
            };
            addActions(actions, newActions);
            return actions;
        }
        return null;
    }
}
