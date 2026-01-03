import cardsLogicSimple from '../modules/cardsLogicSimple.js';
import { insertRandom, shuffleArray } from '../utils.js';
import cardsLogicMultiple from './cardsLogicMultiple.js';
import { Instructions } from './instructions.js';

export function cardsValidation(room, playerId, cards, cardsToRemove) {
    switch (cards.length) {
        case 1:
            return cardsLogicSimple(room, playerId, cards[0], cardsToRemove);
        default:
            return cardsLogicMultiple(room, playerId, cards, cardsToRemove);
    }
}

export function actionsValidation(room, playerId, action_name, data) {
    switch (action_name) {
        case 'changeFuture': {
            const cutoff = room.deck.length - data.length;
            const bottomCards = room.deck.slice(0, cutoff);
            const topCardsOrig = room.deck.slice(cutoff);
            const topCards = data.map(index => topCardsOrig[index]);
            room.deck = [...bottomCards, ...topCards];
            let action = {
                other: [],
            };
            room.handlePlayerAction(playerId);
            return action;
        }
        case 'choosePlayerSniper': {
            const publicId = room.getSocketIdByUuid(data);
            if (publicId === null) return null;
            const index = room.getQueueIndex(publicId);
            if (index === null) return null;
            room.queuePointerTemp = index;
            if (room.turnsTemp > 2 - 1) {
                room.turnsTemp += 2;
            } else {
                room.turnsTemp = 2;
            }
            room.modifyTurns(-1);
            let action = {
                other: [],
            };
            room.handlePlayerAction(playerId);
            return action;
        }
        case 'choosePlayerFavor': {
            const publicId = room.getSocketIdByUuid(data);
            if (publicId === null) return null;
            room.tempActionPlayer = playerId;
            room.expectedAction = 'chooseCardFavor';
            room.expectedActionPlayers = [publicId];
            let action = {
                [publicId]: [Instructions.chooseCardFavor()],
                other: [],
            };
            return action;
        }
        case 'chooseCardFavor': {
            if (room.tempActionPlayer !== null) {
                const attackingPlayer = room.players.get(room.tempActionPlayer);
                const attackedPlayer = room.players.get(playerId);

                const card = attackedPlayer.cards.splice(data, 1)[0][0];
                attackingPlayer.cards.push([card, true]);

                let action = {
                    [playerId]: [Instructions.move('hand', attackingPlayer.publicId, card)],
                    [room.tempActionPlayer]: [
                        Instructions.move(attackedPlayer.publicId, 'hand', card),
                    ],
                    other: [
                        Instructions.move(attackedPlayer.publicId, attackingPlayer.publicId, '0'),
                    ],
                };
                room.handlePlayerAction(playerId);
                return action;
            }
            return null;
        }
        case 'chooseCardFromPlayerProfanation': {
            const socketId = room.getSocketIdByUuid(data.player);
            if (socketId === null) return null;
            room.players.get(socketId).cards[data.card][1] = false;
            let action = {
                other: [],
            };
            room.handlePlayerAction(playerId);
            return action;
        }
        case 'chooseCardFundraiser': {
            const card = room.players.get(playerId).cards.splice(data, 1)[0][0];
            insertRandom(room.deck, card);
            room.handlePlayerAction(playerId);
            if (room.expectedAction === null) shuffleArray(room.deck);
            let action = {
                [playerId]: [Instructions.move('hand', 'deck', card)],
                other: [Instructions.move(room.getPlayerUuid(playerId), 'deck', '0')],
            };
            return action;
        }
        case 'chooseCardFromPlayerPair': {
            const socketId = room.getSocketIdByUuid(data.player);
            if (socketId === null) return null;
            console.log(action_name, data)
            const attackingPlayer = room.players.get(playerId);
            const attackedPlayer = room.players.get(socketId);
            const card = attackedPlayer.cards.splice(data.card, 1)[0][0];
            insertRandom(attackingPlayer.cards, [card, true]);
            let action = {
                [playerId]: [Instructions.move(attackedPlayer.publicId, 'hand', card)],
                [socketId]: [Instructions.move('hand', attackingPlayer.publicId, card)],
                other: [Instructions.move(attackedPlayer.publicId, attackingPlayer.publicId, '0')],
            };
            room.handlePlayerAction(playerId);
            return action;
        }
        default:
            return null;
    }
}
