import { ZodType, z } from "zod";

interface Page {
  page: number;
  maxUsers: number;
}

export const pageSchema = z.object({
  page: z.number().min(1),
  maxUsers: z.number().min(1).max(32),
}) satisfies ZodType<Page>;

export default Page;
