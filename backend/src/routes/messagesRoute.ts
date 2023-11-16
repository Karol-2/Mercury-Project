import { Router } from "express";
import reactionRouter from "./reactionsRoute";

const messageRouter = Router();

messageRouter.get("/", (_req, res) => {
  return res.send("Messages for specified chat will be received");
});

messageRouter.post("/", (_req, res) => {
  return res.send("New message will be added");
});

messageRouter.put("/:messageId", (req, res) => {
  return res.send(`Message with ID: ${req.params.messageId} will be updated`);
});

messageRouter.delete("/:messageId", (req, res) => {
  return res.send(`Message with ID: ${req.params.messageId} will be deleted`);
});

messageRouter.use("/:messageId/reactions", reactionRouter);

export default messageRouter;
