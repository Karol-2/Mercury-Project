export default (state = [], action: any) => {
  if (action.type === "SET_USER_FRIENDS") {
    return action.payload.friends;
  } else {
    return state;
  }
};
