import crypto from 'crypto';
import { data, rotateArray, shuffleArray } from '../utils.js';

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
        /**Actions transaction flag */
        this.changeFlag = true;

        this.expectedAction = null;
        this.expectedActionPlayers = [];
    }

    addPlayer(id, nickname, name) {
        if (this.players.size < this.maxPlayers) {
            this.players.set(id, {
                publicId: crypto.randomUUID(),
                nickname: nickname,
                name: name,
                readyFlag: false,
                cards: [],
            });
            return true;
        }
        return false;
    }

    getPlayerList() {
        const list = [];
        for (const [id, player] of this.players.entries()) {
            list.push({ id, nickname: player.nickname });
        }
        return list;
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
            gameActive: this.roomClosed
        };
    }

    /**
     * Handles Game Over for a player (Exploding Pig).
     * Removes from queue (cannot play), but keeps in Map (can spectate).
     */
    eliminatePlayer(socketId) {
        if (!this.players.has(socketId)) return false;
        this._removeFromQueue(socketId);
        return true;
    }

    /**Returns whether player is in the room */
    validatePlayer(playerId) {
        return this.players.has(playerId);
    }

    /**Creates a game backup to restore after the usage of nu nu nu card */
    saveState() {
        this.changeFlag = false;
        this.lastState = {
            cards: {},
            thrown: [...this.thrown], // Kopia tablicy
            deck: [...this.deck],     // Kopia tablicy (fix błędu logicznego)
        };
        for (const key of this.players.keys()) {
            // Kopia kart każdego gracza
            this.lastState.cards[key] = this.players.get(key).cards.map(card => [...card]); 
        }
    }

    /**Adds last action to the last state and frees transaction flag */
    saveStateAction(action) {
        this.lastState['action'] = action;
        this.changeFlag = true;
    }

    /**Debug prints */
    printGame() {
        console.log(`Deck - ${this.deck}`);
        for (const socketId of this.queue) {
            console.log(`${socketId} - ${this.players.get(socketId).cards}`);
        }
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
            
            // Queue trzyma teraz tylko SocketID
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
        
        const index = this.queue.indexOf(id);
        const rotatedQueue = rotateArray(this.queue, index);
        
        const cards = {};
        for (const socketId of rotatedQueue) {
            const player = this.players.get(socketId);
            const hand = [];
            for (const c of player.cards) {
                hand.push(!c[1] || socketId === id ? c[0] : '0');
            }

            const playerIndex = rotatedQueue.indexOf(socketId);
            cards[playerIndex] = {
                hand: hand,
                publicId: player.publicId,
                nickname: player.nickname,
            };
        }
        res['cards'] = cards;
        return res;
    }

    indexesToCards(playerId, idx) {
        let cards = this.players.get(playerId).cards;
        return idx.map(x => cards[x][0]);
    }

    // Handles the queue direction, turns etc., should be runned after every change in this.turns
    handleQueue() {
        if (this.turns === 0) {
            if (this.queueDirection) this.queuePointer = (this.queuePointer + 1) % this.queue.length;
            else this.queuePointer = (this.queuePointer - 1 + this.queue.length) % this.queue.length;
            
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

    handlePlayerAction(playerId) {
        this.expectedActionPlayers = this.expectedActionPlayers.filter(p => p !== playerId);
        if (this.expectedActionPlayers.length === 0) {
            this.expectedAction = null;
            this.handleQueue();
        }
    }

    removeCards(playerId, indexes) {
        const playerCards = this.players.get(playerId).cards;
        const sortedIndices = [...indexes].sort((a, b) => b - a);
        for (const c of sortedIndices) {
            const removedCard = playerCards.splice(c, 1)[0][0];
            this.thrown.push(removedCard);
        }
    }

    isPlayerTurn(playerId) {
        return this.queue[this.queuePointer] === playerId;
    }

    // ? ====== NOTE: PLAYER CARDS ACTIONS ======

    takeCardTop(playerId) {
        console.log('take top');
        if (this.deck.length > 0 && this.isPlayerTurn(playerId) && this.turns > 0) {
            this.saveState();
            this.turns--;
            this.negable = false;
            const card = this.deck.pop();
            this.players.get(playerId).cards.push([card, true]);
            let actions = {
                [playerId]: [['move', 'deck', 'hand', card]],
                other: [['move', 'deck', playerId, '0']],
            };
            this.saveStateAction(actions);
            return actions;
        }
        return null;
    }

    takeCardBot(playerId) {
        console.log('take bottom');
        if (this.deck.length > 0 && this.isPlayerTurn(playerId) && this.turns > 0) {
            this.saveState();
            this.turns--;
            this.negable = false;
            const card = this.deck.shift(); // shift removes from start (bottom)
            this.players.get(playerId).cards.push([card, true]);
            let action = {
                [playerId]: [['move', 'deck', 'hand', card]],
                other: [['move', 'deck', playerId, '0']],
            };
            this.saveStateAction(action);
            return action;
        }
        return null;
    }

    seeNCardsTop(playerId, n) {
        console.log(`see ${n} cards`);
        if (this.isPlayerTurn(playerId) && this.turns > 0) {
            this.saveState();
            this.negable = false;
            let action = {
                [playerId]: [
                    ['move', 'hand', 'thrown', `9_${n}`],
                    ['peekFuture', this.deck.slice(-n).reverse()],
                ],
                other: [['move', playerId, 'thrown', `9_${n}`]],
            };
            this.saveStateAction(action);
            return action;
        }
        return null;
    }

    mixNCardsTop(playerId, n) {
        console.log(`change ${n} cards`);
        if (this.isPlayerTurn(playerId) && this.turns > 0) {
            this.saveState();
            this.negable = false;
            this.expectedAction = 'changeFuture';
            this.expectedActionPlayers = [playerId];
            let action = {
                [playerId]: [
                    ['move', 'hand', 'thrown', `10_${n}`],
                    ['changeFuture', this.deck.slice(-n).reverse()],
                ],
                other: [['move', playerId, 'thrown', `10_${n}`]],
            };
            this.saveStateAction(action);
            return action;
        }
        return null;
    }

    skipTurn(playerId) {
        console.log('skip');
        if (this.isPlayerTurn(playerId) && this.turns > 0) {
            this.saveState();
            this.turns--;
            this.negable = true;
            let action = {
                [playerId]: [['move', 'hand', 'thrown', '3']],
                other: [['move', playerId, 'thrown', '3']],
            };
            this.saveStateAction(action);
            return action;
        }
        return null;
    }

    skipAllTurns(playerId) {
        console.log('skip all');
        if (this.isPlayerTurn(playerId) && this.turns > 0) {
            this.saveState();
            this.turns = 0;
            this.negable = true;
            let action = {
                [playerId]: [['move', 'hand', 'thrown', '4']],
                other: [['move', playerId, 'thrown', '4']],
            };
            this.saveStateAction(action);
            return action;
        }
        return null;
    }

    shuffleDeck(playerId) {
        console.log('shuffle');
        if (this.isPlayerTurn(playerId) && this.turns > 0) {
            this.saveState();
            this.negable = true;
            shuffleArray(this.deck);
            let action = {
                [playerId]: [['move', 'hand', 'thrown', '8']],
                other: [['move', playerId, 'thrown', '8']],
            };
            this.saveStateAction(action);
            return action;
        }
        return null;
    }

    inverseQueue(playerId) {
        console.log('inverse');
        if (this.isPlayerTurn(playerId) && this.turns > 0) {
            this.saveState();
            this.negable = true;
            this.turns--;
            this.queueDirection = !this.queueDirection;
            let action = {
                [playerId]: [['move', 'hand', 'thrown', '5']],
                other: [['move', playerId, 'thrown', '5']],
            };
            this.saveStateAction(action);
            return action;
        }
        return null;
    }

    attackNTimesNext(playerId, n) {
        console.log(`attack ${n} times`);
        if (this.isPlayerTurn(playerId) && this.turns > 0) {
            this.saveState();
            this.negable = true;
            if (this.turnsTemp > n - 1) {
                this.turnsTemp += n;
            } else {
                this.turnsTemp = n;
            }
            this.turns--;
            let action = {
                [playerId]: [['move', 'hand', 'thrown', '6']],
                other: [['move', playerId, 'thrown', '6']],
            };
            this.saveStateAction(action);
            return action;
        }
        return null;
    }

    attackNTimesTarget(playerId, n, targetId) {}

    allBombsTop(playerId) {
        console.log('bombs on top');
        if (this.isPlayerTurn(playerId) && this.turns > 0) {
            this.saveState();
            this.negable = true;
            let oldLen = this.deck.length;
            this.deck = this.deck.filter(x => x !== '1');
            shuffleArray(this.deck);
            let bombs = Array(oldLen - this.deck.length).fill('1');
            this.deck = [...this.deck, ...bombs];
            let action = {
                [playerId]: [['move', 'hand', 'thrown', '17']],
                other: [['move', playerId, 'thrown', '17']],
            };
            this.saveStateAction(action);
            return action;
        }
        return null;
    }

    allBombsBot(playerId) {
        console.log('bombs on bottom');
        if (this.isPlayerTurn(playerId) && this.turns > 0) {
            this.saveState();
            this.negable = true;
            let oldLen = this.deck.length;
            this.deck = this.deck.filter(x => x !== '1');
            shuffleArray(this.deck);
            let bombs = Array(oldLen - this.deck.length).fill('1');
            this.deck = [...bombs, ...this.deck];
            let action = {
                [playerId]: [['move', 'hand', 'thrown', '18']],
                other: [['move', playerId, 'thrown', '18']],
            };
            this.saveStateAction(action);
            return action;
        }
        return null;
    }

    pissPlayer(playerId) {}

    takeRandomFromPlayer(playerId) {}

    nonono(playerId) {}

    // ? ====== NOTE: PLAYERS OTHER ACTIONS ======

    handleCardsMix(playerId, indexes) {
        console.log(`mixing cards with indexes ${indexes}`);
        this.saveState();
        const cutoff = this.deck.length - indexes.length;
        const bottomCards = this.deck.slice(0, cutoff);
        const topCardsOrig = this.deck.slice(cutoff);
        console.log(`top cards: ${topCardsOrig}`);
        const topCards = indexes.map(index => topCardsOrig[index]);
        console.log(`top cards after: ${topCards}`);
        this.deck = [...bottomCards, ...topCards];
        let action = {
            other: [],
        };
        this.handlePlayerAction(playerId);
        this.saveStateAction(action);
        return action;
    }
}