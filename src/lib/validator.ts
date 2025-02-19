import { z } from "zod";

export type loginFormData = z.infer<typeof loginFormSchema>;
export type registerFormData = z.infer<typeof registerFormSchema>;

export const loginFormSchema = z.object({
  email: z.string({ required_error: "Email is required" }),
  password: z.string({ required_error: "Password is required" }),
});

export const registerFormSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email formate"),
    password: z
      .string({ required_error: "Password is required" })
      .min(3, "Must be 3 or more characters long")
      .max(20, "Must be less than 20 characters")
      .refine(
        (password) => /[A-Z]/.test(password),
        "Must contain one capital letter"
      )
      .refine(
        (password) => /[a-z]/.test(password),
        "Must contain one small letter"
      )
      .refine((password) => /[0-9]/.test(password), "Must contain one number")
      .refine(
        (password) => /[!@#$%^&*]/.test(password),
        "Must contain one special character"
      ),
    name: z.string().min(3, "Name is required"),
    phone: z.string().min(3, "Phone number is required"),
    role: z.string().min(1, "role is required"),
    companyName: z.string().max(20, "company name cannot exceed 20 characters"),
    image: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "VENDOR") {
        return !!data.companyName;
      }
      return true;
    },
    {
      message: "company name is required",
      path: ["companyName"],
    }
  );
