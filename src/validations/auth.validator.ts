import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Min 2 characters").max(50, "Max 50 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
  phone: z.string(),
  role: z.enum(["admin", "patient"], {
    message: "Please select a role",
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["admin", "patient"], {
    message: "Please select a role",
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
