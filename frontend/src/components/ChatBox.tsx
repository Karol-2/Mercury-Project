import React, { useEffect, useRef, useState } from "react";
import Message, { MessageProps } from "./Message";
import User from "../models/User";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Socket } from "socket.io-client";
import dataService from "../services/data";
interface ChatBoxProps {
  user: User;
  friendId: string;
  friend_profile_picture: string;
}
function ChatBox({ user, friendId, friend_profile_picture }: ChatBoxProps) {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const enterPressed = useRef<boolean>(false);
  const socket: Socket = useSelector((state: RootState) => state.socket);
  socket.on("message", (message: MessageProps) => {
    setMessages([...messages, message]);
  });

  useEffect(() => {
    async function fetchMessages() {  
      const messageResponse = await dataService.fetchData(
        `/chat/${user.id}/${friendId}`, 
        "GET",
        {}
      );
      const messageArr = messageResponse.messages.map((message: MessageProps) => {
        return {
          ...message, 
          author_image: message.type === "sent" 
                        ? user.profile_picture 
                        : friend_profile_picture
        }
      })
      setMessages(messageArr);
    }
    fetchMessages();
  }, []);

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
    const message: MessageProps = {
      type: "sent",
      authorId: author.id,
      author_image: author.profile_picture,
      content,
      receiverId: friendId,
      created_date: new Date()
    };
    setMessages([...messages, message]);
    socket.emit("message", message);
  };

  return (
    <div className="flex flex-col justify-end w-full p-2 h-[90vh]">
      <div className="w-full px-5 flex flex-col justify-between overflow-y-scroll">
        {messages.map((e, i) => (
          <Message key={i} {...e} />
        ))}
      </div>
      <textarea
        className="w-3/6 text-3xl bg-my-dark form-input"
        rows={4}
        cols={30}
        onKeyDown={handleKeyPress}
        onKeyUp={handleKeyRelease}
        placeholder="Type message here ..."
      ></textarea>
    </div>
  );
}

export default ChatBox;
