export function cardsValidation(room, player_id, cardsIdx) {
    switch (cardsIdx.length) {
        case 1:
            switch (cardsIdx[0]) {
                case '3':
                    return room.skipTurn(player_id);
                case '4':
                    return room.skipAllTurns(player_id);
                case '5':
                    return room.inverseQueue(player_id);
                case '6':
                    return room.attackNTimesNext(player_id, 2);
                case '8':
                    return room.shuffleDeck(player_id);
                case '9_3':
                    return room.seeNCardsTop(player_id, 3);
                case '9_4':
                    return room.seeNCardsTop(player_id, 4);
                case '9_5':
                    return room.seeNCardsTop(player_id, 5);
                case '10_3':
                    return room.mixNCardsTop(player_id, 3);
                case '10_4':
                    return room.mixNCardsTop(player_id, 4);
                case '10_5':
                    return room.mixNCardsTop(player_id, 5);
                case '17':
                    return room.allBombsTop(player_id);
                case '18':
                    return room.allBombsBot(player_id);
                case '19':
                    return room.takeCardBot(player_id);
                default:
                    return null;
            }
        default:
            return null;
    }
}

export function actionsValidation(room, player_id, action_name, data) {
    switch (action_name) {
        case 'changeFuture':
            return room.handleCardsMix(player_id, data);
        default:
            return null;
    } 
}