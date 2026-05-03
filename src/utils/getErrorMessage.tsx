// utils/getErrorMessage.ts
import type { AxiosError } from "axios";

interface ApiError {
  message: string;
}

export function getErrorMessage(error: AxiosError<ApiError> | Error | null): string {
  if (!error) return "";

  const axiosError = error as AxiosError<ApiError>;

  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message;
  }

  return error.message || "Something went wrong";
}