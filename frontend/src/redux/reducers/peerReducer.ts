import Peer from "peerjs";

const peer = new Peer({
    host: "/",
    port: 8000
});
const initState = {
    peer,
    peerId: ""
}
peer.on("open", (peerId) => {
    initState.peerId = peerId;
});

export default (state = initState, _action: any) => {
    return state;
}