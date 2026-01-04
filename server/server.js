import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import socketHandler from './src/socket/index.js';

const app = express();

const server = http.createServer(app);

const rooms = new Map();

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

socketHandler(io, rooms);

const port = process.env.PORT || 3000;
const address = process.env.IP || 'localhost';

server.listen(port, address, () => console.log(`Serwer działa na ${address}:${port}`));
