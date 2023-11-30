import React from "react";
import User from "../models/User";
import { useNavigate } from "react-router-dom";

export interface ProfilePageFormProps {
  user: User;
  friends: User[];
  isEditing: boolean;
  launchMeeting: (ownerId: string, guestId: string) => void;
  handleEditClick: () => void;
  handleSaveClick: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteUser: () => void;
  viewMeetingDashboard: () => void;
}

function ProfilePageForm(props: ProfilePageFormProps) {
  const navigate = useNavigate();
  const {
    user,
    isEditing,
    friends,
    handleEditClick,
    handleSaveClick,
    handleChange,
    deleteUser,
    launchMeeting,
    viewMeetingDashboard
  } = props;
  return (
    <section className="bg-my-darker min-h-screen flex justify-center ">
      <div className=" bg-my-dark p-10 px-20 rounded-xl mx-50 my-20 lg:mx-72 text-lg">
        <h1 className="text-3xl font-bold">Your profile</h1>
        <hr className="text-my-orange"></hr>
        <div>
          <img src={user.profile_picture} alt="Profile" className="my-5" />
          <p>
            First Name:{" "}
            {isEditing ? (
              <input
                type="text"
                name="first_name"
                value={user.first_name}
                onChange={handleChange}
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
              />
            ) : (
              user.password || ""
            )}
          </p>
          <ul>
            Friends:{" "}
            {friends.map((f) => (
              <li key={f.id}>
                <h3>
                  {f.first_name} {f.last_name}
                </h3>
                <button onClick={() => launchMeeting(String(user.id), String(f.id))}>
                  launch meeting
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
          <button onClick={deleteUser} className="btn secondary">
            Remove account
          </button>
          <button onClick={() => viewMeetingDashboard()} className="btn secondary">
            View meeting dashboard
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProfilePageForm;
