// hooks/useDoctors.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../apis/doctor.api";
import type { IDoctor } from "../pages/doctor/types/doctor";

interface ApiError {
  message: string;
}

export const useGetDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });
};

export const useGetDoctor = (query: Partial<IDoctor>) => {
  return useQuery({
    queryKey: ["doctors", query],
    queryFn: () => getDoctor(query),
    enabled: !!query._id,
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiError>, Partial<IDoctor>>({
    mutationFn: createDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiError>, Partial<IDoctor>>({
    mutationFn: updateDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiError>, Partial<IDoctor>>({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};
