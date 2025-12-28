import { Instructions } from '../modules/instructions.js';
import { getSecondInt, shuffleArray } from "../utils.js";

export default function cardsLogicSimple(room, playerId, cardId) {
    switch (cardId) {
        case '3':
            if (room.isPlayerTurn(playerId)) {
                room.saveState();
                room.modifyTurns(-1);
                room.negable = true;
                return {
                    [playerId]: [Instructions.discard('3')],
                    other: [Instructions.discard('3', playerId)],
                };
            }
            return null;

        case '4':
            if (room.isPlayerTurn(playerId)) {
                room.saveState();
                room.modifyTurns(-99);
                room.negable = true;
                return {
                    [playerId]: [Instructions.discard('4')],
                    other: [Instructions.discard('4', playerId)],
                };
            }
            return null;

        case '5':
            if (room.isPlayerTurn(playerId)) {
                room.saveState();
                room.negable = true;
                room.modifyTurns(-1);
                room.queueDirection = !room.queueDirection;
                return {
                    [playerId]: [Instructions.discard('5')],
                    other: [Instructions.discard('5', playerId)],
                };
            }
            return null;

        case '6':
            if (room.isPlayerTurn(playerId)) {
                room.saveState();
                room.negable = true;
                if (room.turnsTemp > 2 - 1) {
                    room.turnsTemp += 2;
                } else {
                    room.turnsTemp = 2;
                }
                room.modifyTurns(-1);
                return {
                    [playerId]: [Instructions.discard('6')],
                    other: [Instructions.discard('6', playerId)],
                };
            }
            return null;

        case '8':
            if (room.isPlayerTurn(playerId)) {
                room.saveState();
                room.negable = true;
                shuffleArray(room.deck);
                return {
                    [playerId]: [Instructions.discard('8')],
                    other: [
                        Instructions.discard('8', playerId), 
                    ],
                };
            }
            return null;

        case '9_3':
        case '9_4':
        case '9_5':
            if (room.isPlayerTurn(playerId)) {
                let n = getSecondInt(cardId);
                room.saveState();
                room.negable = false;
                return {
                    [playerId]: [
                        Instructions.discard(`9_${n}`),
                        Instructions.peekFuture(room.deck.slice(-n).reverse())
                    ],
                    other: [Instructions.discard('0', playerId)],
                };
            }
            return null;

        case '10_3':
        case '10_4':
        case '10_5':
            if (room.isPlayerTurn(playerId)) {
                let n = getSecondInt(cardId);
                room.saveState();
                room.negable = false;
                room.expectedAction = 'changeFuture';
                room.expectedActionPlayers = [playerId];
                return {
                    [playerId]: [
                        Instructions.discard(`10_${n}`),
                        Instructions.changeFuture(room.deck.slice(-n).reverse()),
                    ],
                    other: [Instructions.discard(`10_${n}`, playerId)],
                };
            }
            return null;

        case '17':
            if (room.isPlayerTurn(playerId)) {
                room.saveState();
                room.negable = true;
                let oldLen = room.deck.length;
                room.deck = room.deck.filter(x => x !== '1');
                shuffleArray(room.deck);
                let bombs = Array(oldLen - room.deck.length).fill('1');
                room.deck = [...room.deck, ...bombs];
                return {
                    [playerId]: [Instructions.discard('17')],
                    other: [Instructions.discard('17', playerId)],
                };
            }
            return null;

        case '18':
            if (room.isPlayerTurn(playerId)) {
                room.saveState();
                room.negable = true;
                let oldLen = room.deck.length;
                room.deck = room.deck.filter(x => x !== '1');
                shuffleArray(room.deck);
                let bombs = Array(oldLen - room.deck.length).fill('1');
                room.deck = [...bombs, ...room.deck];
                return {
                    [playerId]: [Instructions.discard('18')],
                    other: [Instructions.discard('18', playerId)],
                };
            }
            return null;

        case '19':
            if (room.deck.length > 0 && room.isPlayerTurn(playerId)) {
                room.saveState();
                room.modifyTurns(-1);
                room.negable = false;
                const card = room.deck.shift();
                room.players.get(playerId).cards.push([card, true]);
                return {
                    [playerId]: [Instructions.move('deck', 'hand', card)],
                    other: [Instructions.move('deck', playerId, '0')],
                };
            }
            return null;

        default:
            return null;
    }
}