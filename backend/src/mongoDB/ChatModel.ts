import { model, Schema } from "mongoose";
import Chat from "../models/Chat";
const chatSchema = new Schema<Chat>({
    userIds: [],
    messages: []
});

const ChatModel = model("Chat", chatSchema, "chats");

export default ChatModel;