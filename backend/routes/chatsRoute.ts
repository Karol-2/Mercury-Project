import { Router } from "express";
const chatRouter = Router();

chatRouter.get("/:userId", (req, res) => {
    return res.send(`All chats owned by user with ${req.params.userId} ID will be received`);
});

chatRouter.post("/:userId", (req, res) => {
    return res.send(`New chat for user ${req.params.userId} ID will be created`);
});

chatRouter.delete("/:chatId", (req, res) => {
    return res.send(`Chat with ID: ${req.params.chatId} will be deleted`);
});

export default chatRouter;