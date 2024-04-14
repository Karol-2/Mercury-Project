import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
    const invokeAction = (notification: any) => {
        if (notification.type === "call") {
            joinMeeting(notification.senderId)
        }
    }
    return (
        <>
            <Navbar />
            <div>
                {notifications.map((n,i) => <div key={i}>
                    <span>type: {n.type} </span>
                    <span>from: {n.senderId}</span>
                    <button onClick={() => invokeAction(n)}>action</button>
                </div>)}
            </div>
            <Footer />
        </>
    )
}
export default NotificationPage;