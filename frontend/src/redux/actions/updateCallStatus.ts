import CallStatusState from "../../models/CallStatusState";
export default (prop: keyof CallStatusState, value: any) => {
  return {
    type: "UPDATE_CALL_STATUS",
    payload: { prop, value },
  };
};
