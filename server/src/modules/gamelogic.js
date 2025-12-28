import cardsLogicSimple from '../modules/cardsLogicSimple.js';
import { Instructions } from './instructions.js';

export function cardsValidation(room, playerId, cards) {
    switch (cards.length) {
        case 1:
            return cardsLogicSimple(room, playerId, cards[0]);
        default:
            return null;
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
            console.log(data);
            const publicId = room.getSocketIdByUuid(data);
            if (publicId === null) return null;
            console.log("socket id: " + data);
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
                    [room.tempActionPlayer]: [Instructions.move(attackedPlayer.publicId, 'hand', card)],
                    other: [Instructions.move(attackedPlayer.publicId, attackingPlayer.publicId, '0')],
                };
                room.handlePlayerAction(playerId);
                return action;
            }
            return null;
        }
        default:
            return null;
    }
}
