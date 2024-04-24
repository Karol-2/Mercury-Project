import { expect, test } from "vitest";
import { fetchData } from "./fetchData.js";
import User from "../src/models/User.js";

let page: number = 1;
let maxUsers: number = 1;
let userId: string = "";
let userId2: string = "";

const getUsers = async () => {
  const response = await fetchData(`http://localhost:5000/users`, "GET", {});
  userId = response.users[0].id;
  userId2 = response.users[1].id;
};

await getUsers();

test("Check current requests", async () => {
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

test("Check current requests with incorrect ID", async () => {
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

test("Missing page", async () => {
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

test("Missing maxUsers", async () => {
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

test("Missing page and maxUsers", async () => {
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

test("Send invite", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/send-friend-request/${userId2}`,
    "POST",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  const { status } = response;

  expect(status).toBe("ok");
});

test("Send invite with incorrect id", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/send-friend-request/0`,
    "POST",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors).toBeDefined();
  expect(errors.userId2).toBe("not found");
});

test("Decline friend request", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/decline-friend-request/${userId2}`,
    "POST",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  const { status } = response;

  expect(status).toBe("ok");
});

test("Decline friend request with incorrect id", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/decline-friend-request/0`,
    "POST",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors).toBeDefined();
  expect(errors.userId2).toBe("not found");
});

test("Accept not invited friend request", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/accept-friend-request/${userId2}`,
    "POST",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors).toBeDefined();
  expect(errors.userId1).toBe("not invited");
});

test("Accept invite", async () => {
  await fetchData(
    `http://localhost:5000/users/${userId}/send-friend-request/${userId2}`,
    "POST",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  const response = await fetchData(
    `http://localhost:5000/users/${userId2}/accept-friend-request/${userId}`,
    "POST",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  const { status } = response;

  expect(status).toBe("ok");

  const friendsResponse = await fetchData(
    `http://localhost:5000/users/${userId2}/friends?page=1&maxUsers=10`,
    "GET",
    {},
  );

  const friend = friendsResponse.friends.find(
    (user: User) => user.id == userId,
  );

  expect(friend).toBeDefined();
});

test("Accept invite with incorrect id", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/accept-friend-request/0`,
    "POST",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors).toBeDefined();
  expect(errors.userId2).toBe("not found");
});

test("Decline friend request when not invited", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId2}/decline-friend-request/${userId}`,
    "POST",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors).toBeDefined();
  expect(errors.userId1).toBe("not invited");
});

test("Delete friend", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId2}/delete-friend/${userId}`,
    "DELETE",
    {},
  );

  const { status } = response;

  expect(status).toBe("ok");
});

test("Delete friend with incorrect id", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/delete-friend/0`,
    "DELETE",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors).toBeDefined();
  expect(errors.userId2).toBe("not found");
});
