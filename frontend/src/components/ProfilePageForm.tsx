import React, { useState } from "react";
import User from "../models/User";
import Modal from "./Modal";

export interface ProfilePageFormProps {
  user: User;
  friends: User[];
  isEditing: boolean;
  handleEditClick: () => void;
  handleSaveClick: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  createMeeting: () => void;
  joinMeeting: (friendId: string) => void;
  deleteUser: () => void;
}

function ProfilePageForm(props: ProfilePageFormProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    user,
    isEditing,
    handleEditClick,
    handleSaveClick,
    handleChange,
    deleteUser,
  } = props;

  return (
    <section className="bg-my-darker min-h-screen flex justify-center ">
      <div className=" bg-my-dark p-10 px-20 rounded-xl mx-50 my-20 lg:mx-72 text-lg">
        <h1 className="text-3xl font-bold">Your profile</h1>
        <hr className="text-my-orange"></hr>
        <div>
          <img
            src={user.profile_picture}
            alt="Profile"
            className="my-5 w-96 h-96 object-cover"
          />
          <h1 className="text-2xl font-bold">Personal Data</h1>
          <hr className="text-my-orange mb-2"></hr>
          <p>
            First Name:{" "}
            {isEditing ? (
              <input
                type="text"
                name="first_name"
                value={user.first_name}
                onChange={handleChange}
                className=" text-my-dark "
              />
            ) : (
              user.first_name || ""
            )}
          </p>
          <p>
            Last Name:{" "}
            {isEditing ? (
              <input
                type="text"
                name="last_name"
                value={user.last_name}
                onChange={handleChange}
                className=" text-my-dark"
              />
            ) : (
              user.last_name || ""
            )}
          </p>
          <p>
            Country:{" "}
            {isEditing ? (
              <input
                type="text"
                name="country"
                value={user.country}
                onChange={handleChange}
                className=" text-my-dark"
              />
            ) : (
              user.country || ""
            )}
          </p>
          <p>
            E-mail:{" "}
            {isEditing ? (
              <input
                type="text"
                name="mail"
                value={user.mail}
                onChange={handleChange}
                className=" text-my-dark"
              />
            ) : (
              user.mail || ""
            )}
          </p>
        </div>
        <div className="my-5 grid grid-cols-1 md:grid-cols-2">
          {isEditing ? (
            <button onClick={handleSaveClick} className="btn primary w-full">
              Save
            </button>
          ) : (
            <button onClick={handleEditClick} className="btn primary w-full">
              Edit
            </button>
          )}
          <button
            data-testid="RemoveAccount"
            onClick={() => setShowDeleteModal(true)}
            className="btn secondary w-full"
          >
            Remove account
          </button>
          {showDeleteModal && (
            <Modal
              text={`Are you sure that you want to delete you account?`}
              handleYes={deleteUser}
              handleNo={() => setShowDeleteModal(false)}
            ></Modal>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfilePageForm;
