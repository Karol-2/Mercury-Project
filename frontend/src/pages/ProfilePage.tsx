import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useUser } from "../helpers/UserProvider";
import Profile from "../components/Profile";
import Transition from "../components/Transition";
import dataService from "../services/data";
import { useDispatch } from "react-redux";
import setNotifications from "../redux/actions/setNotifications";
import setUserFriends from "../redux/actions/setUserFriends";
import addNotification from "../redux/actions/addNotification";
import initPeer from "../redux/actions/initPeer";

function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userId, meeting, deleteUser, socket } = useUser();

  const [showAnimation, setShowAnim] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleEditClick = () => {
    navigate("/edit");
  };
  const fetchNotifications = async () => {
    const roomNotificationsRequest = await dataService.fetchData(
      `/room/${userId}`,
      "GET",
      {},
    );
    dispatch(setNotifications(roomNotificationsRequest.rooms));
  };

  useEffect(() => {
    setShowAnim(true);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      if (user) {
        const friendsResponse = await dataService.fetchData(
          `/users/${user.id}/friends`,
          "GET",
          {},
        );
        dispatch(setUserFriends(friendsResponse.friends));
      }
    };
    fetchFriends();
  }, []);

  useEffect(() => {
    if (meeting?.id) {
      navigate("/meeting");
    }
  }, [meeting]);

  useEffect(() => {
    if (userId === null) navigate("/login");
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    dispatch(initPeer(userId!));
  }, []);

  useEffect(() => {
    socket!.on("newRoom", (notification) => {
      dispatch(addNotification(notification));
    });
  }, []);

  return (
    <>
      <Navbar />
      {showAnimation && <Transition startAnimation={showAnimation} />}
      {user && showContent ? (
        <Profile
          user={user}
          handleEditClick={handleEditClick}
          deleteUser={deleteUser}
        />
      ) : (
        <div className="text-lg">Loading...</div>
      )}
      {showContent && <Footer />}
    </>
  );
}

export default ProfilePage;
