export interface MessageProps {
  type: "sent" | "received" | "info";
  sentDate: Date;
  fromUserId: string;
  fromUserProfilePicture?: string;
  msgRef?: (ref: HTMLDivElement) => void;
  toUserId: string;
  content: string;
}

function Message(props: MessageProps) {
  const { type, fromUserProfilePicture, msgRef, content } = props;

  let align = "";
  let flexDirection = "";
  let rounded = "";
  let bgColor = "";

  if (type == "sent") {
    align = "self-end";
    flexDirection = "flex-row";
    rounded = "rounded-bl-3xl rounded-tl-3xl rounded-tr-xl";
    bgColor = "bg-my-dark";
  } else if (type == "received") {
    align = "self-start";
    flexDirection = "flex-row-reverse";
    rounded = "rounded-br-3xl rounded-tr-3xl rounded-tl-xl";
    bgColor = "bg-my-orange";
  }

  return (
    <div
      className={`${align} flex ${flexDirection} justify-center gap-5 mb-4`}
      ref={msgRef}
    >
      <div
        className={`mr-2 py-3 px-4 ${bgColor} ${rounded} text-white text-2xl`}
      >
        {content}
      </div>
      <img
        src={fromUserProfilePicture || ""}
        className="object-cover h-12 w-12 rounded-full"
        alt=""
      />
    </div>
  );
}

export default Message;
