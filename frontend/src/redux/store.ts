import { combineReducers, createStore } from "redux";
import friendsReducer from "./reducers/friendsReducer";
import notificationsReducer from "./reducers/notificationsReducer";

const rootReducer = combineReducers({
  friends: friendsReducer,
  notifications: notificationsReducer
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
