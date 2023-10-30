import { expect, test } from "vitest";

let userId: number;

test("Create user", async () => {
  const userData = {
    nick: "Bobby",
    password: "12345",
    first_name: "Bob",
    last_name: "Smith",
    country: "USA",
    profile_picture: "https://example.com/bobby.jpg",
    mail: "bob.smith@example.com",
  };

  const response = await fetch("http://localhost:5000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const responseData = await response.json();
  const data = responseData.result;
  const status = responseData.status;

  expect(status).toBe("ok");

  userId = data.id;
});

test("Fetch user by ID", async () => {
  const response = await fetch(`http://localhost:5000/users/${userId}`);
  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("ok");
});

test("Update user by ID", async () => {
  const userUpdateData = {
    nick: "John",
    password: "54321",
    first_name: "Bob",
    last_name: "Smith",
    country: "Canada",
    profile_picture: "https://example.com/johnbob.jpg",
    mail: "bobjohn@example.com",
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
