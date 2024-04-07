import { expect, test } from "vitest";
import { fetchData } from "./fetchData.js";

let page: number = 1;
let maxUsers: number = 1;

test("Search all users", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/search?q=a&page=1&maxUsers=100`,
    "GET",
    {},
  );

  const users = response.users;
  const status = response.status;

  expect(status).toBe("ok");
  expect(users.length).toBe(27);
});

test("Search all users from Poland", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/search?page=1&maxUsers=10&country=Poland`,
    "GET",
    {},
  );

  const users = response.users;
  const status = response.status;

  expect(status).toBe("ok");
  expect(users.length).toBe(3);
});

test("Missing page", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/search?q=a&maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const status = response.status;

  expect(status).toBe("error");
});

test("Missing maxUsers", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/search?q=a&page=${page}`,
    "GET",
    {},
  );

  const status = response.status;

  expect(status).toBe("error");
});

test("First user from Lithuania", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/search?country=Lithuania&page=${page}&maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const users = response.users;
  const status = response.status;

  expect(status).toBe("ok");
  expect(users.length).toBe(1);
  expect(users[0].country).toBe("Lithuania");
});

test("Not found user", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/search?country=Germany`,
    "GET",
    {},
  );

  const status = response.status;

  expect(status).toBe("error");
});
