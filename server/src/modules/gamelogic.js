//NOTE: CARDS VALIDATION FUNCTIONS + OBJ


//NOTE: ONLY SOME CARDS HAVE EFECT ALTHOUGH THE ALL POSIBLE THROWES COMBINATIONS ARE ALLOWED
export const VALID_OBJ = [
    valid_3, //             WORKING
    valid_4, //             WORKING
    valid_5, //             WORKING
    valid_6, //             WORKING
    valid_7, //             NOT WORKING
    valid_8, //             WORKING
    valid_9_3, //           NOT WORKING
    valid_9_4, //           NOT WORKING
    valid_9_5, //           NOT WORKING
    valid_10_3, //          NOT WORKING
    valid_10_4, //          NOT WORKING
    valid_10_5, //          NOT WORKING
    valid_11, //            NOT WORKING
    valid_12, //            NOT WORKING
    valid_13, //            NOT WORKING
    valid_14_1, //          NOT WORKING
    valid_14_2, //          NOT WORKING
    valid_14_3, //          NOT WORKING
    valid_14_4, //          NOT WORKING
    valid_14_5, //          NOT WORKING
    valid_16, //            NOT WORKING
    valid_17, //            WORKING
    valid_18, //            WORKING
    valid_19, //            WORKING
];

export function valid_3(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '3'
    ) {
        // skip 1
        return room.skip_turn(player_id);
    } else {
        return null;
    }
}

export function valid_4(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '4'
    ) {
        // skip all
        return room.skip_all_turns(player_id);
    } else {
        return null;
    }
}

export function valid_5(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '5'
    ) {
        // inverse
        return room.inverse_queue(player_id);
    } else {
        return null;
    }
}

export function valid_6(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '6'
    ) {
        //atack next
        //TODO: finish that later
        return room.attack_n_times_next(player_id, 2);
    } else {
        return null;
    }
}

export function valid_7(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '7'
    ) {
        //atack precise
        //TODO: finish that later
        return room.empty(player_id);
    } else {
        return null;
    }
}

export function valid_8(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '8'
    ) {
        //shuffle
        return room.shuffle_deck(player_id);
    } else {
        return null;
    }
}

export function valid_9_3(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '9_3'
    ) {
        //see 3 next
        //TODO: finish that later
        return room.empty(player_id);
    } else {
        return null;
    }
}

export function valid_9_4(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '9_4'
    ) {
        //see 4 next
        //TODO: finish that later
        return room.empty(player_id);
    } else {
        return null;
    }
}

export function valid_9_5(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '9_5'
    ) {
        //see 5 next
        //TODO: finish that later
        return room.empty(player_id);
    } else {
        return null;
    }
}

export function valid_10_3(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '10_3'
    ) {
        //mix 3 next
        return room.empty(player_id);
    } else {
        return null;
    }
}

export function valid_10_4(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '10_4'
    ) {
        //mix 4 next
        return room.empty(player_id);
    } else {
        return null;
    }
}

export function valid_10_5(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '10_5'
    ) {
        //mix 5 next
        return room.empty(player_id);
    } else {
        return null;
    }
}

export function valid_11(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '11'
    ) {
        //players give a chosen card back to deck
        return room.empty(player_id);
    } else {
        return null;
    }
}

export function valid_12(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '12'
    ) {
        //piss
        return room.empty(player_id);
    } else {
        return null;
    }
}

export function valid_13(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '13'
    ) {
        //nonono
        return room.empty(player_id);
    } else {
        return null;
    }
}

export function valid_14_1(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 2 &&
        (
            room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '14_1' &&
            room.players.get(player_id).cards[indexesOfSelectedCards[1]][0] === '14_1'
            ||
            room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '14_1' &&
            room.players.get(player_id).cards[indexesOfSelectedCards[1]][0] === '15'
            ||
            room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '15' &&
            room.players.get(player_id).cards[indexesOfSelectedCards[1]][0] === '14_1'
        )
    ) {
        //player give u random card
        return room.empty(player_id);
    } else {
        return null;
    }
}

export function valid_14_2(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 2 &&
        (
            room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '14_2' &&
            room.players.get(player_id).cards[indexesOfSelectedCards[1]][0] === '14_2'
            ||
            room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '14_2' &&
            room.players.get(player_id).cards[indexesOfSelectedCards[1]][0] === '15'
            ||
            room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '15' &&
            room.players.get(player_id).cards[indexesOfSelectedCards[1]][0] === '14_2'
        )
    ) {
        //player give u random card
        return room.empty(player_id);
    } else {
        return null;
    }
}

export function valid_14_3(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 2 &&
        (
            room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '14_3' &&
            room.players.get(player_id).cards[indexesOfSelectedCards[1]][0] === '14_3'
            ||
            room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '14_3' &&
            room.players.get(player_id).cards[indexesOfSelectedCards[1]][0] === '15'
            ||
            room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '15' &&
            room.players.get(player_id).cards[indexesOfSelectedCards[1]][0] === '14_3'
        )
    ) {
        //player give u random card
        return room.empty(player_id);
    } else {
        return null;
    }
}

export function valid_14_4(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 2 &&
        (
            room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '14_4' &&
            room.players.get(player_id).cards[indexesOfSelectedCards[1]][0] === '14_4'
            ||
            room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '14_4' &&
            room.players.get(player_id).cards[indexesOfSelectedCards[1]][0] === '15'
            ||
            room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '15' &&
            room.players.get(player_id).cards[indexesOfSelectedCards[1]][0] === '14_4'
        )
    ) {
        //player give u random card
        return room.empty(player_id);
    } else {
        return null;
    }
}

export function valid_14_5(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 2 &&
        (
            room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '14_5' &&
            room.players.get(player_id).cards[indexesOfSelectedCards[1]][0] === '14_5'
            ||
            room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '14_5' &&
            room.players.get(player_id).cards[indexesOfSelectedCards[1]][0] === '15'
            ||
            room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '15' &&
            room.players.get(player_id).cards[indexesOfSelectedCards[1]][0] === '14_5'
        )
    ) {
        //player give u random card
        return room.empty(player_id);
    } else {
        return null;
    }
}

export function valid_16(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '16'
    ) {
        //player give u chosen card
        return room.empty(player_id);
    } else {
        return null;
    }
}

export function valid_17(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '17'
    ) {
        //all bombs top + suffle rest
        console.log(room.players.get(player_id).cards);
        return room.all_bombs_top(player_id);
    } else {
        return null;
    }
}

export function valid_18(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '18'
    ) {
        //all bombs bot + suffle rest
        console.log(room.players.get(player_id).cards);
        return room.all_bombs_bot(player_id);
    } else {
        return null;
    }
}

export function valid_19(room, player_id, indexesOfSelectedCards) {
    if (
        indexesOfSelectedCards.length === 1 &&
        room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === '19'
    ) {
        //take from bottom
        return room.take_card_bot(player_id);
    } else {
        return null;
    }
}