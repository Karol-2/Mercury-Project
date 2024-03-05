import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useUser } from "../helpers/UserProvider";
import { useMeeting } from "../helpers/MeetingProvider";

import { faUserMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Footer from "../components/Footer";
import FriendRequest from "../components/FriendRequest";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import User from "../models/User";
import setUserFriends from "../redux/actions/setUserFriends";
import dataService from "../services/data";
import Transition from "../components/Transition";
import { useProtected } from "../helpers/Protected";

function FriendsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userState } = useUser();
  const { user } = useProtected();
  const { meeting, createMeeting, joinMeeting} = useMeeting();

  const [friends, setFriends] = useState([]);
  const [friendsRequests, setFriendsRequests] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState<User | null>(null);

  const [showAnimation, setShowAnim] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (userState.status == "anonymous") navigate("/login");
  }, [user]);

  useEffect(() => {
    setShowAnim(true);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
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

  useEffect(() => {
    const fetchFriends = async () => {
      if (user) {
        const friendsResponse = await dataService.fetchData(
          `/users/${user.id}/friends`,
          "GET",
          {},
        );
        setFriends(friendsResponse.friends);
        dispatch(setUserFriends(friendsResponse.friends));
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
                <h1 className="text-3xl font-bold">Friends:</h1>
                <hr className="text-my-orange"></hr>
                <ul className="">
                  {friends.map((friend: User) => (
                    <li key={friend.id} className="flex flex-row mt-5">
                      <img
                        src={friend.profile_picture}
                        className="rounded-full w-28 h-28 border-my-orange border-2 object-cover"
                      />
                      <div className=" ml-5 flex flex-col justify-evenly">
                        <p className="font-semibold text-2xl">
                          <span className="">
                            {" "}
                            {friend.first_name} {friend.last_name}{" "}
                          </span>
                          <button
                            className={` text-my-red text-sm my-2 p-2 rounded-md transition hover:scale-110 hover:bg-my-red hover:text-my-light active:translate-x-2`}
                            onClick={() => {
                              setShowDeleteModal(true);
                              setFriendToDelete(friend);
                            }}
                          >
                            <FontAwesomeIcon icon={faUserMinus} />
                          </button>
                        </p>
                        <div className="flex flex-col xl:flex-row">
                          <button
                            className={`btn small bg-my-orange text-xs my-2`}
                            onClick={() => joinMeeting(friend.id)}
                          >
                            <FontAwesomeIcon icon={faVideo} />
                          </button>
                          <button
                            className={`btn small bg-my-purple text-xs my-2`}
                            onClick={() => navigate(`/messages/${friend.id}`)}
                          >
                            <FontAwesomeIcon icon={faCommentAlt} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {showDeleteModal && friendToDelete && (
                <Modal
                  text={`Are you sure that you want remove ${friendToDelete.first_name} ${friendToDelete.last_name} from your friends ?`}
                  handleYes={() => {
                    handleDeclineRequest(friendToDelete);
                    setFriendToDelete(null);
                  }}
                  handleNo={() => setShowDeleteModal(false)}
                ></Modal>
              )}

              <div id="friend-requests" className="">
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
