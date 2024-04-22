import { Session } from "neo4j-driver";
import Notification from "./models/Notification.js";

export async function addNotification(
    session: Session, 
    id: string,
    notification: Notification
) {
    const {receiverId, senderId, type, senderFullName} = notification;
    await session.run(
        `
        MATCH (u:User {id: $receiverId})
        MERGE (u)-[:HAS_NOTIFICATION]->(n:Notification {id: $id, senderId: $senderId, type: $type, senderFullName: $senderFullName})
        `,
        {
            id,
            receiverId,
            senderId,
            type,
            senderFullName
        }
    )
}