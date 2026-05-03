import type { IDoctor } from "./doctor";

export type Role = "admin" | "patient" | "doctor";

export interface IUserSummary {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
}

export interface ITimeSlot {
  _id?: string;
  startTime: string;
  endTime: string;
  status:
    | "available"
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed"
    | "blocked";
  patient?: IUserSummary | null;
  reason?: string | null;
  notes?: string | null;
  cancelledBy?: "patient" | "doctor" | "admin" | null;
  cancelReason?: string | null;
}

export interface ISlot {
  _id: string;
  doctorId: IDoctor;
  date: string;
  slotDuration: number;
  timeSlots: ITimeSlot[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}