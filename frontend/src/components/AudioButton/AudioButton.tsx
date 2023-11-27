import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import getDevices from "../../devices/getDevices";
import updateCallStatus from "../../redux/actions/updateCallStatus";
import startAudioStream from "./startAudioStream";
interface AudioButtonProps {
    smallFeedEl: any
}
function AudioButton({smallFeedEl}: AudioButtonProps) {
    const dispatch = useDispatch();
    const callStatus = useSelector((state: RootState) => state.callStatus);
    const streams = useSelector((state: RootState) => state.streams);
    const [caretOpen, _setCaretOpen] = useState(false);
    const [_audioDeviceList, setAudioDeviceList] = useState<MediaDeviceInfo[]>([]);
    useEffect(() => {
        const getDevicesAsync = async () => {
            if (caretOpen) {
                const devices = await getDevices();
                const {audioOutputDevices, audioInputDevices} = devices;
                setAudioDeviceList([...audioInputDevices, ...audioOutputDevices]);
            }
        }
        getDevicesAsync();
    }, [caretOpen]);
    const startStopAudio = () => {
        const tracks: MediaStreamTrack[] = streams.localStream.stream.getAudioTracks();
        switch (callStatus.audio) {
            case "enabled":
                dispatch(updateCallStatus("audio", "disabled"));
                tracks.forEach(t => t.enabled = false);
                break;
            case "disabled":
                dispatch(updateCallStatus("audio", "enabled"));
                tracks.forEach(t => t.enabled = true);
                break;
            default:
                changeAudioDevice({target: {value: "inputdefault"}});
                startAudioStream(streams);
        }
    }
    const changeAudioDevice = async (e:any) => {
        const deviceId = e.target.value.slice(5);
        const audioType = e.target.value.slice(0,5);
        if (audioType === "output") {
            smallFeedEl.current.setSinkId(deviceId);
        } else if (audioType === "input") {
            const newConstraints = {
                audio: {deviceId: {exact: deviceId}},
                video: callStatus.videoDevice === "default" ? true : {deviceId: {exact: callStatus.videoDevice}}
            }
            const stream: MediaStream = await navigator.mediaDevices.getUserMedia(newConstraints);
            dispatch(updateCallStatus("audioDevice", deviceId));
            dispatch(updateCallStatus("audio", "enabled"));
            const [audioTrack] = stream.getAudioTracks();
            Object.keys(streams).forEach(s => {
                if (s !== "localStream") {
                    const senders: RTCRtpSender[] = streams[s].peerConnection.getSenders();
                    const sender: RTCRtpSender | undefined = senders.find(s => {
                        if (s.track) {
                            return s.track.kind === audioTrack.kind;
                        } else {
                            return false;
                        }
                    });
                    sender?.replaceTrack(audioTrack);
                }
            });
        }
    }
    return (
        <button onClick={startStopAudio}>
            {callStatus.audio === "enabled" ? "Mute" : "Unmute"}
        </button>
    )
}
export default AudioButton;