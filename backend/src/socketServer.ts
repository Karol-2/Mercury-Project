import servers from "./server";
import dotenv from "dotenv";
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
  const {guestId, ownerId} = decodedData;
  if (!("meetingOwner" in decodedData)) {
    await fetch(`http://localhost:5000/users/${guestId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ socketID: socket.id }),
    });
    const meetingRequest = await fetch(`http://localhost:5000/users/${guestId}/${ownerId}/meetings`);
    const meetingData = await meetingRequest.json();
    const {meetingId} = meetingData;
    socket.emit("meetingData", {meetingId});
    const offersRequest = await fetch(`http://localhost:5000/offers/${guestId}`);
    const offersData = await offersRequest.json();
    offersData.offers.forEach((offer:any) => io.to(socket.id).emit("newOfferWaiting",offer));
  } else {
    await fetch(`http://localhost:5000/users/${ownerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ socketID: socket.id }),
    });
    const offersRequest = await fetch(`http://localhost:5000/offers/${ownerId}`);
    const offersData = await offersRequest.json();
    offersData.offers.forEach((offer:any) => io.to(socket.id).emit("newOfferWaiting",offer));
  }
  socket.on("newAnswer", async ({answer, ownerId}) => {
    const ownerRequest = await fetch(`http://localhost:5000/users/${ownerId}`);
    const ownerData = await ownerRequest.json();
    const socketID = ownerData.user.socketID;
    if (socketID) {
      socket.to(socketID).emit("answerToOwner", answer);
    }
    await fetch(`http://localhost:5000/offers/${ownerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer }),
    });
  });
});
