import React, { useRef } from "react";
import { MessageProps } from "./Message";
import User from "../models/User";

function ChatBox() {
  const enterPressed = useRef<boolean>(false);
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key != "Enter") return;
    if (e.shiftKey) return;
    e.preventDefault();

    if (!enterPressed.current) {
      enterPressed.current = true;
      const text = e.currentTarget.value.trim();
      if (!text) return;

      sendMessage({} as User, text);
      e.currentTarget.value = ""
    }
  }

  const handleKeyRelease = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key != "Enter") return;
    enterPressed.current = false;
    e.preventDefault();
  }

  const sendMessage = (author: User, content: string) => {
    const message: MessageProps = {type: "sent", author, content}
    console.log("SEND MESSAGE:", message)
  }

  const receiveMessage = (message: MessageProps) => {
    console.log("RECEIVE MESSAGE:", message)
  }

  return (
    <div className="w-96">
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
