import servers from "./server";
import dotenv from "dotenv";
import { Socket } from "socket.io";
import { setSocketId, getSocketId } from "./misc/socketId";
const { io } = servers;

dotenv.config();

io.on("connection", async (socket: Socket) => {
  const userId = socket.handshake.auth.userId;
  await setSocketId(socket.id, userId);
  console.log("Socket server started ");

  socket.on("iceCandidate", (candidate) => {
    socket.broadcast.emit("iceCandidate", candidate);
  });

  socket.on("description", (description) => {
    socket.broadcast.emit("description", description);
  });

  socket.on("message", async (message) => {
    const { receiverId } = message;
    const socketId = await getSocketId(receiverId);
    delete message.receiverId;
    socket.to(socketId).emit("message", { ...message, type: "received" });
  });

  socket.rooms.forEach((room) => {
    if (io.sockets.adapter.rooms.get(room)?.size === 1) {
      socket.emit("first");
    }
  });
});
