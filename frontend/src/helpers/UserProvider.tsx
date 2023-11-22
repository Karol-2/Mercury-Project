import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import { isExpired, decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { fetchData } from "../services/fetchData";
import User from "../models/user.model";

export interface UserContextValue {
  userId: string | null;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (mail: string, password: string) => Promise<void>;
  updateUser: () => Promise<boolean>;
  deleteUser: () => Promise<boolean>;
}

const UserContext = createContext<UserContextValue | null>(null);

function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<object | null>(null);
  const firstRefresh = useRef(true);

  const trySetToken = (tokenStr: string | null): boolean => {
    if (tokenStr) {
      const decodedToken = decodeToken(tokenStr);
      if (decodedToken && !isExpired(tokenStr)) {
        setToken(decodedToken);
        return true;
      }
    }
    return false;
  };

  const getAccessToken = async () => {
    // Try to use access token from session storage
    const tokenStr = sessionStorage.getItem("token");
    if (trySetToken(tokenStr)) {
      return;
    }

    // Try to use refresh token from cookies
    const refreshTokenStr = Cookies.get("refreshToken");
    if (!refreshTokenStr) return;

    const response = await fetchData("/auth/refresh", "POST", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    trySetToken(response.token);
  };

  const login = async (mail: string, password: string) => {
    if (userId) return;

    const response = await fetchData("/auth/login", "POST", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mail,
        password,
      }),
    });

    if (response.status != "ok") {
      setUserId("");
      return;
    }

    sessionStorage.setItem("token", response.token);
    setToken(decodeToken(response.token));
  };

  const updateUser = async () => {
    if (!user) return false;

    const response = await fetchData(`/users/${user.id}`, "PUT", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (response.status === "ok") {
      return true;
    }

    console.error("Error from the server", response.errors);
    return false;
  };

  const deleteUser = async () => {
    if (!user) return true;

    const response = await fetchData(`/users/${user.id}`, "DELETE");
    if (response.status === "ok") {
      setUser(null);
      return true;
    }

    console.error("Error from the server", response.errors);
    return false;
  };

  useEffect(() => {
    if (token) {
      const newUserId = (token as any).userId;
      fetchData(`/users/${newUserId}`, "GET").then((response) => {
        setUser(response.user as any);
        setUserId(newUserId);
      });
    }
  }, [token]);

  if (firstRefresh.current) {
    firstRefresh.current = false;
    getAccessToken();
  }

  return (
    <UserContext.Provider
      value={{ userId, user, setUser, login, updateUser, deleteUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { useUser };
export default UserProvider;
