import { useEffect, useRef, useState } from "react";
import dataService from "../services/data";
interface RoomPeerVideoProps {
    remoteStream: MediaStream;
    peerId: string;
}
function RoomPeerVideo({remoteStream, peerId}: RoomPeerVideoProps) {
    const remoteRef = useRef<HTMLVideoElement>(null);
    const [name, setName] = useState("");
    const fetchFullName = async () => {
        const fullNameRequest = await dataService.fetchData(`/users/${peerId}/name`, "GET", {});
        const fullName = fullNameRequest.fullName;
        setName(fullName);
    }
    useEffect(() => {
        if (remoteStream) {
            remoteRef.current!.srcObject = remoteStream;
            remoteRef.current!.play();
        }
        fetchFullName();
    }, []);
    return (
        <div><video
            ref={remoteRef}
        ></video><span>{name}</span></div>
    )
}

export default RoomPeerVideo;