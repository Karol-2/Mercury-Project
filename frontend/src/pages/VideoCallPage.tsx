import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUser } from "../helpers/UserProvider";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
function VideoCallPage() {
  const { user, userId } = useUser();
  const navigate = useNavigate();
  const localStream = useRef<HTMLVideoElement>(null);
  const remoteStream = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (userId === null) navigate("/login");
  }, [userId]);

  useEffect(() => {
    if (user === undefined) {
      return;
    }
  }, [user]);

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
