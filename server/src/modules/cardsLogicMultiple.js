import { Instructions } from '../modules/instructions.js';

export default function cardsLogicMultiple(room, playerId, cards, cardsToRemove) {
    cards.sort((a, b) => a.replace('_', '.') - b.replace('_', '.'));
    if (
        cards.length === 2 &&
        (cards[0] === cards[1] ||
            (cards[0] === '15' && cards[1].startsWith('14_')) ||
            (cards[1] === '15' && cards[0].startsWith('14_')))
        && room.isPlayerTurn(playerId)
    ) {
        room.removeCards(playerId, cardsToRemove);
        room.saveState();
        room.setNegable(true);
        room.expectedAction = 'chooseCardFromPlayerPair';
        room.expectedActionPlayers = [playerId];
        let action = {
            [playerId]: [Instructions.discard(cards[1]), Instructions.chooseCardFromPlayerPair()],
            other: [Instructions.discard(cards[1], room.getPlayerUuid(playerId))],
        };
        return action;
    }
    return null;
}
