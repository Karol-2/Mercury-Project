import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import neo4j, { Session } from "neo4j-driver";
import { v4 as uuidv4 } from "uuid";
import { ZodType } from "zod";

import kcAdminClient from "./kcAdminClient.js";
import { Either } from "./misc/Either.js";
import { issuers } from "./misc/jwt.js";
import removeKeys from "./misc/removeKeys.js";
import wordToVec from "./misc/wordToVec.js";
import ChangePasswordReq from "./models/ChangePasswordReq.js";
import DbUser from "./models/DbUser.js";
import ExternalUser from "./models/ExternalUser.js";
import NativeUser, { nativeUserSchema } from "./models/NativeUser.js";
import TokenPayload from "./models/TokenPayload.js";
import User, { userSchema } from "./models/User.js";

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

export type RegisterUser = Omit<User, "id"> & NativeUser;
export type CreateUser = Omit<User, "id"> & Either<NativeUser, ExternalUser>;
export type UpdateUser = Partial<Omit<User, "id">>;
export type UserCreateResult = User | { errors: Record<string, string> };

export const registerUserSchema = userSchema
  .omit({ id: true })
  .merge(nativeUserSchema) satisfies ZodType<RegisterUser>;

export const updateUserSchema = userSchema
  .omit({
    id: true,
  })
  .partial() satisfies ZodType<UpdateUser>;

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

  const nameEmbeddingResult = await generateNameEmbedding(
    userData.first_name,
    userData.last_name,
  );
  const { success, firstNameCorrect, lastNameCorrect, nameEmbedding } =
    nameEmbeddingResult;

  const errors: Record<string, string> = {};

  if (!success) {
    if (!firstNameCorrect) {
      errors["first_name"] = "incorrect";
    }

    if (!lastNameCorrect) {
      errors["last_name"] = "incorrect";
    }

    return { errors };
  }

  const id = uuidv4();
  let user = { ...userData, id, name_embedding: nameEmbedding } as DbUser;

  if ("password" in userData) {
    const { password } = userData;
    const passwordHashed = await bcrypt.hash(password, 10);
    user = { ...user, password: passwordHashed };
  }

  return createUserQuery(session, user);
}

export async function registerUser(
  session: Session,
  userData: RegisterUser,
): Promise<User> {
  let keycloakId: string = "";

  try {
    keycloakId = (
      await kcAdminClient.users.create(registerUserToKeycloakUser(userData))
    ).id;
  } catch (e) {
    const response = getResponse(e);
    if (response == null || response.status != 409) {
      throw e;
    }
  }

  if (!keycloakId) {
    keycloakId = (
      await kcAdminClient.users.find({ email: userData.mail, realm: "mercury" })
    )[0].id!;
  }

  const dbUserData: CreateUser = {
    ...removeKeys(userData, ["password"]),
    issuer: "mercury",
    issuer_id: keycloakId,
  };

  await createUser(session, dbUserData);

  const user = await getDbUser(session, {
    mail: userData.mail,
    issuer: "mercury",
  });
  return filterUser(user!);
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

type SubProps = {
  sub?: string;
  props?: Partial<DbUser>;
};

function tokenPayloadToSubProps(tokenPayload: TokenPayload): SubProps {
  const issuer = tokenPayload.iss;

  if (issuer == issuers.mercury) {
    const sub = tokenPayload.sub;
    const props = { issuer: "mercury", issuer_id: sub };
    return { sub, props };
  } else if (issuer == issuers.rest) {
    const sub = tokenPayload.userId;
    const props = { id: sub };
    return { sub, props };
  }

  return {};
}

export async function getTokenDbUser(
  session: Session,
  tokenPayload: TokenPayload,
): Promise<DbUser | null> {
  let { sub, props } = tokenPayloadToSubProps(tokenPayload);

  if (!sub || !props) {
    return null;
  }

  const user = await getDbUser(session, props);
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
  country: string,
  pageIndex: number,
  pageSize: number,
  userId: string = "",
): Promise<UserScore[] | null> {
  const queryElems = neo4j.int((pageIndex + 1) * pageSize);
  const querySkip = neo4j.int(pageIndex * pageSize);
  const queryLimit = neo4j.int(pageSize);

  let userRequest: neo4j.QueryResult;

  if (!searchTerm) {
    userRequest = await session.run(
      `MATCH (u:User)
       WHERE ($country = "" OR u.country = $country) AND u.id <> $userId
       RETURN u as similarUser, 1.0 as score
       SKIP $querySkip
       LIMIT $queryLimit`,
      { queryElems, country, userId, querySkip, queryLimit },
    );
  } else {
    const wordVec = wordToVec(searchTerm);

    if (wordVec.length == 0) {
      return null;
    }

    userRequest = await session.run(
      `CALL db.index.vector.queryNodes('user-names', $queryElems, $wordVec)
       YIELD node AS similarUser, score
       WHERE ($country = "" OR similarUser.country = $country) AND similarUser.id <> $userId
       RETURN similarUser, score
       SKIP $querySkip
       LIMIT $queryLimit`,
      { wordVec, queryElems, userId, country, querySkip, queryLimit },
    );
  }

  const users = userRequest.records.map((r) => {
    return [
      filterUser(r.get("similarUser").properties),
      Number(r.get("score")),
    ] as UserScore;
  });

  return users;
}

export async function getUsersCount(session: Session): Promise<neo4j.Integer> {
  const usersCount = await session.run(`MATCH (u:User) RETURN count(u)`);

  return usersCount.records[0].get(0);
}

export type GenerateNameEmbeddingResult = {
  success: boolean;
  firstNameCorrect: boolean;
  lastNameCorrect: boolean;
  nameEmbedding: number[];
};

export async function generateNameEmbedding(
  firstName: string,
  lastName: string,
): Promise<GenerateNameEmbeddingResult> {
  const firstNameEmbedding = wordToVec(firstName);
  const lastNameEmbedding = wordToVec(lastName);

  const firstNameCorrect = firstNameEmbedding.length > 0;
  const lastNameCorrect = lastNameEmbedding.length > 0;
  const success = firstNameCorrect && lastNameCorrect;

  if (!success) {
    return {
      success,
      firstNameCorrect,
      lastNameCorrect,
      nameEmbedding: [],
    };
  }

  const nameEmbedding = firstNameEmbedding.map((e1, i) => {
    const e2 = lastNameEmbedding[i];
    return (e1 + e2) / 2;
  });

  return {
    success,
    firstNameCorrect,
    lastNameCorrect,
    nameEmbedding,
  };
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

  const { nameEmbedding } = await generateNameEmbedding(
    newUserProps.first_name || user.first_name,
    newUserProps.last_name || user.last_name,
  );
  const newUser = { ...user, ...newUserProps, name_embedding: nameEmbedding };
  await session.run(`MATCH (u:User {id: $userId}) SET u=$user`, {
    userId,
    user: newUser,
  });

  return true;
}

export type ChangePasswordResult = {
  success: boolean;
  userExists: boolean;
  isUserIssued: boolean;
  passwordCorrect: boolean;
};

export async function changePassword(
  session: Session,
  userId: string,
  passwords: ChangePasswordReq,
  token?: TokenPayload,
): Promise<ChangePasswordResult> {
  const user = await getDbUser(session, { id: userId });
  if (!user) {
    return {
      success: false,
      userExists: false,
      isUserIssued: false,
      passwordCorrect: false,
    };
  }

  const userExists = true;
  const isUserIssued = !("password" in user);

  if (isUserIssued) {
    const tokenInvalid = {
      success: false,
      userExists,
      isUserIssued,
      passwordCorrect: false,
    };

    if (!token) {
      return tokenInvalid;
    }

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

      return { success: true, userExists, isUserIssued, passwordCorrect: true };
    } else {
      throw new Error("not implemented");
    }
  }

  let isEmpty = true;
  for (const _ in passwords) {
    isEmpty = false;
  }

  if (isEmpty) {
    return { success: false, userExists, isUserIssued, passwordCorrect: false };
  }

  const { old_password, new_password } = passwords as any;

  const match: boolean = await bcrypt.compare(old_password, user.password);
  if (!match) {
    return { success: false, userExists, isUserIssued, passwordCorrect: false };
  }

  const passwordCorrect = true;
  const passwordHashed = await bcrypt.hash(new_password, 10);
  const updatedUser = { ...user, password: passwordHashed };

  await session.run(`MATCH (u:User {id: $userId}) SET u=$user`, {
    userId: user.id,
    user: updatedUser,
  });

  return { success: true, userExists, isUserIssued, passwordCorrect };
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
