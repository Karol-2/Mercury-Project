import { expect, test } from "vitest";

let userId: number;
let page: number = 3;
let maxUsers: number = 5;

test("Search user", async () => {
  const response = await fetch("http://localhost:5000/users/search?q=a&page=1&maxUsers=10");

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
  const pageCount = responseData.pageCount;
  const friendSuggestionsLength = responseData.friendSuggestions.length;

  expect(status).toBe("ok");
  // expect(pageCount).toBe(3);
  expect(friendSuggestionsLength).toBe(4);
});

test("Missing page", async () => {
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friend-suggestions?maxUsers=${maxUsers}`,
  );

  const responseData = await response.json();
  const status = responseData.status;
  const errors = responseData.errors;

  expect(status).toBe("error");
  expect(errors["page"]).toBe("not provided")
});

test("Missing maxUsers", async () => {
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}`,
  );

  const responseData = await response.json();
  const status = responseData.status;
  const errors = responseData.errors;

  expect(status).toBe("error");
  expect(errors["maxUsers"]).toBe("not provided")
});

test("First user", async () => {
  page = 1;
  maxUsers = 1;
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
  );

  const responseData = await response.json();
  const status = responseData.status;
  const friendSuggestions = responseData.friendSuggestions;

  expect(status).toBe("ok");
  expect(friendSuggestions.length).toBe(1);
});
