import { describe, expect, test } from "vitest";
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

const userMail2 = "cruckman3@archive.org";
const userPassword2 = "coreCar0l;";

const getKeycloakToken = async (
  mail: string,
  password: string,
): Promise<string> => {
  const urlParams = new URLSearchParams({
    grant_type: "password",
    client_id: "mercury-testing",
    client_secret: "5mwGU0Efyh3cT2WVX7ffA8UAWEAmrBag",
    username: mail,
    password: password,
  });

  const response = await fetchData(
    `http://localhost:3000/realms/mercury/protocol/openid-connect/token`,
    "POST",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlParams,
    },
  );

  return response.access_token;
};

const login = async (mail: string, password: string) => {
  const response = await fetchData(`http://localhost:5000/auth/login`, "POST", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mail, password }),
  });

  return response.token;
};

// set after creating user
let token1 = "";
const token2 = await getKeycloakToken(userMail2, userPassword2);

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

describe("Create user", () => {
  test("correct", async () => {
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
    token1 = await login(userData.mail, userData.password);
  });

  test("existing mail", async () => {
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

  test("too short first name", async () => {
    userData.first_name = "j";

    const response = await fetchData(`http://localhost:5000/users`, "POST", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.first_name).toBe(
      "String must contain at least 2 character(s)",
    );
  });

  test("too short last name", async () => {
    userData.last_name = "s";

    const response = await fetchData(`http://localhost:5000/users`, "POST", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.last_name).toBe(
      "String must contain at least 2 character(s)",
    );
  });

  test("too short password", async () => {
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
});

describe("Get user", () => {
  test("incorrect ID", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/🐈`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.id).toBe("not found");
  });

  test("all users", async () => {
    const response = await fetchData(`http://localhost:5000/users`, "GET", {});
    const { status, users } = response;

    expect(status).toBe("ok");
    expect(users.length).toBe(28);
  });

  test("correct", async () => {
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
});

describe("Update user", () => {
  test("without token", async () => {
    const { status } = await updateUser(userId);
    expect(status).toBe("unauthorized");
  });

  test("with incorrect token", async () => {
    const { status } = await updateUser(userId, token2);
    expect(status).toBe("forbidden");
  });

  // test("incorrect ID", async () => {
  //   const { status, errors } = await updateUser("0", token1);

  //   expect(status).toBe("error");
  //   expect(errors.id).toBe("not found");
  // });

  test("correct", async () => {
    userData.profile_picture = "https://example.com/new_john_smith.jpg";

    const { status } = await updateUser(userId, token1);
    expect(status).toBe("ok");
  });

  test("too short first name", async () => {
    userData.first_name = "j";

    const { status, errors } = await updateUser(userId, token1);

    expect(status).toBe("error");
    expect(errors.first_name).toBe(
      "String must contain at least 2 character(s)",
    );
  });

  test("too short last name", async () => {
    userData.last_name = "s";

    const { status, errors } = await updateUser(userId, token1);

    expect(status).toBe("error");
    expect(errors.last_name).toBe(
      "String must contain at least 2 character(s)",
    );
  });
});

describe("Change password", () => {
  test("too short", async () => {
    const { status, errors } = await changePassword(
      userId,
      "1234",
      "1234",
      token1,
    );

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.old_password).toBe("incorrect");
  });

  test("identical", async () => {
    const { status } = await changePassword(
      userId,
      "12345678",
      "12345678",
      token1,
    );
    expect(status).toBe("ok");
  });

  test("correct", async () => {
    const { status } = await changePassword(
      userId,
      "123456789",
      "123456789",
      token1,
    );
    expect(status).toBe("ok");
  });
});

describe("Delete user", () => {
  test("without token", async () => {
    const { status } = await deleteUser(userId);
    expect(status).toBe("unauthorized");
  });

  test("with incorrect token", async () => {
    const { status } = await deleteUser(userId, token2);
    expect(status).toBe("forbidden");
  });

  // test("incorrect ID", async () => {
  //   const response = await deleteUser("🐍", token1);
  //   const { status, errors } = response;

  //   expect(status).toBe("error");
  //   expect(errors.id).toBe("not found");
  // });

  test("correct", async () => {
    const { status } = await deleteUser(userId, token1);
    expect(status).toBe("ok");
  });
});
