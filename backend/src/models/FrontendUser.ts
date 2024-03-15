import User from "./User";

export default interface FrontendUser extends User {
  friend_ids?: number[];
  socketId?: string;
}
