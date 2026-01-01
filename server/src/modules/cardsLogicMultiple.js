import { Instructions } from '../modules/instructions.js';

export default function cardsLogicMultiple(room, playerId, cards) {
    cards.sort((a, b) => a.replace('_', '.') - b.replace('_', '.'));
    if (
        cards.length === 2 &&
        (cards[0] === cards[1] ||
            (cards[0] === '15' && cards[1].startsWith('14_')) ||
            (cards[1] === '15' && cards[0].startsWith('14_')))
    ) {
        room.saveState();
        room.expectedAction = 'chooseCardFromPlayerPair';
        room.expectedActionPlayers = [playerId];
        room.negable = true;
        let action = {
            [playerId]: [Instructions.discard(cards[1]), Instructions.chooseCardFromPlayerPair()],
            other: [Instructions.discard(cards[1], room.getPlayerUuid(playerId))],
        };
        return action;
    }
    return null;
}
