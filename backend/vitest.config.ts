import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: ["test/importData.test.ts", "test/userEndpoints.test.ts"],
  },
});
