import { Router, Request, Response } from "express";
import driver from "../driver/driver.js";
import { JWTRequest, authenticateToken, getToken } from "../misc/jwt.js";
import {
  AuthOkErrorResponse,
  OkErrorResponse,
  UserErrorResponse,
  UsersErrorResponse,
  UsersSearchErrorResponse,
} from "../types/userResponse.js";
import usersFriendsRoute from "./usersFriendsRoute.js";
import {
  getAllUsers,
  searchUser as searchUsers,
  getUser as getUser,
  createUser,
  updateUser,
  deleteUser,
  UserCreateResult,
  registerUser,
  getDbUser,
  changePassword,
  getUsersCount,
} from "../users.js";
import DbUser from "../models/DbUser.js";
import { ChangePasswordReq } from "../models/ChangePasswordReq.js";
import { verifyRegisterUser, verifySearchQuery } from "../misc/verifyRequest.js";

const usersRouter = Router();

usersRouter.use("/", usersFriendsRoute);

export function userNotFoundRes(res: Response) {
  const json = { status: "error", errors: { id: "not found" } } as const;
  return res.status(404).json(json);
}

usersRouter.get("/", async (_req: Request, res: UsersErrorResponse) => {
  const session = driver.session();
  try {
    const users = await getAllUsers(session);
    return res.json({ status: "ok", users });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  } finally {
    await session.close();
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
    const verify = verifySearchQuery(req.query as any);
    if (!verify.valid) {
      return res.status(400).json({ status: "error", errors: verify.errors });
    }

    const { page, maxUsers, q: searchTerm, country, userId } = verify.verified;
    const maxUsersBig = BigInt(maxUsers);

    const session = driver.session();
    try {
      const userScores = await searchUsers(
        session,
        searchTerm,
        country,
        page - 1,
        maxUsers,
        userId
      );
      if (userScores === null) {
        return res
          .status(400)
          .json({ status: "error", errors: { searchTerm: "incorrect" } });
      }

      const usersCount = (await getUsersCount(session)).toBigInt() - 1n;
      const pageCount = Number(
        (usersCount + maxUsersBig - 1n) / maxUsersBig,
      );
      const users = userScores.map((userScore) => userScore[0]);

      return res.json({ status: "ok", pageCount, users });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as object });
    } finally {
      await session.close();
    }
  },
);

usersRouter.get("/:userId", async (req: Request, res: UserErrorResponse) => {
  const userId = req.params.userId;
  const issuer = req.query.issuer as string;

  let props: Partial<DbUser>;
  if (issuer) {
    props = {
      issuer: issuer,
      issuer_id: userId,
    };
  } else {
    props = {
      id: userId,
    };
  }

  const session = driver.session();
  try {
    const user = await getUser(session, props);
    if (!user) {
      return userNotFoundRes(res);
    }

    return res.json({ status: "ok", user });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  } finally {
    await session.close();
  }
});

usersRouter.get("/meetings/:userId", async (req: Request, res) => {
  try {
    const session = driver.session();
    const userId = req.params.userId;

    const user = await getDbUser(session, { id: userId });
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
  const verify = verifyRegisterUser(req.body);
  if (!verify.valid) {
    return res.status(400).json({ status: "error", errors: verify.errors });
  }

  const verifiedUser = verify.verified;
  const { issuer } = req.body;

  const session = driver.session();
  try {
    let user: UserCreateResult;
    if (issuer) {
      user = await registerUser(verifiedUser);
    } else {
      user = await createUser(session, verifiedUser);
    }

    if ("errors" in user) {
      const errors = user["errors"];
      return res.status(400).json({ status: "error", errors });
    }

    return res.json({ status: "ok", user });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  } finally {
    await session.close();
  }
});

usersRouter.put("/:userId", async (req: Request, res: OkErrorResponse) => {
  // TODO: verify user fields
  const userId = req.params.userId;
  const newUserProps = req.body;

  const session = driver.session();
  try {
    const newUser = await updateUser(session, userId, newUserProps);
    if (!newUser) {
      return userNotFoundRes(res);
    }

    return res.json({ status: "ok" });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  } finally {
    await session.close();
  }
});

usersRouter.post(
  "/:userId/change-password",
  getToken,
  async (req: JWTRequest, res: AuthOkErrorResponse) => {
    const userId = req.params.userId;

    const passwords: ChangePasswordReq = req.body;
    const { old_password, new_password, repeat_password } = passwords;

    const session = driver.session();
    try {
      const user = await getDbUser(session, { id: userId });

      if (!user) {
        return userNotFoundRes(res);
      }

      if ("password" in user) {
        const errors: Record<string, string> = {};

        if (!old_password) {
          errors["old_password"] = "is empty";
        }

        if (!new_password) {
          errors["new_password"] = "is empty";
        }

        if (!repeat_password) {
          errors["repeat_password"] = "is empty";
        }

        for (const _ in errors) {
          return res.status(400).json({ status: "error", errors });
        }
      } else {
        if (!req.token) {
          return res.status(403).json({ status: "forbidden" });
        }
      }

      const changeStatus = await changePassword(
        session,
        user,
        old_password,
        new_password,
        repeat_password,
      );

      if (changeStatus == "verify") {
        return res
          .status(400)
          .json({ status: "error", errors: { "old_password": "incorrect" } });
      } else if (changeStatus == "repeat") {
        return res.status(400).json({
          status: "error",
          errors: { "repeat_password": "passwords don't match" },
        });
      }

      return res.json({ status: "ok" });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as object });
    } finally {
      await session.close();
    }
  },
);

usersRouter.delete("/:userId", async (req: Request, res: OkErrorResponse) => {
  const userId = req.params.userId;

  const session = driver.session();
  try {
    const isDeleted = await deleteUser(session, userId);
    if (!isDeleted) {
      return userNotFoundRes(res);
    }

    return res.json({ status: "ok" });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  } finally {
    await session.close();
  }
});

export default usersRouter;
