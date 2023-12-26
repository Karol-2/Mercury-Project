import { io, Socket } from "socket.io-client";
import { useUser } from "../helpers/UserProvider";

let socket: Socket;
const socketConnection = () => {
  const {userId} = useUser();
  if (socket && socket.connected) {
    return socket;
  } else {
    socket = io("http://localhost:5000", {auth: {userId}});
    return socket;
  }
};

export default socketConnection;
