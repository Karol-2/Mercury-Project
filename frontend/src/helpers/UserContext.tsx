import { createContext } from "react";
import { Socket } from "socket.io-client";
import User from "../models/User";

export interface UserContextValue {
  userId: string | null | undefined;
  user: User | null | undefined;
  socket: Socket | null;
  setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
  login: (mail: string, password: string) => Promise<void>;
  logout: () => Promise<boolean>;
  updateUser: () => Promise<boolean>;
  deleteUser: () => Promise<boolean>;
}

const UserContext = createContext<UserContextValue | null>(null);
export default UserContext;
