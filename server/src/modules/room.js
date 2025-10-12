import { shuffleArray, data } from "../utils.js";

export class Room {
    constructor(max_players) {
        this.max_players = max_players;
        this.deck = [];
        this.thrown = null;
        this.players = new Map();
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
        for (const key in this.players.keys()) {
            this.players.get(key).cards.push(["2", true]);
            for (let i = 0; i < 7; i++) {
                this.players.get(key).cards.push([deck.pop(), true]);
            }
            shuffleArray(this.players.get(key).cards);
        }
        deck.push("2");
        for (const key in this.players.keys()) {
            deck.push("1");
        }
        this.deck = deck;
    }

    serve_cards(id) {
        if (this.players.has(id)) {
            const res = {};
            res["deck"] = "0";
            res["thrown"] = this.thrown;
            const cards = {};
            for (const key in this.players.keys()) {
                const hand = [];
                for (const c of this.players.get(key).cards) {
                    hand.push((c[1] || key === id) ? "0" : c[0]);
                }
                cards[key] = hand;
            }
            res["cards"] = cards;
            return res;
        }
        return null;
    }

    take_card(id) {
        if (this.deck.length && this.players.has(id))
            return [["move", "deck", `${Array.from(myMap.keys()).indexOf(id)}:${this.players.get(id).cards.length + 1}`]];
        return null;
    }
}