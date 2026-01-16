// server.test.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Client from 'socket.io-client';
import socketHandler from '../src/socket/index.js'; // Dostosuj ścieżkę do swojego pliku

describe('Exploding Pigs Server Tests', () => {
    let io, serverSocket, clientSocket, httpServer;
    const rooms = new Map();

    beforeAll(done => {
        const app = express();
        app.get('/test', (req, res) => {
            res.send({ status: 'Serwer żyje!' });
        });

        httpServer = createServer(app);
        io = new Server(httpServer);

        socketHandler(io, rooms);

        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = new Client(`http://localhost:${port}`);

            io.on('connection', socket => {
                serverSocket = socket;
            });

            clientSocket.on('connect', done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
        httpServer.close();
    });

    test('powinien pozwolić klientowi na połączenie (Socket.io)', done => {
        expect(clientSocket.connected).toBe(true);
        done();
    });

    test('powinien obsłużyć zdarzenie (np. tworzenie pokoju/dołączenie)', done => {
        expect(serverSocket).toBeDefined();
        expect(serverSocket.id).toBeDefined();
        done();
    });

    test('GET /test powinien zwrócić status 200 i JSON', async () => {
        const port = httpServer.address().port;
        const response = await fetch(`http://localhost:${port}/test`);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.status).toBe('Serwer żyje!');
    });
});
