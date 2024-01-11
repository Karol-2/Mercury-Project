import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import User from "../models/User";
import { useUser } from "../helpers/UserProvider";
import ProfilePageForm from "../components/ProfilePageForm";
import dataService from "../services/data";

function ProfilePage() {
  const navigate = useNavigate();
  const {
    user,
    userId,
    setUser,
    meetingId,
    updateUser,
    deleteUser,
    createMeeting,
    joinMeeting,
  } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [friends, setFriends] = useState([]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    updateUser().then((updated) => {
      if (updated) console.log("Updated");
      else throw new Error("Error while updating user");
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value } as User);
  };

  useEffect(() => {
    if (meetingId) {
      navigate("/meeting");
    }
  }, [meetingId]);

  useEffect(() => {
    if (userId === null) navigate("/login");

    const fetchFriends = async () => {
      const friendsResponse = await dataService.fetchData(
        `/users/${userId}/friends`,
        "GET",
      );
      setFriends(friendsResponse.friends);
    };

    fetchFriends();
  }, [userId]);

  return (
    <>
      <Navbar />
      {user && friends ? (
        <ProfilePageForm
          user={user}
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
      <Footer />
    </>
  );
}

export default ProfilePage;
