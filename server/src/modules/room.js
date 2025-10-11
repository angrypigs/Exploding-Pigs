import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STARTING_CARD_COUNT = 5;

export class Room {
    constructor(max_players) {
        this.max_players = max_players;
        this.deck = []
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

    make_deck() {
        const jsonPath = path.join(__dirname, '..', '..', '..', 'card_renderer', 'cards_data.json');

        const fileContent = fs.readFileSync(jsonPath, 'utf8');
        const cardData = JSON.parse(fileContent);

        const deck = [];
        for (const cardId in cardData) {
            const cardInfo = cardData[cardId];
            // Add a card to the deck for its 'count' number of times
            for (let i = 0; i < cardInfo.count; i++) {
                deck.push({ id: cardId, ...cardInfo });
            }
        }
        return deck
    }

    start_game() {
        console.log("starting game")
        this.deck = this.make_deck();

        for (const player of this.players.values()) {
            player.cards = this.draw_cards(STARTING_CARD_COUNT);
        }
    }

    draw_cards(amount) {
        const drawnCards = [];

        for (let i = 0; i < amount; i++) {
            if (this.deck.length === 0) {
                console.log("Not enough cards in the deck to draw the requested amount.");
                break;
            }

            const randomIndex = Math.floor(Math.random() * this.deck.length);

            const selectedCard = this.deck.splice(randomIndex, 1)[0];
            drawnCards.push(selectedCard);
        }

        return drawnCards;
    }
}