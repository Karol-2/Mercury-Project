import { expect, test } from "vitest";
import { fetchData } from "./fetchData.js";

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
  expect(pageCount).toBe(10);
  expect(friends.length).toBe(6);
});

test("Missing page", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friends?maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.page).toBe("not provided");
});

test("Page as a text", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friends?page=text?maxUsers=${maxUsers}`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.page).toBe("not a number");
});

test("Missing maxUsers", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friends?page=${page}`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.maxUsers).toBe("not provided");
});

test("maxUsers as a text", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friends?page=text?page=${page}&maxUsers=text`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.maxUsers).toBe("not a number");
});

test("Missing page and maxUsers", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/friends`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.page).toBe("not provided");
  expect(errors.maxUsers).toBe("not provided");
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
  expect(pageCount).toBe(10);
  expect(friends.length).toBe(1);
  expect(friends[0].country).toBe("Iran");
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

  const { status, pageCount, friends } = response;

  expect(status).toBe("ok");
  expect(pageCount).toBe(10);
  expect(friends.length).toBe(0);
});
