import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FriendRequest from "../components/FriendRequest";
import { faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import dataService from "../services/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../components/Modal";
import User from "../models/User";
import { useUser } from "../helpers/UserProvider";
import { useNavigate } from "react-router-dom";

function FriendsPage() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [friendsRequests, setFriendsRequests] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState<User | null>(null);

  const { user } = useUser();

  useEffect(() => {
    if (user === null) navigate("/login");
  }, [user]);

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
      <div className="mx-50 my-20 lg:mx-56" id="wrapper">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
          <div id="friends" className=" bg-my-dark p-10 rounded-xl">
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
                        onClick={() => {
                          setShowDeleteModal(true);
                          setFriendToDelete(friend);
                        }}
                      >
                        <FontAwesomeIcon icon={faUserMinus} />
                      </button>
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
                  </div>
                </li>
              ))}
            </ul>
          </div>

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
  );
}

export default FriendsPage;
