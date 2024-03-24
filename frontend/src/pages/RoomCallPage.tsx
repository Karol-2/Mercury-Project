import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchUserMedia from "../media/fetchUserMedia";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import User from "../models/User";
import { useUser } from "../helpers/UserProvider";
import { useParams } from "react-router-dom";
import dataService from "../services/data";
import RoomPeerVideo from "../components/RoomPeerVideo";
import Peer from "peerjs";
import RoomPeer from "../models/RoomPeer";
function RoomCallPage() {
    const localRef = useRef<HTMLVideoElement>(null);
    const peer: Peer = useSelector((state: RootState) => state.peer);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [roomPeers, setRoomPeers] = useState<{[key: string]: RoomPeer}>({});
    const friends: User[] = useSelector((state: RootState) => state.friends);
    const {socket, userId, user} = useUser();
    const params = useParams();
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
                <section>
                    <div>
                        <video 
                            ref={localRef}
                        ></video>
                        <span>{`${user?.first_name} ${user?.last_name}`}</span>
                    </div>
                    {Object.entries(roomPeers).map((roomPeer) => {
                        const [id, peer] = roomPeer;
                        return <RoomPeerVideo key={id} remoteStream={peer.stream} peerId={id}  />
                    })}
                </section>
                <section>
                    <h3><strong>Invite</strong></h3>
                    <ul>
                        {friends.map(friend => 
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