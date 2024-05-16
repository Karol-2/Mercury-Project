import { describe, expect, test } from "vitest";

import { fetchData } from "../src/misc/fetchData.js";
import User from "../src/models/User.js";

let userId: number;
let page: number = 3;
let maxUsers: number = 5;

const userMail1 = "bconford2@wikimedia.org";
const userPassword1 = "heuristic";

const userMail2 = "cruckman3@archive.org";
const userPassword2 = "coreCar0l;";

const getFirstUser = async () => {
  const response = await fetchData(`http://localhost:5000/users`, "GET", {});
  userId = response.users.find(
    (user: User) => user.mail === "bconford2@wikimedia.org",
  ).id;
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

await getFirstUser();
const token1 = await getKeycloakToken(userMail1, userPassword1);
const token2 = await getKeycloakToken(userMail2, userPassword2);

describe("Get friend suggestions", () => {
  test("without token", async () => {
    const { status } = await fetchData(
      `http://localhost:5000/users/${userId}/friend-suggestions` +
        `?page=${page}&maxUsers=${maxUsers}`,
      "GET",
      {},
    );
    expect(status).toBe("unauthorized");
  });

  test("with incorrect token", async () => {
    const { status } = await fetchData(
      `http://localhost:5000/users/${userId}/friend-suggestions` +
        `?page=${page}&maxUsers=${maxUsers}`,
      "GET",
      {},
      token2,
    );
    expect(status).toBe("forbidden");
  });

  // test("incorrect ID", async () => {
  //   const response = await fetchData(
  //     `http://localhost:5000/users/0/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
  //     "GET",
  //     {},
  //     token1
  //   );

  //   const { status, errors } = response;

  //   expect(status).toBe("error");
  //   expect(errors).toBeDefined();
  //   expect(errors.id).toBe("not found");
  // });

  test("correct", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
      "GET",
      {},
      token1,
    );

    const { status, pageCount, friendSuggestions } = response;

    expect(status).toBe("ok");
    expect(pageCount).toBe(3);
    expect(friendSuggestions).toBeDefined();
    expect(friendSuggestions.length).toBe(3);
  });

  test("first user", async () => {
    page = 1;
    maxUsers = 1;
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
      "GET",
      {},
      token1,
    );

    const { status, pageCount, friendSuggestions } = response;

    expect(status).toBe("ok");
    expect(pageCount).toBe(13);
    expect(friendSuggestions).toBeDefined();
    expect(friendSuggestions.length).toBe(1);
  });
});

describe("Pagination parameters", () => {
  test("missing page", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friend-suggestions?maxUsers=${maxUsers}`,
      "GET",
      {},
      token1,
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.page).toBe("Invalid input");
  });

  test("missing maxUsers", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}`,
      "GET",
      {},
      token1,
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.maxUsers).toBe("Invalid input");
  });

  test("missing page and maxUsers", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friend-suggestions`,
      "GET",
      {},
      token1,
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.page).toBe("Invalid input");
    expect(errors.maxUsers).toBe("Invalid input");
  });

  test("maxUsers as a text", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friend-suggestions?page=text?page=${page}&maxUsers=text`,
      "GET",
      {},
      token1,
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.maxUsers).toBe("Expected number, received nan");
  });

  test("maxUsers equals 0", async () => {
    maxUsers = 0;
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
      "GET",
      {},
      token1,
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.maxUsers).toBe("Number must be greater than or equal to 1");
  });
});
