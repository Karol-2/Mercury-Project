import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUser } from "../helpers/UserProvider";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import socketConnection from "../webSocket/socketConnection";
import stunServers from "../stun/stunServers";
function VideoCallPage() {
  const { user, userId } = useUser();
  const navigate = useNavigate();
  const localStream = useRef<HTMLVideoElement>(null);
  const remoteStream = useRef<HTMLVideoElement>(null);
  const [makingOffer, setMakingOffer] = useState(false);
  //const socket: Socket = useSelector((state: RootState) => state.socket);
  //console.log(socket)
  const socket = socketConnection();
  useEffect(() => {
    if (userId === null) navigate("/login");
  }, [userId]);

  useEffect(() => {
    if (user === undefined) {
      return;
    }
  }, [user]);

  useEffect(() => {
    prepareWebRTC();
  }, []);

  async function prepareWebRTC() {
    const peerConnection = new RTCPeerConnection(stunServers);
    let polite = false;
    socket.on("first", () => {
      console.log("SOCKET: first");
      polite = true;
    });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });
      localStream.current!.srcObject = stream;
    } catch (err) {
      console.error(err);
    }

    peerConnection.ontrack = ({ track, streams }) => {
      track.onunmute = () => {
        remoteStream.current!.srcObject = streams[0];
      };
    };

    peerConnection.onnegotiationneeded = async () => {
      negotiate(peerConnection, socket);
    };

    peerConnection.oniceconnectionstatechange = () => {
      if (peerConnection.iceConnectionState === "failed") {
        peerConnection.restartIce();
      } else if (peerConnection.iceConnectionState == "disconnected") {
        remoteStream.current!.srcObject = null;
      }
    };

    peerConnection.onicecandidate = ({ candidate }) => {
      socket.emit("iceCandidate", candidate!);
    };

    let ignoreOffer = false;
    socket.on("description", async (description) => {
      console.log("SOCKET: description");
      const offerCollision =
        description.type === "offer" &&
        (makingOffer || peerConnection.signalingState !== "stable");

      ignoreOffer = !polite && offerCollision;
      if (ignoreOffer) {
        return;
      }
      await peerConnection.setRemoteDescription(description);
      if (description.type === "offer") {
        await peerConnection.setLocalDescription();
        socket.emit("description", peerConnection.localDescription!);
      }
    });
    socket.on("iceCandidate", async (candidate) => {
      console.log("SOCKET: iceCandidate");
      try {
        await peerConnection.addIceCandidate(candidate);
      } catch (err) {
        console.error(err);
      }
    });
  }

  async function negotiate(peerConnection: RTCPeerConnection, socket: Socket) {
    try {
      setMakingOffer(true);
      await peerConnection.setLocalDescription();
      socket.emit("description", peerConnection.localDescription);
    } catch (err) {
      console.error(err);
    } finally {
      setMakingOffer(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex gap-5 p-10">
        <video
          id="large-feed"
          ref={localStream}
          className="rounded-lg flex-1"
          autoPlay
          controls
          playsInline
        ></video>
        <video
          id="small-feed"
          ref={remoteStream}
          className="rounded-lg flex-1"
          autoPlay
          controls
          playsInline
        ></video>
      </div>
      <Footer />
    </>
  );
}

export default VideoCallPage;
