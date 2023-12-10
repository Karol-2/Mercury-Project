import CallStatusState from "../../models/CallStatusState";

const initState: CallStatusState = {
  current: "idle",
  video: "off",
  audio: "off",
  audioDevice: "default",
  videoDevice: "default",
  shareScreen: false,
  haveMedia: false,
  haveCreatedOffer: false,
};

export default (state = initState, action: any) => {
  switch (action.type) {
    case "UPDATE_CALL_STATUS":
      const copyState: any = { ...state };
      copyState[action.payload.prop] = action.payload.value;
      return copyState;
    case "LOGOUT_ACTION":
      return initState;
    case "NEW_VERSION":
      return initState;
    default:
      return state;
  }
};
