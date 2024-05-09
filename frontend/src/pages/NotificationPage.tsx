import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NotificationComponent from "../components/NotificationComponent";
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
                    action: async () => {
                        joinMeeting(notification.senderId);
                        await removeNotification(user!.id, notification.id!);
                    }
                }
            case "friend":
                return {
                    ...notificationWithDeleteMethod,
                    action: async () => {
                        navigate(`/friends`);
                        await removeNotification(user!.id, notification.id!);
                    }
                }
            case "message":
                return {
                    ...notificationWithDeleteMethod, 
                    action: async () => {
                        navigate(`/messages/${notification.senderId}`);
                        await removeNotification(user!.id, notification.id!);
                    }
                }
            default:
                break;
        }
        return notification;
    }
    return (
        <>
            <Navbar />
            <div className="my-20 mx-50">
                {notifications.map(notification => addAction(notification))
                .map((notification) => <NotificationComponent key={notification.id} notification={notification} />)}
            </div>
            <Footer />
        </>
    )
}
export default NotificationPage;