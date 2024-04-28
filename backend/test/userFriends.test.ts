import { expect, test } from "vitest";
import { fetchData } from "../src/misc/fetchData.js";

let page: number = 1;
let maxUsers: number = 10;
let userId: string = "";

const getFirstUser = async () => {
  const response = await fetchData(`http://localhost:5000/users`, "GET", {});
  userId = response.users[0].id;
};

await getFirstUser();

test("Get friends", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friends?page=${page}&maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const { status, pageCount, friends } = response;

  expect(status).toBe("ok");
  expect(pageCount).toBe(1);
  expect(friends.length).toBe(6);
});

test("Get friends with incorrect ID", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/0/friends?page=${page}&maxUsers=${maxUsers}`,
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
    `http://localhost:5000/users/${userId}/friends?maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.page).toBe("Invalid input");
});

test("Page as a text", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friends?page=text?maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.page).toBe("Expected number, received nan");
});

test("Missing maxUsers", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friends?page=${page}`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.maxUsers).toBe("Invalid input");
});

test("maxUsers as a text", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friends?page=text?page=${page}&maxUsers=text`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.maxUsers).toBe("Expected number, received nan");
});

test("Missing page and maxUsers", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friends`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.page).toBe("Invalid input");
  expect(errors.maxUsers).toBe("Invalid input");
});

test("First user", async () => {
  page = 1;
  maxUsers = 1;
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friends?page=${page}&maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const { status, pageCount, friends } = response;

  expect(status).toBe("ok");
  expect(pageCount).toBe(6);
  expect(friends.length).toBe(1);
  expect(friends[0].country).toBe("PL");
  expect(friends[0].mail).toBe("agodneyh@studiopress.com");
  expect(friends[0].first_name).toBe("Abby");
  expect(friends[0].last_name).toBe("Godney");
});

test("maxUsers equals 0", async () => {
  maxUsers = 0;
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friends?page=${page}&maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors).toBeDefined();
  expect(errors.maxUsers).toBe("Number must be greater than or equal to 1");
});
