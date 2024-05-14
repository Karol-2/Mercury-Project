import { expect, test } from "vitest";
import { fetchData } from "../src/misc/fetchData.js";

let userId: string;
let userData = {
  first_name: "John",
  last_name: "Smith",
  country: "USA",
  profile_picture: "https://example.com/john_smith.jpg",
  mail: "john_smith@example.com",
  password: "12345678",
};
let token: string;

const login = async (mail: string, password: string) => {
  const response = await fetchData(`http://localhost:5000/auth/login`, "POST", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mail: mail, password: password }),
  });

  token = response.token;
};

const updateUser = async (userId: string, token?: string) => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}`,
    "PUT",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    },
    token,
  );

  return response;
};

const changePassword = async (
  userId: string,
  new_password: string,
  repeat_password: string,
  token?: string,
) => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}/change-password`,
    "POST",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        old_password: userData.password,
        new_password,
        repeat_password,
      }),
    },
    token,
  );

  return response;
};

const deleteUser = async (userId: string, token?: string) => {
  const response = await fetchData(
    `http://localhost:5000/users/${userId}`,
    "DELETE",
    {},
    token,
  );

  return response;
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
  await login(userData.mail, userData.password);
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
  expect(errors.first_name).toBe("String must contain at least 2 character(s)");
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
  expect(errors.last_name).toBe("String must contain at least 2 character(s)");
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
  expect(errors.password).toBe("String must contain at least 8 character(s)");
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

test("Update user without token", async () => {
  const { status } = await updateUser(userId);
  expect(status).toBe("unauthorized");
});

test("Update user by ID", async () => {
  userData.profile_picture = "https://example.com/new_john_smith.jpg";

  const { status } = await updateUser(userId, token);
  expect(status).toBe("ok");
});

test("Update user with incorrect ID", async () => {
  const { status, errors } = await updateUser("0", token);

  expect(status).toBe("error");
  expect(errors.id).toBe("not found");
});

test("Update user with short first name", async () => {
  userData.first_name = "j";

  const { status, errors } = await updateUser(userId, token);

  expect(status).toBe("error");
  expect(errors.first_name).toBe("String must contain at least 2 character(s)");
});

test("Update user with short last name", async () => {
  userData.last_name = "s";

  const { status, errors } = await updateUser(userId, token);

  expect(status).toBe("error");
  expect(errors.last_name).toBe("String must contain at least 2 character(s)");
});

test("Update user with short password", async () => {
  const { status, errors } = await changePassword(
    userId,
    "1234",
    "1234",
    token,
  );

  expect(status).toBe("error");
  expect(errors).toBeDefined();
  expect(errors.old_password).toBe("incorrect");
});

test("Update user with same password", async () => {
  const { status } = await changePassword(
    userId,
    "12345678",
    "12345678",
    token,
  );
  expect(status).toBe("ok");
});

test("Update user with correct password", async () => {
  const { status } = await changePassword(
    userId,
    "123456789",
    "123456789",
    token,
  );
  expect(status).toBe("ok");
});

test("Delete user without token", async () => {
  const { status } = await deleteUser(userId);
  expect(status).toBe("unauthorized");
});

test("Delete user by ID", async () => {
  const { status } = await deleteUser(userId, token);
  expect(status).toBe("ok");
});

test("Delete user with incorrect ID", async () => {
  const response = await deleteUser("🐍", token);
  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.id).toBe("not found");
});
