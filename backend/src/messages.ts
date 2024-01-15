import Message from "./models/Message";
import MessageModel from "./mongoDB/MessageModel";

export async function addMessageToDb(message: Message) {
  try {
    await MessageModel.create(message);
  } catch (err) {
    console.error(err);
  }
}
