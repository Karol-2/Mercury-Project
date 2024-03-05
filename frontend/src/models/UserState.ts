import User from "./User";

export type AnonymousUserState = {
  status: "anonymous";
}

export type LoadingUserState = {
  status: "loading";
}

export type LoggedInUserState = {
  status: "logged_in";
  user: User;
}

type UserState = LoadingUserState | AnonymousUserState | LoggedInUserState;

export default UserState;
