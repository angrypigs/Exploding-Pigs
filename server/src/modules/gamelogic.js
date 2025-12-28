import cardsLogicSimple from '../modules/cardsLogicSimple.js'

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
        case 'changeFuture':
            room.saveState();
            const cutoff = room.deck.length - data.length;
            const bottomCards = room.deck.slice(0, cutoff);
            const topCardsOrig = room.deck.slice(cutoff);
            console.log(`top cards: ${topCardsOrig}`);
            const topCards = data.map(index => topCardsOrig[index]);
            console.log(`top cards after: ${topCards}`);
            room.deck = [...bottomCards, ...topCards];
            let action = {
                other: [],
            };
            room.handlePlayerAction(playerId);
            return action;
        default:
            return null;
    }
}
