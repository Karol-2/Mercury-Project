interface Notification {
    id?: string;
    type: "message" | "friend" | "call";
    senderId: string;
    receiverId: string;
    senderFullName: string;
}
export default Notification;