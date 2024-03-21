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
function RoomCallPage() {
    const localRef = useRef<HTMLVideoElement>(null);
    //const peerConfig = useSelector((state: RootState) => state.peer);
    //const {userId: peerId, peer} = peerConfig;
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const friends: User[] = useSelector((state: RootState) => state.friends);
    const {socket, userId, user} = useUser();
    socket?.on("userConnected", (newPeerId) => {
        console.log("[NEW USER]: ", newPeerId);
    });
    const params = useParams();
    const roomId = params.roomId;
    
    const prepareWebRTC = async () => {
        const stream = await fetchUserMedia();
        setLocalStream(stream);
        localRef.current!.srcObject = stream;
        localRef.current!.play();
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
    return (
        <>
            <Navbar />
            {localStream ? <main>
                <section>
                    <div>
                        <video 
                            ref={localRef}
                        ></video>
                    </div>
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