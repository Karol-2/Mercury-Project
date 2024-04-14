import { Socket } from "socket.io-client";

function socketListeners(socket: Socket) {
    socket.on("notify", (e) => {
        console.log("notify");
    });
}

export default socketListeners;