import { describe, expect, test } from "vitest";

import { fetchData } from "../src/misc/fetchData.js";
import User from "../src/models/User.js";

let page: number = 1;
let maxUsers: number = 1;
let userId: string = "";
let userId2: string = "";

const userMail1 = "bconford2@wikimedia.org";
const userPassword1 = "heuristic";

const userMail2 = "cruckman3@archive.org";
const userPassword2 = "coreCar0l;";

const getUsers = async () => {
  const response = await fetchData(`http://localhost:5000/users`, "GET", {});
  userId = response.users.find((user: User) => user.mail === userMail1).id;
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

const sendFriendRequest = async (
  userId1: string,
  userId2: string,
  token?: string,
) => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId1}/send-friend-request/${userId2}`,
    "POST",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
    token,
  );

  return response;
};

const declineFriendRequest = async (
  userId1: string,
  userId2: string,
  token?: string,
) => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId1}/decline-friend-request/${userId2}`,
    "POST",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
    token,
  );

  return response;
};

const acceptFriendRequest = async (
  userId1: string,
  userId2: string,
  token?: string,
) => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId1}/accept-friend-request/${userId2}`,
    "POST",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
    token,
  );

  return response;
};

const deleteFriend = async (
  userId1: string,
  userId2: string,
  token?: string,
) => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId1}/delete-friend/${userId2}`,
    "DELETE",
    {},
    token,
  );

  return response;
};

describe("Get current requests", () => {
  test("correct", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friend-requests?page=${page}&maxUsers=${maxUsers}`,
      "GET",
      {},
    );

    const { status, pageCount, friendRequests } = response;

    expect(status).toBe("ok");
    expect(pageCount).toBe(0);
    expect(friendRequests.length).toBe(0);
  });

  test("incorrect ID", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/0/friend-requests?page=${page}&maxUsers=${maxUsers}`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.id).toBe("not found");
  });
});

describe("Pagination parameters", () => {
  test("missing page", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friend-requests?maxUsers=${maxUsers}`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.page).toBe("Invalid input");
  });

  test("missing maxUsers", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friend-requests?page=${page}`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.maxUsers).toBe("Invalid input");
  });

  test("missing page and maxUsers", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friend-requests`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.page).toBe("Invalid input");
    expect(errors.maxUsers).toBe("Invalid input");
  });

  test("maxUsers as a text", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friend-requests?page=text?page=${page}&maxUsers=text`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.maxUsers).toBe("Expected number, received nan");
  });

  test("maxUsers equals 0", async () => {
    maxUsers = 0;
    const response = await fetchData(
      `http://localhost:5000/users/${userId}/friend-requests?page=${page}&maxUsers=${maxUsers}`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.maxUsers).toBe("Number must be greater than or equal to 1");
  });
});

describe("Send friend request", () => {
  test("without token", async () => {
    const { status } = await sendFriendRequest(userId, userId2);
    expect(status).toBe("unauthorized");
  });

  test("with incorrect token", async () => {
    const { status } = await sendFriendRequest(userId, userId2, token2);
    expect(status).toBe("forbidden");
  });

  test("correct", async () => {
    const { status } = await sendFriendRequest(userId, userId2, token1);
    expect(status).toBe("ok");
  });

  test("incorrect id", async () => {
    const { status, errors } = await sendFriendRequest(userId, "0", token1);

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.userId2).toBe("not found");
  });
});

describe("Decline friend request", () => {
  test("without token", async () => {
    const { status } = await declineFriendRequest(userId2, userId);
    expect(status).toBe("unauthorized");
  });

  test("with incorrect token", async () => {
    const { status } = await declineFriendRequest(userId2, userId, token1);
    expect(status).toBe("forbidden");
  });

  test("correct", async () => {
    const { status } = await declineFriendRequest(userId2, userId, token2);
    expect(status).toBe("ok");
  });

  test("incorrect id", async () => {
    const { status, errors } = await declineFriendRequest(userId2, "0", token2);

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.userId2).toBe("not found");
  });

  test("not invited", async () => {
    const { status, errors } = await declineFriendRequest(
      userId2,
      userId,
      token2,
    );

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.userId1).toBe("not invited");
  });
});

describe("Accept friend request", () => {
  test("without token", async () => {
    const { status } = await acceptFriendRequest(userId2, userId);
    expect(status).toBe("unauthorized");
  });

  test("with incorrect token", async () => {
    const { status } = await acceptFriendRequest(userId2, userId, token1);
    expect(status).toBe("forbidden");
  });

  test("incorrect id", async () => {
    const response = await acceptFriendRequest(userId, "0", token1);
    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.userId2).toBe("not found");
  });

  test("not invited", async () => {
    const { status, errors } = await acceptFriendRequest(
      userId2,
      userId,
      token2,
    );

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.userId1).toBe("not invited");
  });

  test("correct", async () => {
    await sendFriendRequest(userId, userId2, token1);

    const { status } = await acceptFriendRequest(userId2, userId, token2);
    expect(status).toBe("ok");

    const friendsResponse = await fetchData(
      `http://localhost:5000/users/${userId2}/friends?page=1&maxUsers=10`,
      "GET",
      {},
      token2,
    );

    const friend = friendsResponse.friends.find(
      (user: User) => user.id == userId,
    );

    expect(friend).toBeDefined();
  });
});

describe("Delete friend", () => {
  test("without token", async () => {
    const { status } = await deleteFriend(userId2, userId);
    expect(status).toBe("unauthorized");
  });

  test("with incorrect token", async () => {
    const { status } = await deleteFriend(userId2, userId, token1);
    expect(status).toBe("forbidden");
  });

  test("incorrect id", async () => {
    const response = await deleteFriend(userId, "0", token1);
    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.userId2).toBe("not found");
  });

  test("correct", async () => {
    const { status } = await deleteFriend(userId2, userId, token2);
    expect(status).toBe("ok");
  });
});
