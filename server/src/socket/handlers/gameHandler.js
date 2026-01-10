import { actionsValidation, cardsValidation } from '../../modules/gameLogic.js';
import { z } from "zod";

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

        if (!room || !room.validatePlayer(socket.id) || !room.gameActive) {
            socket.emit('refreshGame', null);
            return;
        }

        const actions = actionCallback(room);
        const isGameOver = room.isGameOver();

        if (isGameOver) {
            const nickname = room.players.get(isGameOver).nickname ?? '';
            for (const playerId of room.players.keys()) {
                let isWon = (playerId === isGameOver);
                io.to(playerId).emit('gameOver', { isWon: isWon, winner: nickname });
            }
        } else if (actions) {
            const turnData = room.handleQueue();
            broadcastGameUpdate(room, actions, turnData);
        } else {
            socket.emit('refreshGame', false);
        }
    };

    const PlayerIdSchema = z.string().uuid();

    const RoomCodeSchema = z
        .string()
        .regex(/^\d{5}$/, "room code must be exactly 5 digits");

    const CardIndexSchema = z
        .number()
        .int()
        .min(0);

    const TakeCardSchema = z.tuple([
        RoomCodeSchema
    ]);

    const ThrowCardSchema = z.tuple([
        RoomCodeSchema,
        z.array(CardIndexSchema).min(1).max(5)
    ]);

    const GameActionNameSchema = z.enum(["peekFuture",
        "changeFuture",
        "choosePlayerSniper",
        "choosePlayerFavor",
        "chooseCardFavor",
        "chooseCardFundraiser",
        "chooseCardFromPlayerProfanation",
        "chooseCardFromPlayerPair"
    ]);

    const GameActionDataSchema =
    {
        "changeFuture": z.array(CardIndexSchema).min(3).max(5),
        "choosePlayerSniper": PlayerIdSchema,
        "choosePlayerFavor": PlayerIdSchema,
        "chooseCardFavor": CardIndexSchema,
        "chooseCardFundraiser": CardIndexSchema,
        "chooseCardFromPlayerProfanation": z.object({
            player: PlayerIdSchema,
            card: CardIndexSchema
        }),
        "chooseCardFromPlayerPair": z.object({
            player: PlayerIdSchema,
            card: CardIndexSchema
        })
    };

    const GameActionSchema = z.tuple([
        RoomCodeSchema,
        GameActionNameSchema,
        z.any()
    ]);


    socket.on('takeCard', (code) => {
        //NOTE: checks done
        const parsed = TakeCardSchema.safeParse([code]);
        if (!parsed.success) {
            console.log("TakeCardSocket Params Check Not Passed !!!\n");
            return;
        }

        const [safeRoomCode] = parsed.data;

        console.log("TakeCardSocket Params Check Passed\n");
        handleRoomAction(safeRoomCode, room => {
            if (room.expectedAction !== null) return null;
            return room.takeCardTop(socket.id);
        });
    });

    socket.on('throwCard', (code, cardsIndexes) => {
        //NOTE: checks done
        const parsed = ThrowCardSchema.safeParse([code, cardsIndexes]);
        if (!parsed.success) {
            console.log("ThrowCardSocket Params Check Not Passed !!!\n");
            return;
        }

        const [safeRoomCode, safeCardsIndexes] = parsed.data;

        console.log("ThrowCardSocket Params Check Passed\n");
        handleRoomAction(safeRoomCode, room => {
            const cards = room.indexesToCards(socket.id, safeCardsIndexes);
            if (room.expectedAction !== null &&
                !(cards.length === 1 && cards[0] === "13")) return null;
            const actions = cardsValidation(room, socket.id, cards, safeCardsIndexes);
            if (actions) {
                return actions;
            }
            return null;
        });
    });

    socket.on('gameAction', (code, actionName, actionData) => {
        //NOTE: checks done
        console.log(`${actionName}`);
        console.log(`${actionData}`);
        const parsed = GameActionSchema.safeParse([code, actionName, actionData]);
        if (!parsed.success) {
            console.log("GameActionSocket Params Check Not Passed !!!\n");
            return;
        }

        const [safeRoomCode, safeActionName, notsafeActionData] = parsed.data;

        const actionDataSchema = GameActionDataSchema[safeActionName];
        if (!actionDataSchema) {
            console.log("GameActionSocket Params Check Not Passed !!!\n");
            return;
        }

        const dataParsed = actionDataSchema.safeParse(notsafeActionData);
        if (!dataParsed.success) {
            console.log("GameActionSocket Params Check Not Passed !!!\n");
            return;
        }

        const safeActionData = dataParsed.data;

        console.log("GameActionSocket Params Check Passed\n");

        handleRoomAction(safeRoomCode, room => {
            if (
                room.expectedAction !== safeActionName ||
                !room.expectedActionPlayers.includes(socket.id)
            ) {
                return null;
            }
            //console.log(socket.id, safeActionName, safeActionData);
            return actionsValidation(room, socket.id, safeActionName, safeActionData);
        });
    });
}
