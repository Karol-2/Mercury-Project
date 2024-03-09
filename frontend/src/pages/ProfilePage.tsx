import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useUser } from "../helpers/UserProvider";
import ProfilePageForm from "../components/ProfilePageForm";
import Transition from "../components/Transition";

function ProfilePage() {
  const navigate = useNavigate();
  const {
    user,
    userId,
    meeting,
    deleteUser,
  } = useUser();

  const [showAnimation, setShowAnim] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleEditClick = () => {
    navigate("/edit")
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

  return (
    <>
      <Navbar />
      {showAnimation && <Transition startAnimation={showAnimation} />}
      {user && showContent ? (
        <ProfilePageForm
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
