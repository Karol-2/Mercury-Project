import { MouseEventHandler } from "react";

interface Notification {
    id?: string;
    type: "message" | "friend" | "call";
    senderId: string;
    receiverId: string;
    senderFullName: string;
    action?: MouseEventHandler<HTMLButtonElement> | undefined;
    deleteNotification?: (id: string) => void;
}

export default Notification;