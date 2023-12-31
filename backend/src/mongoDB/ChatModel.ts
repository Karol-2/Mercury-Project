import { model, Schema } from "mongoose";
import Chat from "../models/Chat";

const chatSchema = new Schema<Chat>({
  authorId: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: { type: String, required: true },
  created_date: { type: Date, required: true },
});

const ChatModel = model("Chat", chatSchema, "chats");

export default ChatModel;
