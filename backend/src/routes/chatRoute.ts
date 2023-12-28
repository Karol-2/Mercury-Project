import { Router } from "express";
import ChatModel from "../mongoDB/ChatModel";
import Chat from "../models/Chat";
import { sortBy } from "lodash";
const chatRouter = Router();

chatRouter.get("/:user1Id/:user2Id", async (req, res) => {
  try {
    const user1Id = req.params.user1Id;
    const user2Id = req.params.user2Id;
    const messageRequest = await Promise.all([
      ChatModel.find({ authorId: user1Id, receiverId: user2Id }),
      ChatModel.find({ authorId: user2Id, receiverId: user1Id }),
    ]);
    const messages = sortBy(messageRequest.flat(), (m) => m.created_date).map(
      (m) => {
        const { authorId, receiverId, content, created_date } = m;
        return {
          authorId,
          receiverId,
          content,
          created_date,
          type: authorId === user1Id ? "sent" : "received",
        };
      },
    );
    return res.json({ status: "ok", messages });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

export default chatRouter;
