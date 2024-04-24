import { expect, test } from "vitest";
import { fetchData } from "./fetchData.js";

let userId: number;
let page: number = 3;
let maxUsers: number = 5;

const getFirstUser = async () => {
  const response = await fetchData(`http://localhost:5000/users`, "GET", {});
  userId = response.users[0].id;
};

await getFirstUser();

test("Get friend suggestions", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const { status, pageCount, friendSuggestions } = response;

  expect(status).toBe("ok");
  expect(pageCount).toBe(10);
  expect(friendSuggestions).toBeDefined();
  expect(friendSuggestions.length).toBe(5);
});

test("Get friend suggestions with incorrect ID", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/0/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors).toBeDefined();
  expect(errors.id).toBe("not found");
});

test("Missing page", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friend-suggestions?maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors).toBeDefined();
  expect(errors.page).toBe("Invalid input");
});

test("Missing maxUsers", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors).toBeDefined();
  expect(errors.maxUsers).toBe("Invalid input");
});

test("Missing page and maxUsers", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friend-suggestions`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.page).toBe("Invalid input");
  expect(errors.maxUsers).toBe("Invalid input");
});

test("maxUsers as a text", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=text?page=${page}&maxUsers=text`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.maxUsers).toBe("Expected number, received nan");
});

test("First user", async () => {
  page = 1;
  maxUsers = 1;
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const { status, pageCount, friendSuggestions } = response;

  expect(status).toBe("ok");
  expect(pageCount).toBe(10);
  expect(friendSuggestions).toBeDefined();
  expect(friendSuggestions.length).toBe(1);
});

test("maxUsers equals 0", async () => {
  maxUsers = 0;
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors).toBeDefined();
  expect(errors.maxUsers).toBe("Number must be greater than or equal to 1");
});
