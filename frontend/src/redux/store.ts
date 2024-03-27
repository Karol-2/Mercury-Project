import { combineReducers, createStore } from "redux";
import friendsReducer from "./reducers/friendsReducer";
import notificationsReducer from "./reducers/notificationsReducer";
import peerReducer from "./reducers/peerReducer";

const rootReducer = combineReducers({
  friends: friendsReducer,
  notifications: notificationsReducer,
  peer: peerReducer,
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
