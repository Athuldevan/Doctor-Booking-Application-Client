// hooks/useSlots.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  createSlot,
  getAllSlots,
  getSlotsByDoctor,
  updateSlotStatus,
  bookSlot,
  cancelSlot,
  deleteSlot,
} from "../apis/slot";

interface ApiError {
  message: string;
}

export const useCreateSlot = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiError>,
    {
      doctorId: string;
      date: string;
      startTime: string;
      endTime: string;
      slotDuration: number;
    }
  >({
    mutationFn: createSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

export const useGetAllSlots = () => {
  return useQuery({
    queryKey: ["slots"],
    queryFn: getAllSlots,
  });
};

export const useGetSlotsByDoctor = (doctorId: string, date?: string) => {
  return useQuery({
    queryKey: ["slots", doctorId, date],
    queryFn: () => getSlotsByDoctor(doctorId, date),
    enabled: !!doctorId,
  });
};

export const useUpdateSlotStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiError>,
    {
      doctorSlotId: string;
      timeSlotId: string;
      status: string;
    }
  >({
    mutationFn: updateSlotStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

export const useBookSlot = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiError>,
    {
      doctorSlotId: string;
      timeSlotId: string;
    }
  >({
    mutationFn: bookSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};
export const useCancelSlot = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiError>,
    {
      doctorSlotId: string;
      timeSlotId: string;
      cancelReason?: string;
    }
  >({
    mutationFn: cancelSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

export const useDeleteSlot = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiError>, string>({
    mutationFn: deleteSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};