// apis/slot.ts
import axiosClient from "../lib/axios";

export const createSlot = async (data: {
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
}) => {
  const res = await axiosClient.post("/slots", data);
  return res.data;
};

export const getAllSlots = async () => {
  const res = await axiosClient.get("/slots");
  return res.data;
};

export const getSlotsByDoctor = async (doctorId: string, date?: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {};
  if (date) params.date = date;
  const res = await axiosClient.get(`/slots/doctor/${doctorId}`, {
    params,
  });
  return res.data;
};

export const updateSlotStatus = async (data: {
  doctorSlotId: string;
  timeSlotId: string;
  status: string;
}) => {
  const res = await axiosClient.patch(
    `/slots/${data.doctorSlotId}/status/${data.timeSlotId}`,
    { status: data.status }
  );
  return res.data;
};

export const bookSlot = async (data: {
  doctorSlotId: string;
  timeSlotId: string;
}) => {
  const res = await axiosClient.post(
    `/slots/${data.doctorSlotId}/book/${data.timeSlotId}`
  );
  return res.data;
};

export const cancelSlot = async (data: {
  doctorSlotId: string;
  timeSlotId: string;
  cancelReason?: string;
}) => {
  const res = await axiosClient.patch(
    `/slots/${data.doctorSlotId}/cancel/${data.timeSlotId}`,
    { cancelReason: data.cancelReason }
  );
  return res.data;
};

export const deleteSlot = async (doctorSlotId: string) => {
  const res = await axiosClient.delete(`/slots/${doctorSlotId}`);
  return res.data;
};