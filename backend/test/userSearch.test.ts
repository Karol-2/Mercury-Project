import { describe, expect, test } from "vitest";
import { fetchData } from "../src/misc/fetchData.js";
import User from "../src/models/User.js";

let page: number = 1;
let maxUsers: number = 32;
let query: string = "a";
let country: string = "PL";

describe("Search users", () => {
  test("all users from Poland", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/search?page=${page}&maxUsers=${maxUsers}&country=${country}&q=`,
      "GET",
      {},
    );

    const { status, pageCount, users } = response;

    expect(status).toBe("ok");
    expect(pageCount).toBe(1);
    expect(users).toBeDefined();
    expect(users.length).toBe(4);
  });

  test("first user from Brazil", async () => {
    country = "BR";
    const response = await fetchData(
      `http://localhost:5000/users/search?page=${page}&maxUsers=${maxUsers}&country=${country}&q=`,
      "GET",
      {},
    );

    const { status, pageCount, users } = response;

    expect(status).toBe("ok");
    expect(pageCount).toBe(1);
    expect(users).toBeDefined();
    expect(users.length).toBe(1);
    expect(users[0].country).toBe("BR");
  });

  test("with polish characters", async () => {
    query = "Małysz";
    country = "PL";
    const response = await fetchData(
      `http://localhost:5000/users/search?page=${page}&maxUsers=${maxUsers}&country=${country}&q=${query}`,
      "GET",
      {},
    );

    const { status, pageCount, users } = response;

    expect(status).toBe("ok");
    expect(pageCount).toBe(1);
    expect(users).toBeDefined();
    expect(users.length).toBe(4);

    const malysz = users.find((user: User) => user.mail == "adasko@malysz.pl");

    expect(malysz).toBeDefined();
  });

  test("not found", async () => {
    country = "GR";
    const response = await fetchData(
      `http://localhost:5000/users/search?page=${page}&maxUsers=${maxUsers}&country=${country}&q=`,
      "GET",
      {},
    );

    const { status, pageCount, users } = response;

    expect(status).toBe("ok");
    expect(pageCount).toBe(1);
    expect(users).toBeDefined();
    expect(users.length).toBe(1);
  });
});

describe("Search parameters", () => {
  test("missing country", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/search?page=${page}&maxUsers=${maxUsers}&q=`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.country).toBe("Invalid input");
  });

  test("empty query", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/search?page=${page}&maxUsers=${maxUsers}&country=${country}&q=`,
      "GET",
      {},
    );

    const { status, users } = response;

    expect(status).toBe("ok");
    expect(users).toBeDefined();
  });

  test("missing query", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/search?page=${page}&maxUsers=${maxUsers}&country=${country}`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.q).toBe("Required");
  });
});

describe("Pagination parameters", () => {
  test("missing page", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/search?maxUsers=${maxUsers}`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.page).toBe("Invalid input");
  });

  test("missing maxUsers", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/search?page=${page}`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.maxUsers).toBe("Invalid input");
  });

  test("missing page and maxUsers", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/search`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.page).toBe("Invalid input");
    expect(errors.maxUsers).toBe("Invalid input");
  });

  test("maxUsers as a text", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/search?page=text?page=${page}&maxUsers=text`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors.maxUsers).toBe("Expected number, received nan");
  });

  test("repeated page", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/search?page=${page}&maxUsers=${maxUsers}&page=${page}&q=`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.page).toBe("Invalid input");
  });

  test("repeated maxUsers", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/search?page=${page}&maxUsers=${maxUsers}&maxUsers=${maxUsers}&q=`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.maxUsers).toBe("Invalid input");
  });

  test("maxUsers above 32", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/search?page=${page}&maxUsers=33&country=${country}&q=`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.maxUsers).toBe("Number must be less than or equal to 32");
  });

  test("repeated page and maxUsers", async () => {
    const response = await fetchData(
      `http://localhost:5000/users/search?page=${page}&maxUsers=${maxUsers}&page=${page}&maxUsers=${maxUsers}&q=`,
      "GET",
      {},
    );

    const { status, errors } = response;

    expect(status).toBe("error");
    expect(errors).toBeDefined();
    expect(errors.page).toBe("Invalid input");
    expect(errors.maxUsers).toBe("Invalid input");
  });
});
