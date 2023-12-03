import StreamsState from "../../models/StreamsState";
const initState: StreamsState = {};
export default (state = initState, action: any) => {
  if (action.type === "ADD_STREAM") {
    const copyState = { ...state };
    copyState[action.payload.who] = action.payload;
    return copyState;
  } else if (action.type === "LOGOUT_ACTION") {
    return initState;
  } else {
    return state;
  }
};
