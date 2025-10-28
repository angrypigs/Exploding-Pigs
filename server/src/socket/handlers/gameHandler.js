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

    socket.on("throwCard", (code, cardsSelected) => {
        const room = rooms.get(code);
        if (room) {
            console.log(`${code} + ${cardsSelected}`);
        } else {
            socket.emit("refreshGame", null);
        }
    })
}