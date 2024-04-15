import { expect, test } from "vitest";
import { fetchData } from "./fetchData.js";

let userId: number;
let userData = {
  first_name: "John",
  last_name: "Smith",
  country: "USA",
  profile_picture: "https://example.com/john_smith.jpg",
  mail: "john_smith@example.com",
  password: "12345678",
};

test("Get all users", async () => {
  const response = await fetchData(`http://localhost:5000/users`, "GET", {});
  const { status, users } = response;

  expect(status).toBe("ok");
  expect(users.length).toBe(27);
});

test("Create user", async () => {
  const response = await fetchData(`http://localhost:5000/users`, "POST", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const { status, user } = response;

  expect(status).toBe("ok");
  expect(user.first_name).toBe(userData.first_name);
  expect(user.last_name).toBe(userData.last_name);
  expect(user.mail).toBe(userData.mail);

  userId = user.id;
});

test("Create user with existing mail", async () => {
  userData.mail = "shudghton1@geocities.com";

  const response = await fetchData(`http://localhost:5000/users`, "POST", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.id).toBe("already exists");
});

test("Create user with short first name", async () => {
  userData.first_name = "j";

  const response = await fetchData(`http://localhost:5000/users`, "POST", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.first_name).toBe("too short");
});

test("Create user with short last name", async () => {
  userData.last_name = "s";

  const response = await fetchData(`http://localhost:5000/users`, "POST", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.last_name).toBe("too short");
});

test("Create user with short password", async () => {
  userData.password = "1234";

  const response = await fetchData(`http://localhost:5000/users`, "POST", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.password).toBe("too short");
});

test("Get user by ID", async () => {
  userData.mail = "john_smith@example.com";
  userData.first_name = "John";
  userData.last_name = "Smith";
  userData.password = "12345678";

  const response = await fetchData(
    `http://localhost:5000/users/${userId}`,
    "GET",
    {},
  );
  const { status, user } = response;

  expect(status).toBe("ok");
  expect(user.id).toBe(userId);
  expect(user.first_name).toBe(userData.first_name);
  expect(user.last_name).toBe(userData.last_name);
  expect(user.mail).toBe(userData.mail);
});

test("Get user with incorrect ID", async () => {
  const response = await fetchData(`http://localhost:5000/users/🐈`, "GET", {});

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.id).toBe("not found");
});

test("Update user by ID", async () => {
  userData.profile_picture = "https://example.com/new_john_smith.jpg";

  const response = await fetchData(
    `http://localhost:5000/users/${userId}`,
    "PUT",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    },
  );

  const { status } = response;

  expect(status).toBe("ok");
});

test("Update user with incorrect ID", async () => {
  const response = await fetchData(`http://localhost:5000/users/0`, "PUT", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.id).toBe("not found");
});

test("Update user with short first name", async () => {
  userData.first_name = "j";

  const response = await fetchData(
    `http://localhost:5000/users/${userId}`,
    "PUT",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    },
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.first_name).toBe("too short");
});

test("Update user with short last name", async () => {
  userData.last_name = "s";

  const response = await fetchData(
    `http://localhost:5000/users/${userId}`,
    "PUT",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    },
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.last_name).toBe("too short");
});

test("Update user with short password", async () => {
  userData.password = "1234";

  const response = await fetchData(
    `http://localhost:5000/users/${userId}`,
    "PUT",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    },
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.password).toBe("too short");
});

test("Delete user by ID", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}`,
    "DELETE",
    {},
  );

  const { status } = response;

  expect(status).toBe("ok");
});

test("Delete user with incorrect ID", async () => {
  const response = await fetchData(
    `http://localhost:5000/users/🐍`,
    "DELETE",
    {},
  );

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.id).toBe("not found");
});
