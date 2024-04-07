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

test("Get friend suggestions", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const status = response.status;
  const pageCount = response.pageCount;
  const friendSuggestionsLength = response.friendSuggestions.length;

  expect(status).toBe("ok");
  // expect(pageCount).toBe(3);
  expect(friendSuggestionsLength).toBe(4);
});

test("Missing page", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friend-suggestions?maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const status = response.status;
  const errors = response.errors;

  expect(status).toBe("error");
  expect(errors["page"]).toBe("not provided");
});

test("Missing maxUsers", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}`,
    "GET",
    {},
  );

  const status = response.status;
  const errors = response.errors;

  expect(status).toBe("error");
  expect(errors["maxUsers"]).toBe("not provided");
});

test("First user", async () => {
  page = 1;
  maxUsers = 1;
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const status = response.status;
  const friendSuggestions = response.friendSuggestions;

  expect(status).toBe("ok");
  expect(friendSuggestions.length).toBe(1);
});
