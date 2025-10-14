import gameHandler from "./handlers/gameHandler.js";
import roomHandler from "./handlers/roomHandler.js"

export default function socketHandler(io, rooms) {
    io.on("connection", (socket) => {
        console.log("New client:", socket.id);   
        roomHandler(io, socket, rooms);
        gameHandler(io, socket, rooms);
        socket.on("disconnect", () => {
            console.log("Rozłączono:", socket.id);
            for (const [code, room] of rooms.entries()) {
            if (room.players.has(socket.id)) {
                room.players.delete(socket.id);
                room.queue = room.queue.filter(el => el[0] !== socket.id);
                if (room.queue_dir) room.queue_p = room.queue_p % room.queue.length
                else room.queue_p = (room.queue_p - 1 + room.queue.length) % room.queue.length
                console.log(`Usunięto gracza ${socket.id} z pokoju ${code}`);
                io.to(code).emit("refreshRoom", room.get_player_list());
                if (room.players.size === 0) {
                rooms.delete(code);
                console.log(`Pokój ${code} został usunięty, bo nie ma graczy`);
                }
                break;
            }
            }
        });
    });
}