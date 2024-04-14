import { Dispatch } from "react";
import { Params } from "react-router-dom";
import { Socket } from "socket.io-client";

function socketListeners(socket: Socket, play: () => void, setNotifications: Dispatch<any>, params: Params) {
    socket.on("notify", (notification) => {
        play();
        switch (notification.type) {
            case "message":
                const converserId = params.friendId;
                if (!converserId || converserId !== notification.senderId) {
                    setNotifications((prev: any[]) => [...prev, notification]);
                }
                break;
            case "call":
                setNotifications((prev: any[]) => [...prev, notification]);
                break;
            case "friend":
                console.log(notification);
                break;
            default:
                break;
        }
    });
}

export default socketListeners;