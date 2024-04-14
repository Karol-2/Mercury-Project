import { Dispatch } from "react";
import { Socket } from "socket.io-client";

function socketListeners(socket: Socket, play: () => void, setNotifications: Dispatch<any>) {
    socket.on("notify", (notification) => {
        play();
        switch (notification.type) {
            case "message":
                console.log(notification);
                break;
            case "call":
                setNotifications((prev: any[]) => [...prev, notification]);
                break;
            case "friend":
                console.log(notification);
                break;
            default:
                console.log("Unknown notification");
        }
    });
}

export default socketListeners;