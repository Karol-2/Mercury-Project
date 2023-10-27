import { beforeAll, expect, test } from "vitest";
import importInitialData from "../data/importData";

test("Is initial data fetched", async () => {
    const importedData = await importInitialData();
    expect(importedData).toBe("Error importing data");
});

test("Is database not empty", async () => {
    const importedData2 = await importInitialData();
    expect(importedData2).toBe("Database is not empty");
});
