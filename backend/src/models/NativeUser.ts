import { z, ZodType } from "zod";

type NativeUser = {
  password: string;
};

export const nativeUserSchema = z.object({
  password: z.string().min(8).max(32),
}) satisfies ZodType<NativeUser>;

export default NativeUser;
