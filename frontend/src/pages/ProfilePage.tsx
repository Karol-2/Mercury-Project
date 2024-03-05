import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import User from "../models/User";
import { useUser } from "../helpers/UserProvider";
import ProfilePageForm from "../components/ProfilePageForm";
import dataService from "../services/data";
import Transition from "../components/Transition";
import { useMeeting } from "../helpers/MeetingProvider";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, userState, updateUser, deleteUser } = useUser();
  const [formUser, setFormUser] = useState<Partial<User>>(user || {});
  const { meeting, createMeeting, joinMeeting } = useMeeting();

  const [isEditing, setIsEditing] = useState(false);
  const [friends, setFriends] = useState([]);

  const [showAnimation, setShowAnim] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    updateUser(formUser).then((updated) => {
      if (updated) console.log("Updated");
      else throw new Error("Error while updating user");
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormUser({ ...user, [name]: value } as User);
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
    if (userState.status == "anonymous") navigate("/login");

    const fetchFriends = async () => {
      const friendsResponse = await dataService.fetchData(
        `/users/${user!.id}/friends`,
        "GET",
      );
      setFriends(friendsResponse.friends);
    };

    fetchFriends();
  }, [userState]);

  return (
    <>
      <Navbar />
      {showAnimation && <Transition startAnimation={showAnimation} />}
      {user && friends && showContent ? (
        <ProfilePageForm
          user={formUser}
          friends={friends}
          isEditing={isEditing}
          handleEditClick={handleEditClick}
          handleSaveClick={handleSaveClick}
          handleChange={handleChange}
          createMeeting={createMeeting}
          joinMeeting={joinMeeting}
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
