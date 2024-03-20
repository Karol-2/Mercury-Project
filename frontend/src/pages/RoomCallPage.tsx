import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchUserMedia from "../media/fetchUserMedia";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import User from "../models/User";
import { useUser } from "../helpers/UserProvider";
function RoomCallPage() {
    const localRef = useRef<HTMLVideoElement>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const friends: User[] = useSelector((state: RootState) => state.friends);
    const {socket} = useUser();
    const getStream = async () => {
        const stream = await fetchUserMedia();
        setLocalStream(stream);
        localRef.current!.srcObject = stream;
        localRef.current!.play();
    }
    const inviteFriendToRoom = async (friendId: string) => {
        console.log(friendId);
    }
    useEffect(() => {
        getStream();
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
                                <span>{`${friend.first_name} ${friend.last_name}`}</span>
                                <button onClick={() => inviteFriendToRoom(friend.id)}> invite</button>
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