import { Session } from "neo4j-driver";

export async function isFriend(
  session: Session,
  firstUserId: string,
  secondUserId: string,
) {
  try {
    const request = await session.run(
      `
      MATCH (u1:User {id: $firstUserId})
      MATCH (u2:User {id: $secondUserId})
      RETURN exists((u1)-[:IS_FRIENDS_WITH]-(u2))
      `,
      { firstUserId, secondUserId },
    );

    return request.records.length > 0;
  } catch (err) {
    return false;
  }
}
