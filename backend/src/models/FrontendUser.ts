import User from "./User.js";

export default interface FrontendUser extends User {
  friend_ids?: number[];
  socketId?: string;
}
