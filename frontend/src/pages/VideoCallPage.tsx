import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUser } from "../helpers/UserProvider";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import stunServers from "../stun/stunServers";
import Meeting from "../models/Meeting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneSlash,
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";

function VideoCallPage() {
  const { user, userId, socket, meeting, leaveMeeting } = useUser();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const firstRefresh = useRef<boolean>(true);
  const navigate = useNavigate();
  const localStream = useRef<HTMLVideoElement>(null);
  const remoteStream = useRef<HTMLVideoElement>(null);
  const [makingOffer, setMakingOffer] = useState(false);
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const getPeerConnection = () => peerConnectionRef.current;
  const [yourParticipant, setYourParticipant] = useState("");
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

  async function startStopAudio() {
    if (stream) {
      const tracks = stream.getAudioTracks();
      if (audio) {
        setAudio(false);
        tracks.forEach((track) => (track.enabled = false));
      } else {
        setAudio(true);
        tracks.forEach((track) => (track.enabled = true));
      }
    }
  }
  async function startStopVideo() {
    if (stream) {
      const tracks = stream.getVideoTracks();
      if (video) {
        setVideo(false);
        tracks.forEach((track) => (track.enabled = false));
      } else {
        setVideo(true);
        tracks.forEach((track) => (track.enabled = true));
      }
    }
  }

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
      setStream(stream);
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
      socket.emit("name", `${user?.first_name} ${user?.last_name}`);
    });

    socket.on("iceCandidate", async (candidate) => {
      const peerConnection = getPeerConnection();
      if (!peerConnection) return;

      try {
        await peerConnection.addIceCandidate(candidate);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("name", (name) => {
      setYourParticipant(name);
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
        <div className="flex">
          <span className="flex-1 text-center">
            {user?.first_name + " " + user?.last_name}
          </span>
          <span className="flex-1 text-center">{yourParticipant}</span>
        </div>
      </div>
      <div className="flex px-10">
        <div className="flex-1"></div>
        <div className="flex flex-1 justify-center">
          <button className="btn p-6" onClick={startStopAudio}>
            {audio ? (
              <FontAwesomeIcon icon={faMicrophone} />
            ) : (
              <FontAwesomeIcon icon={faMicrophoneSlash} />
            )}
          </button>
          <button className="btn p-6" onClick={startStopVideo}>
            {video ? (
              <FontAwesomeIcon icon={faVideo} />
            ) : (
              <FontAwesomeIcon icon={faVideoSlash} />
            )}
          </button>
        </div>
        <div className="flex flex-1 justify-end">
          <button
            onClick={() => handleLeaveMeeting()}
            className="btn bg-my-red p-6"
          >
            <FontAwesomeIcon icon={faPhoneSlash}></FontAwesomeIcon>
            <span className="ml-2">Leave</span>
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default VideoCallPage;
