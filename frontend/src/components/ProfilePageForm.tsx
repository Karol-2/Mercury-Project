import React, { useState } from "react";
import User from "../models/User";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    user,
    friends,
    isEditing,
    handleEditClick,
    handleSaveClick,
    handleChange,
    createMeeting,
    joinMeeting,
    deleteUser,
  } = props;

  return (
    <section className="bg-my-darker min-h-screen flex justify-center ">
      <div className=" bg-my-dark p-10 px-20 rounded-xl mx-50 my-20 lg:mx-72 text-lg">
        <h1 className="text-3xl font-bold">Your profile</h1>
        <hr className="text-my-orange"></hr>
        <div>
          <img src={user.profile_picture} alt="Profile" className="my-5" />
          <p>{user.id}</p>
          <p>
            First Name:{" "}
            {isEditing ? (
              <input
                type="text"
                name="first_name"
                value={user.first_name}
                onChange={handleChange}
                className=" text-my-dark"
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
          <p>
            Password:{" "}
            {isEditing ? (
              <input
                type="text"
                name="password"
                value={user.password}
                onChange={handleChange}
                className=" text-my-dark"
              />
            ) : (
              user.password || ""
            )}
          </p>
        </div>
        <div className="my-5">
          {isEditing ? (
            <button onClick={handleSaveClick} className="btn primary">
              Save
            </button>
          ) : (
            <button onClick={handleEditClick} className="btn primary">
              Edit
            </button>
          )}
          <button onClick={deleteUser} className="btn secondary">
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
        <div className="my-5">
          <h2 className="text-4xl font-extrabold dark:text-white">Friends</h2>
          <ul className="list-disc">
            {friends.map((friend) => (
              <li className="my-1" key={friend.id}>
                {`${friend.first_name} ${friend.last_name}`}
                <button
                  className="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                  onClick={() => joinMeeting(friend.id)}
                >
                  Meeting
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="my-5">
          {isEditing ? (
            <button onClick={handleSaveClick} className="btn primary">
              Save
            </button>
          ) : (
            <button onClick={handleEditClick} className="btn primary">
              Edit
            </button>
          )}
          <button onClick={createMeeting} className="btn secondary">
            Create a meeting
          </button>
          <button onClick={deleteUser} className="btn secondary">
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
