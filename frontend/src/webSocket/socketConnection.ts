import { io, Socket } from "socket.io-client";

let socket: Socket;
const socketConnection = ()=>{
    if(socket && socket.connected){
        return socket;
    }else{
        socket = io('http://localhost:5000',{});
        return socket;
    }
}

export default socketConnection;