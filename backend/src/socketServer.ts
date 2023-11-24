import servers from "./server";
import { Socket } from "socket.io";
import {decodeSocketData} from "./misc/jwt";
const {io, app} = servers;
const linkSecret = "ijr2iq34rfeiadsfkjq3ew";

io.on("connection", (socket: Socket) => {
    const handshakeData = socket.handshake.auth.jwt;
    const decodedData = decodeSocketData(handshakeData, linkSecret);
    if (!decodedData) {
        socket.disconnect();
        return;
    }
    
});