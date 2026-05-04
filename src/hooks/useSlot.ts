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
import axiosClient from "../lib/axios";
import { toast } from "react-toastify";

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
      timeSlots: { startTime: string; endTime: string; status: string }[];
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
      toast.success("Appointment status updated!");
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
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

export const useGetSlot = (id: string) => {
  return useQuery({
    queryKey: ["slots", id],
    queryFn: () => getAllSlots().then(res => {
      const slots = res.data || res;
      return slots.find((s: any) => s._id === id);
    }),
    enabled: !!id,
  });
};

export const useUpdateSlotGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiError>,
    {
      id: string;
      data: any;
    }
  >({
    mutationFn: ({ id, data }) => axiosClient.patch(`/slots/${id}`, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

export const useGetPatientAppointments = () => {
  return useQuery({
    queryKey: ["patient-appointments"],
    queryFn: () => axiosClient.get("/slots/patient/history").then(res => res.data),
  });
};