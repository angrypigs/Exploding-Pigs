import crypto from 'crypto';
import { data, rotateArray, shuffleArray } from '../utils.js';

export class Room {
    constructor(max_players) {
        this.max_players = max_players;
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
        this.room_closed = false;

        /**Determines the game order, consists of socket ID-s */
        this.queue = [];
        /**Points onto queue ID of player that currently has action to do */
        this.queue_p = 0;
        /**Queue dir (used by reverse card) */
        this.queue_dir = true;
        /**Number of turns that player has to do before switching to another player */
        this.turns = 1;
        /**Temp field for counting the */
        this.turns_temp = 0;
        /**Temp field to save the chosen person in sniper card action */
        this.queue_p_temp = -1;

        /**Used to recover game state after usage of nu nu nu card */
        this.last_state = null;
        /**Determines whether last action can be recovered by nu nu nu card */
        this.negable = false;
        /**Actions transaction flag */
        this.change_flag = true;

        this.expected_action = null;
        this.expected_action_players = [];
    }

    add_player(id, nickname, name) {
        if (this.players.size < this.max_players) {
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

    get_player_list() {
        const list = [];
        for (const [id, player] of this.players.entries()) {
            list.push({ id, nickname: player.nickname });
        }
        return list;
    }

    /**Returns whether player is in the room */
    validate_player(player_id) {
        return this.players.has(player_id);
    }

    /**Creates a game backup to restore after the usage of nu nu nu card */
    save_state() {
        this.change_flag = false;
        this.last_state = {
            cards: {},
            thrown: this.thrown,
            deck: { ...this.deck },
        };
        for (const key of this.players.keys()) {
            this.last_state.cards[key] = { ...this.players.get(key).cards };
        }
    }

    /**Adds last action to the last state and frees transaction flag */
    save_state_action(action) {
        this.last_state['action'] = action;
        this.change_flag = true;
    }

    /**Debug prints */
    print_game() {
        console.log(`Deck - ${this.deck}`);
        for (const [socketId, idx] of this.queue) {
            console.log(`${socketId} - ${this.players.get(socketId).cards}`);
        }
    }

    get_queue_index(id) {
        return this.queue.findIndex(s => s[0] === id);
    }

    get_player_uuid(id) {
        const item = this.queue.find(s => s[0] === id);
        return item ? item[1] : null;
    }

    start_game() {
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
            const pubId = player.publicId;
            this.queue.push([key, pubId]);
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
    serve_cards(id) {
        if (!this.players.has(id)) return null;
        const res = {};
        res['deck'] = '0';
        res['thrown'] = this.thrown.length > 0 ? this.thrown.at(-1) : null;
        const index = this.queue.findIndex(([socketId]) => socketId === id);
        const rotatedQueue = rotateArray(this.queue, index);
        const cards = {};
        for (const [socketId, publicId] of rotatedQueue) {
            const hand = [];
            for (const c of this.players.get(socketId).cards) {
                hand.push(!c[1] || socketId === id ? c[0] : '0');
            }

            const playerIndex = rotatedQueue.findIndex(s => s[0] === socketId);
            cards[playerIndex] = {
                hand: hand,
                publicId: publicId,
                nickname: this.players.get(socketId).nickname,
            };
        }
        res['cards'] = cards;
        return res;
    }

    indexes_to_cards(player_id, idx) {
        let cards = this.players.get(player_id).cards;
        return idx.map(x => cards[x][0]);
    }

    // Handles the queue direction, turns etc., should be runned after every change in this.turns
    handle_queue() {
        if (this.turns === 0) {
            if (this.queue_dir) this.queue_p = (this.queue_p + 1) % this.queue.length;
            else this.queue_p = (this.queue_p - 1 + this.queue.length) % this.queue.length;
            if (this.queue_p_temp !== -1) this.queue_p = this.queue_p_temp;
            if (this.turns_temp) this.turns = this.turns_temp;
            else this.turns = 1;
            this.turns_temp = 0;
            this.queue_p_temp = -1;
        }
        return [this.queue_p, this.turns, this.queue[this.queue_p][1]];
    }

    remove_cards(player_id, indexes) {
        const playerCards = this.players.get(player_id).cards;
        const sortedIndices = [...indexes].sort((a, b) => b - a);
        for (const c of sortedIndices) {
            const removedCard = playerCards.splice(c, 1)[0][0];
            this.thrown.push(removedCard);
        }
    }

    is_player_turn(player_id) {
        return this.queue[this.queue_p][0] === player_id;
    }

    // ? ====== NOTE: PLAYER CARDS ACTIONS ======

    take_card_top(player_id) {
        console.log('take top');
        if (this.deck.length > 0 && this.is_player_turn(player_id) && this.turns > 0) {
            this.save_state();
            this.turns--;
            this.negable = false;
            const card = this.deck.pop();
            this.players.get(player_id).cards.push([card, true]);
            let actions = {
                [player_id]: [['move', 'deck', 'hand', card]],
                other: [['move', 'deck', player_id, '0']],
            };
            this.save_state_action(actions);
            return actions;
        }
        return null;
    }

    take_card_bot(player_id) {
        console.log('take bottom');
        if (this.deck.length > 0 && this.is_player_turn(player_id) && this.turns > 0) {
            this.save_state();
            this.turns--;
            this.negable = false;
            this.players.get(player_id).cards.push([this.deck.shift(), true]);
            let action = {
                [player_id]: [['move', 'deck', 'hand', card]],
                other: [['move', 'deck', player_id, '0']],
            };
            this.save_state_action(action);
            return action;
        }
        return null;
    }

    see_n_cards_top(player_id, n) {
        console.log(`see ${n} cards`);
        if (this.is_player_turn(player_id) && this.turns > 0) {
            this.save_state();
            this.negable = false;
            let action = {
                [player_id]: [
                    ['move', 'hand', 'thrown', `9_${n}`],
                    ['peekFuture', this.deck.slice(-n).reverse()],
                ],
                other: [['move', player_id, 'thrown', `9_${n}`]],
            };
            this.save_state_action(action);
            return action;
        }
        return null;
    }

    mix_n_cards_top(player_id, n) {
        console.log(`change ${n} cards`);
        if (this.is_player_turn(player_id) && this.turns > 0) {
            this.save_state();
            this.negable = false;
            this.expected_action = 'changeFuture';
            this.expected_action_players = [player_id];
            let action = {
                [player_id]: [
                    ['move', 'hand', 'thrown', `10_${n}`],
                    ['changeFuture', this.deck.slice(-n).reverse()],
                ],
                other: [['move', player_id, 'thrown', `10_${n}`]],
            };
            this.save_state_action(action);
            return action;
        }
        return null;
    }

    skip_turn(player_id) {
        console.log('skip');
        if (this.is_player_turn(player_id) && this.turns > 0) {
            this.save_state();
            this.turns--;
            this.negable = true;
            let action = {
                [player_id]: [['move', 'hand', 'thrown', '3']],
                other: [['move', player_id, 'thrown', '3']],
            };
            this.save_state_action(action);
            return action;
        }
        return null;
    }

    skip_all_turns(player_id) {
        console.log('skip all');
        if (this.is_player_turn(player_id) && this.turns > 0) {
            this.save_state();
            this.turns = 0;
            this.negable = true;
            let action = {
                [player_id]: [['move', 'hand', 'thrown', '4']],
                other: [['move', player_id, 'thrown', '4']],
            };
            this.save_state_action(action);
            return action;
        }
        return null;
    }

    shuffle_deck(player_id) {
        console.log('shuffle');
        if (this.is_player_turn(player_id) && this.turns > 0) {
            this.save_state();
            this.negable = true;
            shuffleArray(this.deck);
            let action = {
                [player_id]: [['move', 'hand', 'thrown', '8']],
                other: [['move', player_id, 'thrown', '8']],
            };
            this.save_state_action(action);
            return action;
        }
        return null;
    }

    inverse_queue(player_id) {
        console.log('inverse');
        if (this.is_player_turn(player_id) && this.turns > 0) {
            this.save_state();
            this.negable = true;
            this.turns--;
            this.queue_dir = !this.queue_dir;
            let action = {
                [player_id]: [['move', 'hand', 'thrown', '5']],
                other: [['move', player_id, 'thrown', '5']],
            };
            this.save_state_action(action);
            return action;
        }
        return null;
    }

    attack_n_times_next(player_id, n) {
        console.log(`attack ${n} times`);
        if (this.is_player_turn(player_id) && this.turns > 0) {
            this.save_state();
            this.negable = true;
            if (this.turns_temp > n - 1) {
                this.turns_temp += n;
            } else {
                this.turns_temp = n;
            }
            this.turns--;
            let action = {
                [player_id]: [['move', 'hand', 'thrown', '6']],
                other: [['move', player_id, 'thrown', '6']],
            };
            this.save_state_action(action);
            return action;
        }
        return null;
    }

    attack_n_times_target(player_id, n, target_id) {}

    all_bombs_top(player_id) {
        console.log('bombs on top');
        if (this.is_player_turn(player_id) && this.turns > 0) {
            this.save_state();
            this.negable = true;
            let old_len = this.deck.length;
            this.deck = this.deck.filter(x => x !== '1');
            shuffleArray(this.deck);
            let bombs = Array(old_len - this.deck.length).fill('1');
            this.deck = [...this.deck, ...bombs];
            let action = {
                [player_id]: [['move', 'hand', 'thrown', '17']],
                other: [['move', player_id, 'thrown', '17']],
            };
            this.save_state_action(action);
            return action;
        }
        return null;
    }

    all_bombs_bot(player_id) {
        console.log('bombs on bottom');
        if (this.is_player_turn(player_id) && this.turns > 0) {
            this.save_state();
            this.negable = true;
            let old_len = this.deck.length;
            this.deck = this.deck.filter(x => x !== '1');
            shuffleArray(this.deck);
            let bombs = Array(old_len - this.deck.length).fill('1');
            this.deck = [...bombs, ...this.deck];
            let action = {
                [player_id]: [['move', 'hand', 'thrown', '18']],
                other: [['move', player_id, 'thrown', '18']],
            };
            this.save_state_action(action);
            return action;
        }
        return null;
    }

    piss_player(player_id) {}

    take_random_from_player(player_id) {}

    nonono(player_id) {}

    // ? ====== NOTE: PLAYERS OTHER ACTIONS ======

    handle_cards_mix(player_id, indexes) {
        console.log(`mixing cards with indexes ${indexes}`);
        this.save_state();
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
        this.save_state_action(action);
        return action;
    }
}
