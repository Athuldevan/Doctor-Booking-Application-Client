/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../lib/axios";

export const login = async (data: any) => {
  console.log(data);
  return axiosClient.post("/auth/login", data);
};
export const register = async (data: any) => {
  return axiosClient.post("/auth/register", data);
};
