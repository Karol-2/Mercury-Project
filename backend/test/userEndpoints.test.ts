import { assert, expect, test } from "vitest";
import User from "../src/models/User.js";

let userId: number;

test("Create user", async () => {
  const userData = {
    first_name: "Tom",
    last_name: "Hanks",
    country: "USA",
    profile_picture: "https://example.com/tommy.jpg",
    mail: "tom.hanks@example.com",
    password: "12345",
  };

  const response = await fetch("http://localhost:5000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const responseData = await response.json();
  const user = responseData.user;
  const status = responseData.status;

  expect(status).toBe("ok");

  userId = user.id;
});

test("Try to create user with existing mail", async () => {
  const userData = {
    first_name: "Tom",
    last_name: "Hanks",
    country: "USA",
    profile_picture: "https://example.com/tommy.jpg",
    mail: "tom.hanks@example.com",
    password: "12345",
  };

  const response = await fetch("http://localhost:5000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("error");
});

test("Fetch user by ID", async () => {
  const response = await fetch(`http://localhost:5000/users/${userId}`);
  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("ok");
});

test("Update user by ID", async () => {
  const userUpdateData = {
    first_name: "Tommy",
    last_name: "Hanks",
    country: "Canada",
    profile_picture: "https://example.com/tommy.jpg",
    mail: "tommy.hanks@example.com",
    password: "54321",
  };

  const response = await fetch(`http://localhost:5000/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userUpdateData),
  });

  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("ok");
});

test("Delete user by ID", async () => {
  const response = await fetch(`http://localhost:5000/users/${userId}`, {
    method: "DELETE",
  });

  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("ok");
});

test("Get user's friends", async () => {
  const usersResponse = await fetch("http://localhost:5000/users");
  const usersResponseData = await usersResponse.json();
  const usersStatus = usersResponseData.status;

  expect(usersStatus).toBe("ok");

  const zuck = usersResponseData.users.find(
    (user: any) => user.mail == "reptilian@meta.com",
  );
  const zuckId = zuck.id;

  const response = await fetch(
    `http://localhost:5000/users/${zuckId}/friends?page=1&maxUsers=2`,
  );
  const responseData = await response.json();
  assert.containsAllKeys(responseData, ["status", "friends", "pageCount"]);

  const { status, friends } = responseData;
  expect(status).toBe("ok");
  expect(friends).toHaveLength(2);
});

async function searchUsers(lastPart: string) {
  const usersResponse = await fetch(
    "http://localhost:5000/users/search" + lastPart,
  );
  const usersResponseData = await usersResponse.json();
  return usersResponseData;
}

test("Search users", async () => {
  const usersNoResponseData = await searchUsers("");
  const usersNoStatus = usersNoResponseData.status;

  expect(usersNoStatus).toBe("error");

  const usersEmptyResponseData = await searchUsers("?q=");
  const usersEmptyStatus = usersEmptyResponseData.status;

  expect(usersEmptyStatus).toBe("error");

  const usersIncorrectResponseData = await searchUsers("?q=🐈");
  const usersIncorrectStatus = usersIncorrectResponseData.status;

  expect(usersIncorrectStatus).toBe("error");

  const usersNoPageResponseData = await searchUsers("?q=zuckerberg");
  const usersNoPageStatus = usersNoPageResponseData.status;
  const usersNoPageErrors = usersNoPageResponseData.errors;

  expect(usersNoPageStatus).toBe("error");
  expect(usersNoPageErrors["page"]).toBe("not provided");
  expect(usersNoPageErrors["maxUsers"]).toBe("not provided");

  const usersWrongPageResponseData = await searchUsers(
    "?q=zuckerberg&page=🐈&maxUsers=🐕",
  );
  const usersWrongPageStatus = usersWrongPageResponseData.status;
  const usersWrongPageErrors = usersWrongPageResponseData.errors;

  expect(usersWrongPageStatus).toBe("error");
  expect(usersWrongPageErrors["page"]).toBe("not a number");
  expect(usersWrongPageErrors["maxUsers"]).toBe("not a number");

  const usersMultiplePageResponseData = await searchUsers(
    "?q=zuckerberg&page=1&page=1&maxUsers=1&maxUsers=1",
  );
  const usersMultiplePageStatus = usersMultiplePageResponseData.status;
  const usersMultiplePageErrors = usersMultiplePageResponseData.errors;

  expect(usersMultiplePageStatus).toBe("error");
  expect(usersMultiplePageErrors["page"]).toBe("incorrect");
  expect(usersMultiplePageErrors["maxUsers"]).toBe("incorrect");

  const usersResponseData = await searchUsers(
    "?q=zuckerberg&page=1&maxUsers=10",
  );
  const usersStatus = usersResponseData.status;

  expect(usersStatus).toBe("ok");

  const zuck = usersResponseData.users.find(
    (user: User) => user.mail == "reptilian@meta.com",
  );

  expect(zuck).toBeDefined();
});
