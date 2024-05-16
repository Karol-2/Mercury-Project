import Keycloak from "keycloak-js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

import User, { FrontendUser } from "../models/User";
import UserState from "../models/UserState";
import dataService from "../services/data";
import UserContext from "./UserContext";

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
  const [friends, setFriends] = useState<Record<string, User>>({});

  const fetchFriendsPage = async (
    userId: number,
    page: number,
    token: string,
  ): Promise<User[] | null> => {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      maxUsers: "32",
    });
    const friendsResponse = await dataService.fetchData(
      `/users/${userId}/friends?${searchParams}`,
      "GET",
      {},
      token,
    );
    if (friendsResponse.status != "ok") {
      console.error("Couldn't fetch friends: ", friendsResponse);
      return null;
    }

    return friendsResponse.friends;
  };

  const fetchFriends = async (
    userId: number,
    token: string,
  ): Promise<User[] | null> => {
    let friends = [];
    let pageEmpty = false;
    let page = 1;

    while (!pageEmpty) {
      const friendsPage = await fetchFriendsPage(userId, page, token);
      if (friendsPage === null) {
        return null;
      }

      if (friendsPage.length > 0) {
        friends.push(...friendsPage);
        page += 1;
      } else {
        pageEmpty = true;
      }
    }

    return friends;
  };

  const friendsToObject = (friends: User[]): Record<string, User> => {
    return Object.fromEntries(friends.map((f) => [f.id, f]));
  };

  const updateUserData = async (token: string) => {
    const keycloak = keycloakRef.current!;
    const tokenDecoded: any = await keycloak.loadUserInfo();

    const keycloakUserId = tokenDecoded.sub;
    const searchParams = new URLSearchParams({ issuer: "mercury" });

    const response = await dataService.fetchData(
      `/users/${keycloakUserId}?${searchParams}`,
      "GET",
    );
    if (response.status != "ok") {
      console.error("Couldn't fetch user data: ", response);
      return;
    }

    const userId = response.user.id;
    const newFriendsArray = (await fetchFriends(userId, token)) || [];
    const newFriends = friendsToObject(newFriendsArray);
    setFriends(newFriends);
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
    keycloakRef.current = keycloak;

    keycloak.onAuthSuccess = () => {
      setToken(keycloak.token);
      updateUserData(keycloak.token!);
    };
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
    const response = await dataService.fetchData(
      `/users/${user.id}`,
      "PUT",
      {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      },
      token,
    );

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
    const response = await dataService.fetchData(
      `/users/${user.id}`,
      "DELETE",
      {},
      token,
    );

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
        friends,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default KeycloakUserProvider;
