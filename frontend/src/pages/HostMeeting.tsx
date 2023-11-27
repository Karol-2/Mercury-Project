import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import updateCallStatus from "../redux/actions/updateCallStatus";
import addStream from "../redux/actions/addStream";
import socketConnection from "../webSocket/socketConnection";
import createPeerConnection from "../webRTC/createPeerConnection";
import meetingService from "../services/meeting";
function HostMeeting() {
    const dispatch = useDispatch();
    const callStatus = useSelector((state: RootState) => state.callStatus);
    const streams = useSelector((state: RootState) => state.streams);
    const [searchParams, setSearchParams] = useSearchParams();
    const [meetingInfo, setMeetingInfo] = useState({});
    const smallFeedEl = useRef<HTMLVideoElement>(null);
    const largeFeedEl = useRef<HTMLVideoElement>(null);
    const uuidRef = useRef<any>(null);
    useEffect(() => {
        const fetchMedia = async () => {
            const constraints = {
                video: true,
                audio: true
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                dispatch(updateCallStatus("haveMedia", true));
                dispatch(addStream("localStream", stream));
                const {peerConnection, remoteStream} = await createPeerConnection(addIce);
                dispatch(addStream("remote1", remoteStream, peerConnection));
                if (largeFeedEl.current) {
                    largeFeedEl.current.srcObject = remoteStream;
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchMedia();
    }, []);
    useEffect(() => {
        const createOfferAsync = () => {
            Object.keys(streams).forEach(async (s) => {
                if (s !== "localStream") {
                    try {
                        const pc: RTCPeerConnection = streams[s].peerConnection;
                        const offer = await pc.createOffer();
                        pc.setLocalDescription(offer);
                        const token = searchParams.get("token");
                        const socket = socketConnection(token!);
                        socket.emit("newOffer", {offer, meetingInfo});
                    } catch (err) {
                        console.log(err);
                    }
                }
            });
            dispatch(updateCallStatus("haveCreatedOffer", true));
        }
        if (callStatus.audio === "enabled" && callStatus.video === "enabled" && !callStatus.haveCreatedOffer) {
            createOfferAsync();
        }
    }, [callStatus.audio, callStatus.video, callStatus.haveCreatedOffer]);
    useEffect(() => {
        const asyncAddAnswer = () => {
            Object.keys(streams).forEach(async (s) => {
                if (s !== "localStream") {
                    const pc: RTCPeerConnection = streams[s].peerConnection;
                    await pc.setRemoteDescription(callStatus.answer);
                }
            });
        }
        if (callStatus.answer) {
            asyncAddAnswer();
        }
    }, [callStatus.answer]);
    useEffect(() => {
        const token = searchParams.get("token");
        const fetchDecodedToken = async () => {
            const response = await meetingService.decodeMeetingData(token!);
            setMeetingInfo(response);
            uuidRef.current = response.meetingId;
        }
        fetchDecodedToken();
    }, [])
    const addIce = (iceC: RTCPeerConnectionIceEvent) => {
        const socket = socketConnection(searchParams.get("token")!);
        socket.emit("iceToServer", {
            iceC,
            who: "owner",
            uuid: uuidRef.current
        });
    }
    return (
        <>
            <Navbar />
            <div>
                <video id="large-feed" ref={largeFeedEl} autoPlay controls playsInline></video>
                <video id="small-feed" ref={smallFeedEl} autoPlay controls playsInline></video>
            </div>
            <Footer />
        </>
    )
}
export default HostMeeting;