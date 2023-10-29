import { expect, test } from "vitest";

test("Fetch all users", async () => {
  const response = await fetch("http://localhost:5000/users");
  const responseData = await response.json();
  const data = responseData.result;
  const status = responseData.status;

  expect(status).toBe("ok");
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBe(7);
});

test("Fetch user by ID", async () => {
  const response = await fetch(`http://localhost:5000/users/0`);
  const responseData = await response.json();
  const data = responseData.result;
  const status = responseData.status;

  expect(status).toBe("ok");
  expect(typeof data).toBe("object");
});

test("Create user", async () => {
  const userData = {
    nick: "newUser",
    first_name: "John",
    last_name: "Doe",
    mail: "john.doe@example.com",
    country: "USA",
    profile_picture: "https://example.com/johndoe.jpg",
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
  expect(data.length).toBe(1);
});

test("Update user by ID", async () => {
  const userUpdateData = {
    nick: "updatedUser",
    first_name: "Updated",
    last_name: "User",
    mail: "updated.user@example.com",
    country: "Canada",
    profile_picture: "https://example.com/updateduser.jpg",
  };

  const response = await fetch(`http://localhost:5000/users/7`, {
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
  const response = await fetch(`http://localhost:5000/users/7`, {
    method: "DELETE",
  });

  const responseData = await response.json();
  const status = responseData.status;

  expect(status).toBe("ok");
});
