import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useUser } from "../helpers/UserProvider";
import Profile from "../components/Profile";
import Transition from "../components/Transition";

function ProfilePage() {
  const navigate = useNavigate();
  const { addNotification, user, userId, meeting, deleteUser, socket } = useUser();

  const [showAnimation, setShowAnim] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleEditClick = () => {
    navigate("/edit");
  };

  useEffect(() => {
    setShowAnim(true);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  }, []);

  useEffect(() => {
    if (meeting?.id) {
      navigate("/meeting");
    }
  }, [meeting]);

  useEffect(() => {
    if (userId === null) navigate("/login");
  }, [userId]);

  useEffect(() => {
    if (socket !== null) {
      socket.on("newRoom", (notification) => {
        addNotification(notification);
      });
    }
  }, [socket]);

  return (
    <>
      <Navbar />
      {showAnimation && <Transition startAnimation={showAnimation} />}
      {user && showContent ? (
        <Profile
          user={user}
          handleEditClick={handleEditClick}
          deleteUser={deleteUser}
        />
      ) : (
        <div className="text-lg">Loading...</div>
      )}
      {showContent && <Footer />}
    </>
  );
}

export default ProfilePage;
