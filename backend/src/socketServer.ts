import servers from "./server";
import dotenv from "dotenv";
import { Socket } from "socket.io";
const { io } = servers;

dotenv.config();

io.on("connection", (socket: Socket) => {
  console.log("Socket server started");

  socket.on("iceCandidate", (candidate) => {
    socket.broadcast.emit("iceCandidate", candidate);
  });

  socket.on("description", (description) => {
    socket.broadcast.emit("description", description);
  });

  socket.on("message", (message) => {
    socket.broadcast.emit("message", {...message, type: "received"});
  });

  socket.rooms.forEach((room) => {
    if (io.sockets.adapter.rooms.get(room)?.size === 1) {
      socket.emit("first");
    }
  });
});
