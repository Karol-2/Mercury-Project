import servers from "./server";
import dotenv from "dotenv";
import { Socket } from "socket.io";
const { io } = servers;

dotenv.config();

io.on("connection", (socket: Socket) => {
  console.log("Socket server started");
  
});
