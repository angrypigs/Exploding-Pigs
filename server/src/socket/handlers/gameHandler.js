import {Room} from "../../modules/room.js";

export default function gameHandler(io, socket, rooms) {
    socket.on("takeCard", (code) => {
        if (rooms.has(code)) {
            const action = rooms.get(code).take_card(socket.id);
            for (const key in rooms.get(code).players.keys()) {
                const res = rooms.get(code).serve_cards(socket.id);
                io.to(key).emit("refreshGame", {}, res["cards"], res["deck"], res["thrown"]);
            }
        } else {
            socket.emit("refreshGame", null);
        }
    });
}