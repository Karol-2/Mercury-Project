import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import dataService from "../services/data";
import { useUser } from "../helpers/UserProvider";
import RoomNotification from "../models/RoomNotification";
function NotificationsPage() {
    const {userId} = useUser();
    const [roomNotifications, setRoomNotifications] = useState<RoomNotification[]>([]);
    useEffect(() => {
        async function fetchRoomNoticifactions() {
            const roomNotificationsRequest = await dataService.fetchData(`/room/${userId}`, "GET", {});
            const roomNotifications = roomNotificationsRequest.rooms;
            setRoomNotifications(roomNotifications);
        }
        fetchRoomNoticifactions();
    }, []);
    return (
        <>
            <Navbar />
            <h1>List of notifications</h1>
            <ul>
                {roomNotifications.length > 0 ? roomNotifications.map(notification => <li key={notification.roomId}>
                    <strong>{notification.title}</strong>
                    <span> from: {notification.userName} </span>
                    <button>click</button>
                </li>) : null}
            </ul>
            <Footer />
        </>
    )
}
export default NotificationsPage;