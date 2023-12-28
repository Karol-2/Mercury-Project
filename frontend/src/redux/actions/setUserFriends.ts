import User from "../../models/User";

export default (friends: User[]) => {
    return {
        type: "SET_USER_FRIENDS",
        friends
    }
}