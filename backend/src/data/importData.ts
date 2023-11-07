import { v4 as uuidv4 } from "uuid";

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
    const userIds: string[] = []

    // Create users
    const createUserQuery = `
      CREATE (u:User $user)
    `;

    for (const user of userData) {
      const userId = uuidv4();
      userIds.push(userId)

      const userClean: any = Object.assign({}, user)
      delete userClean.friend_ids
      delete userClean.chats
      userClean.id = userId

      await session.run(createUserQuery, { user: userClean });
    }

    // Create relationships
    const createRelationshipQuery = `
      MATCH (u1:User {id: $userId})
      MATCH (u2:User {id: $friendId})
      CREATE (u1)-[:IS_FRIENDS_WITH]->(u2)
    `;

    for (const [userIndex, user] of userData.entries()) {
      const userId = userIds[userIndex]

      for (const friendIndex of user.friend_ids) {
        const friendId = userIds[friendIndex]
        await session.run(createRelationshipQuery, { userId, friendId });
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
