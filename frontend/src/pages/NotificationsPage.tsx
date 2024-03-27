import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUser } from "../helpers/UserProvider";
import RoomNotification from "../models/RoomNotification";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import dataService from "../services/data";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import Notification from "../components/Notification";
import deleteNotification from "../redux/actions/deleteNotification";
function NotificationsPage() {
  const { socket, userId, user } = useUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roomNotifications: RoomNotification[] = useSelector(
    (state: RootState) => state.notifications,
  );
  const peer: Peer = useSelector((state: RootState) => state.peer);
  const handleRoomInvite = async (roomId: string) => {
    await dataService.fetchData(`/room/${roomId}`, "DELETE", {});
    const fullName = `${user?.first_name} ${user?.last_name}`;
    socket?.emit("joinRoom", { roomId, peerId: peer.id, userId, fullName });
    navigate(`/room/${roomId}`);
  };

  const declineInvite = (inviteId: string) => {
    dispatch(deleteNotification(inviteId));
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-y-3 p-3">
        {roomNotifications.length > 0
          ? roomNotifications.map((notification) => (
              <Notification
                key={notification.roomId}
                roomNotification={notification}
                handleRoomInvite={handleRoomInvite}
                declineInvite={declineInvite}
              />
            ))
          : null}
      </div>
      <Footer />
    </>
  );
}
export default NotificationsPage;
