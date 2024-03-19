import { Session } from "neo4j-driver";
import { v4 as uuidv4 } from "uuid";
import Meeting from "./models/Meeting.js";

export async function isInMeeting(session: Session, userId: string) {
  const result = await session.run(
    `MATCH (u:User { id: $userId })-[:IS_IN_MEETING]->(m:Meeting) RETURN m`,
    { userId },
  );

  if (result.records.length > 0) {
    return result.records[0].get("m").properties as Meeting;
  }

  return null;
}

export async function createMeeting(session: Session, userId: string) {
  const meetingId = uuidv4();
  const createResult = await session.run(
    `
    MATCH (u:User { id: $userId })
    MERGE (u)-[:IS_IN_MEETING]->(m:Meeting { id: $meetingId })
    RETURN m
    `,
    { userId, meetingId },
  );

  return createResult.records[0].get("m").properties as Meeting;
}

export async function joinMeeting(
  session: Session,
  userId: string,
  friendId: string,
) {
  const createResult = await session.run(
    `
    MATCH (u:User { id: $userId })-[:IS_FRIENDS_WITH]-(f:User { id: $friendId })
    MATCH (f)-[:IS_IN_MEETING]->(m:Meeting)
    MERGE (u)-[:IS_IN_MEETING]->(m)
    RETURN m
    `,
    { userId, friendId },
  );

  return createResult.records[0]?.get("m").properties as Meeting;
}

export async function leaveMeeting(session: Session, userId: string) {
  await session.run(
    `
    MATCH (:User { id: $userId })-[r:IS_IN_MEETING]->(m:Meeting)
    DELETE r
    WITH m
    MATCH (m) WHERE NOT ()-[]->(m)
    DELETE m
    `,
    { userId },
  );
}
