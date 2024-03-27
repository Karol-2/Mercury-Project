import RoomNotification from "../../../models/RoomNotification";

type NotificationsAction = {
  type: "SET_NOTIFICATIONS" | "ADD_NOTIFICATION" | "DELETE_NOTIFICATION";
  payload: {
    id?: string;
    notification?: RoomNotification;
    notifications?: RoomNotification[];
  };
};
export default NotificationsAction;
