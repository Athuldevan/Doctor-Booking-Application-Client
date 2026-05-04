import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics, getAdminAppointments } from "../apis/admin.api";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getDashboardMetrics,
    staleTime: 30_000,
  });
};

export const useAdminAppointments = (opts: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["admin-appointments", opts.status, opts.page],
    queryFn: () => getAdminAppointments(opts),
    staleTime: 15_000,
  });
};
