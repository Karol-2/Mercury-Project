import { combineReducers, createStore } from "redux";
import callStatusReducer from "./reducers/callStatusReducer";
import streamsReducer from "./reducers/streamsReducer";

const rootReducer = combineReducers({
    callStatus: callStatusReducer,
    streams: streamsReducer
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>