import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchUserMedia from "../media/fetchUserMedia";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import User from "../models/User";
import { useUser } from "../helpers/UserProvider";
import { useNavigate, useParams } from "react-router-dom";
import dataService from "../services/data";
import RoomPeerVideo from "../components/RoomPeerVideo";
import Peer from "peerjs";
import RoomPeer from "../models/RoomPeer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPhoneSlash,
    faMicrophone,
    faMicrophoneSlash,
    faVideo,
    faVideoSlash,
  } from "@fortawesome/free-solid-svg-icons";
function RoomCallPage() {
    const localRef = useRef<HTMLVideoElement>(null);
    const peer: Peer = useSelector((state: RootState) => state.peer);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [roomPeers, setRoomPeers] = useState<{[key: string]: RoomPeer}>({});
    const [isAudio, setIsAudio] = useState(true);
    const [isVideo, setIsVideo] = useState(true);
    const friends: User[] = useSelector((state: RootState) => state.friends);
    const {socket, userId, user} = useUser();
    const params = useParams();
    const navigate = useNavigate();
    const roomId = params.roomId;
    peer.on("call", async (call) => {
        if (localStream) {
            call.answer(localStream);
        } else {
            const stream = await fetchUserMedia();
            setLocalStream(stream);
            call.answer(stream);
        }
        call.on("stream", (remoteStream: MediaStream) => {
            const peerId = call.peer;
            const newPeerObj: {[key: string]: RoomPeer} = {};
            newPeerObj[peerId] = {stream: remoteStream}
            setRoomPeers(prev => ({...prev, ...newPeerObj}));
        });
    });
    const connectToNewUser = (newPeerId: string, stream: MediaStream) => {
        const call = peer.call(newPeerId, stream);
        call.on("stream", (remoteStream: MediaStream) => {
            const peerId = newPeerId;
            const newPeerObj: {[key: string]: RoomPeer} = {};
            newPeerObj[peerId] = {stream: remoteStream};
            setRoomPeers(prev => ({...prev, ...newPeerObj}));
        });
    }
    
    const prepareWebRTC = async () => {
        const stream = await fetchUserMedia();
        setLocalStream(stream);
        socket?.on("userConnected", ({peerId}): any => {
            connectToNewUser(peerId, stream);
        });
        socket?.on("leftRoom", (id) => {
            setRoomPeers(prev => Object.fromEntries(
                Object.entries(prev).filter(elem => {
                    const [peerId, _peer] = elem;
                    return peerId !== id;
                })
            ));
        });
    }
    
    const startStopAudio = async () => {
        if (localStream) {
            const tracks = localStream.getAudioTracks();
            if (isAudio) {
                setIsAudio(false);
                tracks.forEach((track) => (track.enabled = false));
            } else {
                setIsAudio(true);
                tracks.forEach((track) => (track.enabled = true));
            }
        }
    } 

    const startStopVideo = async () => {
        if (localStream) {
            const tracks = localStream.getVideoTracks();
            if (isVideo) {
                setIsVideo(false);
                tracks.forEach((track) => (track.enabled = false));
            } else {
                setIsVideo(true);
                tracks.forEach((track) => (track.enabled = true));
            }
        }
    } 

    const handleLeaveMeeting = () => {
        if (localRef.current) {
            (localRef.current.srcObject as MediaStream)
            .getTracks().forEach((track) => {
                track.stop();
            });
            socket?.emit("leftRoom", {roomId, userId});
            navigate("/friends");
        }
    }

    const inviteFriendToRoom = async (friendId: string) => {
        const myFullName = `${user?.first_name} ${user?.last_name}`;
        await dataService.fetchData("/room", "POST", {headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            roomId,
            from: userId, 
            to: friendId, 
            userName: myFullName
        }),});
        socket?.emit("newRoom", {roomId, from: userId, to: friendId, userName: myFullName});
    }

    useEffect(() => {
        prepareWebRTC();
    }, []);
    useEffect(() => {
        if (localRef.current && localStream) {
            localRef.current.srcObject = localStream;
            localRef.current.play();
        }
    }, [localRef.current, localStream]);
    
    return (
        <>
            <Navbar />
            {localStream ? <main>
                <div className="flex justify-center p-1">
                    <button className="btn p-6" onClick={() => startStopAudio()}>
                        {isAudio ? (
                            <FontAwesomeIcon icon={faMicrophone} />
                        ) : (
                            <FontAwesomeIcon icon={faMicrophoneSlash} />
                        )}
                    </button>
                        <button className="btn p-6" onClick={() => startStopVideo()}>
                            {isVideo ? (
                                <FontAwesomeIcon icon={faVideo} />
                            ) : (
                                <FontAwesomeIcon icon={faVideoSlash} />
                            )}
                        </button>
                        <button
                            onClick={() => handleLeaveMeeting()}
                            className="btn bg-my-red p-6"
                        >
                            <FontAwesomeIcon icon={faPhoneSlash}></FontAwesomeIcon>
                        </button>
                </div> 
                <section className="grid p-3 grid-cols-3 gap-2">
                    <div>
                        <video 
                            className="h-full w-full rounded-lg"
                            ref={localRef}
                        ></video>
                        <div>{`${user?.first_name} ${user?.last_name}`}</div>
                    </div>
                    {Object.entries(roomPeers).map((roomPeer) => {
                        const [id, peer] = roomPeer;
                        return <RoomPeerVideo key={id} remoteStream={peer.stream} peerId={id}  />
                    })}
                </section>
                <section>
                    <h3><strong>Invite</strong></h3>
                    <ul>
                        {friends.filter(friend => !(friend.id in roomPeers)).map(friend => 
                            <li key={friend.id}>
                                <span>{`${friend.first_name} ${friend.last_name}`} </span>
                                <button onClick={() => inviteFriendToRoom(friend.id)}>click</button>
                            </li>
                        )}
                    </ul>
                </section>
            </main> : null}
            <Footer />
        </>
    )
}

export default RoomCallPage;