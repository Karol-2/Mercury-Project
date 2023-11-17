import Chat from "./Chat";

export default interface User {
  nick: string;
  password: string;
  first_name: string;
  last_name: string;
  country: string;
  profile_picture: string;
  mail: string;
  friend_ids?: number[];
  chats?: Chat[];
}
