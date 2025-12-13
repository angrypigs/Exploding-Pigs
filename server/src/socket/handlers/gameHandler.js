import { cardsValidation } from '../../modules/gamelogic.js';

export default function gameHandler(io, socket, rooms) {
    socket.on('takeCard', code => {
        const room = rooms.get(code);
        if (room && room.validate_player(socket.id)) {
            const action = room.take_card_top(socket.id);
            console.log(`Action from ${socket.id}: ${action}`);
            if (action) {
                const turn_data = room.handle_queue();
                for (const key of room.players.keys()) {
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
            let cards = room.indexes_to_cards(socket.id, cardsIndexes)
            console.log(cards)
            let actions = cardsValidation(room, socket.id, cards);
            if (actions !== null) {
                const playerCards = room.players.get(socket.id).cards;
                const sortedIndices = [...cardsIndexes].sort((a, b) => b - a);
                for (const c of sortedIndices) {
                    playerCards.splice(c, 1);
                }
                const turn_data = room.handle_queue();
                for (const key of room.players.keys()) {
                    const res = room.serve_cards(key);
                    console.log(actions);
                    // room.print_game()
                    io.to(key).emit(
                        'refreshGame',
                        actions,
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
