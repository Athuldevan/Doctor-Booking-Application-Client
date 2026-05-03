import { useMutation } from "@tanstack/react-query";
import { login, register } from "../apis/auth.api";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/getErrorMessage";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Successfully Registered");
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
