import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import updateCallStatus from "../redux/actions/updateCallStatus";
import addStream from "../redux/actions/addStream";
function HostMeeting() {
    const dispatch = useDispatch();
    const callStatus = useSelector((state: RootState) => state.callStatus);
    const streams = useSelector((state: RootState) => state.streams);
    const [searchParams, setSearchParams] = useSearchParams();
    const [meetingInfo, setMeetingInfo] = useState({});
    const smallFeedEl = useRef<HTMLVideoElement>(null);
    const largeFeedEl = useRef<HTMLVideoElement>(null);
    const uuidRef = useRef<any>(null);
    
    return (
        <>
            <Navbar />
            <div>
                <video id="large-feed" autoPlay controls playsInline></video>
                <video id="small-feed" autoPlay controls playsInline></video>
            </div>
            <Footer />
        </>
    )
}
export default HostMeeting;