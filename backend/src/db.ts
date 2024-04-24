import driver from "./driver/driver.js";

import userData from "./data/users.js";
import { registerUser, registerUserSchema } from "./users.js";
import { addFriend } from "./userFriends.js";

export async function isDatabaseEmpty() {
  const session = driver.session();
  try {
    const result = await session.run(
      "MATCH (u:User) RETURN count(u) as userCount",
    );
    const userCount = result.records[0].get("userCount").toNumber();
    return userCount === 0;
  } catch (error) {
    console.error("Error while loading database:", error);
    return false;
  } finally {
    await session.close();
  }
}

export async function importInitialData() {
  const isEmpty = await isDatabaseEmpty();

  if (!isEmpty) {
    return "Database is not empty";
  }

  const session = driver.session();
  try {
    const userIds: string[] = [];

    for (const user of userData) {
      const parsedUser = registerUserSchema.parse(user);
      const newUser = await registerUser(session, parsedUser);
      userIds.push(newUser.id);
    }

    for (const [userIndex, user] of userData.entries()) {
      const userId = userIds[userIndex];

      for (const friendIndex of user.friend_ids) {
        const friendId = userIds[friendIndex];
        await addFriend(session, userId, friendId);
      }
    }

    // Add user search index
    const searchIndexExistsQuery = `
      SHOW INDEXES WHERE name="user-names"
    `;
    const searchIndexCreateQuery = `
      CALL db.index.vector.createNodeIndex('user-names', 'User', 'name_embedding', 64, 'cosine')
      RETURN true
    `;
    const indexExists = await session.run(searchIndexExistsQuery);
    if (indexExists.records.length == 0) {
      await session.run(searchIndexCreateQuery);
    }

    return "Initial data has been imported into database.";
  } catch (error) {
    return "Error importing data:";
  } finally {
    await session.close();
  }
}

export async function cleanUpData() {
  const session = driver.session();
  await session.run(`MATCH (m:Meeting) DETACH DELETE m`);
  await session.run(`MATCH (s:Socket) DETACH DELETE s`);
  await session.close();
}
