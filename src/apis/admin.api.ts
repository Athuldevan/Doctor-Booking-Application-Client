import axiosClient from "../lib/axios";

export interface DashboardMetrics {
  overview: {
    totalDoctors: number;
    totalPatients: number;
    totalAdmins: number;
    totalBookings: number;
    totalRevenue: number;
  };
  slotStatusBreakdown: {
    available: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  };
  topDoctors: {
    doctorId: string;
    name: string;
    specialization: string;
    consultationFee: number;
    confirmedBookings: number;
    revenue: number;
  }[];
  recentBookings: {
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    doctorName: string;
    specialization: string;
    patientName: string;
    consultationFee: number;
  }[];
  bookingTrend: {
    _id: string;
    confirmed: number;
    pending: number;
    cancelled: number;
  }[];
}

export interface AdminAppointment {
  doctorSlotId: string;
  timeSlotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  cancelledBy?: string | null;
  cancelReason?: string | null;
  doctorId: string;
  doctorName: string;
  doctorEmail: string;
  specialization: string;
  consultationFee: number;
  patientId?: string | null;
  patientName?: string | null;
  patientEmail?: string | null;
  patientPhone?: string | null;
}

export interface AdminAppointmentsResponse {
  appointments: AdminAppointment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const res = await axiosClient.get("/admin/dashboard");
  return res.data.data;
};

export const getAdminAppointments = async (params: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<AdminAppointmentsResponse> => {
  const res = await axiosClient.get("/admin/appointments", { params });
  return res.data.data;
};
