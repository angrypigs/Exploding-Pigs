import { Room } from "../../modules/room.js";

export default function gameHandler(io, socket, rooms) {
    socket.on("nextTurn", (code) => {
        const room = rooms.get(code);
        if (room) {
            room.players.get(socket.id).nextTurn = true;
            if ([...room.players.values()].every(p => p.nextTurn === true)) {
                let res = room.handle_queue()
                io.to(code).emit("nextTurn", res);
                console.log(`Turn: ${res}`);
                [...room.players.values()].forEach(p => p.nextTurn = false);
            } else {
                socket.emit("nextTurn", null);
            }
        } else {
            socket.emit("nextTurn", null);
        }
    });

    socket.on("takeCard", (code) => {
        const room = rooms.get(code);
        if (room) {
            const action = room.take_card(socket.id);
            console.log(`Action from ${socket.id}: ${action}`)
            if (action) {
                for (const key of room.players.keys()) {
                    const res = room.serve_cards(key);
                    // room.print_game()
                    io.to(key).emit("refreshGame", action, res["cards"], res["deck"], res["thrown"]);
                }
            } else {
                socket.emit("refreshGame", false);
            }
        } else {
            socket.emit("refreshGame", null);
        }
    });

    socket.on("throwCard", (code, cardId) => {
        const room = rooms.get(code);
        if (room) {
            console.log(`${code} + ${cardId}`)
            if (room.players.has(socket.id)) {
                const playerCards = room.players.get(socket.id).cards;
                if (playerCards.some(c => c[0] === cardId)) {
                    console.log("VALID THROW");

                    // NOTE: process more

                    // !!! ZAPYTAĆ SIĘ KURWA CO TAM SĄ ZA POJEBANE ZMIENE

                    // 1 - act upon the card

                    // 2 - delete the card from the player deck

                    // 3 - put this card on the pile

                    // 4 - refres all the players
                }
            }
            else {
                //eror
            }
        } else {
            socket.emit("refreshGame", null);
        }
    })
}