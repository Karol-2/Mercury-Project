import User from "../../../models/User";

type FriendsAction = {
  type: "SET_USER_FRIENDS";
  payload: {
    friends: User[];
  };
};
export default FriendsAction;
