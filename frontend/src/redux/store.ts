import { combineReducers, createStore } from "redux";
import socketConnectionReducer from "./reducers/socketConnectionReducer";

const rootReducer = combineReducers({
  socket: socketConnectionReducer,
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
