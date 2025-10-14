import { rotateArray, shuffleArray, data } from "../utils.js";

export class Room {
    constructor(max_players) {
        this.max_players = max_players;
        this.deck = [];
        this.thrown = null;
        this.players = new Map();
        this.room_closed = false;
        this.queue = [];
        this.queue_p = 0;
        this.queue_dir = true;
        this.turns = 1;
    }

    add_player(id, nickname, name) {
        if (this.players.size < this.max_players) {
            this.players.set(id, {
                nickname: nickname,
                name: name,
                readyFlag: false,
                cards: []
            });
            return true;
        }
        else return false;
    }

    get_player_list() {
        const list = [];
        for (const [id, player] of this.players.entries()) {
            list.push({ id, nickname: player.nickname });
        }
        return list;
    }

    start_game() {
        let deck = [];
        Object.entries(data).map(([key, value]) => {
            if (key !== "1" && key !== "2") {
                deck = deck.concat(new Array(value.count).fill(key));
            }
        });
        shuffleArray(deck);
        let counter = 0;
        for (const key of this.players.keys()) {
            this.players.get(key).cards.push(["2", true]);
            for (let i = 0; i < 7; i++) {
                this.players.get(key).cards.push([deck.pop(), true]);
            }
            shuffleArray(this.players.get(key).cards);
            this.queue.push([key, 'player' + counter])
            counter += 1;
        }
        deck.push("2");
        for (const key of this.players.keys()) {
            deck.push("1");
        }
        shuffleArray(deck);
        this.deck = deck;
    }

    serve_cards(id) {
        if (this.players.has(id)) {
            const res = {};
            res["deck"] = "0";
            res["thrown"] = this.thrown;

            const index = this.queue.findIndex(([socketId]) => socketId === id);
            const rotatedQueue = rotateArray(this.queue, index);
            const cards = {};
            for (const [socketId, playerName] of rotatedQueue) {
                const hand = [];
                for (const c of this.players.get(socketId).cards) {
                    hand.push((!c[1] || socketId === id) ? c[0] : "0");
                }
                cards[playerName] = hand;
            }
            res["cards"] = cards;
            return res;
        }
        return null;
    }

    handle_queue() {
        if (this.turns === 1) {
            if (this.queue_dir) this.queue_p = (this.queue_p + 1) % this.queue.length;
            else this.queue_p = (this.queue_p - 1 + this.queue.length) % this.queue.length;
        }
            
    }

    take_card(id) {
        if (this.deck.length && this.players.has(id) && this.queue[this.queue_p][0] === id) {
            let index = this.queue.findIndex(s => s[0] === id);
            this.players.get(id).cards.push(this.deck.pop());
            
            return [["move", "deck", `${this.queue[index][1]}:${this.players.get(id).cards.length + 1}`]];
        }
        return null;
    }

    print_game() {
        console.log(`Deck - ${this.deck}`);
        for (const l of this.queue) {
            console.log(`${l[0]} - ${this.players.get(l[0]).cards}`);
        }
    }
} 