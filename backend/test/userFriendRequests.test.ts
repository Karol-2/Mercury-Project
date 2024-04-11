import { expect, test } from "vitest";
import { fetchData } from "./fetchData.js";

let page: number = 1;
let maxUsers: number = 1;
let userId: string = "";

const getFirstUser = async () => {
  const response = await fetchData(`http://localhost:5000/users`, "GET", {});
  userId = response.users[0].id;
};

await getFirstUser();

test("Check current requests", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friend-requests?page=${page}&maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const { status, pageCount, friendRequests } = response;

  expect(status).toBe("ok");
  expect(pageCount).toBe(10);
  expect(friendRequests.length).toBe(0);
});

test("Check current requests with incorrect ID", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/0/friend-requests?page=${page}&maxUsers=${maxUsers}`,
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
    `http://localhost:5000/users/${userId}/friend-requests?maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors).toBeDefined();
  expect(errors.page).toBe("not provided");
});

test("Missing maxUsers", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friend-requests?page=${page}`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors).toBeDefined();
  expect(errors.maxUsers).toBe("not provided");
});

test("Missing page and maxUsers", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friend-requests`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.page).toBe("not provided");
  expect(errors.maxUsers).toBe("not provided");
});

test("maxUsers as a text", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friend-requests?page=text?page=${page}&maxUsers=text`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.maxUsers).toBe("not a number");
});

test("maxUsers equals 0", async () => {
  maxUsers = 0;
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friend-requests?page=${page}&maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const { status, pageCount, friendRequests } = response;

  expect(status).toBe("ok");
  expect(pageCount).toBe(10);
  expect(friendRequests.length).toBe(0);
});
