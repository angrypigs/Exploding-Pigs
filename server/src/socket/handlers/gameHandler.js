import {Room} from "../../modules/room.js";

export default function gameHandler(io, socket, rooms) {
    socket.on("takeCard", (code) => {
        const room = rooms.get(code);
        if (room) {
            const action = room.take_card(socket.id);
            if (action) {
                for (const key of room.players.keys()) {
                    const res = room.serve_cards(key);
                    room.print_game()
                    io.to(key).emit("refreshGame", action, res["cards"], res["deck"], res["thrown"]);
                }
            } else {
                socket.emit("refreshGame", null);
            }
        } else {
            socket.emit("refreshGame", null);
        }
    });
}