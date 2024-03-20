export default (state = [], action: any) => {
    if (action.type === "SET_NOTIFICATIONS") {
      return action.payload.notifications;
    } else if (action.type === "ADD_NOTIFICATION") {
      return [...state, action.payload.notification];
    } else {
      return state;
    }
};
  