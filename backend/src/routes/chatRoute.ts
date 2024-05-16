import { Router } from "express";
import Message from "../models/Message.js";
import MessageModel from "../mongoDB/MessageModel.js";
import { JWTRequest, authenticateToken } from "../misc/jwt.js";
import { AuthMessagesErrorResponse } from "../types/userResponse.js";
import { Errors } from "../models/Response.js";
import { getTokenDbUser } from "../users.js";
import driver from "../driver.js";
import { userNotFoundRes } from "./usersRoute.js";

const chatRouter = Router();

chatRouter.get(
  "/:user1Id/:user2Id",
  authenticateToken,
  async (req: JWTRequest, res: AuthMessagesErrorResponse) => {
    const session = driver.session();
    try {
      const { user1Id, user2Id } = req.params;
      const user = await getTokenDbUser(session, req.token!);

      if (!user) {
        return userNotFoundRes(res);
      }

      if (user.id != user1Id) {
        return res.status(403).json({ status: "forbidden" });
      }

      const messageRequest = await MessageModel.find({
        $or: [
          { fromUserId: user1Id, toUserId: user2Id },
          { fromUserId: user2Id, toUserId: user1Id },
        ],
      }).sort({ created_date: "asc" });

      const messages = messageRequest.map((m: Message) => {
        const { sentDate, fromUserId, toUserId, content } = m;
        return {
          type: fromUserId === user1Id ? "sent" : "received",
          sentDate,
          fromUserId,
          toUserId,
          content,
        } as Message;
      });

      return res.json({ status: "ok", messages });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as Errors });
    } finally {
      session.close();
    }
  },
);

export default chatRouter;
