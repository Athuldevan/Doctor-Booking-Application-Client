import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,

  Stethoscope,
  Phone,
  Mail,
  ChevronDown,
  Filter,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import { useAdminAppointments } from "../../hooks/useAdmin";
import { useUpdateSlotStatus } from "../../hooks/useSlot";
import type { AdminAppointment } from "../../apis/admin.api";
import { getErrorMessage } from "../../utils/getErrorMessage";
import EmptyState from "../../components/custom/EmptyState";
import PageHeader from "../../components/custom/PageHeader";

const ALL_STATUSES = ["pending", "confirmed", "cancelled", "completed"];

const statusColors: Record<string, string> = {
  available: "bg-secondary/50 text-muted",
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-success/10 text-success",
  cancelled: "bg-danger/10 text-danger",
  completed: "bg-primary/10 text-primary",
  blocked: "bg-secondary text-muted",
};

const statusDot: Record<string, string> = {
  pending: "bg-warning",
  confirmed: "bg-success",
  cancelled: "bg-danger",
  completed: "bg-primary",
};

export default function AdminAppointmentsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { data, isLoading, error } = useAdminAppointments({
    status: statusFilter || undefined,
    page,
    limit: 15,
  });

  const updateStatus = useUpdateSlotStatus();

  const appointments: AdminAppointment[] = data?.appointments ?? [];
  const totalPages = data?.totalPages ?? 1;

  // Client-side search by patient/doctor name
  const filtered = search
    ? appointments.filter(
      (a) =>
        a.patientName?.toLowerCase().includes(search.toLowerCase()) ||
        a.doctorName?.toLowerCase().includes(search.toLowerCase()),
    )
    : appointments;

  const handleStatusChange = (apt: AdminAppointment, newStatus: string) => {
    updateStatus.mutate(
      {
        doctorSlotId: apt.doctorSlotId,
        timeSlotId: String(apt.timeSlotId),
        status: newStatus,
      },
      { onSuccess: () => setOpenDropdown(null) },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Appointments"
          description="View and manage all patient appointments"
        />
        <button
          onClick={() => navigate("/admin/appointments/create")}
          className="btn-primary gap-2 h-11 px-6 rounded-xl shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" />
          Create Slots
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search patient or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ui-input pl-9 h-10 w-full"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-muted font-medium">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          <button
            onClick={() => { setStatusFilter(""); setPage(1); }}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${!statusFilter
                ? "bg-primary text-white"
                : "bg-secondary text-muted hover:bg-secondary/80"
              }`}
          >
            All
          </button>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${statusFilter === s
                  ? "bg-primary text-white"
                  : "bg-secondary text-muted hover:bg-secondary/80"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {getErrorMessage(error)}
        </div>
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-12 w-12" />}
          title="No appointments found"
          description="Try a different filter or search term."
        />
      ) : (
        <>
          <div className="ui-card overflow-hidden">
            {/* Summary bar */}
            <div className="border-b border-border bg-secondary/20 px-6 py-3 flex items-center justify-between">
              <p className="text-xs text-muted">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
                <span className="font-semibold text-foreground">{data?.total ?? 0}</span> appointments
              </p>
              <p className="text-xs text-muted">
                Page {page} of {totalPages}
              </p>
            </div>

            {/* Header row */}
            <div className="hidden border-b border-border bg-secondary/30 px-6 py-3 lg:grid lg:grid-cols-12 gap-4">
              <p className="col-span-3 text-[11px] font-bold uppercase tracking-wider text-muted">Patient</p>
              <p className="col-span-3 text-[11px] font-bold uppercase tracking-wider text-muted">Doctor</p>
              <p className="col-span-2 text-[11px] font-bold uppercase tracking-wider text-muted">Date & Time</p>
              <p className="col-span-2 text-[11px] font-bold uppercase tracking-wider text-muted">Fee</p>
              <p className="col-span-2 text-[11px] font-bold uppercase tracking-wider text-muted">Status</p>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {filtered.map((apt) => {
                const dropId = `${apt.doctorSlotId}-${apt.timeSlotId}`;
                return (
                  <div
                    key={dropId}
                    className="grid grid-cols-1 gap-4 px-6 py-4 transition hover:bg-secondary/10 lg:grid-cols-12 lg:items-center"
                  >
                    {/* Patient */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {apt.patientName ? apt.patientName.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {apt.patientName ?? <span className="italic text-muted">No patient</span>}
                        </p>
                        {apt.patientEmail && (
                          <p className="flex items-center gap-1 truncate text-xs text-muted">
                            <Mail className="h-3 w-3 shrink-0" />
                            {apt.patientEmail}
                          </p>
                        )}
                        {apt.patientPhone && (
                          <p className="flex items-center gap-1 text-xs text-muted">
                            <Phone className="h-3 w-3 shrink-0" />
                            {apt.patientPhone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Doctor */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-success/10 text-sm font-bold text-success">
                        <Stethoscope className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          Dr. {apt.doctorName}
                        </p>
                        <p className="truncate text-xs text-muted">{apt.specialization}</p>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="col-span-2">
                      <p className="flex items-center gap-1.5 text-sm text-foreground">
                        <Calendar className="h-3.5 w-3.5 text-muted" />
                        {new Date(apt.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-muted">
                        <Clock className="h-3 w-3" />
                        {apt.startTime} – {apt.endTime}
                      </p>
                    </div>

                    {/* Fee */}
                    <div className="col-span-2">
                      <p className="text-sm font-bold text-foreground">
                        ₹{apt.consultationFee.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-muted">Consultation</p>
                      {apt.cancelReason && (
                        <p className="mt-1 truncate text-xs text-danger" title={apt.cancelReason}>
                          ⚠ {apt.cancelReason}
                        </p>
                      )}
                    </div>

                    {/* Status & Actions */}
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="relative">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === dropId ? null : dropId)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${statusColors[apt.status]
                            }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusDot[apt.status] ?? "bg-muted"}`}
                          />
                          {apt.status}
                          <ChevronDown className="h-3 w-3" />
                        </button>

                        {openDropdown === dropId && (
                          <div className="absolute left-0 top-full z-20 mt-1 w-40 rounded-xl border border-border bg-surface py-1 shadow-xl">
                            {ALL_STATUSES.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => handleStatusChange(apt, opt)}
                                disabled={updateStatus.isPending}
                                className={`flex w-full items-center gap-2 px-4 py-2 text-left text-xs capitalize transition hover:bg-secondary ${apt.status === opt
                                    ? "font-bold text-primary"
                                    : "text-foreground"
                                  }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${statusDot[opt] ?? "bg-muted"}`}
                                />
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quick Actions for Pending */}
                      {apt.status === "pending" && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStatusChange(apt, "confirmed")}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 text-success transition hover:bg-success hover:text-white"
                            title="Confirm Appointment"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(apt, "cancelled")}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger/10 text-danger transition hover:bg-danger hover:text-white"
                            title="Cancel Appointment"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Pagination ────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted transition hover:bg-secondary disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${p === page
                      ? "bg-primary text-white"
                      : "border border-border bg-surface text-muted hover:bg-secondary"
                    }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted transition hover:bg-secondary disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
