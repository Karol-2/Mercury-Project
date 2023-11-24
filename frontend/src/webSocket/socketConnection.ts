import { io, Socket } from "socket.io-client";

let socket: Socket;
const socketConnection = (jwt: string)=>{
    if(socket && socket.connected){
        return socket;
    }else{
        socket = io('http://localhost:5000',{
            auth: {
                jwt
            }
        });
        return socket;
    }
}

export default socketConnection;