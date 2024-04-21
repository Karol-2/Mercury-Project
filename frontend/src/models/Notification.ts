type NotificationActionType = 
    ((friendId: string) => Promise<string | void>) | 
    ((userId: string) => void);

interface Notification {
    id?: string;
    type: "message" | "friend" | "call";
    senderId: string;
    receiverId: string;
    senderFullName: string;
    action?: NotificationActionType;
    deleteNotification?: (id: string) => void;
}

export default Notification;