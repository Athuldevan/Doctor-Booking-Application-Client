import axiosClient from "../lib/axios";
import type { IDoctor } from "../pages/doctor/types/doctor";

export const getDoctors = async () => {
  const res = await axiosClient.get("/doctors");
  return res.data;
};

export const getDoctor = async (id: string) => {
  const res = await axiosClient.get(`/doctors/${id}`);
  return res.data;
};

export const createDoctor = async (data: Partial<IDoctor>) => {
  const res = await axiosClient.post("/doctors", data);
  console.log(res);
  return res.data;
};

export const updateDoctor = async ({ _id, ...data }: Partial<IDoctor>) => {
  const res = await axiosClient.put(`/doctors/${_id}`, data);
  return res.data;
};

export const deleteDoctor = async ({ _id }: Partial<IDoctor>) => {
  const res = await axiosClient.delete(`/doctors/${_id}`);
  return res.data;
};
