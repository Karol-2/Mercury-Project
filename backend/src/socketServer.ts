import servers from "./server";
import dotenv from "dotenv";
import driver from "./driver/driver";
import { Socket } from "socket.io";
import {
  connectToSocket,
  disconnectFromSocket,
  getAllSockets,
} from "./sockets";
import { isFriend } from "./users";
import Meeting from "./models/Meeting";
import {
  createMeeting,
  leaveMeeting,
  isInMeeting,
  joinMeeting,
} from "./meetings";
import { addMessageToDb } from "./messages";

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

  const session = driver.session();
  await connectToSocket(session, userId, socket.id);
  session.close();

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

  socket.on("leaveMeeting", async () => {
    const session = driver.session();
    await leaveMeeting(session, userId);
    session.close();

    setMeeting(null);
    console.log(`User ${userId} left the meeting`);
    socket.emit("leftMeeting");
  });

  socket.on("iceCandidate", (candidate) => {
    const meetingRoom = getMeetingRoom();
    if (meetingRoom) {
      socket.to(meetingRoom).emit("iceCandidate", candidate);
    }
  });

  socket.on("description", (description) => {
    const meetingRoom = getMeetingRoom();
    if (meetingRoom) {
      socket.to(meetingRoom).emit("description", description);
    }
  });

  socket.on("name", (name) => {
    const meetingRoom = getMeetingRoom();
    if (meetingRoom) {
      socket.to(meetingRoom).emit("name", name);
    }
  });

  socket.on("message", async (message) => {
    const { toUserId } = message;
    await addMessageToDb(message);

    const session = driver.session();
    const sendSockets = await getAllSockets(session, userId);
    const receiveSockets = await getAllSockets(session, toUserId);
    session.close();

    sendSockets.forEach((userSocket) => {
      socket.to(userSocket.id).emit("message", message);
    });

    const receivedMessage = { ...message, type: "received" };
    receiveSockets.forEach((userSocket) => {
      socket.to(userSocket.id).emit("message", receivedMessage);
    });
  });

  socket.on("disconnect", async (_reason) => {
    const session = driver.session();
    await leaveMeeting(session, userId);
    await disconnectFromSocket(session, userId, socket.id);
    session.close();
    setMeeting(null);
    console.log("Client disconnected");
  });
});
