import Peer from "peerjs";
import PeerAction from "./action-models/PeerAction";

export default (state = null, action: PeerAction) => {
  if (action.type === "INIT_PEER") {
    const userId = action.payload.userId;
    const peer = new Peer(userId, {
      host: "/",
      port: 8000,
    });
    return peer;
  } else {
    return state;
  }
};
