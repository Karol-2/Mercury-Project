import { useEffect, useRef } from "react";
import RoomPeer from "../models/RoomPeer";

interface RoomPeerVideoProps {
    remotePeer: RoomPeer;
}
function RoomPeerVideo({remotePeer}: RoomPeerVideoProps) {
    const remoteRef = useRef<HTMLVideoElement>(null);
    const {stream} = remotePeer;
    useEffect(() => {
        if (stream) {
            remoteRef.current!.srcObject = stream;
            remoteRef.current!.play();
        }
    }, []);
    return (
        <div><video
            ref={remoteRef}
        ></video></div>
    )
}

export default RoomPeerVideo;