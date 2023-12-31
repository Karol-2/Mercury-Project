export default interface ClientToServerEvents {
  iceCandidate: (candidate: RTCIceCandidate) => void;
  description: (description: RTCSessionDescription) => void;
  message: (message: any) => void;
}
