import { Socket } from "socket.io-client";
import stunServers from "./stunServers";

const createPeerConnection = (remoteStream: any, negotiate:any, socket: Socket): Promise<RTCPeerConnection> => {
  return new Promise((resolve, _reject) => {
    const peerConnection = new RTCPeerConnection(stunServers);
    peerConnection.ontrack = ({track, streams}) => {
      track.onunmute = () => {
        remoteStream.current!.srcObject = streams[0];
      }
    }
    peerConnection.onnegotiationneeded = async () => {
      negotiate(peerConnection, socket)
    }
    peerConnection.oniceconnectionstatechange = () => {
      if (peerConnection.iceConnectionState === "failed") {
        peerConnection.restartIce();
      } else if (peerConnection.iceConnectionState === "disconnected") {
        remoteStream.current!.srcObject = null;
      }
    }
    peerConnection.onicecandidate = ({candidate}) => {
      socket.emit("iceCandidate", candidate);
    }
    resolve(peerConnection);
  });
}
export default createPeerConnection;