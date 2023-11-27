interface Devices {
    videoDevices: MediaDeviceInfo[];
    audioInputDevices: MediaDeviceInfo[];
    audioOutputDevices: MediaDeviceInfo[];
}
const getDevices = (): Promise<Devices> => {
    return new Promise(async (resolve, _reject) => {
        const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();
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
export default getDevices;