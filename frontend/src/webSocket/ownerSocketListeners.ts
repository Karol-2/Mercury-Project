import { Socket } from "socket.io-client";
import updateCallStatus from "../redux/actions/updateCallStatus";

const ownerSocketListeners = (socket: Socket, dispatch: any, addIceCandidateToPc: any) => {

    socket.on("answerToClient", answer => {
        dispatch(updateCallStatus("answer", answer));
        dispatch(updateCallStatus("myRole", "offerer"));
    });

    socket.on("iceToClient", iceC => {
        addIceCandidateToPc(iceC);
    });

}

export default ownerSocketListeners;