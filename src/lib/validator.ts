import { z } from "zod";

export type loginFormData = z.infer<typeof loginFormSchema>;
export type registerFormData = z.infer<typeof registerFormSchema>;
export type addProductFormData = z.infer<typeof addProductSchema>;
export type profileSchemaData = z.infer<typeof profileSchema>;

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
    role: z.enum(["USER", "VENDOR", "SERVICE_PROVIDER"]).default("USER"),
    companyName: z
      .string()
      .max(20, "company name cannot exceed 20 characters")
      .optional(),
    profileImage: z.any().optional().nullable(),
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

export const addProductSchema = z.object({
  name: z.string().min(1, "Product Name is required"),
  category: z.string().min(1, "Please select a category"),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive("Price must be a positive number")
  ),
  stock: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0, "Stock must be a non negative Integer")
  ),
  imageUrl: z.any(),
});

// Define validation schema using Zod
export const profileSchema = z
  .object({
    name: z.string().min(3, "Full name must be at least 3 characters"),
    phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    profileImage: z.any().optional().nullable(),
  })
  .refine(
    (data) => {
      // Require both passwords if either is provided
      if (data.oldPassword || data.newPassword) {
        return !!data.oldPassword && !!data.newPassword;
      }
      return true;
    },
    {
      message:
        "Both old and new passwords are required to change your password",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword) {
        return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{3,20}$/.test(
          data.newPassword
        );
      }
      return true;
    },
    {
      message:
        "Password must include uppercase, lowercase, number, and special character",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword === data.oldPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New Password and old password cannot be same",
      path: ["newPassword"],
    }
  );
