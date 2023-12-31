import Chat from "../models/Chat";
import ChatModel from "../mongoDB/ChatModel";

async function addMessageToDb(message: Chat) {
  try {
    await ChatModel.create(message);
  } catch (err) {
    console.error(err);
  }
}

export default addMessageToDb;
