import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Session } from "neo4j-driver";
import driver from "../driver/driver";
import bcrypt from "bcrypt";
import wordToVec from "../misc/wordToVec";
import User from "../models/User";
import { JWTRequest, authenticateToken } from "../misc/jwt";
import {
  FriendsErrorResponse,
  OkErrorResponse,
  UserErrorResponse,
  UsersErrorResponse,
  UsersSearchErrorResponse,
} from "../types/userResponse";
import usersFriendsRoute from "./usersFriendsRoute";

import removeKeys from "../misc/removeKeys";
import roundToInt from "../misc/roundToInt";
import { ChangePasswordReq } from "../models/ChangePasswordReq";
import { log } from "console";

const filterUser = (user: User) => removeKeys({ ...user }, ["name_embedding"]);

const usersRouter = Router();

usersRouter.use("/", usersFriendsRoute);

export async function userExists(
  session: Session,
  props: Partial<User>,
): Promise<User | null> {
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

  const user = userExistsResult.records[0].get("u").properties as User;
  return filterUser(user);
}

function userNotFoundRes(res: Response) {
  const json = { status: "error", errors: { id: "not found" } } as const;
  return res.status(404).json(json);
}

usersRouter.get("/", async (_req: Request, res: UsersErrorResponse) => {
  try {
    const session = driver.session();
    const usersRequest = await session.run(`MATCH (u:User) RETURN u`);
    const users = usersRequest.records.map((r) =>
      filterUser(r.get("u").properties),
    );

    await session.close();
    return res.json({ status: "ok", users });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

usersRouter.post(
  "/protected",
  authenticateToken,
  async (_req: JWTRequest, res: Response) => {
    res.json({ status: "ok" });
  },
);

usersRouter.get(
  "/search",
  async (req: Request, res: UsersSearchErrorResponse) => {
    const searchTerm: string = req.query.q as string;
    const country: string = req.query.country as string;

    if (!searchTerm && !country) {
      return res.status(404).json({
        status: "error",
        errors: { searchTerm: "not provided" },
      });
    }

    try {
      const page: number = parseInt((req.query.page as string) || "");
      const maxUsersOnPage: number = parseInt(
        (req.query.maxUsers as string) || "",
      );
      const session = driver.session();
      let allUsers: User[] = [];

      if (country && searchTerm) {
        const wordVec = wordToVec(searchTerm);
        const searchRequest = await session.run(
          `CALL db.index.vector.queryNodes('user-names', 100, $wordVec)
          YIELD node AS similarUser, score
          RETURN similarUser, score`,
          { wordVec },
        );

        allUsers = searchRequest.records
          .map((r) => {
            return filterUser(r.get("similarUser").properties);
          })
          .filter((user) => user.country === country);
      } else if (country) {
        const searchRequest = await session.run(
          `MATCH (similarUser:User {country: $country})
          RETURN similarUser`,
          { country },
        );

        allUsers = searchRequest.records.map((r) => {
          return filterUser(r.get("similarUser").properties);
        });
      } else if (searchTerm) {
        const wordVec = wordToVec(searchTerm);
        const searchRequest = await session.run(
          `CALL db.index.vector.queryNodes('user-names', 100, $wordVec)
          YIELD node AS similarUser, score
          RETURN similarUser, score`,
          { wordVec },
        );

        allUsers = searchRequest.records.map((r) => {
          return filterUser(r.get("similarUser").properties);
        });
      }

      await session.close();

      if (!page && !maxUsersOnPage) {
        if (allUsers.length === 0) {
          return res.status(404).json({
            status: "error",
            errors: { users: "No users found" },
          });
        }
        const totalPage: number = roundToInt(allUsers.length / 10);
        return res.status(200).json({
          status: "ok",
          allUsersSize: allUsers.length,
          totalPage: totalPage,
          users: allUsers,
        });
      } else if (!page || !maxUsersOnPage) {
        return res.status(400).json({
          status: "error",
          errors: { params: "Missing or incorrect query params" },
        });
      }

      const users = allUsers.slice(
        (page - 1) * maxUsersOnPage,
        page * maxUsersOnPage,
      );

      if (users.length === 0) {
        return res.status(404).json({
          status: "error",
          errors: { users: "No users found with given queries" },
        });
      }
      const totalPage: number = roundToInt(allUsers.length / maxUsersOnPage);
      return res.status(200).json({
        status: "ok",
        allUsersSize: allUsers.length,
        totalPage: totalPage,
        users,
      });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as object });
    }
  },
);

usersRouter.get("/:userId", async (req: Request, res: UserErrorResponse) => {
  try {
    const userId = req.params.userId;

    const session = driver.session();
    const user = await userExists(session, { id: userId });
    await session.close();

    if (!user) {
      return userNotFoundRes(res);
    }

    return res.json({ status: "ok", user });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

usersRouter.get("/meetings/:userId", async (req: Request, res) => {
  try {
    const session = driver.session();
    const userId = req.params.userId;

    const user = await userExists(session, { id: userId });
    if (!user) {
      await session.close();
      return res;
    }

    const meetingsRequest = await session.run(
      `MATCH (u1:User {id: $userId})-[m:MEETING]-(u2:User) RETURN m, u2`,
      { userId },
    );
    await session.close();
    try {
      const meetings = meetingsRequest.records.map((meeting) => {
        const { meetingId, waiting } = meeting.get(0).properties;
        const { id, first_name, last_name } = meeting.get(1).properties;
        return { meetingId, id, first_name, last_name, waiting };
      });
      return res.json({ status: "ok", meetings });
    } catch (_err) {
      return res.json({ status: "ok", meetings: [] });
    }
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

usersRouter.get("/:userId/name", async (req, res) => {
  try {
    const userId = req.params.userId;
    const session = driver.session();
    const user = await userExists(session, { id: userId });
    if (!user) {
      return userNotFoundRes(res);
    }
    const userNameRequest = await session.run(
      `MATCH (u:User {id: $userId}) return u`,
      { userId },
    );
    await session.close();
    const userData: User = userNameRequest.records.map((u) =>
      filterUser(u.get("u").properties),
    )[0];
    const fullName = `${userData.first_name} ${userData.last_name}`;
    return res.json({ status: "ok", fullName });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

usersRouter.put("/meetings/:meetingId", async (req: Request, res) => {
  try {
    const session = driver.session();
    const meetingId = req.params.meetingId;

    await session.run(
      `MATCH (u1:User)-[m:MEETING]-(u2:User) WHERE m.meetingId=$meetingId SET m.waiting = true`,
      { meetingId },
    );
    await session.close();
    return res.json({ status: "ok" });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

usersRouter.post("/", async (req: Request, res: UserErrorResponse) => {
  try {
    const newUserProps = req.body;
    // TODO: verify user fields

    const session = driver.session();
    const existsUser = await userExists(session, { mail: newUserProps.mail });

    if (existsUser) {
      await session.close();
      return res
        .status(400)
        .json({ status: "error", errors: { id: "already exists" } });
    }

    newUserProps.id = uuidv4();

    const firstNameEmbedding = wordToVec(newUserProps.first_name);
    const lastNameEmbedding = wordToVec(newUserProps.last_name);

    const errors: Record<string, string> = {};

    if (firstNameEmbedding.length == 0) {
      errors["first_name"] = "incorrect";
    }

    if (lastNameEmbedding.length == 0) {
      errors["last_name"] = "incorrect";
    }

    for (const _ in errors) {
      return res.status(400).json({ status: "error", errors });
    }

    newUserProps.name_embedding = firstNameEmbedding.map((e1, i) => {
      const e2 = lastNameEmbedding[i];
      return (e1 + e2) / 2;
    });

    const { password } = newUserProps;
    const passwordHashed = await bcrypt.hash(password, 10);
    newUserProps.password = passwordHashed;

    const newUserResult = await session.run(`CREATE (u:User $user) RETURN u`, {
      user: newUserProps,
    });

    const user = filterUser(newUserResult.records[0].get("u").properties);
    await session.close();

    return res.json({ status: "ok", user });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

usersRouter.put("/:userId", async (req: Request, res: OkErrorResponse) => {
  try {
    const userId = req.params.userId;
    const newUserProps = req.body;

    // TODO: verify user fields
    const session = driver.session();
    const user = await userExists(session, { id: userId });

    if (!user) {
      return userNotFoundRes(res);
    }

    const newUser = { ...user, ...newUserProps };
    await session.run(`MATCH (u:User {id: $userId}) SET u=$user`, {
      userId,
      user: newUser,
    });
    await session.close();

    return res.json({ status: "ok" });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

usersRouter.post(
  "/:userId/change-password",
  async (req: Request, res: OkErrorResponse) => {
    try {
      const userId = req.params.userId;
      const passwords: ChangePasswordReq = req.body;

      const { old_password, new_password, repeat_password } = passwords;

      const session = driver.session();
      const user = await userExists(session, { id: userId });

      if (!user) {
        return userNotFoundRes(res);
      }

      // check validation of the old password

      const match: boolean = await bcrypt.compare(old_password, user.password);

      if (!match) {
        return res
          .status(400)
          .json({ status: "error", errors: { "error": "" } });
      }

      // check if there are two same password
      if (new_password !== repeat_password) {
        return res.status(400).json({
          status: "error",
          errors: { "error": "Passwords don't match" },
        });
      }

      const passwordHashed = await bcrypt.hash(new_password, 10);

      const updatedUser = { ...user, password: passwordHashed };
      await session.run(`MATCH (u:User {id: $userId}) SET u=$user`, {
        userId,
        user: updatedUser,
      });
      await session.close();

      return res.json({ status: "ok" });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as object });
    }
  },
);

usersRouter.delete("/:userId", async (req: Request, res: OkErrorResponse) => {
  try {
    const userId = req.params.userId;

    const session = driver.session();
    const user = await userExists(session, { id: userId });

    if (!user) {
      return userNotFoundRes(res);
    }

    await session.run(`MATCH (u:User {id: $userId}) DETACH DELETE u`, {
      userId,
    });
    await session.close();

    return res.json({ status: "ok" });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

export default usersRouter;
