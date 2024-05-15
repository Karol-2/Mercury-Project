import { ZodType, z } from "zod";

export default interface User {
  id: string;
  first_name: string;
  last_name: string;
  country: string;
  profile_picture: string;
  mail: string;
}

export const userCountrySchema = z.string().trim().min(2).max(32);

export const userPasswordSchema = z.string().min(8).max(32);

export const userSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().trim().min(2).max(32),
  last_name: z.string().trim().min(2).max(32),
  country: userCountrySchema,
  profile_picture: z.string().url(),
  mail: z.string().email(),
}) satisfies ZodType<User>;
