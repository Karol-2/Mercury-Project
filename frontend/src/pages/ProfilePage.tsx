import React, { useState, useLayoutEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import User from "../models/user.model";
import { fetchData } from "../services/fetchData";
import { useUser } from "../helpers/UserProvider";
import ProfilePageForm from "../components/ProfilePageForm";

function ProfilePage() {
  const { user, setUser, updateUser, deleteUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <>
      <Navbar />
      {user ? (
        <ProfilePageForm
          user={user}
          isEditing={isEditing}
          handleEditClick={handleEditClick}
          handleSaveClick={handleSaveClick}
          handleChange={handleChange}
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
