import { Request, Response, Router } from "express";

import driver from "../driver.js";
import { formatError } from "../misc/formatError.js";
import { authenticateToken, getToken, JWTRequest } from "../misc/jwt.js";
import { changePasswordReqSchema } from "../models/ChangePasswordReq.js";
import DbUser from "../models/DbUser.js";
import { Errors } from "../models/Response.js";
import { searchSchema } from "../models/routes/Search.js";
import {
  AuthOkErrorResponse,
  OkErrorResponse,
  UserErrorResponse,
  UsersErrorResponse,
  UsersSearchErrorResponse,
} from "../types/userResponse.js";
import {
  changePassword,
  createUser,
  deleteUser,
  getAllUsers,
  getDbUser,
  getTokenDbUser,
  getUser,
  getUsersCount,
  registerUser,
  RegisterUser,
  registerUserSchema,
  searchUser as searchUsers,
  updateUser,
  UpdateUser,
  updateUserSchema,
  UserCreateResult,
} from "../users.js";
import usersFriendsRoute from "./userFriendsRoute.js";

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
    return res.status(404).json({ status: "error", errors: err as Errors });
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
    const searchParse = searchSchema.safeParse(req.query);
    if (!searchParse.success) {
      const errors = formatError(searchParse.error);
      return res.status(400).json({ status: "error", errors });
    }

    const { page, maxUsers, q: searchTerm, country, userId } = searchParse.data;
    const maxUsersBig = BigInt(maxUsers);

    const session = driver.session();
    try {
      const userScores = await searchUsers(
        session,
        searchTerm,
        country,
        page - 1,
        maxUsers,
        userId,
      );
      if (userScores === null) {
        return res
          .status(400)
          .json({ status: "error", errors: { searchTerm: "incorrect" } });
      }

      const usersCount = (await getUsersCount(session)).toBigInt() - 1n;
      const pageCount = Number((usersCount + maxUsersBig - 1n) / maxUsersBig);
      const users = userScores.map((userScore) => userScore[0]);

      return res.json({ status: "ok", pageCount, users });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as Errors });
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
    return res.status(404).json({ status: "error", errors: err as Errors });
  } finally {
    await session.close();
  }
});

usersRouter.post("/", async (req: Request, res: UserErrorResponse) => {
  const userParse = registerUserSchema.safeParse(req.body);
  if (!userParse.success) {
    const errors = formatError(userParse.error);
    return res.status(400).json({ status: "error", errors });
  }

  const parsedUser: RegisterUser = userParse.data;
  const { issuer } = req.body;

  const session = driver.session();
  try {
    let user: UserCreateResult;
    if (issuer) {
      user = await registerUser(session, parsedUser);
    } else {
      user = await createUser(session, parsedUser);
    }

    if ("errors" in user) {
      const errors = user["errors"];
      return res.status(400).json({ status: "error", errors });
    }

    return res.json({ status: "ok", user });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as Errors });
  } finally {
    await session.close();
  }
});

usersRouter.put(
  "/:userId",
  authenticateToken,
  async (req: JWTRequest, res: AuthOkErrorResponse) => {
    const session = driver.session();
    try {
      const userId = req.params.userId;
      const user = await getTokenDbUser(session, req.token!);

      if (!user) {
        return userNotFoundRes(res);
      }

      if (user.id != userId) {
        return res.status(403).json({ status: "forbidden" });
      }

      const userParse = updateUserSchema.safeParse(req.body);
      if (!userParse.success) {
        const errors = formatError(userParse.error);
        return res.status(400).json({ status: "error", errors });
      }

      const parsedUser: UpdateUser = userParse.data;

      const newUser = await updateUser(session, userId, parsedUser);
      if (!newUser) {
        return userNotFoundRes(res);
      }

      return res.json({ status: "ok" });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as Errors });
    } finally {
      await session.close();
    }
  },
);

usersRouter.post(
  "/:userId/change-password",
  getToken,
  async (req: JWTRequest, res: AuthOkErrorResponse) => {
    const userId = req.params.userId;

    const passwordsParse = changePasswordReqSchema.safeParse(req.body);
    if (!passwordsParse.success) {
      const errors = formatError(passwordsParse.error);
      return res.status(400).json({ status: "error", errors });
    }

    const parsedPasswords = passwordsParse.data;

    const session = driver.session();
    try {
      const changePasswordResult = await changePassword(
        session,
        userId,
        parsedPasswords,
        req.token,
      );

      if (!changePasswordResult.success) {
        const { userExists, isUserIssued, passwordCorrect } =
          changePasswordResult;

        if (!userExists) {
          return userNotFoundRes(res);
        }

        if (isUserIssued) {
          return res.status(403).json({ status: "forbidden" });
        }

        if (!passwordCorrect) {
          return res
            .status(400)
            .json({ status: "error", errors: { "old_password": "incorrect" } });
        }
      }

      return res.json({ status: "ok" });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as Errors });
    } finally {
      await session.close();
    }
  },
);

usersRouter.delete(
  "/:userId",
  authenticateToken,
  async (req: JWTRequest, res: AuthOkErrorResponse) => {
    const session = driver.session();
    try {
      const userId = req.params.userId;
      const user = await getTokenDbUser(session, req.token!);

      if (!user) {
        return userNotFoundRes(res);
      }

      if (user.id != userId) {
        return res.status(403).json({ status: "forbidden" });
      }

      const isDeleted = await deleteUser(session, userId);
      if (!isDeleted) {
        return userNotFoundRes(res);
      }

      return res.json({ status: "ok" });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as Errors });
    } finally {
      await session.close();
    }
  },
);

export default usersRouter;
