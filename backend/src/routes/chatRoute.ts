import { Router } from "express";
import Message from "../models/Message.js";
import MessageModel from "../mongoDB/MessageModel.js";
import { authenticateToken } from "../misc/jwt.js";

const chatRouter = Router();

chatRouter.get("/:user1Id/:user2Id", authenticateToken, async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;
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
      };
    });

    return res.json({ status: "ok", messages });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

export default chatRouter;
