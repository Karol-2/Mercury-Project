import React, { useState, useEffect, useRef, useMemo } from "react";
import { isExpired, decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import dataService from "../services/data";
import User, { FrontendUser } from "../models/User";
import { Socket, io } from "socket.io-client";
import UserContext from "./UserContext";
import UserState from "../models/UserState";
import { useNavigate } from "react-router-dom";

function RestUserProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const provider = "rest";

  const [userState, setUserState] = useState<UserState>({ status: "loading" });
  const user = useMemo(
    () => (userState.status == "logged_in" ? userState.user : null),
    [userState],
  );
  const [token, setToken] = useState<object | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const setUserAnonymous = () => {
    setUserState({ status: "anonymous" });
  };

  const setUserLoggedIn = (user: User) => {
    setUserState({ status: "logged_in", user });
  };

  useEffect(() => {
    if (userState.status != "logged_in") {
      setSocket(null);
      return;
    }
    if (socket && socket.connected) return;

    const userId = userState.user.id;
    setSocket(io("http://localhost:5000", { auth: { userId } }));
  }, [userState]);

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

    setUserAnonymous();
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  const login = async (mail: string, password: string) => {
    if (userState.status == "logged_in") return;

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
      setUserAnonymous();
      return;
    }

    sessionStorage.setItem("token", response.token);
    setToken(decodeToken(response.token));
  };

  const logout = async () => {
    if (userState.status == "anonymous") return true;

    const tokenStr = sessionStorage.getItem("token");

    const data = await dataService.fetchData("/auth/logout", "POST", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenStr}`,
      },
    });

    if (data.status == "ok") {
      setUserAnonymous();
      sessionStorage.removeItem("token");
      socket?.disconnect();
      return true;
    }

    return false;
  };

  const registerUser = async (user: FrontendUser): Promise<FrontendUser> => {
    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw response;
    }

    const userJson = await response.json();
    console.log("Register " + JSON.stringify(userJson));

    return userJson.user;
  };

  const updateUser = async (updateUser: Partial<User>) => {
    if (userState.status != "logged_in") return false;

    const user = { ...userState.user, ...updateUser };
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
    if (userState.status != "logged_in") return true;

    const user = userState.user!;
    const response = await dataService.fetchData(`/users/${user.id}`, "DELETE");

    if (response.status === "ok") {
      setUserAnonymous();
      return true;
    }

    console.error("Error from the server", response.errors);
    return false;
  };

  useEffect(() => {
    if (token) {
      const newUserId = (token as any).userId;
      dataService.fetchData(`/users/${newUserId}`, "GET").then((response) => {
        setUserLoggedIn(response.user);
      });
    }
  }, [token]);

  if (firstRefresh.current) {
    firstRefresh.current = false;
    getAccessToken();
  }

  useEffect(() => {
    console.log(userState);
  }, [userState]);

  return (
    <UserContext.Provider
      value={{
        provider,
        user,
        userState,
        socket,
        redirectToLogin,
        login,
        logout,
        registerUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default RestUserProvider;
