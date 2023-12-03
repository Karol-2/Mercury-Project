import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useRef, useState } from "react";
import socketConnection from "../webSocket/socketConnection";
import { useSearchParams } from "react-router-dom";
import stunServers from "../webRTC/stunServers";
import ActionButtons from "../components/ActionButtons";
import addStream from "../redux/actions/addStream";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
interface VideoCallPageProps {
  userType: 'guest' | 'owner';
};

function VideoCallPage({userType}: VideoCallPageProps) {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const [streamSetup, setStreamSetup] = useState(false);
  const streamSelector = useSelector((state: RootState) => state.streams)
  useEffect(() => {
    let stream: MediaStream;

    (async () => {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      localVideo.current!.srcObject = stream;
      dispatch(addStream("localStream", stream));
      setStreamSetup(true);
    })();

    return () => {
      stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!streamSetup) return;
    const token = "some-token";
    const socket = socketConnection(token!);
    let peerConnection: RTCPeerConnection;
    let candidates: RTCIceCandidateInit[] = [];
    
    const stream: MediaStream = streamSelector.localStream.stream;

    // let the server know someone joined
    socket.on('connect', () => {
      socket.emit(userType);
    });

    socket.on('offer', async (id, message) => {
      console.log('got remote offer');
      peerConnection = new RTCPeerConnection(stunServers);
      await peerConnection.setRemoteDescription(message);

      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
        
      peerConnection.ontrack = (event) => {
        // got track from other user
        remoteVideo.current!.srcObject = event.streams[0];
        console.log('got track');
        dispatch(addStream("remoteStream", event.streams[0]));
      };
      
      // https://stackoverflow.com/questions/72467928/webrtc-peerconnection-ontrack-listener-doesnt-trigger
      // peerConnection.onnegotiationneeded = () => {
      //   console.log('negotiation needed');
      //   peerConnection
      //   .createOffer()
      //   .then((sdp) => peerConnection.setLocalDescription(sdp))
      //   .then(() => {
      //     socket.emit('offer', id, peerConnection.localDescription);
      //   });
      // }
    

      peerConnection.addEventListener('icecandidate', (event) => {
        // geneated ice candidate, sending to other person
        if (event.candidate) {
          socket.emit('candidate', id, event.candidate);
          console.log("sending candidate", event.candidate);
        }
      });

      peerConnection.createAnswer({})
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit('answer',
            id,
            peerConnection.localDescription,
          );
          console.log('sending answer');
        })
        .catch(e => console.error(e));
      
      for (const candidate of candidates) {
        peerConnection
          .addIceCandidate(new RTCIceCandidate(candidate))
          .catch((e) => console.error(e));
        console.log('added stored remote candidate') 
      }
      candidates = [];
    });

    socket.on('candidate', (_, message) => {
      if (!peerConnection.remoteDescription) {
        candidates.push(message); // remember candidate for later
        console.log("storing remote canidate");
      } else {
        peerConnection
          .addIceCandidate(new RTCIceCandidate(message))
          .catch((e) => console.error(e));
        console.log('got remote candidate') 
      }
    });

    socket.on('owner', () => {
      socket.emit('guest');
    });

    socket.on('guest', async (id: string) => {
      console.log('got guest');
      peerConnection = new RTCPeerConnection(stunServers);
      
      peerConnection.addEventListener('icecandidate', (event) => {
        // geneated ice candidate, sending to other person
        if (event.candidate) {
          socket.emit('candidate', id, event.candidate);
          console.log("sending candidate", event.candidate);
        }
      });

      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

      peerConnection.ontrack = (event) => {
        // got track from other user
        remoteVideo.current!.srcObject = event.streams[0];
        dispatch(addStream("remoteStream", event.streams[0]));
        console.log("got track, i am host");
      };

      peerConnection.onnegotiationneeded = () => {
        peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit('offer', id, peerConnection.localDescription);
        });
      };

      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit('offer', id, peerConnection.localDescription);
          console.log('sent offer');
        });
    });

    socket.on('answer', (_, message) => {
      peerConnection.setRemoteDescription(message);
      console.log("got remote answer")
    });

    // @ts-ignore
    socket.on('userDisconnected', (_) => {
      peerConnection.close();
    });
  }, [streamSetup])

  return (
    <>
      <Navbar />
      <div>
        <video id="large-feed" ref={remoteVideo} autoPlay controls playsInline></video>
        <video id="small-feed" ref={localVideo} style={{outline: "red solid 10px"}} autoPlay controls playsInline></video>
        <ActionButtons smallFeedEl={localVideo} largeFeedEl={remoteVideo} />
      </div>
      <Footer />
    </>
  );
}

export default VideoCallPage;
