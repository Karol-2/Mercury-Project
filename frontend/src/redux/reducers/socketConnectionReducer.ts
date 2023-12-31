import { io } from "socket.io-client";

export default (state = null, action: any) => {
  if (action.type === "CREATE_SOCKET_CONNECTION") {
    const userId = action.payload.userId;
    return io("http://localhost:5000", { auth: { userId } });
  } else {
    return state;
  }
};
