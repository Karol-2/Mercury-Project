import User from "./User";

export default interface Message {
  type: "sent" | "received" | "info";
  author: User;
  receiverId?: string;
  content: string;
}
