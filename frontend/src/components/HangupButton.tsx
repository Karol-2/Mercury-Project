import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import updateCallStatus from "../redux/actions/updateCallStatus";

interface HangupButtonProps {
  smallFeedEl: any;
  largeFeedEl: any;
}
function HangupButton({ smallFeedEl, largeFeedEl }: HangupButtonProps) {
  const dispatch = useDispatch();
  const callStatus = useSelector((state: RootState) => state.callStatus);
  const streams = useSelector((state: RootState) => state.streams);

  const hangupCall = () => {
    dispatch(updateCallStatus("current", "complete"));
    Object.keys(streams).forEach((s) => {
      if (streams[s].peerConnection) {
        streams[s].peerConnection.close();
        streams[s].peerConnection.onicecandidate = null;
        streams[s].peerConnection.onaddstream = null;
        streams[s].peerConnection = null;
      }
    });
    smallFeedEl.current.srcObject = null;
    largeFeedEl.current.srcObject = null;
  };
  if (callStatus.current === "complete") {
    return <></>;
  }
  return <button onClick={hangupCall}>Hangup call</button>;
}

export default HangupButton;
