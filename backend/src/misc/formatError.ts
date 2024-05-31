import { ZodError } from "zod";

import { Errors } from "../models/Response.js";

export function formatError<T>(error: ZodError<T>): Errors {
  const result: Errors = {};

  for (const issue of error.issues) {
    let obj = result;

    for (const key of issue.path.slice(0, -1)) {
      const newObj = {};
      obj[key] = newObj;
      obj = newObj;
    }

    const [lastKey] = issue.path.slice(-1);
    obj[lastKey] = issue.message;
  }

  return result;
}
