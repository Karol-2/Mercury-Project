export default interface ServerToClientEvents {
  iceCandidate: (candidate: RTCIceCandidate) => void;
  description: (description: RTCSessionDescription) => void;
  first: () => void;
  message: (message: any) => void;
}
