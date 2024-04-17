import { ZodType, z } from "zod";

interface Page {
  page: string | number;
  maxUsers: string | number;
}

export const pageSchema = z.object({
  page: z.union([z.number(), z.string()]).pipe(z.coerce.number().min(1)),
  maxUsers: z
    .union([z.number(), z.string()])
    .pipe(z.coerce.number().min(1).max(32)),
}) satisfies ZodType<Page>;

export default Page;
