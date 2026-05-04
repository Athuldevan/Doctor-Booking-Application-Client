import {
  Stethoscope,
  Users,
  Calendar,
  IndianRupee,
  Loader2,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
} from "lucide-react";
import { useAdminDashboard } from "../../hooks/useAdmin";
import { getErrorMessage } from "../../utils/getErrorMessage";

const statusColors: Record<string, string> = {
  confirmed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  cancelled: "bg-danger/10 text-danger",
  completed: "bg-primary/10 text-primary",
};

const statusIcon: Record<string, React.ElementType> = {
  confirmed: CheckCircle2,
  pending: AlertCircle,
  cancelled: XCircle,
  completed: Activity,
};

export default function AdminDashboard() {
  const { data, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
        {getErrorMessage(error)}
      </div>
    );
  }

  const overview = data?.overview;
  const breakdown = data?.slotStatusBreakdown;
  const topDoctors = data?.topDoctors ?? [];
  const recentBookings = data?.recentBookings ?? [];
  const trend = data?.bookingTrend ?? [];

  // Find max for bar chart scaling
  const trendMax = Math.max(1, ...trend.map((t) => t.confirmed + t.pending + t.cancelled));

  const statCards = [
    {
      label: "Total Doctors",
      value: overview?.totalDoctors ?? 0,
      icon: Stethoscope,
      color: "text-primary bg-primary/10",
      sub: "Active doctors",
    },
    {
      label: "Total Patients",
      value: overview?.totalPatients ?? 0,
      icon: Users,
      color: "text-success bg-success/10",
      sub: "Registered users",
    },
    {
      label: "Total Bookings",
      value: overview?.totalBookings ?? 0,
      icon: Calendar,
      color: "text-warning bg-warning/10",
      sub: "All time slots",
    },
    {
      label: "Revenue (Confirmed)",
      value: `₹${(overview?.totalRevenue ?? 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-purple-400 bg-purple-400/10",
      sub: "From confirmed slots",
    },
  ];

  const breakdownItems = [
    { label: "Pending", value: breakdown?.pending ?? 0, color: "bg-warning", textColor: "text-warning" },
    { label: "Confirmed", value: breakdown?.confirmed ?? 0, color: "bg-success", textColor: "text-success" },
    { label: "Cancelled", value: breakdown?.cancelled ?? 0, color: "bg-danger", textColor: "text-danger" },
    { label: "Completed", value: breakdown?.completed ?? 0, color: "bg-primary", textColor: "text-primary" },
  ];

  const totalNonAvailable =
    (breakdown?.pending ?? 0) +
    (breakdown?.confirmed ?? 0) +
    (breakdown?.cancelled ?? 0) +
    (breakdown?.completed ?? 0) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Live metrics from your database — updated every 30 seconds.
        </p>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="ui-card flex items-center gap-4 p-5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.color}`}
            >
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted">{card.label}</p>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-[11px] text-muted">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Middle row: breakdown + trend ────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Booking Status Breakdown */}
        <div className="ui-card p-6">
          <h2 className="mb-5 font-semibold text-foreground">Booking Status Breakdown</h2>
          <div className="space-y-4">
            {breakdownItems.map((item) => {
              const pct = Math.round((item.value / totalNonAvailable) * 100);
              return (
                <div key={item.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{item.label}</span>
                    <span className={`font-bold ${item.textColor}`}>
                      {item.value} <span className="text-xs text-muted font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* Also show available */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-secondary/40 px-4 py-3">
            <span className="text-sm text-muted">Available slots (not booked)</span>
            <span className="font-bold text-foreground">{breakdown?.available ?? 0}</span>
          </div>
        </div>

        {/* 7-Day Booking Trend */}
        <div className="ui-card p-6">
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-foreground">7-Day Booking Trend</h2>
          </div>
          {trend.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted">
              No booking data for the last 7 days.
            </div>
          ) : (
            <div className="flex h-36 items-end gap-2">
              {trend.map((day) => {
                const total = day.confirmed + day.pending + day.cancelled;
                const heightPct = Math.round((total / trendMax) * 100);
                const label = new Date(day._id).toLocaleDateString("en-US", {
                  weekday: "short",
                });
                return (
                  <div key={day._id} className="group relative flex flex-1 flex-col items-center gap-1">
                    {/* Tooltip */}
                    <div className="absolute -top-10 hidden rounded-lg border border-border bg-surface px-2 py-1 text-[11px] shadow-lg group-hover:block z-10 whitespace-nowrap">
                      ✅ {day.confirmed} confirmed · ⏳ {day.pending} pending · ❌ {day.cancelled} cancelled
                    </div>
                    <div
                      className="w-full rounded-t-lg bg-primary/70 transition-all duration-500 group-hover:bg-primary"
                      style={{ height: `${Math.max(4, heightPct)}%` }}
                    />
                    <span className="text-[10px] text-muted">{label}</span>
                    <span className="text-[10px] font-bold text-foreground">{total}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom row: top doctors + recent bookings ─────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Bookings */}
        <div className="ui-card lg:col-span-3">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-semibold text-foreground">Recent Bookings</h2>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Live
            </span>
          </div>
          {recentBookings.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-sm text-muted">
              No recent bookings
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentBookings.map((b, i) => {
                const Icon = statusIcon[b.status] ?? Clock;
                return (
                  <div key={i} className="flex items-center justify-between px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {b.patientName ? b.patientName.charAt(0) : "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{b.patientName}</p>
                        <p className="text-xs text-muted">Dr. {b.doctorName} · {b.specialization}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden text-right sm:block">
                        <p className="text-xs text-muted">
                          {new Date(b.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-muted">{b.startTime}</p>
                      </div>
                      <span
                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium capitalize ${
                          statusColors[b.status]
                        }`}
                      >
                        <Icon className="h-3 w-3" />
                        {b.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Doctors by Revenue */}
        <div className="ui-card lg:col-span-2">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-semibold text-foreground">Top Doctors</h2>
            <p className="text-xs text-muted">By confirmed appointments</p>
          </div>
          {topDoctors.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-sm text-muted">
              No confirmed appointments yet
            </div>
          ) : (
            <div className="divide-y divide-border">
              {topDoctors.map((doc, idx) => (
                <div key={doc.doctorId} className="flex items-center gap-3 px-6 py-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-black text-muted">
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      Dr. {doc.name}
                    </p>
                    <p className="truncate text-xs text-muted">{doc.specialization}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-success">
                      ₹{doc.revenue.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-muted">{doc.confirmedBookings} confirmed</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}