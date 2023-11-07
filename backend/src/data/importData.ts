import driver from "../driver/driver";
import userData from "./users";

async function isDatabaseEmpty() {
  const session = driver.session();
  try {
    const result = await session.run(
      "MATCH (u:User) RETURN count(u) as userCount"
    );
    const userCount = result.records[0].get("userCount").toNumber();
    return userCount === 0;
  } catch (error) {
    console.error("Error while loading database:", error);
    return false;
  } finally {
    session.close();
  }
}

async function importInitialData() {
  const isEmpty = await isDatabaseEmpty();
  if (!isEmpty) {
    return "Database is not empty";
  }

  const session = driver.session();
  try {
    for (const user of userData) {
      const friendIds = user.friend_ids.map((id) => Number(id));

      const createUserQuery = `
        CREATE (u:User $user)
        RETURN ID(u) AS userId
      `;
      const userResult = await session.run(createUserQuery, { user });
      const userId = userResult.records[0].get("userId").toNumber();

      for (const friendId of friendIds) {
        const createRelationshipQuery = `
          MATCH (u1:User) WHERE ID(u1) = $userId1
          MATCH (u2:User) WHERE ID(u2) = $userId2
          CREATE (u1)-[:IS_FRIENDS_WITH]->(u2)
        `;
        await session.run(createRelationshipQuery, {
          userId1: userId,
          userId2: friendId,
        });
      }
    }
    return "Initial data has been imported into database.";
  } catch (error) {
    return "Error importing data";
  } finally {
    session.close();
  }
}

export default importInitialData;
