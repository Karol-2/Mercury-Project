import { Socket } from "socket.io-client";
import updateCallStatus from "../redux/actions/updateCallStatus";

const guestDashboardSocketListeners = (
  socket: Socket,
  setMeetingInfo: any,
  dispatch: any,
) => {
  socket.on("meetingInfo", (meetingInfo) => {
    console.log("meetingData");
    setMeetingInfo(meetingInfo);
  });

  socket.on("newOfferWaiting", (offerData) => {
    console.log("newOfferWaiting");
    dispatch(updateCallStatus("offer", offerData.sdp));
    dispatch(updateCallStatus("myRole", "answerer"));
  });
};

const guestVideoSocketListeners = (
  socket: Socket,
  addIceCandidateToPC: any,
) => {
  socket.on("iceToClient", (iceC: any) => {
    console.log("iceToClient");
    addIceCandidateToPC(iceC);
  });
};

export default { guestDashboardSocketListeners, guestVideoSocketListeners };
