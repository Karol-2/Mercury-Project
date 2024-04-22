import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Notification from "../models/Notification";
import { useUser } from "../helpers/UserContext";
import { useMeeting } from "../helpers/MeetingProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dataService from "../services/data";
function NotificationPage() {
    const navigate = useNavigate();
    const {notifications, setNotifications, user} = useUser();
    const { joinMeeting, meeting } = useMeeting();
    useEffect(() => {
        if (meeting?.id) {
          navigate("/meeting");
        }
    }, [meeting]);
    
    const removeNotification = async (userId: string, notificationId: string) => {
        await dataService.fetchData(`/users/notifications/${userId}/${notificationId}`, "DELETE", {});
        setNotifications((prev: Notification[]) => prev.filter(notification => notification.id !== notificationId));  
    }

    const addAction = (notification: Notification): Notification => {
        const notificationWithDeleteMethod: Notification = {
            ...notification,
            deleteNotification: () => removeNotification(user!.id, notification.id!)
        }
        switch (notification.type) {
            case "call":
                return {
                    ...notificationWithDeleteMethod,
                    action: () => joinMeeting(notification.senderId)
                }
            case "friend":
                return {
                    ...notificationWithDeleteMethod,
                    action: () => navigate(`/friends`)
                }
            case "message":
                return {
                    ...notificationWithDeleteMethod, 
                    action: () => navigate(`/messages/${notification.senderId}`)
                }
            default:
                break;
        }
        return notification;
    }
    return (
        <>
            <Navbar />
            <div>
                {notifications.map(notification => addAction(notification))
                .map((notification) => <div key={notification.id}>
                    {notification.type} from {notification.senderFullName} <button onClick={notification.action}>action</button>
                    <button onClick={notification.deleteNotification}>delete</button>
                </div>)}
            </div>
            <Footer />
        </>
    )
}
export default NotificationPage;