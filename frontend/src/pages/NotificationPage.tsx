import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Notification from "../models/Notification";
import { useUser } from "../helpers/UserContext";
import { useMeeting } from "../helpers/MeetingProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function NotificationPage() {
    const navigate = useNavigate();
    const {notifications} = useUser();
    const { joinMeeting, meeting } = useMeeting();
    useEffect(() => {
        if (meeting?.id) {
          navigate("/meeting");
        }
      }, [meeting]);
    const addAction = (notification: Notification): Notification => {
        switch (notification.type) {
            case "call":
                return {
                    ...notification,
                    action: joinMeeting
                }
            case "friend":
                return {
                    ...notification,
                    action: () => navigate(`/friends`)
                }
            case "message":
                return {
                    ...notification, 
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
                    {notification.type} from {notification.senderFullName}
                </div>)}
            </div>
            <Footer />
        </>
    )
}
export default NotificationPage;