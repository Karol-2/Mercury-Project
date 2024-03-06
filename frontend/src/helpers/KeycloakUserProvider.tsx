import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { isExpired, decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import dataService from "../services/data";
import User from "../models/User";
import { Socket, io } from "socket.io-client";
import UserContext from "./UserContext";
import UserState from "../models/UserState";
import Keycloak from "keycloak-js";

function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

function KeycloakUserProvider({ children }: { children: React.ReactNode }) {
  const [userState, setUserState] = useState<UserState>({ status: "loading" });
  const user = useMemo(
    () => (userState.status == "logged_in" ? userState.user : null),
    [userState],
  );
  const [token, setToken] = useState<object | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const keycloakRef = useRef<Keycloak | null>();

  useEffect(() => {
    if (keycloakRef.current) {
      return;
    }

    keycloakRef.current = new Keycloak({
      url: "http://localhost:3000",
      realm: "mercury-realm",
      clientId: "mercury-client",
    });
  });

  useEffect(() => {
    const setupKeycloak = async () => {
      if (keycloakRef.current !== null) {
        const keycloak = keycloakRef.current;

        try {
          const authenticated = await keycloak.init({});

          if (!authenticated) {
            setUserAnonymous();
          }

          console.log(
            `User is ${authenticated ? "authenticated" : "not authenticated"}`,
          );
        } catch (e) {
          console.error("Failed to initialize adapter:", e);
        }
      }
    };

    setupKeycloak();
  }, []);

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

  // const trySetToken = (tokenStr: string | null): boolean => {
  //   if (tokenStr) {
  //     const decodedToken = decodeToken(tokenStr);

  //     if (decodedToken && !isExpired(tokenStr)) {
  //       setToken(decodedToken);
  //       return true;
  //     }
  //   }

  //   return false;
  // };

  // const getAccessToken = async () => {
  //   // Try to use access token from session storage
  //   const tokenStr = sessionStorage.getItem("token");
  //   if (trySetToken(tokenStr)) {
  //     return;
  //   }

  //   // Try to use refresh token from cookies
  //   const refreshTokenStr = Cookies.get("refreshToken");
  //   if (refreshTokenStr) {
  //     const response = await dataService.fetchData("/auth/refresh", "POST", {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (trySetToken(response.token)) {
  //       return;
  //     }
  //   }

  //   setUserAnonymous();
  // };

  const redirectToLogin = () => {
    if (!keycloakRef.current) {
      return;
    }

    const keycloak = keycloakRef.current;
    keycloak.login();
  };

  const login = async (mail: string, password: string) => {
    if (userState.status == "logged_in") return;
    redirectToLogin();

    // const response = await dataService.fetchData("/auth/login", "POST", {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     mail,
    //     password,
    //   }),
    // });

    // if (response.status != "ok") {
    //   setUserAnonymous();
    //   return;
    // }

    // sessionStorage.setItem("token", response.token);
    // setToken(decodeToken(response.token));
  };

  const logout = async () => {
    if (userState.status == "anonymous") return true;
    if (!keycloakRef.current) {
      return true;
    }

    const keycloak = keycloakRef.current;
    keycloak.logout();
    // const tokenStr = sessionStorage.getItem("token");

    // const data = await dataService.fetchData("/auth/logout", "POST", {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${tokenStr}`,
    //   },
    // });

    // if (data.status == "ok") {
    //   setUserAnonymous();
    //   sessionStorage.removeItem("token");
    //   socket?.disconnect();
    //   return true;
    // }

    return true;
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

  // if (firstRefresh.current) {
  //   firstRefresh.current = false;
  //   getAccessToken();
  // }

  useEffect(() => {
    console.log(userState);
  }, [userState]);

  return (
    <UserContext.Provider
      value={{
        user,
        userState,
        socket,
        login,
        redirectToLogin,
        logout,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default KeycloakUserProvider;
