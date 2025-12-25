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
                case '6':
                    return room.attack_n_times_next(player_id, 2);
                case '8':
                    return room.shuffle_deck(player_id);
                case '9_3':
                    return room.see_n_cards_top(player_id, 3);
                case '9_4':
                    return room.see_n_cards_top(player_id, 4);
                case '9_5':
                    return room.see_n_cards_top(player_id, 5);
                case '10_3':
                    return room.mix_n_cards_top(player_id, 3);
                case '10_4':
                    return room.mix_n_cards_top(player_id, 4);
                case '10_5':
                    return room.mix_n_cards_top(player_id, 5);
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

export function actionsValidation(room, player_id, action_name, data) {
    switch (action_name) {
        case 'changeFuture':
            return room.handle_cards_mix(player_id, data);
        default:
            return null;
    } 
}
