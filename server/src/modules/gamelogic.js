//NOTE: CARDS VALIDATION FUNCTIONS + OBJ

export function cardsValidation(room, player_id, cardsIdx) {
    switch (cardsIdx.length) {
        case 1:
            switch (cardsIdx[0]) {
                case '3':
                    return room.skip_turn(player_id);
                case '4':
                    return room.skip_all_turns(player_id);
                case '5':
                    return room.inverse_queue(player_id);
                case '8':
                    return room.shuffle_deck(player_id);
                case '17':
                    return room.all_bombs_top(player_id);
                case '18':
                    return room.all_bombs_bot(player_id);
                case '19':
                    return room.take_card_bot(player_id);
                default:
                    return null;
            }
        default:
            return null;
    }
}

