import * as z from "zod";
import { FrontendUser } from "./User";
import { PasswordForm } from "./PasswordForm.model";

export const userRegisterSchema: z.ZodType<Partial<FrontendUser>> = z.object({
  first_name: z
    .string()
    .min(2, "First name should be at least two characters long"),
  last_name: z
    .string()
    .min(2, "Last name should be at least two characters long"),
  country: z
    .string()
    .length(2, "Country code should be 2 characters long")
    .toUpperCase(),
  mail: z.string().email(),
  password: z
    .string()
    .min(8, "Password should be at least eight characters long"),
});

export const userEditDetails: z.ZodType<Partial<FrontendUser>> = z.object({
  first_name: z
    .string()
    .min(2, "First name should be at least two characters long"),
  last_name: z
    .string()
    .min(2, "Last name should be at least two characters long"),
  country: z
    .string()
    .length(2, "Country code should be 2 characters long")
    .toUpperCase(),
  mail: z.string().email()
})

export const changePasswordSchema: z.ZodType<PasswordForm> = z.object({
  old_password: z
    .string()
    .min(8, "Password should be at least eight characters long"),
  new_password: z
  .string()
  .min(8, "Password should be at least eight characters long"),
  repeat_password: z
  .string()
  .min(8, "Password should be at least eight characters long"),
})

