import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMeeting } from "../helpers/MeetingProvider";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Footer from "../components/Footer";
import FriendRequest from "../components/FriendRequest";
import Navbar from "../components/Navbar";
import User from "../models/User";
import dataService from "../services/data";
import Transition from "../components/Transition";
import { useProtected } from "../helpers/Protected";
import FoundUser from "../components/FoundUser";
import Friend from "../components/Friend";
import PaginatorV2 from "../components/PaginatorV2";
import { useUser } from "../helpers/UserContext";

function FriendsPage() {
  const navigate = useNavigate();
  const { user } = useProtected();
  const { token } = useUser();
  const { meeting, createMeeting, joinMeeting } = useMeeting();

  const [friendsRequests, setFriendsRequests] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [showAnimation, setShowAnim] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowAnim(true);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  }, []);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (user) {
        // TODO: fix hardcoded max user count
        const friendsRequestsResponse = await dataService.fetchData(
          `/users/${user.id}/friend-requests?page=1&maxUsers=32`,
          "GET",
          {},
          token,
        );
        setFriendsRequests(friendsRequestsResponse.friendRequests);
      }
    };
    fetchFriendRequests();
  }, [refresh]);

  const handleAcceptRequest = async (currentId: string) => {
    if (user) {
      await dataService.fetchData(
        `/users/${user.id}/accept-friend-request/${currentId}`,
        "POST",
        {},
        token,
      );

      setRefresh(() => !refresh);
    }
  };

  const handleDeclineRequest = async (friend: User) => {
    if (user) {
      await dataService.fetchData(
        `/users/${user.id}/decline-friend-request/${friend.id}`,
        "POST",
        {},
        token,
      );

      setRefresh(() => !refresh);
    }
  };

  const handleDeleteFriend = async (friend: User) => {
    if (user) {
      await dataService.fetchData(
        `/users/${user.id}/delete-friend/${friend.id}`,
        "DELETE",
        {},
        token,
      );

      setRefresh(() => !refresh);
    }
  };

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
                  <span className="ml-2">Create a meeting</span>
                </button>
                <h1 className="text-3xl font-bold">Friends</h1>
                <hr className="text-my-orange"></hr>
                <ul className="">
                  {user && (
                    <PaginatorV2
                      endpoint={`/users/${user.id}/friends`}
                      token={token}
                      refresh={refresh}
                      isSearch={false}
                      itemsPerPage={5}
                      getItems={(response) => response.friends}
                      renderItem={(user) => (
                        <Friend
                          friend={user}
                          handleDeleteFriend={handleDeleteFriend}
                          joinMeeting={joinMeeting}
                        />
                      )}
                    />
                  )}
                </ul>
              </div>

              <div id="friend-requests">
                <div className="p-10 rounded-xl bg-my-dark">
                  <h1 className="text-3xl font-bold">Friend requests</h1>
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
                <h1 className="text-3xl font-bold">Friends Suggestions</h1>
                {user && (
                  <PaginatorV2
                    endpoint={`/users/${user.id}/friend-suggestions`}
                    token={token}
                    itemsPerPage={3}
                    refresh={refresh}
                    isSearch={false}
                    getItems={(response) => response.friendSuggestions}
                    renderItem={(resultUser) => (
                      <FoundUser
                        user={resultUser}
                        key={String(1)}
                        currentId={user.id}
                        isFriend={false}
                      />
                    )}
                  />
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
