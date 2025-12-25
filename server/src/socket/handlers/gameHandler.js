import { cardsValidation, actionsValidation } from '../../modules/gamelogic.js';

export default function gameHandler(io, socket, rooms) {
    socket.on('takeCard', code => {
        const room = rooms.get(code);
        if (room && room.validate_player(socket.id)) {
            const actions = room.take_card_top(socket.id);
            if (actions) {
                const turn_data = room.handle_queue();
                for (const key of room.players.keys()) {
                    const action = actions[key] ?? actions['other'];
                    const res = room.serve_cards(key);
                    // room.print_game()
                    io.to(key).emit(
                        'refreshGame',
                        action,
                        res['cards'],
                        res['deck'],
                        res['thrown'],
                        turn_data
                    );
                }
            } else {
                socket.emit('refreshGame', false);
            }
        } else {
            socket.emit('refreshGame', null);
        }
    });

    //FIXME: DO CHECKS FOR ERORRS ETC
    socket.on('throwCard', (code, cardsIndexes) => {
        const room = rooms.get(code);
        if (room && room.validate_player(socket.id)) {
            let cards = room.indexes_to_cards(socket.id, cardsIndexes);
            console.log(cards);
            let actions = cardsValidation(room, socket.id, cards);
            if (actions !== null) {
                room.remove_cards(socket.id, cardsIndexes);
                const turn_data = room.handle_queue();
                for (const key of room.players.keys()) {
                    const action = actions[key] ?? actions['other'];
                    const res = room.serve_cards(key);
                    // room.print_game()
                    io.to(key).emit(
                        'refreshGame',
                        action,
                        res['cards'],
                        res['deck'],
                        res['thrown'],
                        turn_data
                    );
                }
            } else {
                socket.emit('refreshGame', false);
            }
        } else {
            socket.emit('refreshGame', null);
        }
    });

    socket.on('gameAction', (code, actionName, actionData) => {
        const room = rooms.get(code);
        if (room && room.validate_player(socket.id)) {
            let actions = actionsValidation(room, socket.id, actionName, actionData);
            if (actions !== null) {
                const turn_data = room.handle_queue();
                for (const key of room.players.keys()) {
                    const action = actions[key] ?? actions['other'];
                    const res = room.serve_cards(key);
                    io.to(key).emit(
                        'refreshGame',
                        action,
                        res['cards'],
                        res['deck'],
                        res['thrown'],
                        turn_data
                    );
                }
            } else {
                socket.emit('refreshGame', false);
            }
        } else {
            socket.emit('refreshGame', null);
        }
    });
}
