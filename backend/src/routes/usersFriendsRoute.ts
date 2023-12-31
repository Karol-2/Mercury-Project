import { Router, Request, Response } from "express";
import { Session } from "neo4j-driver";
import driver from "../driver/driver";
import User from "../models/User";
import { OkErrorResponse, FriendsErrorResponse } from "../types/userResponse";

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
  async (req: Request, res: FriendsErrorResponse) => {
    try {
      const session = driver.session();
      const userId = req.params.userId;

      const user = await userExists(session, res, userId);
      if ("json" in user) {
        await session.close();
        return res;
      }

      const friendQuery = await session.run(
        `MATCH (u:User {id: $userId})-[:IS_FRIENDS_WITH]->(f:User)-[:IS_FRIENDS_WITH]->(u)
          WITH f ORDER BY f.last_name, f.first_name
          RETURN DISTINCT f`,
        { userId },
      );
      await session.close();

      const friends = friendQuery.records.map((f) => f.get("f").properties);
      return res.json({ status: "ok", friends });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as object });
    }
  },
);

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
