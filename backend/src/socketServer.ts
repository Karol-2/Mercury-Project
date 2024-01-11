import servers from "./server";
import dotenv from "dotenv";
import { Socket } from "socket.io";
import { setSocketId, getSocketId } from "./misc/socketId";
import addMessageToDb from "./misc/addMessageToDb";
import { isFriend } from "./users";
import driver from "./driver/driver";
import {
  createMeeting,
  endMeeting,
  isInMeeting,
  joinMeeting,
} from "./meetings";

const { io } = servers;

dotenv.config();

io.on("connection", async (socket: Socket) => {
  const userId = socket.handshake.auth.userId;
  await setSocketId(socket.id, userId);
  console.log("Client connected");

  socket.on("createMeeting", async () => {
    const session = driver.session();
    const inMeeting = await isInMeeting(session, userId);
    let meeting = null;
    console.log("check");

    if (!inMeeting) {
      console.log("create");
      meeting = await createMeeting(session, userId);
    }

    socket.emit("createdMeeting", meeting);
    session.close();
  });

  socket.on("joinMeeting", async (friendId: string) => {
    const session = driver.session();
    const canJoin = await isFriend(session, userId, friendId);

    if (canJoin) {
      const meeting = await joinMeeting(session, userId, friendId);
      socket.emit(meeting);
    }

    session.close();
  });

  socket.on("iceCandidate", (candidate) => {
    socket.broadcast.emit("iceCandidate", candidate);
  });

  socket.on("description", (description) => {
    socket.broadcast.emit("description", description);
  });

  socket.on("message", async (message) => {
    const { receiverId } = message;
    const socketId = await getSocketId(receiverId);
    await addMessageToDb(message);
    socket.to(socketId).emit("message", { ...message, type: "received" });
  });

  socket.on("disconnect", async (_reason) => {
    const session = driver.session();
    await endMeeting(session, userId);
    session.close();
  });

  socket.rooms.forEach((room) => {
    if (io.sockets.adapter.rooms.get(room)?.size === 1) {
      socket.emit("first");
    }
  });
});
