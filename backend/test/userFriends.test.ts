import { expect, test } from "vitest";

const userId: string = "7aacd3c1-8579-4297-9c8e-dffd77a79b28";
let page: number = 3;
let maxUsers: number = 5;

test("Get friend suggestions", async () => {
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
  );

  const responseData = await response.json();
  const size = responseData.size;
  const status = responseData.status;

  expect(status).toBe("ok");
  expect(size).toBe(14);
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
  expect(size).toBe(14);
  expect(users.length).toBe(2);
});

test("Not found users", async () => {
  maxUsers = 7;
  const response = await fetch(
    `http://localhost:5000/users/${userId}/friend-suggestions?page=${page}&maxUsers=${maxUsers}`,
  );
  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("not found");
});
