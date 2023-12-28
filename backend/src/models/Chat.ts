import Message from "./Message";

export default interface Chat {
  userIds: string[],
  messages: Message[]
}
