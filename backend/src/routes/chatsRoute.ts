import { Router } from "express";
import messageRouter from "./messagesRoute";

const chatRouter = Router();

chatRouter.get("/", (_req, res) => {
  return res.send(`All chats owned by specified user will be received`);
});

chatRouter.post("/", (_req, res) => {
  return res.send(`New chat for specified user will be created`);
});

chatRouter.delete("/:chatId", (req, res) => {
  return res.send(`Chat with ID: ${req.params.chatId} will be deleted`);
});

chatRouter.use("/:chatId/messages", messageRouter);

export default chatRouter;
