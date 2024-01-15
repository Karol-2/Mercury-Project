import { model, Schema } from "mongoose";
import Message from "../models/Message";

const chatSchema = new Schema<Message>({
  type: { type: String, required: true },
  sentDate: { type: Date, required: true },
  fromUserId: { type: String, required: true },
  toUserId: { type: String, required: true },
  content: { type: String, required: true },
});

const MessageModel = model("Chat", chatSchema, "messages");

export default MessageModel;
