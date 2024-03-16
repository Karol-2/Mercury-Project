import { expect, test } from "vitest";

let userId: number;
let page: number = 3;
let maxUsers: number = 5;

test("Search user", async () => {
  const response = await fetch("http://localhost:5000/users/search?q=a");

  const responseData = await response.json();
  const users = responseData.users;
  const status = responseData.status;

  expect(status).toBe("ok");

  userId = users[0][0].id;
});

test("Get friend suggestions", async () => {
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
  );

  const responseData = await response.json();
  const size = responseData.size;
  const status = responseData.status;

  expect(status).toBe("ok");
  expect(size).toBe(15);
});

test("Less users than max on page", async () => {
  maxUsers = 6;
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
  );

  const responseData = await response.json();
  const size = responseData.size;
  const status = responseData.status;
  const users = responseData.users;

  expect(status).toBe("ok");
  expect(size).toBe(15);
  expect(users.length).toBe(3);
});

test("Not found users", async () => {
  maxUsers = 8;
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
  );
  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("not found");
});
