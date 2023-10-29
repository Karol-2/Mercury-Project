import { expect, test } from "vitest";
import importInitialData from "../src/data/importData";

test("Import initial data", async () => {
  const importedData = await importInitialData();
  expect(importedData).toBe("Initial data has been imported into database.");
});

test("Database has data", async () => {
  const importedData = await importInitialData();
  expect(importedData).toBe("Database is not empty");
});
