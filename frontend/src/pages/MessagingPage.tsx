import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox";
import { useUser } from "../helpers/UserProvider";
import { useParams } from "react-router-dom";
import PageNotFound from "./PageNotFound";
function MessagingPage() {
  const {friendId} = useParams();
  const {user, userId} = useUser();
  if (!user || !friendId) {
    return <PageNotFound />
  }
  return (
    <>
      <Navbar />
      <ChatBox user={user} friendId={friendId} />
      <Footer />
    </>
  );
}

export default MessagingPage;
