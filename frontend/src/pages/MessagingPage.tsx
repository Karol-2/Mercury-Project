import { useEffect, useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox";
import { useUser } from "../helpers/UserProvider";
import PageNotFound from "./PageNotFound";

import { RootState } from "../redux/store";
import User from "../models/User";

function MessagingPage() {
  const navigate = useNavigate();
  const friends = useSelector((state: RootState) => state.friends);
  const { friendId } = useParams();
  const friend = friends.find((f: User) => f.id === friendId);
  const { user, socket } = useUser();

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user]);

  const showChatBox = user && socket && friendId;

  return (
    <>
      <Navbar />
      {showChatBox ? (
        <ChatBox
          user={user}
          socket={socket}
          friendId={friendId}
          friend_profile_picture={friend.profile_picture}
        />
      ) : null}
      <Footer />
    </>
  );
}

export default MessagingPage;
