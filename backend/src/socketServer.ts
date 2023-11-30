import servers from "./server";
import dotenv from "dotenv";
import axios from "axios";
import { Socket } from "socket.io";
import { decodeSocketData } from "./misc/jwt";
const { io, app } = servers;

dotenv.config();
const linkSecret = process.env.LINK_SECRET;

io.on("connection", async (socket: Socket) => {
  const handshakeData = socket.handshake.auth.jwt;
  const decodedData = decodeSocketData(handshakeData, linkSecret!);
  if (!decodedData) {
    socket.disconnect();
    return;
  }
  if ("ownerId" in decodedData) {
    const {ownerId} = decodedData;
    await axios.put(`http://localhost:5000/users/${ownerId}`, {socketID: socket.id});
    const offer = await axios.get(`http://localhost:5000/offers/${ownerId}`);
    if (offer.data.length > 0) {
      //todo
    }
  } else {
    const {id} = decodedData;
    await axios.put(`http://localhost:5000/users/${id}`, {socketID: socket.id});
    const meeting = await axios.get(`http://localhost:5000/users/meetings/${id}`);
    socket.emit("meetingData", meeting.data.meetings);
    // todo emit offers
  }
  socket.on("newAnswer", async ({answer, ownerId}) => {
    console.log("newAnswer");
  });
  socket.on("newOffer", async ({offer, meetingInfo}) => {
    console.log("newOffer");
  });
  socket.on("getIce", (uuid, who, ackFunc) => {
    console.log("getIce");
  });
  socket.on("iceToServer", ({who, iceC, uuid}) => {
    console.log("iceToServer");
  });
});
