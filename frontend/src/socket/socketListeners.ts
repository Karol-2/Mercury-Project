import { Socket } from "socket.io-client";

function socketListeners(socket: Socket) {
    socket.on("notify", (notification) => {
        console.log(notification);
    });
}

export default socketListeners;