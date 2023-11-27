const startAudioStream = (streams: {[key: string]: any}) => {
    const localStream = streams.localStream;
    Object.keys(streams).forEach(s => {
        if (s !== "localStream") {
            const curStream = streams[s];
            localStream.stream.getAudioTracks().forEach((t: MediaStreamTrack) => {
                curStream.peerConnection.addTrack(t, streams.localStream.stream);
            });
        }
    });
}

export default startAudioStream;