import { expect, test } from "vitest";
import { fetchData } from "../src/misc/fetchData.js";

let userId: string = "";

const getFirstUser = async () => {
  const response = await fetchData(`http://localhost:5000/users`, "GET", {});
  userId = response.users[0].id;
};

await getFirstUser();

test("Get users meetings", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/meetings/${userId}`,
    "GET",
    {},
  );

  const { status, meetings } = response;

  expect(status).toBe("ok");
  expect(meetings).toBeDefined();
  expect(meetings.length).toBe(0);
});

test("Get users meetings without id", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/meetings`,
    "GET",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors).toBeDefined();
  expect(errors.id).toBe("not found");
});

test("Update meeting", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/meetings/0`,
    "PUT",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  const { status } = response;

  expect(status).toBe("ok");
});
