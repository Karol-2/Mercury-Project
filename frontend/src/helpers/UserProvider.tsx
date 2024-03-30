import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import { isExpired, decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import dataService from "../services/data";
import User from "../models/User";
import { Socket, io } from "socket.io-client";
import Meeting from "../models/Meeting";

export interface UserContextValue {
  userId: string | null | undefined;
  user: User | null | undefined;
  socket: Socket | null;
  meeting: Meeting | null;
  friends: User[];
  setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
  login: (mail: string, password: string) => Promise<void>;
  logout: () => Promise<boolean>;
  updateUser: () => Promise<boolean>;
  deleteUser: () => Promise<boolean>;
  createMeeting: () => Promise<string | void>;
  leaveMeeting: () => Promise<void>;
  joinMeeting: (friendId: string) => Promise<string | void>;
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
  // userId:
  // undefined -> user state is loading
  // null -> user not logged in
  // string -> user logged in, userID correct
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [token, setToken] = useState<object | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    if (!user) {
      setSocket(null);
      return;
    }
    if (socket && socket.connected) return;
    setSocket(io("http://localhost:5000", { auth: { userId } }));
  }, [user]);

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
    if (refreshTokenStr) {
      const response = await dataService.fetchData("/auth/refresh", "POST", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (trySetToken(response.token)) {
        return;
      }
    }

    setUserId(null);
  };

  const login = async (mail: string, password: string) => {
    if (userId) return;

    const response = await dataService.fetchData("/auth/login", "POST", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mail,
        password,
      }),
    });

    if (response.status != "ok") {
      setUserId(null);
      return;
    }

    sessionStorage.setItem("token", response.token);
    setToken(decodeToken(response.token));
  };

  const logout = async () => {
    if (!userId) return true;

    const tokenStr = sessionStorage.getItem("token");

    const data = await dataService.fetchData("/auth/logout", "POST", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenStr}`,
      },
    });

    if (data.status == "ok") {
      setUserId(null);
      setUser(null);
      sessionStorage.removeItem("token");
      socket?.disconnect();
      return true;
    }

    return false;
  };

  const updateUser = async () => {
    if (!user) return false;

    const response = await dataService.fetchData(`/users/${user.id}`, "PUT", {
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

    const response = await dataService.fetchData(`/users/${user.id}`, "DELETE");
    if (response.status === "ok") {
      setUserId(null);
      setUser(null);
      return true;
    }

    console.error("Error from the server", response.errors);
    return false;
  };

  const fetchFriends = async () => {
    if (!user) return false;

    const response = await dataService.fetchData(`/users/${user.id}/friends`, "GET");

    if (response.status === "ok") {
      setFriends(response.users);
    }

    console.error("Error from the server", response.errors);
    return false;
  }

  const createMeeting = async () => {
    if (!socket) return;

    const waitForMeeting = new Promise<string>((resolve) => {
      socket.once("createdMeeting", (meeting) => {
        const meetingId = (meeting?.id || "") as string;
        return resolve(meetingId);
      });
    });

    socket.emit("createMeeting");

    const meetingId = await waitForMeeting;
    setMeeting({ id: meetingId, state: "created" });
    return meetingId;
  };

  const joinMeeting = async (friendId: string) => {
    if (!socket) return;

    const waitForMeeting = new Promise<string>((resolve) => {
      socket.once("joinedMeeting", (meeting) => {
        const meetingId = (meeting?.id || "") as string;
        return resolve(meetingId);
      });
    });

    socket.emit("joinMeeting", [friendId]);

    const meetingId = await waitForMeeting;
    setMeeting({ id: meetingId, state: "joined" });
    return meetingId;
  };

  const leaveMeeting = async () => {
    if (!socket) return;

    const waitForLeaveMeeting = new Promise<void>((resolve) => {
      socket.once("leftMeeting", () => {
        return resolve();
      });
    });

    socket.emit("leaveMeeting");

    await waitForLeaveMeeting;
    setMeeting(null);
  };

  useEffect(() => {
    if (token) {
      const newUserId = (token as any).userId;
      dataService.fetchData(`/users/${newUserId}`, "GET").then((response) => {
        setUserId(newUserId);
        setUser(response.user as any);
      });
    }
  }, [token]);

  useEffect(() => {
    fetchFriends();
  }, [userId]);

  if (firstRefresh.current) {
    firstRefresh.current = false;
    getAccessToken();
  }

  useEffect(() => {
    console.log(userId);
  }, [userId]);

  return (
    <UserContext.Provider
      value={{
        userId,
        user,
        setUser,
        socket,
        meeting,
        friends,
        login,
        logout,
        updateUser,
        deleteUser,
        createMeeting,
        joinMeeting,
        leaveMeeting,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { useUser };
export default UserProvider;
