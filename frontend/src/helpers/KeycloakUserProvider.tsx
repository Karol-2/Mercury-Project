import React, { useState, useEffect, useRef, useMemo } from "react";
import dataService from "../services/data";
import User, { FrontendUser } from "../models/User";
import { Socket, io } from "socket.io-client";
import UserContext from "./UserContext";
import UserState from "../models/UserState";
import Keycloak from "keycloak-js";
import { useNavigate } from "react-router-dom";
import socketListeners from "../socket/socketListeners";

function KeycloakUserProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const provider = "keycloak";
  const [userState, setUserState] = useState<UserState>({ status: "loading" });
  const user = useMemo(
    () => (userState.status == "logged_in" ? userState.user : null),
    [userState],
  );
  const [socket, setSocket] = useState<Socket | null>(null);

  const keycloakRef = useRef<Keycloak | null>(null);
  const [token, setToken] = useState<string | undefined>();

  const updateUserData = async () => {
    const keycloak = keycloakRef.current!;
    const tokenDecoded: any = await keycloak.loadUserInfo();

    const userId = tokenDecoded.sub;
    const searchParams = new URLSearchParams({ issuer: "mercury" });

    const response = await dataService.fetchData(
      `/users/${userId}?${searchParams}`,
      "GET",
    );
    if (response.status != "ok") {
      console.error("Couldn't fetch user data: ", response);
      return;
    }

    setUserLoggedIn(response.user);
  };

  useEffect(() => {
    if (keycloakRef.current) {
      return;
    }

    const keycloak = new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_URI,
      realm: "mercury",
      clientId: "mercury-client",
    });
    keycloak.onAuthSuccess = () => {
      updateUserData();
      setToken(keycloak.token);
    };

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

  useEffect(() => {
    if (socket !== null) {
      socketListeners(socket);
    }
  }, [socket]);

  const redirectToLogin = () => {
    if (!keycloakRef.current) {
      return;
    }

    const keycloak = keycloakRef.current;
    keycloak.login({ redirectUri: "http://localhost:5173/profile" });
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
    keycloak.logout({ redirectUri: "http://localhost:5173" });
    return true;
  };

  const registerUser = async (user: FrontendUser): Promise<FrontendUser> => {
    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...user, issuer: "mercury" }),
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
      setUserLoggedIn(user);
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

      if (keycloakRef.current) {
        navigate("/");
      }

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
        provider,
        user,
        userState,
        token,
        socket,
        login,
        redirectToLogin,
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

export default KeycloakUserProvider;
