import * as z from "zod";
import { FrontendUser } from "./User";

export const userSchema: z.ZodType<Partial<FrontendUser>> = z.object({
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
  //   profile_picture: z
  //   .any()
  //   .refine((obj) => (!obj ? "Profile picture is required" : ""))
  // .refine((obj) => obj && obj.length <= 0, "Profile picture not provided")
  // .transform((obj) => {
  //   if (obj && obj.length > 0 && (obj as FileList)[0].size <= 5 * 1024 * 1024) {
  //     return (obj as FileList)[0].name;
  //   } else {
  //     throw new Error("File is too big (>5 MB)");
  //   }
  // }),
  mail: z.string().email(),
  password: z
    .string()
    .min(8, "Password should be at least eight characters long"),
});
