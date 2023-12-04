import updateCallStatus from "../../redux/actions/updateCallStatus";

const startVideoStream = (streams: { [key: string]: any }, dispatch: any) => {
  const localStream = streams.localStream;
  Object.keys(streams).forEach((s) => {
    if (s !== "localStream") {
      const curStream = streams[s];
      localStream.stream.getVideoTracks().forEach((t: MediaStreamTrack) => {
        curStream.stream.peerConnection.addTrack(t, streams.localStream.stream);
      });
      dispatch(updateCallStatus("video", "enabled"));
    }
  });
};

export default startVideoStream;
