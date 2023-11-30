import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUser } from "../helpers/UserProvider";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import socketConnection from "../webSocket/socketConnection";
import guestSocketListeners from "../webSocket/guestSocketListeners";
function MeetingDashboard() {
    const {user} = useUser();
    const [searchParams, _setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [meetingInfo, setMeetingInfo] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        const token = searchParams.get("token");
        const socket = socketConnection(token!);
        guestSocketListeners.guestDashboardSocketListeners(socket, setMeetingInfo, dispatch);
    }, []);
    const joinGuestCall = (meeting: any) => {
        const token = searchParams.get("token");
        navigate(`/guest-meeting?token=${token}&meetingId=${meeting.meetingId}&ownerId=${meeting.ownerId}`)
    }
    if (!user) {
        return <></>
    }
    return (
        <>
            <Navbar />
            <div>
                {meetingInfo.map((meeting: any) => (
                    <div key={meeting.meetingId}>
                        <li>
                            {meeting.ownerId}
                            {meeting.waiting ? <>
                                <div>Waiting</div>
                                <button onClick={()=>joinGuestCall(meeting)}>Join</button>
                            </> : <></>}
                        </li>
                    </div>
                ))}
            </div>
            <Footer />
        </>
    )
}
export default MeetingDashboard;