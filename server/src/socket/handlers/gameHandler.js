import { actionsValidation, cardsValidation } from '../../modules/gameLogic.js';

export default function gameHandler(io, socket, rooms) {
    const broadcastGameUpdate = (room, actions, turnData) => {
        for (const playerId of room.players.keys()) {
            const playerAction = actions[playerId] ?? actions['other'];
            const view = room.serveCards(playerId);
            io.to(playerId).emit(
                'refreshGame',
                playerAction,
                view['cards'],
                view['deck'],
                view['thrown'],
                turnData
            );
        }
    };

    const handleRoomAction = (code, actionCallback) => {
        const room = rooms.get(code);

        if (!room || !room.validatePlayer(socket.id)) {
            socket.emit('refreshGame', null);
            return;
        }

        const actions = actionCallback(room);

        if (actions) {
            const turnData = room.handleQueue();
            broadcastGameUpdate(room, actions, turnData);
        } else {
            socket.emit('refreshGame', false);
        }
    };

    socket.on('takeCard', code => {
        handleRoomAction(code, room => {
            return room.takeCardTop(socket.id);
        });
    });

    socket.on('throwCard', (code, cardsIndexes) => {
        handleRoomAction(code, room => {
            const cards = room.indexesToCards(socket.id, cardsIndexes);
            const actions = cardsValidation(room, socket.id, cards);
            if (actions) {
                room.removeCards(socket.id, cardsIndexes);
                return actions;
            }
            return null;
        });
    });

    socket.on('gameAction', (code, actionName, actionData) => {
        handleRoomAction(code, room => {
            if (room.expectedAction !== actionName || !room.expectedActionPlayers.includes(socket.id)) {
                return null;
            }
            console.log(socket.id, actionName, actionData)
            return actionsValidation(room, socket.id, actionName, actionData);
        });
    });
}
