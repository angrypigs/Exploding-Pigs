import express from "express";
import http from "http";
import { Server } from "socket.io";
import socketHandler from "./src/socket/index.js"

const app = express();
const server = http.createServer(app);

const rooms = new Map();

const io = new Server(server, {
  cors: {
    origin: "*",  // pozwala wszystkim domenom (dla developmentu)
    methods: ["GET", "POST"]
  }
});

socketHandler(io, rooms);

server.listen(4000, "0.0.0.0", () => console.log("Serwer działa na http://localhost:4000"));