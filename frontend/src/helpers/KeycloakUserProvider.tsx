import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import dataService from "../services/data";
import User from "../models/User";
import { Socket, io } from "socket.io-client";
import UserContext from "./UserContext";
import UserState from "../models/UserState";
import Keycloak from "keycloak-js";

function KeycloakUserProvider({ children }: { children: React.ReactNode }) {
  const [userState, setUserState] = useState<UserState>({ status: "loading" });
  const user = useMemo(
    () => (userState.status == "logged_in" ? userState.user : null),
    [userState],
  );
  const [socket, setSocket] = useState<Socket | null>(null);

  const keycloakRef = useRef<Keycloak | null>(null);

  const updateUserData = async () => {
    const keycloak = keycloakRef.current!;
    const tokenDecoded: any = await keycloak.loadUserInfo();

    const userId = tokenDecoded.sub
    const searchParams = new URLSearchParams({issuer: "mercury"})

    const response = await dataService.fetchData(`/users/${userId}?${searchParams}`, "GET");
    if (response.status != "ok") {
      console.error("Couldn't fetch user data: ", response)
      return
    }

    setUserLoggedIn(response.user)
  };

  useEffect(() => {
    if (keycloakRef.current) {
      return;
    }

    const keycloak = new Keycloak({
      url: "http://localhost:3000",
      realm: "mercury",
      clientId: "mercury-client",
    });
    keycloak.onAuthSuccess = () => updateUserData();

    keycloakRef.current = keycloak;
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

  const redirectToLogin = () => {
    if (!keycloakRef.current) {
      return;
    }

    const keycloak = keycloakRef.current;
    keycloak.login();
  };

  const login = async (_mail: string, _password: string) => {
    if (userState.status == "logged_in") return;
    redirectToLogin();
  };

  const logout = async () => {
    if (userState.status == "anonymous") return true;
    if (!keycloakRef.current) {
      return true;
    }

    const keycloak = keycloakRef.current;
    keycloak.logout();
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
