import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUser } from "../helpers/UserProvider";
import RoomNotification from "../models/RoomNotification";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import dataService from "../services/data";
import { useNavigate } from "react-router-dom";
function NotificationsPage() {
    const {socket} = useUser();
    const navigate = useNavigate();
    const roomNotifications: RoomNotification[] = useSelector((state: RootState) => state.notifications);
    const peerConfig = useSelector((state: RootState) => state.peer);
    const {peerId} = peerConfig;
    const handleRoomInvite = async (roomId: string) => {
        await dataService.fetchData(`/room/${roomId}`, "DELETE", {});
        socket?.emit("joinRoom", {roomId, peerId});
        navigate(`/room/${roomId}`);
    } 
    
    return (
        <>
            <Navbar />
            <h1>List of notifications</h1>
            <ul>
                {roomNotifications.length > 0 ? roomNotifications.map(notification => <li key={notification.roomId}>
                    <strong>{notification.title}</strong>
                    <span> from: {notification.userName} </span>
                    <button onClick={() => handleRoomInvite(notification.roomId)}>click</button>
                </li>) : null}
            </ul>
            <Footer />
        </>
    )
}
export default NotificationsPage;