import { expect, test } from "vitest";
import { fetchData } from "./fetchData.js";

let userId: number;
let page: number = 3;
let maxUsers: number = 5;

test("Search user", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/search?q=a&page=1&maxUsers=10`,
    "GET",
    {},
  );

  const users = response.users;
  const status = response.status;

  expect(status).toBe("ok");

  userId = users[0].id;
});

test("Get friends", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friends?page=1&maxUsers=10`,
    "GET",
    {},
  );

  const friends = response.friends;
  const status = response.status;

  expect(status).toBe("ok");
  expect(friends.length).toBe(6);
});

test("Missing page", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friends?maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const status = response.status;

  expect(status).toBe("error");
});

test("Missing maxUsers", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friends?page=${page}`,
    "GET",
    {},
  );

  const status = response.status;

  expect(status).toBe("error");
});

test("First user", async () => {
  page = 1;
  maxUsers = 1;
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friends?page=${page}&maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const status = response.status;
  const friends = response.friends;

  expect(status).toBe("ok");
  expect(friends.length).toBe(1);
});
