import FriendsAction from "./action-models/FriendsAction";
export default (state = [], action: FriendsAction) => {
  if (action.type === "SET_USER_FRIENDS") {
    return action.payload.friends;
  } else {
    return state;
  }
};
