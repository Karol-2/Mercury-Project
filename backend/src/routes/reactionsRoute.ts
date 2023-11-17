import { Router } from "express";

const reactionRouter = Router();

reactionRouter.get("/", (_req, res) => {
  return res.send("Reactions for specified message will be received");
});

reactionRouter.post("/", (_req, res) => {
  return res.send("New reaction will be added");
});

reactionRouter.put("/:reactionId", (req, res) => {
  return res.send(`Reaction with ID: ${req.params.reactionId} will be updated`);
});

reactionRouter.delete("/:reactionId", (req, res) => {
  return res.send(`Reaction with ID: ${req.params.reactionId} will be deleted`);
});

export default reactionRouter;
