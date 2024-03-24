import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUser } from "../helpers/UserProvider";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Footer from "../components/Footer";
import FriendRequest from "../components/FriendRequest";
import Navbar from "../components/Navbar";
import User from "../models/User";
import dataService from "../services/data";
import Transition from "../components/Transition";
import FoundUser from "../components/FoundUser";
import Friend from "../components/Friend";
import Paginator from "../components/Paginator";
import { RootState } from "../redux/store";
import { v4 } from "uuid";

function FriendsPage() {
  const navigate = useNavigate();
  
  const { user, meeting, createMeeting, joinMeeting } = useUser();

  const friends = useSelector((state: RootState) => state.friends);
  const [friendsRequests, setFriendsRequests] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [friendSuggestions, setFriendSuggestions] = useState([]);

  const [showAnimation, setShowAnim] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (user === null) navigate("/login");
  }, [user]);

  useEffect(() => {
    setShowAnim(true);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  }, []);

  useEffect(() => {
    const fetchFriendSuggestions = async () => {
      if (user) {
        const friendsRequestsResponse = await dataService.fetchData(
          `/users/${user.id}/friend-suggestions`,
          "GET",
          {},
        );
        setFriendSuggestions(friendsRequestsResponse.users);
      }
    };
    fetchFriendSuggestions();
  }, []);

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

  const createRoom = () => {
    const roomId = v4();
    navigate(`/room/${roomId}`);
  }

  useEffect(() => {
    if (meeting?.id) {
      navigate("/meeting");
    }
  }, [meeting]);

  return (
    <>
      <Navbar />
      {showAnimation && <Transition startAnimation={showAnimation} />}
      {showContent ? (
        <>
          <div className="mx-50 my-20 lg:mx-56" id="wrapper">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
              <div id="friends" className=" bg-my-dark p-10 rounded-xl">
                <button
                  onClick={createMeeting}
                  className="btn primary w-full mb-4"
                >
                  <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                  <span className="ml-2">Create a room</span>
                </button>
                <button onClick={() => createRoom()}>Test room</button>
                <h1 className="text-3xl font-bold">Friends:</h1>
                <hr className="text-my-orange"></hr>
                <ul className="">
                  {friends && friends.length > 0 ? (
                    <Paginator
                      users={friends}
                      itemsPerPage={5}
                      renderItem={(user) => (
                        <Friend
                          friend={user}
                          handleDeclineRequest={handleDeclineRequest}
                          joinMeeting={joinMeeting}
                        />
                      )}
                    />
                  ) : (
                    <p>You don't have any friends.</p>
                  )}
                </ul>
              </div>

              <div id="friend-requests">
                <div className="p-10 rounded-xl bg-my-dark">
                  <h1 className="text-3xl font-bold">Friend requests:</h1>
                  <hr className="text-my-orange"></hr>
                </div>
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
            <section id="suggestions" className=" mt-8">
              <div>
                <h1 className="text-3xl font-bold">Friends Suggestions:</h1>
                {user && friendSuggestions && friendSuggestions.length > 0 ? (
                  <Paginator
                    users={friendSuggestions}
                    itemsPerPage={3}
                    renderItem={(user) => (
                      <FoundUser
                        user={user}
                        key={String(1)}
                        currentId={user.id}
                        isFriend={false}
                      />
                    )}
                  />
                ) : (
                  "You need to add more friends to show valid suggestions."
                )}
              </div>
            </section>
          </div>
          <Footer />
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default FriendsPage;
