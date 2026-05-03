import axiosClient from "../lib/axios";
import type { IDoctor } from "../pages/doctor/types/doctor";

export const getDoctors = async () => {
  const res = await axiosClient.get("/doctors");
  return res.data;
};

export const getDoctor = async (query: Partial<IDoctor>) => {
  const res = await axiosClient.get(`/doctors`, { params: query });
  return res.data;
};

export const createDoctor = async (data: Partial<IDoctor>) => {
  const res = await axiosClient.post("/doctors", data);
  console.log(res);
  return res.data;
};

export const updateDoctor = async (query: Partial<IDoctor>) => {
  const res = await axiosClient.put("/doctors/", { params: query });
  return res.data;
};

export const deleteDoctor = async (query: Partial<IDoctor>) => {
  const res = await axiosClient.delete("/doctors", { params: query });
  return res.data;
};
