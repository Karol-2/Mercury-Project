import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUser } from "../helpers/UserProvider";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
function VideoCallPage() {
  const { user, userId } = useUser();
  const navigate = useNavigate();
  const localStream = useRef<HTMLVideoElement>(null);
  const remoteStream = useRef<HTMLVideoElement>(null);
  const [makingOffer, setMakingOffer] = useState(false);
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
      <div>
        <video
          id="large-feed"
          ref={localStream}
          autoPlay
          controls
          playsInline
        ></video>
        <video
          id="small-feed"
          ref={remoteStream}
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
