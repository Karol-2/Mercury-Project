import driver from "../driver/driver";
import userData from './users';

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
      const query = `
        CREATE (u:User {
          id: $id,
          nick: $nick,
          first_name: $first_name,
          last_name: $last_name,
          country: $country,
          profile_picture: $profile_picture,
          mail: $mail,
          friend_ids: $friend_ids,
          chats: $chats
        })
        RETURN u.id AS userId
      `;
      await session.run(query, user);
    }
    return "Initial data has been imported into database.";
  } catch (error) {
    return "Error importing data";
  } finally {
    session.close();
  }
}

export default importInitialData;
