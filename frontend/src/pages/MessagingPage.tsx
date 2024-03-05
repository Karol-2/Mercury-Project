import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox";
import { useUser } from "../helpers/UserProvider";

function MessagingPage() {
  const navigate = useNavigate();
  const navigating = useRef<boolean>(false);
  const { friendId } = useParams();
  const { user, userState, socket } = useUser();

  useEffect(() => {
    if (navigating.current) return;
    if (userState.status == "loading") return;

    if (userState.status == "anonymous") {
      navigating.current = true;
      navigate("/login");
    } else if (friendId === null) {
      navigating.current = true;
      navigate("/friends");
    }
  }, [user, friendId]);

  const showChatBox = user && socket && friendId;

  return (
    <>
      <Navbar />
      {showChatBox ? (
        <ChatBox user={user} socket={socket} friendId={friendId} />
      ) : null}
      <Footer />
    </>
  );
}

export default MessagingPage;
