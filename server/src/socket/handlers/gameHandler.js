import { Room } from "../../modules/room.js";
import { VALID_OBJ } from "../../gamelogic.js";
import { Console } from "console";

export default function gameHandler(io, socket, rooms) {
    socket.on("nextTurn", (code) => {
        const room = rooms.get(code);
        if (room) {
            room.players.get(socket.id).nextTurn = true;
            [...room.players.values()].forEach(p => console.log(p.nextTurn));
            if ([...room.players.values()].every(p => p.nextTurn === true)) {
                let res = room.handle_queue()
                console.log(res);
                io.to(code).emit("nextTurn", res);
                console.log(`Turn: ${res}`);
                [...room.players.values()].forEach(p => p.nextTurn = false);
            } else {
                socket.emit("nextTurn", null);
            }
        } else {
            socket.emit("nextTurn", null);
        }
    });

    socket.on("takeCard", (code) => {
        const room = rooms.get(code);
        if (room) {
            const action = [room.take_card_top(socket.id)];
            console.log(`Action from ${socket.id}: ${action}`)
            if (action) {
                for (const key of room.players.keys()) {
                    const res = room.serve_cards(key);
                    // room.print_game()
                    io.to(key).emit("refreshGame", action, res["cards"], res["deck"], res["thrown"]);
                }
            } else {
                socket.emit("refreshGame", false);
            }
        } else {
            socket.emit("refreshGame", null);
        }
    });

    //FIXME: DO CHECKS FOR ERORRS ETC
    socket.on("throwCard", (code, cardsSelected) => {
        const room = rooms.get(code);
        if (room) {
            console.log(`${code} + ${cardsSelected}`);


            let actions = null;
            for (const v of VALID_OBJ) {
                if ((actions = v(room, socket.id, cardsSelected))) {
                    console.log("VALID THROW");
                    break;
                }
            }
            console.log("KURWA MAC :");
            console.log(actions);


            const playerCards = room.players.get(socket.id).cards;

            for (const c of cardsSelected) {
                playerCards.splice(c, 1);
            }

            console.log("KURWA");
            for (const key of room.players.keys()) {
                const res = room.serve_cards(key);
                // room.print_game()
                console.log("KURWA1");
                io.to(key).emit("refreshGame", actions, res["cards"], res["deck"], res["thrown"]);
                console.log("KURWA2");

            }
        }
        else {
            console.log("KURWA5");
            socket.emit("refreshGame", null);
        }
    })
}