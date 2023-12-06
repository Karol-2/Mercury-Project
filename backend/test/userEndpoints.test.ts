import { expect, test } from "vitest";

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
    (user: any) => user.mail == "goodboymark1@meta.com",
  );
  const zuckId = zuck.id;

  const response = await fetch(`http://localhost:5000/users/${zuckId}/friends`);
  const responseData = await response.json();
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

  const usersResponseData = await searchUsers("?q=zuckerberg");
  const usersStatus = usersResponseData.status;

  expect(usersStatus).toBe("ok");

  const zuck = usersResponseData.users.find(
    ([user, _score]: any) => user.mail == "goodboymark1@meta.com",
  );

  expect(zuck).toBeDefined();
});
