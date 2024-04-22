import { MouseEventHandler } from "react";

interface Notification {
    id?: string;
    type: "message" | "friend" | "call";
    senderId: string;
    receiverId: string;
    senderFullName: string;
    action?: MouseEventHandler<HTMLButtonElement> | undefined;
    deleteNotification?: MouseEventHandler<HTMLButtonElement> | undefined;
}

export default Notification;