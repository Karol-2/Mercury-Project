import { Socket } from "socket.io-client";
import updateCallStatus from "../redux/actions/updateCallStatus";

const guestDashboardSocketListeners = (socket: Socket, setMeetingInfo: any, dispatch: any) => {
    
    socket.on("meetingData", meetingData => {
        setMeetingInfo(meetingData);
    });

    socket.on("newOfferWaiting", offerData => {
        dispatch(updateCallStatus("offer", offerData.offer));
        dispatch(updateCallStatus("myRole", "answerer"));
    });
}

const guestVideoSocketListeners = (socket: Socket, addIceCandidateToPC: any) => {
    socket.on("iceToClient", (iceC: any) => {
        addIceCandidateToPC(iceC);
    });
}

export default {guestDashboardSocketListeners, guestVideoSocketListeners}