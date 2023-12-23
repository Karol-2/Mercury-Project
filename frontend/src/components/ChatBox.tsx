import React, { useEffect, useRef, useState } from "react";
import Message, { MessageProps } from "./Message";
import User from "../models/User";
import socketConnection from "../webSocket/socketConnection";

function ChatBox() {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const enterPressed = useRef<boolean>(false);
  const socket = socketConnection();

  useEffect(() => {
    socket.on("message", (message: MessageProps) => {
      console.log("received msg: ", message);
      setMessages([...messages, message]);
    });
  }, []);
  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key != "Enter") return;
    if (e.shiftKey) return;
    e.preventDefault();

    if (!enterPressed.current) {
      enterPressed.current = true;
      const text = e.currentTarget.value.trim();
      if (!text) return;

      sendMessage({} as User, text);
      e.currentTarget.value = "";
    }
  };

  const handleKeyRelease = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key != "Enter") return;
    enterPressed.current = false;
    e.preventDefault();
  };

  const sendMessage = (author: User, content: string) => {
    const message: MessageProps = { type: "sent", author, content };
    setMessages([...messages, message]);
    socket.emit("message", message);
  };

  const receiveMessage = (message: MessageProps) => {
    console.log("RECEIVE MESSAGE:", message);
  };

  return (
    <div className="w-96">
      <div className="flex flex-col">
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
