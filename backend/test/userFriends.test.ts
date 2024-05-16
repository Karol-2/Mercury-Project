import { describe, expect, test } from "vitest";

import { fetchData } from "../src/misc/fetchData.js";
import User from "../src/models/User.js";

let page: number = 1;
let maxUsers: number = 10;
let userId: string = "";

const userMail1 = "bconford2@wikimedia.org";
const userPassword1 = "heuristic";

const userMail2 = "cruckman3@archive.org";
const userPassword2 = "coreCar0l;";

const getFirstUser = async () => {
  const response = await fetchData(`http://localhost:5000/users`, "GET", {});
  userId = response.users.find((user: User) => user.mail === userMail1).id;
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

describe("Get friends", () => {
  test("without token", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friends?page=${page}&maxUsers=${maxUsers}`,
      "GET",
      {},
    );

    const { status } = response;
    expect(status).toBe("unauthorized");
  });

  test("with incorrect token", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friends?page=${page}&maxUsers=${maxUsers}`,
      "GET",
      {},
      token2,
    );

    const { status } = response;
    expect(status).toBe("forbidden");
  });

  // test("incorrect ID", async () => {
  //   const response = await fetchData(
  //     `http://localhost:5000/users/0/friends?page=${page}&maxUsers=${maxUsers}`,
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
      `http://localhost:5000/users/${userId}/friends?page=${page}&maxUsers=${maxUsers}`,
      "GET",
      {},
      token1,
    );

    const { status, pageCount, friends } = response;

    expect(status).toBe("ok");
    expect(pageCount).toBe(1);
    expect(friends.length).toBe(9);
  });

  test("first user", async () => {
    page = 1;
    maxUsers = 1;
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friends?page=${page}&maxUsers=${maxUsers}`,
      "GET",
      {},
      token1,
    );

    const { status, pageCount, friends } = response;

    expect(status).toBe("ok");
    expect(pageCount).toBe(9);
    expect(friends.length).toBe(1);
    expect(friends[0].country).toBe("CN");
    expect(friends[0].mail).toBe("tshillitoe@state.gov");
    expect(friends[0].first_name).toBe("Trever");
    expect(friends[0].last_name).toBe("Shillito");
  });
});

describe("Pagination parameters", () => {
  test("missing page", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friends?maxUsers=${maxUsers}`,
      "GET",
      {},
      token1,
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.page).toBe("Invalid input");
  });

  test("page as a text", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friends?page=text?maxUsers=${maxUsers}`,
      "GET",
      {},
      token1,
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.page).toBe("Expected number, received nan");
  });

  test("missing maxUsers", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friends?page=${page}`,
      "GET",
      {},
      token1,
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.maxUsers).toBe("Invalid input");
  });

  test("maxUsers as a text", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friends?page=text?page=${page}&maxUsers=text`,
      "GET",
      {},
      token1,
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.maxUsers).toBe("Expected number, received nan");
  });

  test("missing page and maxUsers", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friends`,
      "GET",
      {},
      token1,
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.page).toBe("Invalid input");
    expect(errors.maxUsers).toBe("Invalid input");
  });

  test("maxUsers equals 0", async () => {
    maxUsers = 0;
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friends?page=${page}&maxUsers=${maxUsers}`,
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
