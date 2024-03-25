const doesNotificationRepeat = (notification: any, notificationArray: any[]) => {
  const doesExist = notificationArray.find(n => n.roomId === notification.roomId);
  return !!doesExist;
}
export default (state = [], action: any) => {
    if (action.type === "SET_NOTIFICATIONS") {
      return action.payload.notifications.reduce((acum: any,item: any) => {
        return doesNotificationRepeat(item, acum) ? acum : [...acum, item];
      }, []);
    } else if (action.type === "ADD_NOTIFICATION") {
      return doesNotificationRepeat(action.payload.notification, state) 
      ? state : [...state, action.payload.notification];
    } else if (action.type === "DELETE_NOTIFICATION") {
      return state.filter((notification:any) => notification.roomId !== action.payload.id);
    } else {
      return state;
    }
};
  