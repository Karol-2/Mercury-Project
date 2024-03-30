import { Router, Request, Response } from "express";
import { Session } from "neo4j-driver";
import driver from "../driver/driver.js";
import User from "../models/User.js";
import roundToInt from "../misc/roundToInt.js";
import {
  OkErrorResponse,
  FriendsErrorResponse,
  UsersErrorResponse,
  FriendsPageErrorResponse,
} from "../types/userResponse.js";
import { filterUser, getFriends } from "../users.js";
import { userNotFoundRes } from "./usersRoute.js";

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
    const page = Number(req.query.page as string) - 1;
    const maxUsers = Number(req.query.maxUsers as string);

    const session = driver.session();
    try {
      const friends = await getFriends(session, userId, page, maxUsers);
      if (friends === null) {
        return userNotFoundRes(res);
      }

      return res.json({ status: "ok", pageCount: 10, friends });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as object });
    } finally {
      await session.close();
    }
  },
);

// friendshipRouter.get(
//   "/:userId/friends",
//   async (req: Request, res: Response) => {
//     try {
//       const session = driver.session();
//       const userId = req.params.userId;
//       const page: number = parseInt((req.query.page as string) || "");
//       const maxUsersOnPage: number = parseInt(
//         (req.query.maxUsers as string) || "",
//       );

//       const user = await userExists(session, res, userId);
//       if ("json" in user) {
//         await session.close();
//         return res;
//       }

//       const searchRequest = await session.run(
//         `MATCH (u:User {id: $userId})-[:IS_FRIENDS_WITH]->(f:User)-[:IS_FRIENDS_WITH]->(u)
//           WITH f ORDER BY f.last_name, f.first_name
//           RETURN DISTINCT f`,
//         { userId },
//       );
//       await session.close();

//       const allFriends = searchRequest.records.map((f) => {
//         return filterUser(f.get("f").properties);
//       });

//       if (!page && !maxUsersOnPage) {
//         if (allFriends.length === 0) {
//           return res.status(404).json({
//             status: "error",
//             errors: { users: "No friends found" },
//           });
//         }
//         const totalPage: number = roundToInt(allFriends.length / 5);
//         return res.status(200).json({
//           status: "ok",
//           allUsersSize: allFriends.length,
//           totalPage: totalPage,
//           users: allFriends,
//         });
//       } else if (!page || !maxUsersOnPage) {
//         return res.status(400).json({
//           status: "error",
//           errors: { params: "Missing or incorrect query params" },
//         });
//       }

//       const friends = allFriends.slice(
//         (page - 1) * maxUsersOnPage,
//         page * maxUsersOnPage,
//       );

//       if (friends.length === 0) {
//         return res.status(404).json({
//           status: "error",
//           errors: { users: "No friends found with given queries" },
//         });
//       }
//       const totalPage: number = roundToInt(allFriends.length / maxUsersOnPage);
//       return res.status(200).json({
//         status: "ok",
//         allUsersSize: allFriends.length,
//         totalPage: totalPage,
//         users: friends,
//       });
//     } catch (err) {
//       console.log("Error:", err);
//       return res.status(404).json({ status: "error", errors: err as object });
//     }
//   },
// );

friendshipRouter.get(
  "/:userId/friend-requests",
  async (req: Request, res: FriendsErrorResponse) => {
    try {
      const session = driver.session();
      const userId = req.params.userId;

      const user = await userExists(session, res, userId);
      if ("json" in user) {
        await session.close();
        return res;
      }

      const friendRequests = await session.run(
        `MATCH (u:User {id: $userId})<-[:SENT_INVITE_TO]-(f:User)
          WITH f ORDER BY f.last_name, f.first_name
          RETURN DISTINCT f`,
        { userId },
      );
      await session.close();

      const friends = friendRequests.records.map((f) => f.get("f").properties);
      return res.json({ status: "ok", friends });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as object });
    }
  },
);

friendshipRouter.get(
  "/:userId/friend-suggestions",
  async (req: Request, res: Response) => {
    try {
      const session: Session = driver.session();
      const userId: string = req.params.userId;
      const page: number = parseInt((req.query.page as string) || "");
      const maxUsersOnPage: number = parseInt(
        (req.query.maxUsers as string) || "",
      );
      const user = await userExists(session, res, userId);
      if ("json" in user) {
        await session.close();
        return res;
      }

      const friendSuggestionsQuery = await session.run(
        `MATCH (u:User {id: $userId})-[:IS_FRIENDS_WITH]->(friend:User)-[:IS_FRIENDS_WITH]->(suggested:User)
          WHERE NOT (u)-[:IS_FRIENDS_WITH]->(suggested) AND suggested.id <> $userId
          RETURN DISTINCT suggested`,
        { userId },
      );

      const allUsers: User[] = friendSuggestionsQuery.records.map((r) => {
        return filterUser(r.get("suggested").properties);
      });

      await session.close();

      if (!page && !maxUsersOnPage) {
        if (allUsers.length === 0) {
          return res.status(404).json({
            status: "not found",
            message: "No users found",
          });
        }
        const totalPage: number = roundToInt(allUsers.length / 5);
        return res.status(200).json({
          status: "ok",
          allUsersSize: allUsers.length,
          totalPage: totalPage,
          users: allUsers,
        });
      } else if (!page || !maxUsersOnPage) {
        return res.status(400).json({
          status: "bad request",
          message: "Missing or incorrect query params",
        });
      }

      const users = allUsers.slice(
        (page - 1) * maxUsersOnPage,
        page * maxUsersOnPage,
      );

      if (users.length === 0) {
        return res.status(404).json({
          status: "not found",
          message: "No users found with given queries",
        });
      }

      const totalPage: number = roundToInt(allUsers.length / maxUsersOnPage);
      return res.status(200).json({
        status: "ok",
        pageCount: totalPage,
        friends: users,
      });
    } catch (err) {
      console.error("Error:", err);
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
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
      return res.status(404).json({ status: "error", errors: err as object });
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
      return res.status(404).json({ status: "error", errors: err as object });
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
      return res.status(404).json({ status: "error", errors: err as object });
    }
  },
);

export default friendshipRouter;
