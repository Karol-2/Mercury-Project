import React, { useEffect, useRef, useState } from "react";

import { Socket } from "socket.io-client";

import User from "../models/User";
import notificationSoundUrl from "../misc/notification.mp3";
import Message, { MessageProps } from "./Message";
import dataService from "../services/data";

const notificationSound = new Audio(notificationSoundUrl);

interface ChatBoxProps {
  user: User;
  socket: Socket;
  friendId: string;
  friend_profile_picture: string;
}

function ChatBox({
  user,
  socket,
  friendId,
  friend_profile_picture,
}: ChatBoxProps) {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const enterPressed = useRef<boolean>(false);
  const [notificationPlaying, setNotificationPlaying] =
    useState<boolean>(false);

  socket.on("message", (message: MessageProps) => {
    if (message.type != "sent") {
      setNotificationPlaying(true);
    }

    setMessages([...messages, message]);
  });

  useEffect(() => {
    if (notificationPlaying) {
      notificationSound.addEventListener("canplay", () =>
        notificationSound.play(),
      );
    }
  }, [notificationPlaying]);

  useEffect(() => {
    notificationSound.addEventListener("ended", () =>
      setNotificationPlaying(false),
    );
    return () => {
      notificationSound.removeEventListener("ended", () =>
        setNotificationPlaying(false),
      );
    };
  }, []);

  useEffect(() => {
    async function fetchMessages() {
      const messageResponse = await dataService.fetchData(
        `/chat/${user.id}/${friendId}`,
        "GET",
        {},
      );
      const messageArr = messageResponse.messages.map(
        (message: MessageProps) => {
          console.log(message);
          return {
            ...message,
            author_image:
              message.type === "sent"
                ? user.profile_picture
                : friend_profile_picture,
          };
        },
      );
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

      sendMessage(user.id, text);
      e.currentTarget.value = "";
    }
  };

  const handleKeyRelease = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key != "Enter") return;
    enterPressed.current = false;
    e.preventDefault();
  };

  const sendMessage = (toUserId: string, content: string) => {
    const message: MessageProps = {
      type: "sent",
      sentDate: new Date(),
      fromUserId: toUserId,
      toUserId: friendId,
      content,
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
