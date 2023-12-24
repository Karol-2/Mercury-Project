import React, { useEffect, useRef, useState } from "react";
import Message, { MessageProps } from "./Message";
import User from "../models/User";
import socketConnection from "../webSocket/socketConnection";
interface ChatBoxProps {
  user: User
}
function ChatBox({user}: ChatBoxProps) {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const enterPressed = useRef<boolean>(false);
  const socket = socketConnection();
  socket.on("message", (message: MessageProps) => {
    setMessages([...messages, message]);
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key != "Enter") return;
    if (e.shiftKey) return;
    e.preventDefault();

    if (!enterPressed.current) {
      enterPressed.current = true;
      const text = e.currentTarget.value.trim();
      if (!text) return;

      sendMessage(user, text);
      e.currentTarget.value = "";
    }
  };

  const handleKeyRelease = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key != "Enter") return;
    enterPressed.current = false;
    e.preventDefault();
  };

  const sendMessage = (author: User, content: string) => {
    console.log("SEND: ", author);
    const message: MessageProps = { type: "sent", author, content };
    setMessages([...messages, message]);
    socket.emit("message", message);
  };

  const receiveMessage = (message: MessageProps) => {
    console.log("RECEIVE MESSAGE:", message);
  };

  return (
    <div className="w-full p-2">
      <div className="w-full px-5 flex flex-col justify-between">
        {messages.map((e, i) => (
          <Message key={i} {...e} />
        ))}
      </div>
      <textarea
        className="text-my-dark form-input"
        rows={4}
        cols={30}
        onKeyDown={handleKeyPress}
        onKeyUp={handleKeyRelease}
      ></textarea>
    </div>
  );
}

export default ChatBox;
