import { expect, test } from "vitest";

let userId: number;
let page: number = 1;
let maxUsers: number = 1;

test("Search user", async () => {
  const response = await fetch(
    "http://localhost:5000/users/search?q=a&page=1&maxUsers=10",
  );

  const responseData = await response.json();
  const users = responseData.users;
  const status = responseData.status;

  expect(status).toBe("ok");

  userId = users[0].id;
});

test("Check current requests", async () => {
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friend-requests?page=${page}&maxUsers=${maxUsers}`,
  );

  const responseData = await response.json();
  const friendRequests = responseData.friendRequests;
  const status = responseData.status;

  expect(status).toBe("ok");

  expect(friendRequests.length).toBe(0);
});
