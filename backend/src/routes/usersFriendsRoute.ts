import { Router, Request, Response } from "express";
import { Session } from "neo4j-driver";
import driver from "../driver/driver.js";
import User from "../models/User.js";
import {
  OkErrorResponse,
  FriendsPageErrorResponse,
  FriendRequestsPageErrorResponse,
  FriendSuggestionsPageErrorResponse,
} from "../types/userResponse.js";
import {
  acceptFriendRequest,
  declineFriendRequest,
  deleteFriend,
  getFriendRequests,
  getFriendRequestsCount,
  getFriendSuggestions,
  getFriendSuggestionsCount,
  getFriends,
  getFriendsCount,
  sendFriendRequest,
} from "../users.js";
import { userNotFoundRes } from "./usersRoute.js";
import { Errors } from "../models/Response.js";
import Page, { pageSchema } from "../models/routes/Page.js";
import { formatError } from "../misc/formatError.js";

const friendshipRouter = Router();

async function userExists(
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

friendshipRouter.get(
  "/:userId/friends",
  async (req: Request, res: FriendsPageErrorResponse) => {
    const userId = req.params.userId;

    const pageParse = pageSchema.safeParse(req.query);
    if (!pageParse.success) {
      const errors = formatError(pageParse.error);
      return res.status(400).json({ status: "error", errors });
    }

    const { page, maxUsers }: Page = pageParse.data;
    const maxUsersBig = BigInt(maxUsers);

    const session = driver.session();
    try {
      const friends = await getFriends(session, userId, page - 1, maxUsers);
      if (friends === null) {
        console.log(friends);
        return userNotFoundRes(res);
      }

      const friendsCount = await getFriendsCount(session, userId);
      if (friendsCount === null) {
        return userNotFoundRes(res);
      }

      const pageCount = Number(
        (friendsCount.toBigInt() + maxUsersBig - 1n) / maxUsersBig,
      );
      console.log(pageCount);
      return res.json({ status: "ok", pageCount, friends });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as Errors });
    } finally {
      await session.close();
    }
  },
);

friendshipRouter.get(
  "/:userId/friend-requests",
  async (req: Request, res: FriendRequestsPageErrorResponse) => {
    const userId = req.params.userId;

    const pageParse = pageSchema.safeParse(req.query);
    if (!pageParse.success) {
      const errors = formatError(pageParse.error);
      return res.status(400).json({ status: "error", errors });
    }

    const { page, maxUsers }: Page = pageParse.data;
    const maxUsersBig = BigInt(maxUsers);

    const session = driver.session();
    try {
      const friendRequests = await getFriendRequests(
        session,
        userId,
        page - 1,
        maxUsers,
      );
      if (friendRequests === null) {
        return userNotFoundRes(res);
      }

      const friendRequestsCount = await getFriendRequestsCount(session, userId);
      if (friendRequestsCount === null) {
        return userNotFoundRes(res);
      }

      const pageCount = Number(
        (friendRequestsCount.toBigInt() + maxUsersBig - 1n) / maxUsersBig,
      );
      return res.json({ status: "ok", pageCount, friendRequests });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as Errors });
    } finally {
      await session.close();
    }
  },
);

friendshipRouter.get(
  "/:userId/friend-suggestions",
  async (req: Request, res: FriendSuggestionsPageErrorResponse) => {
    const userId = req.params.userId;

    const pageParse = pageSchema.safeParse(req.query);
    if (!pageParse.success) {
      const errors = formatError(pageParse.error);
      return res.status(400).json({ status: "error", errors });
    }

    const { page, maxUsers }: Page = pageParse.data;
    const maxUsersBig = BigInt(maxUsers);

    const session = driver.session();
    try {
      const friendSuggestions = await getFriendSuggestions(
        session,
        userId,
        page - 1,
        maxUsers,
      );
      if (friendSuggestions === null) {
        return userNotFoundRes(res);
      }

      const friendSuggestionsCount = await getFriendSuggestionsCount(
        session,
        userId,
      );
      if (friendSuggestionsCount === null) {
        return userNotFoundRes(res);
      }

      const pageCount = Number(
        (friendSuggestionsCount.toBigInt() + maxUsersBig - 1n) / maxUsersBig,
      );
      return res.json({ status: "ok", pageCount, friendSuggestions });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as Errors });
    } finally {
      await session.close();
    }
  },
);

friendshipRouter.post(
  "/:userId1/send-friend-request/:userId2",
  async (req: Request, res: OkErrorResponse) => {
    const session = driver.session();
    const userId1 = req.params.userId1;
    const userId2 = req.params.userId2;

    try {
      const requestResult = await sendFriendRequest(session, userId1, userId2);
      if (!requestResult.success) {
        const { firstUserExists, secondUserExists } = requestResult;
        const errors: Errors = {};

        if (!firstUserExists) {
          errors["userId1"] = "not found";
        }

        if (!secondUserExists) {
          errors["userId2"] = "not found";
        }

        return res.status(400).json({ status: "error", errors });
      }

      return res.json({ status: "ok" });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as Errors });
    } finally {
      session.close();
    }
  },
);

friendshipRouter.post(
  "/:userId1/accept-friend-request/:userId2",
  async (req: Request, res: OkErrorResponse) => {
    const session = driver.session();
    const userId1 = req.params.userId1;
    const userId2 = req.params.userId2;

    try {
      const requestResult = await acceptFriendRequest(
        session,
        userId1,
        userId2,
      );
      if (!requestResult.success) {
        const {
          firstUserExists,
          secondUserExists,
          sentInvite,
          alreadyFriends,
        } = requestResult;
        const errors: Errors = {};

        if (!firstUserExists) {
          errors["userId1"] = "not found";
        }

        if (!secondUserExists) {
          errors["userId2"] = "not found";
        }

        if (firstUserExists && secondUserExists && !sentInvite) {
          errors["userId1"] = "not invited";
        }

        if (alreadyFriends) {
          errors["userId1"] = "already friends";
        }

        return res.status(400).json({ status: "error", errors });
      }

      return res.json({ status: "ok" });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as Errors });
    } finally {
      session.close();
    }
  },
);

friendshipRouter.post(
  "/:userId1/decline-friend-request/:userId2",
  async (req: Request, res: OkErrorResponse) => {
    const session = driver.session();
    const userId1 = req.params.userId1;
    const userId2 = req.params.userId2;

    try {
      const requestResult = await declineFriendRequest(
        session,
        userId1,
        userId2,
      );
      if (!requestResult.success) {
        const { firstUserExists, secondUserExists, wasFriend, wasInvited } =
          requestResult;
        const errors: Errors = {};

        if (!firstUserExists) {
          errors["userId1"] = "not found";
        }

        if (!secondUserExists) {
          errors["userId2"] = "not found";
        }

        if (firstUserExists && secondUserExists) {
          if (wasFriend) {
            errors["userId1"] = "already friends";
          }
          if (!wasInvited) {
            errors["userId1"] = "not invited";
          }
        }
        return res.status(400).json({ status: "error", errors });
      }

      return res.json({ status: "ok" });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as Errors });
    } finally {
      session.close();
    }
  },
);

friendshipRouter.delete(
  "/:userId1/delete-friend/:userId2",
  async (req: Request, res: OkErrorResponse) => {
    const session = driver.session();
    const userId1 = req.params.userId1;
    const userId2 = req.params.userId2;

    try {
      const requestResult = await deleteFriend(session, userId1, userId2);
      if (!requestResult.success) {
        const { firstUserExists, secondUserExists, wasFriend } = requestResult;
        const errors: Errors = {};

        if (!firstUserExists) {
          errors["userId1"] = "not found";
        }

        if (!secondUserExists) {
          errors["userId2"] = "not found";
        }

        if (firstUserExists && secondUserExists && !wasFriend) {
          errors["userId2"] = "not a friend";
        }

        return res.status(400).json({ status: "error", errors });
      }

      return res.json({ status: "ok" });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as Errors });
    } finally {
      session.close();
    }
  },
);

export default friendshipRouter;
