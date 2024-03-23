import Peer from "peerjs";

export default (state = null, action: any) => {
    if (action.type === "INIT_PEER") {
        const userId = action.payload.userId;
        const peer = new Peer(userId, {
            host: "/",
            port: 8000
        });
        return peer;
    } else {
        return state
    }
}