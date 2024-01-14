import { combineReducers, createStore } from "redux";
import friendsReducer from "./reducers/friendsReducer";

const rootReducer = combineReducers({
  friends: friendsReducer,
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
