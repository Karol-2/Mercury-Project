import RoomNotification from "../../models/RoomNotification";
export default (notification: RoomNotification) => {
  return {
    type: "ADD_NOTIFICATION",
    payload: { notification },
  };
};
