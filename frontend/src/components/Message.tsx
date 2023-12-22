import User from "../models/User";

export interface MessageProps {
  type: "sent" | "received" | "info";
  author: User;
  content: string;
}

function Message(props: MessageProps) {
  const { type, author, content } = props;

  let align = "";

  if (type == "sent") {
    align = "text-right";
  } else if (type == "received") {
    align = "text-left";
  }

  return (
    <div className={`bg-my-light text-my-dark h-20 my-2 ${align}`}>
      {content}
    </div>
  );
}

export default Message;
