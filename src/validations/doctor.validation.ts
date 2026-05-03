import { z } from "zod";

export const doctorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Invalid phone"),
  password: z.string().optional(),
  specialization: z.string().min(1, "Select specialization"),
  experience: z.number().min(1, "Experience is required"),
  consultationFee: z.number(),
  bio: z.string().optional(),
});

export type DoctorFormData = z.infer<typeof doctorSchema>;
