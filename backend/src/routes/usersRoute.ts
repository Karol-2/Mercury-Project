import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import driver from "../driver/driver.js";
import { JWTRequest, authenticateToken } from "../misc/jwt.js";
import {
  FriendsErrorResponse,
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
  getFriends,
  createUser,
  updateUser,
  deleteUser,
  UserCreateResult,
  registerUser,
  getDbUser,
  changePassword,
} from "../users.js";
import DbUser from "../models/DbUser.js";
import { ChangePasswordReq } from "../models/ChangePasswordReq.js";

const usersRouter = Router();

usersRouter.use("/", usersFriendsRoute);

function userNotFoundRes(res: Response) {
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
    session.close();
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

    const session = driver.session();
    try {
      const users = await searchUsers(session, searchTerm);
      if (users === null) {
        return res
          .status(400)
          .json({ status: "error", errors: { searchTerm: "incorrect" } });
      }

      return res.json({ status: "ok", users });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as object });
    } finally {
      session.close();
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
    session.close();
  }
});

usersRouter.get(
  "/:userId/friends",
  async (req: Request, res: FriendsErrorResponse) => {
    const userId = req.params.userId;

    const session = driver.session();
    try {
      const friends = await getFriends(session, userId);
      if (friends === null) {
        return userNotFoundRes(res);
      }

      return res.json({ status: "ok", friends });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as object });
    } finally {
      session.close();
    }
  },
);

usersRouter.post("/", async (req: Request, res: UserErrorResponse) => {
  // TODO: verify user fields
  const { issuer, ...newUserProps } = req.body;

  const session = driver.session();
  try {
    let user: UserCreateResult;
    if (issuer) {
      user = await registerUser(newUserProps);
    } else {
      user = await createUser(session, newUserProps);
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
    session.close();
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
    session.close();
  }
});

usersRouter.post(
  "/:userId/change-password",
  async (req: Request, res: OkErrorResponse) => {
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
      session.close();
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
    session.close();
  }
});

export default usersRouter;
