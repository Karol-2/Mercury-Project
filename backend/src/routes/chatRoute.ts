import { Router } from "express";
import ChatModel from "../mongoDB/ChatModel";

const chatRouter = Router();

chatRouter.get("/:user1Id/:user2Id", async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;
    const messageRequest = await ChatModel.find({
      $or: [
        { authorId: user1Id, receiverId: user2Id },
        { authorId: user2Id, receiverId: user1Id },
      ],
    }).sort({ created_date: "asc" });

    const messages = messageRequest.map((m) => {
      const { authorId, receiverId, content, created_date } = m;
      return {
        authorId,
        receiverId,
        content,
        created_date,
        type: authorId === user1Id ? "sent" : "received",
      };
    });

    return res.json({ status: "ok", messages });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

export default chatRouter;
