import Message from "./models/Message.js";
import MessageModel from "./mongoDB/MessageModel.js";

export async function addMessageToDb(message: Message) {
  try {
    await MessageModel.create(message);
  } catch (err) {
    console.error(err);
  }
}
