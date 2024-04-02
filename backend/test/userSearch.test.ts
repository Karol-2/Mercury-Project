import { expect, test } from "vitest";

let page: number = 1;
let maxUsers: number = 1;

test("Search all users", async () => {
  const response = await fetch("http://localhost:5000/users/search?q=a&page=1&maxUsers=100");

  const responseData = await response.json();
  const users = responseData.users;
  const status = responseData.status;

  expect(status).toBe("ok");
  expect(users.length).toBe(27);
});

test("Search all users from Poland", async () => {
  const response = await fetch(
    "http://localhost:5000/users/search?page=1&maxUsers=10&country=Poland",
  );

  const responseData = await response.json();
  const users = responseData.users;
  const status = responseData.status;

  expect(status).toBe("ok");
  expect(users.length).toBe(3);
});

test("Missing page", async () => {
  const response = await fetch(
    `http://localhost:5000/users/search?q=a&maxUsers=${maxUsers}`,
  );

  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("error");
});

test("Missing maxUsers", async () => {
  const response = await fetch(
    `http://localhost:5000/users/search?q=a&page=${page}`,
  );

  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("error");
});

test("First user from Lithuania", async () => {
  const response = await fetch(
    `http://localhost:5000/users/search?country=Lithuania&page=${page}&maxUsers=${maxUsers}`,
  );

  const responseData = await response.json();
  const users = responseData.users;
  const status = responseData.status;

  expect(status).toBe("ok");
  expect(users.length).toBe(1);
  expect(users[0].country).toBe("Lithuania");
});

test("Not found user", async () => {
  const response = await fetch(
    `http://localhost:5000/users/search?country=Germany`,
  );

  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("error");
});
