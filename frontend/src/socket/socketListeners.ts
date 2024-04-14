import { Socket } from "socket.io-client";

function socketListeners(socket: Socket, play: () => void) {
    socket.on("notify", (notification) => {
        play();
        console.log(notification);
    });
}

export default socketListeners;