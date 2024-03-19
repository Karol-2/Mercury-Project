import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import User from "../models/User";
import UserState from "../models/UserState";

export interface UserContextValue {
  user: User | null;
  userState: UserState;
  socket: Socket | null;
  // setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
  login: (mail: string, password: string) => Promise<void>;
  redirectToLogin: () => void;
  logout: () => Promise<boolean>;
  updateUser: (updateUser: Partial<User>) => Promise<boolean>;
  deleteUser: () => Promise<boolean>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

export default UserContext;