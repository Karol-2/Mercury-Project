export default interface CallStatusState {
  current: string;
  video: string;
  audio: string;
  audioDevice: string;
  videoDevice: string;
  shareScreen: boolean;
  haveMedia: boolean;
  haveCreatedOffer: boolean;
  answer?: any;
  myRole?: string;
  offer?: any;
}
