import { Session } from "neo4j-driver";

export async function addNotification(
    session: Session, 
    senderId: string, 
    receiverId: string,
    type: "message" | "friend" | "call"
) {
    await session.run(
        `
        MATCH (u:User {id: $receiverId})
        MERGE (u)-[:HAS_NOTIFICATION]->(n:Notification {senderId: $senderId, type: $type})
        `,
        {
            receiverId,
            senderId,
            type
        }
    )
}