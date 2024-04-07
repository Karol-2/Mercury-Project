import { expect, test } from "vitest";
import User from "../src/models/User.js";
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
  expect(user.country).toBe(userData.country);
  expect(user.profile_picture).toBe(userData.profile_picture);
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

  console.log(userData.first_name);

  const response = await fetchData(`http://localhost:5000/users`, "POST", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const { status, errors } = response;

  expect(status).toBe("error");
  expect(errors.id).toBe("First name should be at least two characters long");
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
  expect(errors.id).toBe("Last name should be at least two characters long");
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
  expect(errors.id).toBe("Password should be at least eight characters long");
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
  expect(user.country).toBe(userData.country);
  expect(user.profile_picture).toBe(userData.profile_picture);
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
  expect(errors.id).toBe("First name should be at least two characters long");
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
  expect(errors.id).toBe("Last name should be at least two characters long");
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
  expect(errors.id).toBe("Password should be at least eight characters long");
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

async function searchUsers(lastPart: string) {
  const usersResponse = await fetchData(
    "http://localhost:5000/users/search" + lastPart,
    "GET",
    {},
  );
  return usersResponse;
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
