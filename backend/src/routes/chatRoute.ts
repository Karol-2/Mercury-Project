import { Router } from "express";
import ChatModel from "../mongoDB/ChatModel";
import Chat from "../models/Chat";
const chatRouter = Router();

chatRouter.get("/:user1Id/:user2Id", async (req, res) => {
    try {
        const user1Id = req.params.user1Id;
        const user2Id = req.params.user2Id;
        const messages = await Promise.all([
            ChatModel.find({authorId: user1Id, receiverId: user2Id}),
            ChatModel.find({authorId: user2Id, receiverId: user1Id}) 
        ]);
        return res.json({status: "ok", messages});
    } catch (err) {
        console.log("Error:", err);
        return res.status(404).json({ status: "error", errors: err as object });
    }
});

chatRouter.post("/", async (req, res) => {
    try {
        const newChat = req.body as Chat;
        await ChatModel.create(newChat);
        return res.json({status: "ok"});
    } catch (err) {
        console.log("Error:", err);
        return res.status(404).json({ status: "error", errors: err as object });
    }
});

export default chatRouter;