import RoomNotification from "../../models/RoomNotification";
import NotificationsAction from "./action-models/NotificationsAction";
const doesNotificationRepeat = (notification: RoomNotification, notificationArray: RoomNotification[]) => {
  const doesExist = notificationArray.find(n => n.roomId === notification.roomId);
  return !!doesExist;
}
export default (state = [], action: NotificationsAction) => {
    if (action.type === "SET_NOTIFICATIONS") {
      return action.payload.notifications!.reduce((acum: RoomNotification[],item: RoomNotification) => {
        return doesNotificationRepeat(item, acum) ? acum : [...acum, item];
      }, []);
    } else if (action.type === "ADD_NOTIFICATION") {
      return doesNotificationRepeat(action.payload.notification!, state) 
      ? state : [...state, action.payload.notification];
    } else if (action.type === "DELETE_NOTIFICATION") {
      return state.filter((notification:RoomNotification) => notification.roomId !== action.payload.id);
    } else {
      return state;
    }
};
  