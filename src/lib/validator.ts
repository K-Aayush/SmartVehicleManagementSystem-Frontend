import { z } from "zod";

export type loginFormData = z.infer<typeof loginFormSchema>;
export type registerFormData = z.infer<typeof registerFormSchema>;
export type addProductFormData = z.infer<typeof addProductSchema>;

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
  category: z.string().min(1, "Product category is required"),
  price: z.number().positive("price must be a positive Number"),
  stock: z.number().int().min(0, "Stock must be a non negative Integer"),
  imageUrl: z.array(z.string()).min(1, "At least one image is required"),
});
