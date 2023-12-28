import { combineReducers, createStore } from "redux";
import socketConnectionReducer from "./reducers/socketConnectionReducer";
import friendsReducer from "./reducers/friendsReducer";

const rootReducer = combineReducers({
  socket: socketConnectionReducer,
  friends: friendsReducer
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
