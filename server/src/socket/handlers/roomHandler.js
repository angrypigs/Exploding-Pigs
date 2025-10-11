import {Room} from "../../modules/room.js";

export default function roomHandler(io, socket, rooms) {
    socket.on("joinRoom", (code, nickname, name) => {
        if (rooms.has(code)) {
            if (rooms.get(code).add_player(socket.id, nickname, name)) {
                socket.join(code);
                socket.emit("joinRoom", code, nickname, name);
                io.to(code).emit("refreshRoom", rooms.get(code).get_player_list());
            } else {
                socket.emit("joinRoom", false, "Room is full");
            }
        } else {
            socket.emit("joinRoom", false, "No room");
        }
    });

    socket.on("createRoom", (max_players, nickname, name) => {
        let new_key = null;
        for (let i = 0; i <= 10000; i++) {
            const key = String(i).padStart(5, "0");
            if (!rooms.has(key)) {
                new_key = key;
                break;
            }
        }
        if (new_key !== null && max_players < 9) {
            rooms.set(new_key, new Room(max_players))
            rooms.get(new_key).add_player(socket.id, nickname, name);
            socket.join(new_key);
            socket.emit("joinRoom", new_key, nickname, name);
        } else {
            socket.emit("joinRoom", false, "No room slots (come back later)");
        }
    });

    socket.on("refreshRoom", (code) => {
        if (rooms.has(code)) {
            socket.emit("refreshRoom", rooms.get(code).get_player_list());
        } else {
            socket.emit("refreshRoom", null);
        }
    });

    socket.on("playerReady", (code) => {
        if (rooms.has(code)) {
            let player = rooms.get(code).players.get(socket.id);
            player.readyFlag = !player.readyFlag;

            let isAllReady = true

            for (const player of rooms.get(code).players.values()) {
                if (!player.readyFlag) {
                    isAllReady = false;
                    break;
                }
            }

            if (isAllReady) {
                console.log("SERVER READY");
                rooms.get(code).start_game();
                io.to(code).emit("roomReady");
            } else {
                console.log("SERVER NOT READY");
            }
        }
    });

}