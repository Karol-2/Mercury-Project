import servers from "./server";
import dotenv from "dotenv";
import { Socket } from "socket.io";
import { setSocketId, getSocketId } from "./misc/socketId";
import addMessageToDb from "./misc/addMessageToDb";
import { isFriend } from "./users";
import driver from "./driver/driver";
import {
  createMeeting,
  leaveMeeting,
  isInMeeting,
  joinMeeting,
} from "./meetings";
import Meeting from "./models/Meeting";

const { io } = servers;

dotenv.config();

io.on("connection", async (socket: Socket) => {
  const userId = socket.handshake.auth.userId;
  let meeting: Meeting | null = null;

  await setSocketId(socket.id, userId);
  console.log("Client connected");

  socket.on("createMeeting", async () => {
    const session = driver.session();
    const inMeeting = await isInMeeting(session, userId);

    if (!inMeeting) {
      meeting = await createMeeting(session, userId);
      console.log(`Create meeting: ${userId} created meeting ${meeting.id}`);
    } else {
      console.log(
        `Create meeting: ${userId} can't create meeting - already created`,
      );
    }

    socket.emit("createdMeeting", meeting);
    session.close();
  });

  socket.on("joinMeeting", async (message) => {
    const [friendId] = message;
    const session = driver.session();
    const canJoin = await isFriend(session, userId, friendId);

    if (canJoin) {
      meeting = await joinMeeting(session, userId, friendId);
      if (meeting) {
        console.log(`Join meeting: ${userId} joined meeting of ${friendId}`);
      } else {
        console.log(
          `Join meeting: ${userId} can't join meeting of ${friendId} - meeting not created`,
        );
      }
    } else {
      console.log(`Join meeting: ${userId} is not a friend of ${friendId}`);
    }

    socket.emit("joinedMeeting", meeting);
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
    await leaveMeeting(session, userId);
    session.close();
  });

  socket.rooms.forEach((room) => {
    if (io.sockets.adapter.rooms.get(room)?.size === 1) {
      socket.emit("first");
    }
  });
});
