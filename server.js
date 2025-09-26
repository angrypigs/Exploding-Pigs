const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Room } = require("./src/room");

const app = express();
const server = http.createServer(app);

const rooms = new Map();

const io = new Server(server, {
  cors: {
    origin: "*",  // pozwala wszystkim domenom (dla developmentu)
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("New client:", socket.id);

  socket.on("joinRoom", (code, nickname, name) => {
    if (rooms.has(code)) {
      socket.join(code);
      rooms.get(code).add_player(socket.id, nickname, name);
      socket.emit("joinRoom", code);
    } else {
      socket.emit("joinRoom", false);
    }
    console.log(`Client ${socket.id} sent code ${code}`);
  });

  socket.on("createRoom", (max_players, nickname, name) => {
    let new_key = null;
    for (let i = 0; i <= 10000; i++) {
      const key = String(i).padStart(5, "0");
      if (!rooms.has(key)) {
        new_key = key;
        break;
      }
    }
    if (new_key !== null && max_players < 9) {
      rooms.set(new_key, new Room(max_players))
      rooms.get(new_key).add_player(socket.id, nickname, name);
      socket.emit("joinRoom", new_key);
    } else {
      socket.emit("joinRoom", false);
    }
  });

  socket.on("disconnect", () => {
    console.log("Rozłączono:", socket.id);
    for (const [code, room] of rooms.entries()) {
      if (room.players.has(socket.id)) {
        room.players.delete(socket.id);
        console.log(`Usunięto gracza ${socket.id} z pokoju ${code}`);
        if (room.players.size === 0) {
          rooms.delete(code);
          console.log(`Pokój ${code} został usunięty, bo nie ma graczy`);
        }
        break;
      }
    }
  });
});

server.listen(4000, () => console.log("Serwer działa na http://localhost:4000"));