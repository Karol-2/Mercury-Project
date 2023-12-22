import User from "../models/User";

export interface MessageProps {
  type: "sent" | "received" | "info",
  author: User,
  content: string
}

function Message(props: MessageProps) {
  const {type, author, content} = props

  return <div>{content}</div>
}

export default Message;
