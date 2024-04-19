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
  expect(pageCount).toBe(10);
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

  const { status, pageCount, friendRequests } = response;

  expect(status).toBe("ok");
  expect(pageCount).toBe(10);
  expect(friendRequests.length).toBe(0);
});

test("Send invite", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/add/${userId2}`,
    "POST",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  const { status, friends } = response;

  expect(status).toBe("ok");
  expect(friends).toBeDefined();
});

test("Send invite with incorrect id", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/add/0`,
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
  expect(errors.id).toBe("not found");
});

test("Accept invite", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/accept/${userId2}`,
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
    `http://localhost:5000/users/${userId}/friends?page=1&maxUsers=10`,
    "GET",
    {},
  );

  const friend = friendsResponse.friends.find(
    (user: User) => user.id == userId2,
  );

  expect(friend).toBeDefined();
});

test("Accept invite with incorrect id", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/accept/0`,
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
  expect(errors.id).toBe("not found");
});

test("Delete relations", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/remove/${userId2}`,
    "DELETE",
    {},
  );

  const { status } = response;

  expect(status).toBe("ok");
});

test("Delete relations with incorrect id", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/remove/0`,
    "DELETE",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors).toBeDefined();
  expect(errors.id).toBe("not found");
});
