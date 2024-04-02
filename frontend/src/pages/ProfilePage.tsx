import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useUser } from "../helpers/UserContext";
import Profile from "../components/Profile";
import Transition from "../components/Transition";
import { useMeeting } from "../helpers/MeetingProvider";
import { useProtected } from "../helpers/Protected";

function ProfilePage() {
  const navigate = useNavigate();
  const { deleteUser } = useUser();
  const { user } = useProtected();
  const { meeting } = useMeeting();

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
