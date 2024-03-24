import { useEffect, useRef } from "react";

interface RoomPeerVideoProps {
    remoteStream: MediaStream;
    peerId: string;
}
function RoomPeerVideo({remoteStream, peerId}: RoomPeerVideoProps) {
    const remoteRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (remoteStream) {
            remoteRef.current!.srcObject = remoteStream;
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