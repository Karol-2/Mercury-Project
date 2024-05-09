import React, { useEffect, useMemo, useRef, useState } from "react";

import { Socket } from "socket.io-client";

import User from "../models/User";
import Notification from "../models/Notification";
import notificationSoundUrl from "../misc/notification.mp3";
import Message, { MessageProps } from "./Message";
import dataService from "../services/data";

const notificationSound = new Audio(notificationSoundUrl);

interface ChatBoxProps {
  user: User;
  socket: Socket;
  friendId: string;
}

function ChatBox({ user, socket, friendId }: ChatBoxProps) {
  const messages = useRef<MessageProps[]>([]);

  const handleScroll = (ref: HTMLDivElement | null) => {
    if (ref && ref.parentElement) {
      ref.parentElement.scrollTop = ref.offsetTop;
    }
  };

  const [refreshMessages, setRefreshMessages] = useState<number>(0);
  const messageElems = useMemo(
    () =>
      messages.current.map((e, i) => {
        let msgRefFunc = (_ref: HTMLDivElement | null) => {};
        if (i == messages.current.length - 1) {
          msgRefFunc = handleScroll;
        }
        return <Message key={i} {...e} msgRef={msgRefFunc} />;
      }),
    [refreshMessages],
  );

  const [profilePictures, setProfilePictures] = useState<
    Record<string, string>
  >({});

  const enterPressed = useRef<boolean>(false);
  const [notificationPlaying, setNotificationPlaying] =
    useState<boolean>(false);

  const addMessages = async (addedMessages: MessageProps[]) => {
    const newMessages: MessageProps[] = [];
    for (const message of addedMessages) {
      const profilePicture = await getProfilePicture(message.fromUserId);
      newMessages.push({ ...message, fromUserProfilePicture: profilePicture });
    }

    const allNewMessages = [...messages.current, ...newMessages];
    messages.current = allNewMessages;
  };

  const getProfilePicture = async (userId: string) => {
    const profilePicture = profilePictures[userId];
    if (profilePicture) return profilePicture;

    const userResponse = await dataService.fetchData(
      `/users/${userId}`,
      "GET",
      {},
    );
    const fetchProfilePicture = userResponse.user.profile_picture;

    setProfilePictures({ ...profilePictures, [userId]: fetchProfilePicture });
    return fetchProfilePicture;
  };

  const messageListener = async (message: MessageProps) => {
    if (message.type != "sent") {
      setNotificationPlaying(true);
    }
    await addMessages([message]);
    setRefreshMessages(refreshMessages + 1);
  };

  useEffect(() => {
    socket.on("message", messageListener);
    return () => {
      socket.off("message", messageListener);
    };
  }, []);

  useEffect(() => {
    if (refreshMessages != 0) {
      setRefreshMessages(0);
    }
  }, [refreshMessages]);

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

      await addMessages(messageResponse.messages);
      setRefreshMessages(refreshMessages + 1);
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
      const notification: Notification = {
        type: "message",
        senderId: user.id,
        receiverId: friendId,
        senderFullName: `${user.first_name} ${user.last_name}`,
      };
      socket.emit("notify", notification);
      sendMessage(user.id, text);
      e.currentTarget.value = "";
    }
  };

  const handleKeyRelease = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key != "Enter") return;
    enterPressed.current = false;
    e.preventDefault();
  };

  const sendMessage = async (toUserId: string, content: string) => {
    const message: MessageProps = {
      type: "sent",
      sentDate: new Date(),
      fromUserId: toUserId,
      toUserId: friendId,
      content,
    };

    await addMessages([message]);
    setRefreshMessages(refreshMessages + 1);
    socket.emit("message", message);
  };

  return (
    <div className="flex flex-col justify-end w-full p-10 h-[90vh]">
      <div className="w-full px-5 flex flex-col justify-between overflow-y-scroll">
        {messageElems}
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
