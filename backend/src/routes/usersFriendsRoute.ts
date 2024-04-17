import { Router, Request, Response } from "express";
import { Session } from "neo4j-driver";
import driver from "../driver/driver.js";
import User from "../models/User.js";
import {
  OkErrorResponse,
  FriendsErrorResponse,
  FriendsPageErrorResponse,
  FriendRequestsPageErrorResponse,
  FriendSuggestionsPageErrorResponse,
} from "../types/userResponse.js";
import {
  getFriendRequests,
  getFriendRequestsCount,
  getFriendSuggestions,
  getFriendSuggestionsCount,
  getFriends,
  getFriendsCount,
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

friendshipRouter.delete(
  "/:userId1/remove/:userId2",
  async (req: Request, res: OkErrorResponse) => {
    try {
      const session = driver.session();
      const userId1 = req.params.userId1;
      const userId2 = req.params.userId2;

      const user = await userExists(session, res, userId1);
      if ("json" in user) {
        await session.close();
        return res;
      }

      // Deletes all types of relations
      await session.run(
        `MATCH (a:User {id: $userId1})-[r:IS_FRIENDS_WITH]-(b:User {id: $userId2})
          DELETE r`,
        { userId1, userId2 },
      );

      await session.run(
        `MATCH (a:User {id: $userId1})-[r:SENT_INVITE_TO]-(b:User {id: $userId2})
          DELETE r`,
        { userId1, userId2 },
      );
      await session.close();

      return res.json({ status: "ok" });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as Errors });
    }
  },
);

friendshipRouter.post(
  "/:userId1/add/:userId2",
  async (req: Request, res: FriendsErrorResponse) => {
    try {
      const session = driver.session();
      const userId1 = req.params.userId1;
      const userId2 = req.params.userId2;

      const user = await userExists(session, res, userId1);
      if ("json" in user) {
        await session.close();
        return res;
      }

      const friendRequest = await session.run(
        `MATCH (a:User {id: $userId1}), (b:User {id: $userId2})
          MERGE (a)-[:SENT_INVITE_TO]->(b)`,
        { userId1, userId2 },
      );
      await session.close();

      const friends = friendRequest.records.map((f) => f.get("f").properties);
      return res.json({ status: "ok", friends });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as Errors });
    }
  },
);

friendshipRouter.post(
  "/:userId1/accept/:userId2",
  async (req: Request, res: OkErrorResponse) => {
    try {
      const session = driver.session();
      const userId1 = req.params.userId1;
      const userId2 = req.params.userId2;

      const user = await userExists(session, res, userId1);
      if ("json" in user) {
        await session.close();
        return res;
      }

      // Delete every SENT_INVITE_TO between 2 users
      await session.run(
        `MATCH (a:User {id: $userId1})-[r:SENT_INVITE_TO]-(b:User {id: $userId2})
          DELETE r`,
        { userId1, userId2 },
      );

      // Add IS_FRIENDS_WITH both ways
      await session.run(
        `MATCH (a:User {id: $userId1}), (b:User {id: $userId2})
          MERGE (a)-[:IS_FRIENDS_WITH]->(b)
          MERGE (b)-[:IS_FRIENDS_WITH]->(a)`,
        { userId1, userId2 },
      );

      await session.close();

      return res.json({ status: "ok" });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as Errors });
    }
  },
);

export default friendshipRouter;
