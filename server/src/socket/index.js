import gameHandler from './handlers/gameHandler.js';
import roomHandler from './handlers/roomHandler.js';

export default function socketHandler(io, rooms) {
    io.on('connection', socket => {
        console.log('New client:', socket.id);

        roomHandler(io, socket, rooms);
        gameHandler(io, socket, rooms);

        socket.on('disconnect', () => {
            console.log('Disconnected:', socket.id);
            for (const [code, room] of rooms.entries()) {
                const { wasPlayer, roomEmpty, gameActive } = room.disconnectPlayer(socket.id);
                if (wasPlayer) {
                    console.log(`Player ${socket.id} has been removed from the room ${code}`);
                    if (roomEmpty) {
                        rooms.delete(code);
                        console.log(`Room ${code} was empty and deleted`);
                    } else {
                        if (gameActive) {
                            const turnData = room.handleQueue();
                            for (const playerId of room.players.keys()) {
                                const res = room.serveCards(playerId);
                                io.to(playerId).emit(
                                    'refreshGame',
                                    null,
                                    res['cards'],
                                    res['deck'],
                                    res['thrown'],
                                    turnData
                                );
                            }
                        } else {
                            io.to(code).emit('refreshRoom', room.getPlayerList());
                        }
                    }
                    break;
                }
            }
        });
    });
}