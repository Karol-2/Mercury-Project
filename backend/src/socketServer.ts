import servers from "./server";
import { Socket } from "socket.io";
const {io, app} = servers;

io.on("connection", (socket: Socket) => {
    console.log("Socket server started");
});