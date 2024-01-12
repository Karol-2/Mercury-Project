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

const meetings: Record<string, Meeting> = {};

io.on("connection", async (socket: Socket) => {
  const userId = socket.handshake.auth.userId;

  const getMeeting = () => meetings[socket.id];
  const getMeetingRoom = () => `meeting:${meetings[socket.id].id}`;

  const setMeeting = (newMeeting: Meeting | null) => {
    const meeting = meetings[socket.id];

    if (!meeting && newMeeting) {
      meetings[socket.id] = newMeeting;
      const meetingRoom = getMeetingRoom();
      socket.join(meetingRoom);
    } else if (meeting && !newMeeting) {
      const meetingRoom = getMeetingRoom();
      socket.leave(meetingRoom);
      delete meetings[socket.id];
    }
  };

  await setSocketId(socket.id, userId);
  console.log("Client connected");

  socket.on("createMeeting", async () => {
    const session = driver.session();
    const inMeeting = await isInMeeting(session, userId);

    if (!inMeeting) {
      const meeting = await createMeeting(session, userId);
      setMeeting(meeting);
      console.log(`Create meeting: ${userId} created meeting ${meeting.id}`);
    } else {
      setMeeting(null);
      console.log(
        `Create meeting: ${userId} can't create meeting - already created`,
      );
    }

    socket.emit("createdMeeting", getMeeting());
    session.close();
  });

  socket.on("joinMeeting", async (message) => {
    const [friendId] = message;
    const session = driver.session();
    const canJoin = await isFriend(session, userId, friendId);

    if (canJoin) {
      const meeting = await joinMeeting(session, userId, friendId);

      if (meeting) {
        setMeeting(meeting);
        console.log(`Join meeting: ${userId} joined meeting of ${friendId}`);
      } else {
        setMeeting(null);
        console.log(
          `Join meeting: ${userId} can't join meeting of ${friendId} - meeting not created`,
        );
      }
    } else {
      console.log(`Join meeting: ${userId} is not a friend of ${friendId}`);
    }

    socket.emit("joinedMeeting", getMeeting());
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
    setMeeting(null);
  });

  socket.rooms.forEach((room) => {
    if (io.sockets.adapter.rooms.get(room)?.size === 1) {
      socket.emit("first");
    }
  });
});
