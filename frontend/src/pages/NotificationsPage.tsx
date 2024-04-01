import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUser } from "../helpers/UserProvider";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import dataService from "../services/data";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import Notification from "../components/Notification";
import { useEffect } from "react";
function NotificationsPage() {
  const { deleteNotification, notifications, socket, userId, user } = useUser();
  const navigate = useNavigate();
  const peer: Peer = useSelector((state: RootState) => state.peer);
  const handleRoomInvite = async (roomId: string) => {
    console.log("[HANDLE ROOM INVITE]: starts");
    await dataService.fetchData(`/room/${roomId}`, "DELETE", {});
    console.log("[HANDLE ROOM INVITE]: delete invite from DB");
    const fullName = `${user?.first_name} ${user?.last_name}`;
    console.log("[HANDLE ROOM INVITE]: create full name: ", fullName);
    console.log("[PEER]: ", peer);
    socket?.emit("joinRoom", { roomId, peerId: peer.id, userId, fullName });
    console.log("[HANDLE ROOM INVITE]: emitted joinRoom");
    navigate(`/room/${roomId}`);
  };

  const declineInvite = (inviteId: string) => {
    deleteNotification(inviteId);
  };

  useEffect(() => {
    console.log("[NOTIFICATIONS]: ", notifications);
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-y-3 p-3">
        {notifications.length > 0
          ? notifications.map((notification) => (
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
