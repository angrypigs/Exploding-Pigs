import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import socketHandler from './src/socket/index.js';

const app = express();

app.get('/', (req, res) => {
    res.send('Game Server is OK');
});

const server = http.createServer(app);

const rooms = new Map();

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token !== process.env.GAME_SECRET) {
        const err = new Error('Not authorized');
        return next(err);
    }
    next();
});

const protectedSocketHandler = (ioInstance, roomsMap) => {
    try {
        socketHandler(ioInstance, roomsMap);
    } catch (error) {
        console.error('Socket Handler Init Error:', error);
    }
};

protectedSocketHandler(io, rooms);

const port = process.env.PORT || 8080;

server.listen(port, '0.0.0.0', () => console.log(`Serwer działa na porcie ${port}`));

process.on('uncaughtException', err => {
    console.error('CRASH PREVENTED:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('PROMISE REJECTION:', reason);
});
