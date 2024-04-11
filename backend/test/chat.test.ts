import { expect, test } from "vitest";
import { fetchData } from "./fetchData.js";

let userId1: string = "";
let userId2: string = "";

const getUsers = async () => {
  const response = await fetchData(`http://localhost:5000/users`, "GET", {});
  userId1 = response.users[0].id;
  userId2 = response.users[1].id;
};

await getUsers();

test("Get chat without ids", async () => {
  const response = await fetch(`http://localhost:5000/chat`);
  const data = response.headers.get("content-type");

  expect(response.status).toBe(404);
  expect(data).toBe("text/html; charset=utf-8");
});

test("Get chat with ids", async () => {
  const response = await fetchData(
    `http://localhost:5000/chat/${userId1}/${userId2}`,
    "GET",
    {},
  );

  const { status, messages } = response;

  expect(status).toBe("ok");
  expect(messages).toBeDefined();
  expect(messages.length).toBe(0);
});
