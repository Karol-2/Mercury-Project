import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUser } from "../helpers/UserProvider";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import stunServers from "../stun/stunServers";
import Meeting from "../models/Meeting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneSlash} from "@fortawesome/free-solid-svg-icons";

function VideoCallPage() {
  const { userId, socket, meeting, leaveMeeting } = useUser();
  const firstRefresh = useRef<boolean>(true);
  const navigate = useNavigate();
  const localStream = useRef<HTMLVideoElement>(null);
  const remoteStream = useRef<HTMLVideoElement>(null);
  const [makingOffer, setMakingOffer] = useState(false);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const getPeerConnection = () => peerConnectionRef.current;

  useEffect(() => {
    if (userId === null) navigate("/login");
  }, [userId]);

  useEffect(() => {
    if (!meeting) {
      navigate("/profile");
    }
  }, [meeting]);

  useEffect(() => {
    if (!firstRefresh.current) return;
    firstRefresh.current = false;

    if (socket && meeting) {
      peerConnectionRef.current = new RTCPeerConnection(stunServers);
      prepareWebRTC(socket, meeting, peerConnectionRef.current);
    }
  }, []);

  async function prepareWebRTC(
    socket: Socket,
    meeting: Meeting,
    peerConnection: RTCPeerConnection,
  ) {
    let polite = meeting.state == "created";

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
      const peerConnection = getPeerConnection();
      if (!peerConnection) return;

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
      const peerConnection = getPeerConnection();
      if (!peerConnection) return;

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

  const handleLeaveMeeting = async () => {
    if (localStream.current) {
      (localStream.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => {
          track.stop();
        });
      localStream.current.srcObject = null;
    }

    if (remoteStream.current) {
      remoteStream.current.srcObject = null;
    }
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    leaveMeeting();
  };

  return (
    <>
      <Navbar handleNavigate={() => handleLeaveMeeting()} />
      <div className="flex flex-col justify-center gap-5 p-10">
        <div className="flex flex-col md:flex-row gap-5">
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
      </div>
      <div className=" flex justify-center">
        <button onClick={() => handleLeaveMeeting()} className="btn bg-my-red p-6">
          <FontAwesomeIcon icon={faPhoneSlash}></FontAwesomeIcon>
          <span className="ml-2">Leave</span>
        </button>
      </div>
      <Footer />
    </>
  );
}

export default VideoCallPage;
