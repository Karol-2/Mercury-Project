import { describe, expect, test } from "vitest";

import { fetchData } from "../src/misc/fetchData.js";
import User from "../src/models/User.js";

let userId1: string = "";
let userId2: string = "";

const userMail1 = "bconford2@wikimedia.org";
const userPassword1 = "heuristic";

const userMail2 = "cruckman3@archive.org";
const userPassword2 = "coreCar0l;";

const getUsers = async () => {
  const response = await fetchData(`http://localhost:5000/users`, "GET", {});
  userId1 = response.users.find((user: User) => user.mail === userMail1).id;
  userId2 = response.users.find((user: User) => user.mail === userMail2).id;
};

const getKeycloakToken = async (
  mail: string,
  password: string,
): Promise<string> => {
  const urlParams = new URLSearchParams({
    grant_type: "password",
    client_id: "mercury-testing",
    client_secret: "5mwGU0Efyh3cT2WVX7ffA8UAWEAmrBag",
    username: mail,
    password: password,
  });

  const response = await fetchData(
    `http://localhost:3000/realms/mercury/protocol/openid-connect/token`,
    "POST",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlParams,
    },
  );

  return response.access_token;
};

await getUsers();
const token1 = await getKeycloakToken(userMail1, userPassword1);
const token2 = await getKeycloakToken(userMail2, userPassword2);

const getChat = async (userId1: string, userId2: string, token?: string) => {
  const response = await fetchData(
    `http://localhost:5000/chat/${userId1}/${userId2}`,
    "GET",
    {},
    token,
  );

  return response;
};

describe("Get chat messages", () => {
  test("without IDs", async () => {
    const response = await fetch(`http://localhost:5000/chat`);
    const data = response.headers.get("content-type");

    expect(response.status).toBe(404);
    expect(data).toBe("text/html; charset=utf-8");
  });

  test("without token", async () => {
    const { status } = await getChat(userId1, userId2);
    expect(status).toBe("unauthorized");
  });

  test("with incorrect token", async () => {
    const { status } = await getChat(userId1, userId2, token2);
    expect(status).toBe("forbidden");
  });

  test("correct", async () => {
    const { status, messages } = await getChat(userId1, userId2, token1);

    expect(status).toBe("ok");
    expect(messages).toBeDefined();
    expect(messages.length).toBe(0);
  });
});
