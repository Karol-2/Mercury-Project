import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import dataService from "../services/data";
import { useUser } from "../helpers/UserProvider";
import RoomNotification from "../models/RoomNotification";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import addNotification from "../redux/actions/addNotification";
function NotificationsPage() {
    const {userId, socket} = useUser();
    const dispatch = useDispatch();
    const roomNotifications: RoomNotification[] = useSelector((state: RootState) => state.notifications);
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
                    <button>click</button>
                </li>) : null}
            </ul>
            <Footer />
        </>
    )
}
export default NotificationsPage;