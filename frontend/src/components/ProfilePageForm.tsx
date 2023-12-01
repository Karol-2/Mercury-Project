import React, { useEffect, useState } from "react";
import User from "../models/User";
import FriendRequest from "./FriendRequest";
import dataService from "../services/data";
import { faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "./Modal";

export interface ProfilePageFormProps {
  user: User;
  isEditing: boolean;
  handleEditClick: () => void;
  handleSaveClick: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteUser: () => void;
}

function ProfilePageForm(props: ProfilePageFormProps) {

  const [friends, setFriends] = useState([]);
  const [friendsRequests,setFriendsRequests] = useState([]);
  const [refresh,setRefresh] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  

  
  const {
    user,
    isEditing,
    handleEditClick,
    handleSaveClick,
    handleChange,
    deleteUser,
  } = props;

  useEffect(() => {
    const fetchFriendRequests = async () => {
      const friendsRequestsResponse = await dataService.fetchData(
        `/users/${user!.id}/friend-requests`,
        "GET",
        {},
      );
      setFriendsRequests(friendsRequestsResponse.friends);
    };
    fetchFriendRequests();
  }, [refresh]);

  useEffect(() => {
    const fetchFriends = async () => {
      const friendsResponse = await dataService.fetchData(
        `/users/${user.id}/friends`,
        "GET",
        {},
      );
      setFriends(friendsResponse.friends);
    };
    fetchFriends();
  }, [refresh]);



  const handleDeclineRequest = async (friend: User,) => {
    
    await dataService
      .fetchData(`/users/${user.id}/remove/${friend.id}`, "DELETE", {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
    setRefresh(() => !refresh);
    
  };

  const handleAcceptRequest = async (currentId: string) => {

    await dataService.fetchData(
      `/users/${user.id}/add/${currentId}`,
      "POST",
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    setRefresh(() => !refresh);
  };


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
            <button onClick={()=>setShowDeleteModal(true)} className="btn secondary">
              Remove account
            </button>
             {/* modals section */}
             {showDeleteModal &&(
                        <Modal text={`Are you sure that you want to delete you account?`}
                        handleYes={deleteUser} handleNo={()=>setShowDeleteModal(false)}></Modal>
                      )}
          </div>
          <h1 className="text-3xl font-bold">Friends:</h1>
          <hr className="text-my-orange"></hr>
          <ul>
            {friends.map((friend: User) => (
              <li key={friend.id} className="flex flex-row mt-5">
                <img
                  src={friend.profile_picture}
                  className="rounded-full w-20 h-20 border-my-orange border-2 object-cover"
                />
                <div className=" ml-5 flex flex-col justify-evenly">
                  <p className="font-semibold text-2xl">
                    {friend.first_name} {friend.last_name}
                  </p>
                  <div className="flex flex-row">
                    <button
                      className={`btn small bg-my-purple text-xs`}
                      onClick={() => console.log("meeting")}
                    >
                      <FontAwesomeIcon icon={faVideo} />
                    </button>
                    <button
                      className={`btn small bg-my-red text-xs`}
                      onClick={() => handleDeclineRequest(friend)}
                    >
                      <FontAwesomeIcon icon={faUserMinus} />
                    </button>
                 
                  </div>
                </div>
              </li>
            ))}
            
          </ul>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Friend requests:</h1>
          <hr className="text-my-orange"></hr>
          <div>
            {friendsRequests && friendsRequests.length > 0 ? (
              friendsRequests.map((friend, index) => (
                <FriendRequest
                  user={friend}
                  key={String(index)}
                  handleAcceptRequest={handleAcceptRequest}
                  handleDeclineRequest={handleDeclineRequest}
                />
              ))
            ) : (
              <p className="h1 text-lg">
                There are currently no friend requests.
              </p>
            )}
          </div>
        </div>
      </div>
      
      
    </section>
  );
}

export default ProfilePageForm;
