import stunServers from "./stunServers";
import PeerConfig from "../models/PeerConfig";

type IceEventFunction = (e: RTCPeerConnectionIceEvent) => void;

const createPeerConnection = (addIce: IceEventFunction): Promise<PeerConfig> => {
    return new Promise(async (resolve, _reject) => {
        const peerConnection = new RTCPeerConnection(stunServers);
        const remoteStream = new MediaStream();
        peerConnection.addEventListener("signalingstatechange", (_e) => {

        });
        peerConnection.addEventListener("icecandidate", (e) => {
            if (e.candidate) {
                addIce(e);
            }
        });
        peerConnection.addEventListener("track", (e) => {
            e.streams[0].getTracks().forEach(track => {
                remoteStream.addTrack(track);
            });
        });
        resolve({
            peerConnection,
            remoteStream
        });
    });
}

export default createPeerConnection;