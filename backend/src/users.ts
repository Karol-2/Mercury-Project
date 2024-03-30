import neo4j, { Session } from "neo4j-driver";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import removeKeys from "./misc/removeKeys.js";
import wordToVec from "./misc/wordToVec.js";
import DbUser from "./models/DbUser.js";
import kcAdminClient from "./kcAdminClient.js";
import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation.js";
import driver from "./driver/driver.js";
import { Either } from "./misc/Either.js";
import NativeUser from "./models/NativeUser.js";
import ExternalUser from "./models/ExternalUser.js";

export const filterUser = (user: DbUser): User => {
  if ("password" in user) {
    return removeKeys(user, ["name_embedding", "password"]);
  } else {
    return removeKeys(user, ["name_embedding", "issuer", "issuer_id"]);
  }
};

const registerUserToKeycloakUser = (
  user: RegisterUser,
): UserRepresentation => ({
  enabled: true,
  firstName: user.first_name,
  lastName: user.last_name,
  credentials: [
    {
      type: "password",
      value: user.password,
      temporary: false,
    },
  ],
  email: user.mail,
  emailVerified: true,
});

function getResponse(e: any): Response | null {
  if (!e || !e.response) {
    return null;
  }

  return e.response;
}

type RegisterUser = Omit<User, "id"> & NativeUser;
type CreateUser = Omit<User, "id"> & Either<NativeUser, ExternalUser>;
export type UserCreateResult = User | { errors: Record<string, string> };

async function createUserQuery(
  session: Session,
  userData: DbUser,
): Promise<User> {
  const userResult = await session.run(`CREATE (u:User $user) RETURN u`, {
    user: userData,
  });

  const user = filterUser(userResult.records[0].get("u").properties);
  return user;
}

export async function createUser(
  session: Session,
  userData: CreateUser,
): Promise<UserCreateResult> {
  if ("password" in userData) {
    const existsUser = await getDbUser(session, { mail: userData.mail });

    if (existsUser) {
      return { errors: { id: "already exists" } };
    }
  } else {
    const existsUser = (await getDbUser(session, {
      mail: userData.mail,
      issuer: userData.issuer,
    })) as (DbUser & ExternalUser) | null;

    if (existsUser) {
      if (existsUser.issuer_id != userData.issuer_id) {
        await updateUser(session, existsUser.id, {
          issuer_id: userData.issuer_id,
        });
      }

      return { errors: { id: "already exists" } };
    }
  }

  const firstNameEmbedding = wordToVec(userData.first_name);
  const lastNameEmbedding = wordToVec(userData.last_name);

  const errors: Record<string, string> = {};

  if (firstNameEmbedding.length == 0) {
    errors["first_name"] = "incorrect";
  }

  if (lastNameEmbedding.length == 0) {
    errors["last_name"] = "incorrect";
  }

  for (const _ in errors) {
    return { errors };
  }

  const id = uuidv4();
  const nameEmbedding = firstNameEmbedding.map((e1, i) => {
    const e2 = lastNameEmbedding[i];
    return (e1 + e2) / 2;
  });

  let user = { ...userData, id, name_embedding: nameEmbedding } as DbUser;

  if ("password" in userData) {
    const { password } = userData;
    const passwordHashed = await bcrypt.hash(password, 10);
    user = { ...user, password: passwordHashed };
  }

  return createUserQuery(session, user);
}

export async function registerUser(
  userData: RegisterUser,
): Promise<UserCreateResult> {
  const session = driver.session();
  try {
    const { id: keycloakId } = await kcAdminClient.users.create(
      registerUserToKeycloakUser(userData),
    );

    const dbUserData: CreateUser = {
      ...removeKeys(userData, ["password"]),
      issuer: "mercury",
      issuer_id: keycloakId,
    };

    const user = await createUser(session, dbUserData);
    return user;
  } catch (e) {
    const response = getResponse(e);
    if (response != null && response.status == 409) {
      return { errors: { id: "already exists" } };
    } else {
      throw e;
    }
  } finally {
    await session.close();
  }
}

export async function getUser(
  session: Session,
  props: Partial<User>,
): Promise<User | null> {
  const user = await getDbUser(session, props);
  if (!user) {
    return null;
  }

  return filterUser(user);
}

export async function getDbUser(
  session: Session,
  props: Partial<DbUser>,
): Promise<DbUser | null> {
  const propsStr = Object.keys(props)
    .map((k) => `${k}: $${k}`)
    .join(", ");

  const userExistsResult = await session.run(
    `MATCH (u:User {${propsStr}}) RETURN u`,
    props,
  );

  if (userExistsResult.records.length === 0) {
    return null;
  }

  const user = userExistsResult.records[0].get("u").properties as DbUser;
  return user;
}

export async function getAllUsers(session: Session) {
  const usersRequest = await session.run(`MATCH (u:User) RETURN u`);
  const users = usersRequest.records.map((r) =>
    filterUser(r.get("u").properties),
  );
  return users;
}

export type UserScore = [User, number];

export async function searchUser(
  session: Session,
  searchTerm: string,
  pageIndex: number,
  pageSize: number,
): Promise<UserScore[] | null> {
  const wordVec = wordToVec(searchTerm);

  if (wordVec.length == 0) {
    return null;
  }

  const querySkip = neo4j.int(pageIndex * pageSize);
  const queryLimit = neo4j.int(pageSize);
  console.log(querySkip, queryLimit)

  const userRequest = await session.run(
    `CALL db.index.vector.queryNodes('user-names', 10, $wordVec)
     YIELD node AS similarUser, score
     RETURN similarUser, score
     SKIP $querySkip
     LIMIT $queryLimit`,
    { wordVec, querySkip, queryLimit },
  );

  const users = userRequest.records.map((r) => {
    return [
      filterUser(r.get("similarUser").properties),
      Number(r.get("score")),
    ] as UserScore;
  });

  return users;
}

export async function getUsersCount(session: Session): Promise<neo4j.Integer> {
  const usersCount = await session.run(
    `MATCH (u:User) RETURN count(u)`,
  );

  return usersCount.records[0].get(0)
}

export async function updateUser(
  session: Session,
  userId: string,
  newUserProps: Partial<DbUser>,
): Promise<boolean> {
  const user = await getDbUser(session, { id: userId });
  if (!user) {
    return false;
  }

  if (!("password" in user) && user.issuer == "mercury") {
    const keycloakUser = await kcAdminClient.users.findOne({
      id: user.issuer_id,
    });

    if (keycloakUser) {
      await kcAdminClient.users.update(
        { id: user.issuer_id },
        {
          firstName: newUserProps.first_name,
          lastName: newUserProps.last_name,
        },
      );
    }
  }

  const newUser = { ...user, ...newUserProps };
  await session.run(`MATCH (u:User {id: $userId}) SET u=$user`, {
    userId,
    user: newUser,
  });

  return true;
}

export type ChangePasswordSuccess = "success";
export type ChangePasswordError = "verify" | "repeat";
export type ChangePasswordResult = ChangePasswordSuccess | ChangePasswordError;

export async function changePassword(
  session: Session,
  user: DbUser,
  oldPassword: string,
  newPassword: string,
  repeatPassword: string,
): Promise<ChangePasswordResult> {
  if (!("password" in user)) {
    if (user.issuer == "mercury") {
      const keycloakUser = await kcAdminClient.users.findOne({
        id: user.issuer_id,
      });

      const requiredActions = keycloakUser?.requiredActions || [];
      requiredActions.push("UPDATE_PASSWORD");

      await kcAdminClient.users.update(
        { id: user.issuer_id },
        {
          requiredActions,
        },
      );
      return "success";
    } else {
      throw new Error("not implemented");
    }
  }

  const match: boolean = await bcrypt.compare(oldPassword, user.password);
  if (!match) {
    return "verify";
  }

  if (newPassword != repeatPassword) {
    return "repeat";
  }

  const passwordHashed = await bcrypt.hash(newPassword, 10);
  const updatedUser = { ...user, password: passwordHashed };

  await session.run(`MATCH (u:User {id: $userId}) SET u=$user`, {
    userId: user.id,
    user: updatedUser,
  });
  return "success";
}

export async function deleteUser(
  session: Session,
  userId: string,
): Promise<boolean> {
  const user = await getDbUser(session, { id: userId });

  if (!user) {
    return false;
  }

  if (!("password" in user) && user.issuer == "mercury") {
    await kcAdminClient.users.del({ id: user.issuer_id });
  }

  await session.run(`MATCH (u:User {id: $userId}) DETACH DELETE u`, {
    userId,
  });

  return true;
}

export async function getFriends(
  session: Session,
  userId: string,
  pageIndex: number,
  pageSize: number,
): Promise<User[] | null> {
  const user = await getUser(session, { id: userId });
  if (!user) {
    return null;
  }

  const querySkip = neo4j.int(pageIndex * pageSize);
  const queryLimit = neo4j.int(pageSize);

  const friendRequest = await session.run(
    `MATCH (u:User {id: $userId})-[:IS_FRIENDS_WITH]-(f:User)
     RETURN DISTINCT f
     SKIP $querySkip
     LIMIT $queryLimit`,
    { userId, querySkip, queryLimit },
  );

  const friends = friendRequest.records.map((f) =>
    filterUser(f.get("f").properties),
  );
  return friends;
}

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
