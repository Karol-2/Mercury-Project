import { expect, test } from "vitest";
import importInitialData from "../data/importData";

test("Is initial data fetched", async () => {
    const importedData = await importInitialData();
    expect(importedData).toBe("Initial data has been imported into database.");
});

test("Is database not empty", async () => {
    const importedData = await importInitialData();
    expect(importedData).toBe("Database is not empty");
});
