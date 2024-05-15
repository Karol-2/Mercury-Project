import { z } from "zod";
import { userPasswordSchema } from "./User.js";

type ChangePasswordReq =
  | {
      old_password: string;
      new_password: string;
      repeat_password: string;
    }
  | {};

export const changePasswordReqSchema: z.ZodType<ChangePasswordReq> = z
  .object({
    old_password: userPasswordSchema,
    new_password: userPasswordSchema,
    repeat_password: z.string(),
  })
  .refine((data) => data.new_password === data.repeat_password, {
    message: "Passwords don't match",
    path: ["repeat_password"],
  })
  .or(z.object({}));

export default ChangePasswordReq;
