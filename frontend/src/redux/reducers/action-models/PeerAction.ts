type PeerAction = {
    type: "INIT_PEER",
    payload: {
        userId: string;
    }
}
export default PeerAction;