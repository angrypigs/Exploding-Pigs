import { Instructions } from '../modules/instructions.js';
import { getSecondInt, shuffleArray } from '../utils.js';

export default function cardsLogicSimple(room, playerId, cardId) {
    switch (cardId) {
        case '3':
            if (room.isPlayerTurn(playerId)) {
                room.saveState();
                room.modifyTurns(-1);
                room.negable = true;
                return {
                    [playerId]: [Instructions.discard('3')],
                    other: [Instructions.discard('3', room.getPlayerUuid(playerId))],
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
                    other: [Instructions.discard('4', room.getPlayerUuid(playerId))],
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
                    other: [Instructions.discard('5', room.getPlayerUuid(playerId))],
                };
            }
            return null;

        case '6':
            if (room.isPlayerTurn(playerId)) {
                if (room.queuePointerTemp !== -1) return null;
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
                    other: [Instructions.discard('6', room.getPlayerUuid(playerId))],
                };
            }
            return null;
        case '7':
            if (room.isPlayerTurn(playerId)) {
                room.saveState();
                room.negable = true;
                room.expectedAction = 'choosePlayerSniper';
                room.expectedActionPlayers = [playerId];
                return {
                    [playerId]: [Instructions.discard('7'), Instructions.choosePlayerSniper()],
                    other: [Instructions.discard('7', room.getPlayerUuid(playerId))],
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
                    other: [Instructions.discard('8', room.getPlayerUuid(playerId))],
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
                        Instructions.peekFuture(room.deck.slice(-n).reverse()),
                    ],
                    other: [Instructions.discard(`9_${n}`, room.getPlayerUuid(playerId))],
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
                    other: [Instructions.discard(`10_${n}`, room.getPlayerUuid(playerId))],
                };
            }
            return null;
        case '11':
            if (room.isPlayerTurn(playerId)) {
                room.saveState();
                room.negable = true;
                room.expectedAction = 'chooseCardFundraiser';
                room.expectedActionPlayers = [...room.players.keys()];
                return {
                    [playerId]: [Instructions.discard('11'), Instructions.chooseCardFundraiser()],
                    other: [
                        Instructions.discard('11', room.getPlayerUuid(playerId)),
                        Instructions.chooseCardFundraiser(),
                    ],
                };
            }
            return null;
        case '12':
            if (room.isPlayerTurn(playerId)) {
                room.saveState();
                room.negable = true;
                room.expectedAction = 'chooseCardFromPlayerProfanation';
                room.expectedActionPlayers = [playerId];
                return {
                    [playerId]: [
                        Instructions.discard('12'),
                        Instructions.chooseCardFromPlayerProfanation(),
                    ],
                    other: [Instructions.discard('12', room.getPlayerUuid(playerId))],
                };
            }
            return null;
        case '16':
            if (room.isPlayerTurn(playerId)) {
                room.saveState();
                room.negable = true;
                room.expectedAction = 'choosePlayerFavor';
                room.expectedActionPlayers = [playerId];
                return {
                    [playerId]: [Instructions.discard('16'), Instructions.choosePlayerFavor()],
                    other: [Instructions.discard('16', room.getPlayerUuid(playerId))],
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
                    other: [Instructions.discard('17', room.getPlayerUuid(playerId))],
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
                    other: [Instructions.discard('18', room.getPlayerUuid(playerId))],
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
                    [playerId]: [
                        Instructions.move('deck', 'hand', card),
                        Instructions.discard('18'),
                    ],
                    other: [
                        Instructions.move('deck', room.getPlayerUuid(playerId), '0'),
                        Instructions.discard('18', room.getPlayerUuid(playerId)),
                    ],
                };
            }
            return null;

        default:
            return null;
    }
}
