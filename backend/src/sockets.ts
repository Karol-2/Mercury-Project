import { Session } from "neo4j-driver";

export async function connectToSocket(
  session: Session,
  userId: string,
  socketId: string,
) {
  await session.run(
    `
    MATCH (u:User { id: $userId })
    MERGE (u)-[:CONNECTED_TO]->(s:Socket { id: $socketId })
    `,
    {
      userId,
      socketId,
    },
  );
}

export async function disconnectFromSocket(
  session: Session,
  userId: string,
  socketId: string,
) {
  await session.run(
    `
    MATCH (u:User { id: $userId} )-[:CONNECTED_TO]->(s:Socket { id: $socketId })
    DETACH DELETE s
    `,
    {
      userId,
      socketId
    },
  );
}
