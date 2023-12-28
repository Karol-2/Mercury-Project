import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox";
import { useUser } from "../helpers/UserProvider";
import { useParams } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import User from "../models/User";
function MessagingPage() {
  const friends = useSelector((state: RootState) => state.friends);
  const { friendId } = useParams();
  const friend = friends.find((f:User) => f.id === friendId);
  const { user } = useUser();
  if (!user || !friendId) {
    return <PageNotFound />;
  }
  return (
    <>
      <Navbar />
      <ChatBox 
        user={user} 
        friendId={friendId} 
        friend_profile_picture={friend.profile_picture} 
      />
      <Footer />
    </>
  );
}

export default MessagingPage;
