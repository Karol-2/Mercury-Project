import { ZodType, z } from "zod";
import Page, { pageSchema } from "./Page.js"
import { userCountrySchema } from "./User.js";

interface Search extends Page {
  q: string;
  country: string;
  userId: string;
}

export const searchSchema = z.object({
  q: z.string().min(0).max(64),
  country: userCountrySchema,
  userId: z.string().uuid()
}).merge(pageSchema) satisfies ZodType<Search>

export default Search;
