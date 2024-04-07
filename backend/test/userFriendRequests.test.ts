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
