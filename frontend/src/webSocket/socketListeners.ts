import { Socket } from "socket.io-client";

const socketListeners = (
        socket: Socket, 
        polite:boolean, 
        setPolite: any, 
        setIgnoreOffer: any, 
        makingOffer: any, 
        peerConnection: RTCPeerConnection
    ) => {

    socket.on("first", () => {
        setPolite(true);
    });

    socket.on("description", async (description: RTCSessionDescription) => {
        const offerCollision = description.type === "offer" && (makingOffer || peerConnection.signalingState !== "stable")
        const ignoreOffer = !polite && offerCollision
        setIgnoreOffer(ignoreOffer);
        if (ignoreOffer) {
            return;
        }
        await peerConnection.setRemoteDescription(description);
        if (description.type === "offer") {
            await peerConnection.setLocalDescription();
            socket.emit("description", peerConnection.localDescription);
        }
    });

    socket.on("iceCandidate", async (candidate: RTCIceCandidate) => {
        try {
            await peerConnection.addIceCandidate(candidate);
        } catch (err) {
            console.error(err);
        }
    })
}

export default socketListeners;