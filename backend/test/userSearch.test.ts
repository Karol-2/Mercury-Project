import { expect, test } from "vitest";

let userId: number;
let page: number = 1;
let maxUsers: number = 1;

test("Search all users", async () => {
  const response = await fetch("http://localhost:5000/users/search?q=a");

  const responseData = await response.json();
  const users = responseData.users;
  const status = responseData.status;

  expect(status).toBe("ok");
  expect(users.length).toBe(27);

  userId = users[0][0].id;
});

test("Search all users from Poland", async () => {
  const response = await fetch(
    "http://localhost:5000/users/search?country=Poland",
  );

  const responseData = await response.json();
  const users = responseData.users;
  const status = responseData.status;

  expect(status).toBe("ok");
  expect(users.length).toBe(3);
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
  expect(users[0][0].country).toBe("Lithuania");
});

test("Not found user", async () => {
  const response = await fetch(
    `http://localhost:5000/users/search?country=Germany`,
  );

  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("error");
});
