import { createContext } from "react";
import { Socket } from "socket.io-client";
import User from "../models/User";
import UserState from "../models/UserState";

export interface UserContextValue {
  user: User | null;
  userState: UserState;
  socket: Socket | null;
  // setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
  login: (mail: string, password: string) => Promise<void>;
  logout: () => Promise<boolean>;
  updateUser: (updateUser: Partial<User>) => Promise<boolean>;
  deleteUser: () => Promise<boolean>;
}

const UserContext = createContext<UserContextValue | null>(null);
export default UserContext;
