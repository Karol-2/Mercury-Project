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

  userId = users[0].id;
});

test("Get friends", async () => {
  const response = await fetch(`http://localhost:5000/users/${userId}/friends`);

  const responseData = await response.json();
  const users = responseData.users;
  const status = responseData.status;

  expect(status).toBe("ok");
  expect(users.length).toBe(6);
});

test("Missing page", async () => {
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friends?maxUsers=${maxUsers}`,
  );

  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("error");
});

test("Missing maxUsers", async () => {
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friends?page=${page}`,
  );

  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("error");
});

test("First user", async () => {
  page = 1;
  maxUsers = 1;
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friends?page=${page}&maxUsers=${maxUsers}`,
  );

  const responseData = await response.json();
  const status = responseData.status;
  const users = responseData.users;

  expect(status).toBe("ok");
  expect(users.length).toBe(1);
});

test("Not found users", async () => {
  page = 3;
  maxUsers = 3;
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friends?page=${page}&maxUsers=${maxUsers}`,
  );
  const responseData = await response.json();
  const status = responseData.status;
  const message = responseData.errors.users;

  expect(status).toBe("error");
  expect(message).toBe("No friends found with given queries");
});
