import { z } from "zod";

export type loginFormData = z.infer<typeof loginFormSchema>;

export const loginFormSchema = z.object({
  email: z.string({ required_error: "Email is required" }),
  password: z.string({ required_error: "Password is required" }),
});
