import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, register, logout } from "../apis/auth.api";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useNavigate } from "react-router-dom";
import type  { IUser } from "../types/user";


export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      
    },
    onError: (error) => {
      const err = getErrorMessage(error);
      toast.error(err || "something went wrong");
    },
  });
};
export const useRegister = () => {
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success("Successfully Registered");
    },
    onError: (error) => {
      const err = getErrorMessage(error);
      toast.error(err || "something went wrong");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.clear();
      queryClient.clear();
      navigate("/login");
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      localStorage.clear();
      queryClient.clear();
      navigate("/login");
      console.error("Logout error:", error);
    },
  });
};


export const useUser = (): IUser | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as IUser;
  } catch {
    return null;
  }
};
