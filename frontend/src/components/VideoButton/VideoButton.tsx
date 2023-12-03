import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import getDevices from "../../devices/getDevices";
import updateCallStatus from "../../redux/actions/updateCallStatus";
import startVideoStream from "./startVideoStream";

interface VideoButtonProps {
  smallFeedEl: any;
}
function VideoButton({ smallFeedEl }: VideoButtonProps) {
  const dispatch = useDispatch();
  const callStatus = useSelector((state: RootState) => state.callStatus);
  const streams = useSelector((state: RootState) => state.streams);
  const [pendingUpdate, setPendingUpdate] = useState(false);
  const [caretOpen, _setCaretOpen] = useState(false);
  const [_videoDeviceList, setVideoDeviceList] = useState<MediaDeviceInfo[]>(
    [],
  );

  useEffect(() => {
    const getDevicesAsync = async () => {
      if (caretOpen) {
        const devices = await getDevices();
        setVideoDeviceList(devices.videoDevices);
      }
    };
    getDevicesAsync();
  }, [caretOpen]);

  const startStopVideo = () => {
    const tracks: MediaStreamTrack[] =
      streams.localStream.stream.getAudioTracks();
    if (callStatus.video === "enabled") {
      dispatch(updateCallStatus("video", "disabled"));
      tracks.forEach((t) => (t.enabled = false));
    } else if (callStatus.video === "disabled") {
      dispatch(updateCallStatus("video", "enabled"));
      tracks.forEach((t) => (t.enabled = true));
    } else if (callStatus.haveMedia) {
      smallFeedEl.current.srcObject = streams.localStream.stream;
      startVideoStream(streams, dispatch);
    } else {
      setPendingUpdate(true);
    }
  };
  useEffect(() => {
    if (pendingUpdate && callStatus.haveMedia) {
      setPendingUpdate(false);
      smallFeedEl.current.srcObject = streams.localStream.stream;
      startVideoStream(streams, dispatch);
    }
  }, [pendingUpdate, callStatus.haveMedia]);
  return (
    <button onClick={startStopVideo}>
      {callStatus.video === "enabled" ? "Stop" : "Start"}
    </button>
  );
}

export default VideoButton;
