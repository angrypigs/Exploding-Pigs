import { Room } from '../../modules/room.js';

export default function roomHandler(io, socket, rooms) {
    socket.on('joinRoom', (code, nickname, name) => {
        if (rooms.has(code)) {
            let room = rooms.get(code);
            if (room.addPlayer(socket.id, nickname, name) && !room.room_closed) {
                socket.join(code);
                socket.emit('joinRoom', code, nickname, name);
                io.to(code).emit('refreshRoom', rooms.get(code).getPlayerList());
            } else {
                socket.emit('joinRoom', false, 'Room is full');
            }
        } else {
            socket.emit('joinRoom', false, 'No room');
        }
    });

    socket.on('createRoom', (max_players, nickname, name) => {
        let new_key = null;
        for (let i = 0; i <= 10000; i++) {
            const key = String(i).padStart(5, '0');
            if (!rooms.has(key)) {
                new_key = key;
                break;
            }
        }
        if (new_key !== null && max_players < 9) {
            rooms.set(new_key, new Room(max_players));
            rooms.get(new_key).addPlayer(socket.id, nickname, name);
            socket.join(new_key);
            socket.emit('joinRoom', new_key, nickname, name);
        } else {
            socket.emit('joinRoom', false, 'No room slots (come back later)');
        }
    });

    socket.on('refreshRoom', code => {
        if (rooms.has(code)) {
            socket.emit('refreshRoom', rooms.get(code).getPlayerList());
        } else {
            socket.emit('refreshGame', null);
        }
    });

    socket.on('playerReady', code => {
        if (rooms.has(code)) {
            const room = rooms.get(code);
            let player = room.players.get(socket.id);
            player.readyFlag = !player.readyFlag;

            let isAllReady = true;

            for (const player of room.players.values()) {
                if (!player.readyFlag) {
                    isAllReady = false;
                    break;
                }
            }
            room.room_closed = false;

            if (isAllReady && room.players.size > 1) {
                room.room_closed = true;
                room.startGame();
                io.to(code).emit('roomReady');
                setTimeout(() => {
                    console.log('game start');
                    for (const key of room.players.keys()) {
                        const res = room.serveCards(key);
                        const turn_data = room.handleQueue();
                        io.to(key).emit(
                            'refreshGame',
                            null,
                            res['cards'],
                            res['deck'],
                            res['thrown'],
                            turn_data
                        );
                    }
                }, 2000);
            } else {
                console.log('SERVER NOT READY');
            }
        }
    });
}
