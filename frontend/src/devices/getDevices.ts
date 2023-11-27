const getDevices = () => {
    return new Promise(async (resolve, _reject) => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === "videoinput");
        const audioInputDevices = devices.filter(d => d.kind === "audioinput");
        const audioOutputDevices = devices.filter(d => d.kind === "audiooutput");
        resolve({
            videoDevices,
            audioInputDevices,
            audioOutputDevices
        });
    });
}