// validations/slot.validation.ts
import { z } from "zod";

export const slotSchema = z.object({
  doctorId: z.string().min(1, "Select a doctor"),
  date: z.string().min(1, "Select a date"),
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
  slotDuration: z.string().min(1, "Select duration"),
});

export type SlotFormData = z.infer<typeof slotSchema>;