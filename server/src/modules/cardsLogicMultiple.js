import { Instructions } from '../modules/instructions.js';

export default function cardsLogicMultiple(room, playerId, cards, cardsToRemove) {
    cards.sort((a, b) => a.replace('_', '.') - b.replace('_', '.'));

    if (
        cards.length === 2 &&
        (cards[0] === cards[1] ||
            (cards[0] === '15' && cards[1].startsWith('14_')) ||
            (cards[1] === '15' && cards[0].startsWith('14_'))) &&
        room.isPlayerTurn(playerId)
    ) {
        room.removeCards(playerId, cardsToRemove);
        room.saveState();
        room.setNegable(true);

        let action = {
            [playerId]: [Instructions.discard(cards[1])],
            other: [Instructions.discard(cards[1], room.getPlayerUuid(playerId))],
        };

        const othersWithCards = room.queue.some(
            id => id !== playerId && room.players.get(id).cards.length > 0
        );

        if (othersWithCards) {
            room.expectedAction = 'chooseCardFromPlayerPair';
            room.expectedActionPlayers = [playerId];
            action[playerId].push(Instructions.chooseCardFromPlayerPair());
        }

        return action;
    }
    return null;
}
