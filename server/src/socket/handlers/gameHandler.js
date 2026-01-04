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
        //TODO: check incoming params
        handleRoomAction(code, room => {
            if (room.expectedAction !== null) return null;
            return room.takeCardTop(socket.id);
        });
    });

    socket.on('throwCard', (code, cardsIndexes) => {
        //TODO: check incoming params
        handleRoomAction(code, room => {
            const cards = room.indexesToCards(socket.id, cardsIndexes);
            if (room.expectedAction !== null &&
                !(cards.length === 1 && cards[0] === "13")) return null;
            const actions = cardsValidation(room, socket.id, cards, cardsIndexes);
            if (actions) {
                return actions;
            }
            return null;
        });
    });

    socket.on('gameAction', (code, actionName, actionData) => {
        //TODO: check incoming params
        handleRoomAction(code, room => {
            if (
                room.expectedAction !== actionName ||
                !room.expectedActionPlayers.includes(socket.id)
            ) {
                return null;
            }
            console.log(socket.id, actionName, actionData);
            return actionsValidation(room, socket.id, actionName, actionData);
        });
    });
}
