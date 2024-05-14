import { useState } from "react";
import User from "../models/User";
import Modal from "./Modal";
import countriesData from "../assets/countries.json";

export interface ProfilePageFormProps {
  user: User;
  handleEditClick: () => void;
  deleteUser: () => void;
}

function Profile(props: ProfilePageFormProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { user, handleEditClick, deleteUser } = props;

  const countryName = countriesData.find((v) => v.Code == user.country)
    ?.Country;

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
            Name: {user.first_name} {user.last_name}
          </p>
          <p>Country: {countryName || ""}</p>
          <p>E-mail: {user.mail}</p>
        </div>
        <div className="my-5 grid grid-cols-1 md:grid-cols-2">
          <button
            data-testid="Edit"
            onClick={handleEditClick}
            className="btn primary w-full"
          >
            Edit
          </button>

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

export default Profile;
