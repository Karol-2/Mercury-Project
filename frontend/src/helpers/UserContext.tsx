import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import User, { FrontendUser } from "../models/User";
import UserState from "../models/UserState";

export interface UserContextValue {
  provider: string;
  user: User | null;
  userState: UserState;
  token?: string;
  socket: Socket | null;
  login: (mail: string, password: string) => Promise<void>;
  redirectToLogin: () => void;
  logout: () => Promise<boolean>;
  registerUser: (user: FrontendUser) => Promise<FrontendUser>;
  updateUser: (updateUser: Partial<User>) => Promise<boolean>;
  deleteUser: () => Promise<boolean>;
  friends: Record<string, User>;
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
