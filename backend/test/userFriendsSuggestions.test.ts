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

test("Get friend suggestions", async () => {
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
  );

  const responseData = await response.json();
  const status = responseData.status;
  const allUsersSize = responseData.allUsersSize;
  const totalPage = responseData.totalPage;
  const usersLength = responseData.users.length;

  expect(status).toBe("ok");
  expect(allUsersSize).toBe(15);
  expect(totalPage).toBe(3);
  expect(usersLength).toBe(5);
});

test("Missing page", async () => {
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friend-suggestions?maxUsers=${maxUsers}`,
  );

  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("bad request");
});

test("Missing maxUsers", async () => {
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}`,
  );

  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("bad request");
});

test("First user", async () => {
  page = 1;
  maxUsers = 1;
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
  );

  const responseData = await response.json();
  const status = responseData.status;
  const users = responseData.users;

  expect(status).toBe("ok");
  expect(users.length).toBe(1);
});

test("Not found users", async () => {
  page = 3;
  maxUsers = 8;
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
  );
  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("not found");
});
