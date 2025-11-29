import { data, rotateArray, shuffleArray } from '../utils.js';

export class Room {
    constructor(max_players) {
        this.max_players = max_players;
        this.deck = [];
        this.thrown = [];
        this.players = new Map();
        this.room_closed = false;

        this.queue = [];
        this.queue_p = 0;
        this.queue_dir = true;
        this.turns = 1;
        this.turns_temp = 0;
        this.queue_p_temp = -1;

        this.last_state = null;
        this.negable = false;
        this.change_flag = true;
    }

    add_player(id, nickname, name) {
        if (this.players.size < this.max_players) {
            this.players.set(id, {
                nickname: nickname,
                name: name,
                readyFlag: false,
                nextTurn: false,
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

    validate_player(player_id) {
        return this.players.has(player_id);
    }

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

    save_state_action(action) {
        this.last_state['action'] = action;
        this.change_flag = true;
    }

    print_game() {
        console.log(`Deck - ${this.deck}`);
        for (const [socketId, idx] of this.queue) {
            console.log(`${socketId} - ${this.players.get(socketId).cards}`);
        }
    }

    get_queue_index(id) {
        return this.queue.findIndex(s => s[0] === id);
    }

    start_game() {
        let deck = [];
        Object.entries(data).forEach(([key, value]) => {
            if (key !== '1' && key !== '2') {
                deck = deck.concat(new Array(value.count).fill(key));
            }
        });
        shuffleArray(deck);
        let counter = 0;
        for (const key of this.players.keys()) {
            this.players.get(key).cards.push(['2', true]);
            for (let i = 0; i < 7; i++) {
                this.players.get(key).cards.push([deck.pop(), true]);
            }
            shuffleArray(this.players.get(key).cards);
            this.queue.push([key, counter]);
            counter++;
        }
        deck.push('2');
        for (const key of this.players.keys()) {
            deck.push('1');
        }
        shuffleArray(deck);
        this.deck = deck;
    }

    serve_cards(id) {
        if (!this.players.has(id)) return null;
        const res = {};
        res['deck'] = '0';
        res['thrown'] = this.thrown.length > 0 ? this.thrown.at(-1) : null;
        const index = this.queue.findIndex(([socketId]) => socketId === id);
        const rotatedQueue = rotateArray(this.queue, index);
        const cards = {};
        for (const [socketId] of rotatedQueue) {
            const hand = [];
            for (const c of this.players.get(socketId).cards) {
                hand.push(!c[1] || socketId === id ? c[0] : '0');
            }
            const playerIndex = rotatedQueue.findIndex(s => s[0] === socketId);
            cards[playerIndex] = hand;
        }
        res['cards'] = cards;
        return res;
    }

    handle_queue() {
        if (this.turns === 0) {
            if (this.queue_dir) this.queue_p = (this.queue_p + 1) % this.queue.length;
            else this.queue_p = (this.queue_p - 1 + this.queue.length) % this.queue.length;
            if (this.queue_p_temp !== -1) this.queue_p = this.queue_p_temp;
            if (this.turns_temp) this.turns = this.turns_temp;
            else this.turns = 1;
        }
        return [this.queue_p, this.turns];
    }

    //NOTE: PLAYER ACTIONS

    is_player_turn(player_id) {
        return this.queue[this.queue_p][0] === player_id;
    }

    take_card_top(player_id) {
        console.log('take top');
        if (this.deck.length > 0 && this.is_player_turn(player_id) && this.turns > 0) {
            this.turns--;
            this.save_state();
            this.negable = false;
            this.players.get(player_id).cards.push([this.deck.pop(), true]);
            let action = [['move', 'deck', `${this.get_queue_index(player_id)}`, '0']];
            this.save_state_action(action);
            return action;
        }
        return null;
    }

    take_card_bot(player_id) {
        console.log('take bottom');
        if (this.deck.length > 0 && this.is_player_turn(player_id) && this.turns > 0) {
            this.turns--;
            this.save_state();
            this.negable = false;
            this.players.get(player_id).cards.push([this.deck.shift(), true]);
            let action = [['move', 'deck', `${this.get_queue_index(player_id)}`, '0']];
            this.save_state_action(action);
            return action;
        }
        return null;
    }

    see_n_cards_top(player_id, n) {}

    mix_n_cards_top(player_id, n) {}

    skip_turn(player_id) {
        console.log('skip');
        if (this.is_player_turn(player_id) && this.turns > 0) {
            this.save_state();
            this.turns--;
            this.negable = true;
            let action = [['move', `${this.get_queue_index(player_id)}`, 'thrown', '3']];
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
            let action = [['move', `${this.get_queue_index(player_id)}`, 'thrown', '4']];
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
            let action = [['move', `${this.get_queue_index(player_id)}`, 'thrown', '8']];
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
            let action = [['move', `${this.get_queue_index(player_id)}`, 'thrown', '5']];
            this.save_state_action(action);
            return action;
        }
        return null;
    }

    attack_n_times(player_id, n, target_id) {}

    all_bombs_top(player_id) {
        //TODO: this
    }

    all_bombs_bot(player_id) {
        //TODO: this
    }

    piss_player(player_id) {}

    take_random_from_player(player_id) {}

    nonono(player_id) {}
}
