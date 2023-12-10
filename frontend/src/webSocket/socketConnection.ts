import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  guest: () => void;
  owner: (id: string) => void;
  userDisconnected: (id: string) => void;
  offer: (id: string, message: any) => void;
  answer: (id: string, message: any) => void;
  candidate: (id: string, message: any) => void;
}

interface ClientToServerEvents {
  guest: (secret: string) => void;
  owner: () => void;
  offer: (id: string, message: any) => void;
  answer: (id: string, message: any) => void;
  candidate: (id: string, message: any) => void;
}

let socket: Socket<ClientToServerEvents, ServerToClientEvents>;
const socketConnection = (jwt: string) => {
  if (socket && socket.connected) {
    return socket;
  } else {
    socket = io("http://localhost:5000", {
      auth: {
        jwt,
      },
    });
    return socket;
  }
};

export default socketConnection;
