import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Session } from "neo4j-driver";

import driver from "../driver/driver";

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

const usersRouter = Router();

export async function userExists(
  session: Session,
  res: Response,
  userId: string,
): Promise<Response | User> {
  const userExistsResult = await session.run(
    `MATCH (u:User {id: $userId}) RETURN u`,
    { userId },
  );

  if (userExistsResult.records.length === 0) {
    await session.close();
    const json = { status: "error", errors: { id: "not found" } } as const;
    return res.status(404).json(json);
  }

  return userExistsResult.records[0].get("u").properties as User;
}

usersRouter.get("/", async (_req: Request, res: UsersErrorResponse) => {
  try {
    const session = driver.session();
    const usersRequest = await session.run(`MATCH (u:User) RETURN u`);
    const users = usersRequest.records.map((r) => r.get("u").properties);

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
    const searchTerm = req.query.q;
    if (typeof searchTerm != "string") {
      return res.status(404).json({
        status: "error",
        errors: { searchTerm: "not provided" },
      });
    }

    if (searchTerm.length == 0) {
      return res
        .status(404)
        .json({ status: "error", errors: { searchTerm: "is empty" } });
    }

    try {
      const session = driver.session();
      const wordVec = wordToVec(searchTerm);

      const userRequest = await session.run(
        `CALL db.index.vector.queryNodes('user-names', 10, $wordVec)
      YIELD node AS similarUser, score
      RETURN similarUser, score`,
        { wordVec },
      );
      const users = userRequest.records.map((r) => {
        return [r.get("similarUser").properties, Number(r.get("score"))] as [
          User,
          number,
        ];
      });
      await session.close();
      return res.json({ status: "ok", users });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as object });
    }
  },
);

usersRouter.get("/:userId", async (req: Request, res: UserErrorResponse) => {
  try {
    const session = driver.session();
    const userId = req.params.userId;

    const user = await userExists(session, res, userId);
    await session.close();
    if ("json" in user) return res;

    return res.json({ status: "ok", user });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

usersRouter.get(
  "/:userId/friends",
  async (req: Request, res: FriendsErrorResponse) => {
    try {
      const session = driver.session();
      const userId = req.params.userId;

      const user = await userExists(session, res, userId);
      if ("json" in user) {
        await session.close();
        return res;
      }

      const friendRequest = await session.run(
        `MATCH (u:User {id: $userId})-[:IS_FRIENDS_WITH]-(f:User) RETURN f`,
        { userId },
      );
      await session.close();

      const friends = friendRequest.records.map((f) => f.get("f").properties);
      return res.json({ status: "ok", friends });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as object });
    }
  },
);

usersRouter.get(
  "/:user1Id/:user2Id/meetings",
  async (req: Request, res) => {
    try {
      const session = driver.session();
      const user1Id = req.params.user1Id;
      const user2Id = req.params.user2Id;

      const user1 = await userExists(session, res, user1Id);
      const user2 = await userExists(session, res, user2Id);
      if ("json" in user1 || "json" in user2) {
        await session.close();
        return res;
      }

      const meetingsRequest = await session.run(
        `MATCH (u1:User {id: $user1Id})-[m:MEETING]-(u2:User {id: $user2Id}) RETURN m`,
        { user1Id, user2Id },
      );
      await session.close();
      const meetingId = meetingsRequest.records[0].get(0).properties.meetingId;
      return res.json({ status: "ok", meetingId });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as object });
    }
  }
)

usersRouter.post("/", async (req: Request, res: UserErrorResponse) => {
  try {
    const newUserProps = req.body;
    // TODO: verify user fields

    newUserProps.id = uuidv4();
    newUserProps.name_embedding = wordToVec(
      newUserProps.first_name + newUserProps.last_name,
    );

    const session = driver.session();
    const newUserResult = await session.run(`CREATE (u:User $user) RETURN u`, {
      user: newUserProps,
    });

    const user = newUserResult.records[0].get("u").properties;
    await session.close();

    return res.json({ status: "ok", user });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

usersRouter.put("/:userId", async (req: Request, res: OkErrorResponse) => {
  try {
    const newUserProps = req.body;
    // TODO: verify user fields

    const session = driver.session();
    const userId = req.params.userId;

    const userProps = await userExists(session, res, userId);
    if ("json" in userProps) {
      session.close();
      return res;
    }

    const user = { ...userProps, ...newUserProps };
    await session.run(`MATCH (u:User {id: $userId}) SET u=$user`, {
      userId,
      user,
    });
    await session.close();

    return res.json({ status: "ok" });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

usersRouter.delete("/:userId", async (req: Request, res: OkErrorResponse) => {
  try {
    const session = driver.session();
    const userId = req.params.userId;

    const user = await userExists(session, res, userId);
    if ("json" in user) {
      await session.close();
      return res;
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
