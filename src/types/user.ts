export type Role = "admin" | "patient" | "doctor";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
}
