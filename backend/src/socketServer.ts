import servers from "./server";
import dotenv from "dotenv";
import { Socket } from "socket.io";
import {decodeSocketData} from "./misc/jwt";
const {io, app} = servers;

dotenv.config();
const linkSecret = process.env.LINK_SECRET;

io.on("connection", (socket: Socket) => {
    const handshakeData = socket.handshake.auth.jwt;
    const decodedData = decodeSocketData(handshakeData, linkSecret!);
    if (!decodedData) {
        socket.disconnect();
        return;
    }
    
});