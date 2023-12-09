import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FriendRequest from "../components/FriendRequest";
import { faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import dataService from "../services/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Modal from "../components/Modal";
import User from "../models/User";
import { useUser } from "../helpers/UserProvider";

function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [friendsRequests, setFriendsRequests] = useState([]);
  const [refresh, setRefresh] = useState(false);
  // const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (user) {
        const friendsRequestsResponse = await dataService.fetchData(
          `/users/${user.id}/friend-requests`,
          "GET",
          {},
        );
        setFriendsRequests(friendsRequestsResponse.friends);
      }
    };
    fetchFriendRequests();
  }, [refresh]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (user) {
        const friendsResponse = await dataService.fetchData(
          `/users/${user.id}/friends`,
          "GET",
          {},
        );
        setFriends(friendsResponse.friends);
      }
    };
    fetchFriends();
  }, [refresh]);

  const handleDeclineRequest = async (friend: User) => {
    if (user) {
      await dataService.fetchData(
        `/users/${user.id}/remove/${friend.id}`,
        "DELETE",
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setRefresh(() => !refresh);
    }
  };

  const handleAcceptRequest = async (currentId: string) => {
    if (user) {
      await dataService.fetchData(
        `/users/${user.id}/accept/${currentId}`,
        "POST",
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setRefresh(() => !refresh);
    }
  };
  return (
    <>
      <Navbar />
      <section>
        <div>
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
          <h1 className="text-3xl font-bold mt-5">Friend requests:</h1>
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
      </section>
      <Footer />
    </>
  );
}

export default FriendsPage;
