//NOTE: CARDS VALIDATION FUNCTIONS + OBJ

export const VALID_OBJ =
    [
        valid_3,
        valid_4,
        valid_5,
        valid_6,
        valid_7,
        valid_8,
        valid_9_3,
        valid_9_4,
        valid_9_5,
        // valid_10_3,
        // valid_10_4,
        // valid_10_5,
        // valid_11,
        // valid_12,
        // valid_13,
        // valid_14,
        // valid_15,
        // valid_16,
        // valid_17,
        // valid_18,
        valid_19
    ];

export function valid_3(room, player_id, indexesOfSelectedCards) {
    if ((indexesOfSelectedCards.length === 1) && (room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "3")) {
        //skip 1

        return true;
    }
    else {
        return false;
    }
}

export function valid_4(room, player_id, indexesOfSelectedCards) {
    if ((indexesOfSelectedCards.length === 1) && (room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "4")) {
        //skip all
        return true;
    }
    else {
        return false;
    }
}

export function valid_5(room, player_id, indexesOfSelectedCards) {
    if ((indexesOfSelectedCards.length === 1) && (room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "5")) {
        //skip 1 + inverse
        return true;
    }
    else {
        return false;
    }
}

export function valid_6(room, player_id, indexesOfSelectedCards) {
    if ((indexesOfSelectedCards.length === 1) && (room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "6")) {
        //atack next
        return true;
    }
    else {
        return false;
    }
}

export function valid_7(room, player_id, indexesOfSelectedCards) {
    if ((indexesOfSelectedCards.length === 1) && (room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "7")) {
        //atack precise
        return true;
    }
    else {
        return false;
    }
}

export function valid_8(room, player_id, indexesOfSelectedCards) {
    if ((indexesOfSelectedCards.length === 1) && (room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "8")) {
        //shuffle
        return true;
    }
    else {
        return false;
    }
}

export function valid_9_3(room, player_id, indexesOfSelectedCards) {
    if ((indexesOfSelectedCards.length === 1) && (room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "9_3")) {
        //see 3 next
        return true;
    }
    else {
        return false;
    }
}

export function valid_9_4(room, player_id, indexesOfSelectedCards) {
    if ((indexesOfSelectedCards.length === 1) && (room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "9_4")) {
        //see 4 next
        return true;
    }
    else {
        return false;
    }
}

export function valid_9_5(room, player_id, indexesOfSelectedCards) {
    if ((indexesOfSelectedCards.length === 1) && (room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "9_5")) {
        //see 5 next
        return true;
    }
    else {
        return false;
    }
}


// export function valid_10_3(room, player_id, indexesOfSelectedCards) {
//     if (indexesOfSelectedCards.length === 1 ) && ( room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "10_3") {
//         //mix 3 next
//     }
//     else {

//     }
// }

// export function valid_10_4(room, player_id, indexesOfSelectedCards) {
//     if (indexesOfSelectedCards.length === 1 ) && ( room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "10_4") {
//         //mix 4 next
//     }
//     else {

//     }
// }

// export function valid_10_5(room, player_id, indexesOfSelectedCards) {
//     if (indexesOfSelectedCards.length === 1 ) && ( room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "10_5") {
//         //mix 5 next
//     }
//     else {

//     }
// }

// export function valid_14_1(room, player_id, indexesOfSelectedCards) {
//     if (indexesOfSelectedCards.length === 1 ) && ( room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === ) {

//     }
//     else {

//     }
// }

// export function valid_14_2(room, player_id, indexesOfSelectedCards) {
//     if (indexesOfSelectedCards.length === 1 ) && ( room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === ) {

//     }
//     else {

//     }
// }

// export function valid_14_3(room, player_id, indexesOfSelectedCards) {
//     if (indexesOfSelectedCards.length === 1 ) && ( room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === ) {

//     }
//     else {

//     }
// }
// export function valid_14_4(room, player_id, indexesOfSelectedCards) {
//     if (indexesOfSelectedCards.length === 1 ) && ( room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === ) {

//     }
//     else {

//     }
// }

// export function valid_14_5(room, player_id, indexesOfSelectedCards) {
//     if (indexesOfSelectedCards.length === 1 ) && ( room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === ) {

//     }
//     else {

//     }
// }

// export function valid_15(room, player_id, indexesOfSelectedCards) {
//     if (indexesOfSelectedCards.length === 1 ) && ( room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "15") {

//     }
//     else {

//     }
// }

// export function valid_16(room, player_id, indexesOfSelectedCards) {
//     if (indexesOfSelectedCards.length === 1 ) && ( room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "16") {

//     }
//     else {

//     }
// }

// export function valid_17(room, player_id, indexesOfSelectedCards) {
//     if (indexesOfSelectedCards.length === 1 ) && ( room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "17") {

//     }
//     else {

//     }
// }

// export function valid_18(room, player_id, indexesOfSelectedCards) {
//     if (indexesOfSelectedCards.length === 1 ) && ( room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "18") {

//     }
//     else {

//     }
// }

export function valid_19(room, player_id, indexesOfSelectedCards) {
    if ((indexesOfSelectedCards.length === 1) && (room.players.get(player_id).cards[indexesOfSelectedCards[0]][0] === "19")) {
        //take from bottom
        return true;
    }
    else {
        return false;
    }
}