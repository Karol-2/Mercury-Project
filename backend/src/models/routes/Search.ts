import { z, ZodType } from "zod";

import { userCountrySchema } from "../User.js";
import Page, { pageSchema } from "./Page.js";

interface Search extends Page {
  q: string;
  country: string;
  userId?: string;
}

export const searchSchema = z
  .object({
    q: z.string().min(0).max(64),
    country: z.union([userCountrySchema, z.literal("")]),
    userId: z.optional(z.string().uuid()),
  })
  .merge(pageSchema) satisfies ZodType<Search>;

export default Search;
