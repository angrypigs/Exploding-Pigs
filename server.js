const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// dodaj CORS
const io = new Server(server, {
  cors: {
    origin: "*",  // pozwala wszystkim domenom (dla developmentu)
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("New client:", socket.id);

  socket.on("playerAction", (action) => {
    io.emit("gameState", { lastAction: action, player: socket.id });
    console.log(`Client ${socket.id} sent action ${action}`);
  });

  socket.on("disconnect", () => console.log("Rozłączono:", socket.id));
});

server.listen(4000, () => console.log("Serwer działa na http://localhost:4000"));