import Message from "./Message";

export default interface Chat {
  id: string;
  owner_id: string;
  users_ids: string[];
  messages: Message[];
}
