import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { useUser } from "../helpers/UserProvider";
import RoomNotification from "../models/RoomNotification";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import addNotification from "../redux/actions/addNotification";
import dataService from "../services/data";
function NotificationsPage() {
    const {socket} = useUser();
    const dispatch = useDispatch();
    const roomNotifications: RoomNotification[] = useSelector((state: RootState) => state.notifications);
    const handleRoomInvite = async (roomId: string) => {
        const res = await dataService.fetchData(`/room/${roomId}`, "DELETE", {});
        console.log(res);
    } 
    useEffect(() => {
        socket?.on("newRoom", (notification: RoomNotification) => {
            dispatch(addNotification(notification));
        });
    }, []);
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