import RoomNotification from "../../models/RoomNotification";

export default (notifications: RoomNotification[]) => {
    return {
      type: "SET_NOTIFICATIONS",
      payload: { notifications },
    };
};
  