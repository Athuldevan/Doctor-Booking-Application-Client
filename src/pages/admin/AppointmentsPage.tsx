// pages/admin/appointments/index.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Calendar,
  Clock,
  Loader2,
  ChevronDown,
  Trash2,
} from "lucide-react";
import PageHeader from "../../components/custom/PageHeader";
import EmptyState from "../../components/custom/EmptyState";
import DeleteModal from "../../components/custom/DeleteModel";
import {
  useDeleteSlot,
  useGetAllSlots,
  useUpdateSlotStatus,
} from "../../hooks/useSlot";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { ISlot, ITimeSlot } from "../doctor/types/ISlot";

const statusColors: Record<string, string> = {
  available: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-primary/10 text-primary",
  cancelled: "bg-danger/10 text-danger",
  completed: "bg-muted/10 text-muted",
  blocked: "bg-secondary text-muted",
};

const statusOptions = [
  "available",
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "blocked",
];

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAllSlots();
  const updateStatus = useUpdateSlotStatus();
  const deleteMutation = useDeleteSlot();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const slots: ISlot[] = data?.data || data || [];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Manage doctor slots and bookings"
        action={
          <button
            onClick={() => navigate("/admin/appointments/create")}
            className="btn-primary gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Slots
          </button>
        }
      />

      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {getErrorMessage(error)}
        </div>
      )}

      {slots.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-12 w-12" />}
          title="No appointments yet"
          description="Create slots for doctors to get started"
          action={
            <button
              onClick={() => navigate("/admin/appointments/create")}
              className="btn-primary gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Slots
            </button>
          }
        />
      ) : (
        <div className="space-y-6">
          {slots.map((slot: ISlot) => (
            <div key={slot._id} className="ui-card overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                    {slot.doctorId?.user?.name?.charAt(0) || "D"}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Dr. {slot.doctorId?.user?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted">
                      {slot.doctorId?.specialization}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted">
                    <Calendar className="h-4 w-4" />
                    {new Date(slot.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted">
                    <Clock className="h-4 w-4" />
                    {slot.slotDuration} min
                  </div>
                  <button
                    onClick={() => setDeleteId(slot._id)}
                    className="rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {slot.timeSlots.map((ts: ITimeSlot) => (
                    <div
                      key={ts._id}
                      className="relative rounded-xl border border-border p-3 transition hover:border-primary/30"
                    >
                      <p className="text-sm font-medium text-foreground">
                        {ts.startTime} - {ts.endTime}
                      </p>

                      {ts.patient && (
                        <p className="mt-1 truncate text-xs text-muted">
                          👤 {ts.patient.name}
                        </p>
                      )}

                      {ts.reason && (
                        <p className="mt-0.5 truncate text-xs text-muted">
                          📝 {ts.reason}
                        </p>
                      )}

                      {/* Status Dropdown */}
                      <div className="mt-2">
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === ts._id ? null : (ts._id ?? null),
                            )
                          }
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium capitalize ${
                            statusColors[ts.status]
                          }`}
                        >
                          {ts.status}
                          <ChevronDown className="h-3 w-3" />
                        </button>

                        {openDropdown === ts._id && (
                          <div className="absolute left-0 top-full z-10 mt-1 w-36 rounded-xl border border-border bg-surface py-1 shadow-lg">
                            {statusOptions.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => {
                                  updateStatus.mutate({
                                    doctorSlotId: slot._id,
                                    timeSlotId: ts._id!,
                                    status: opt,
                                  });
                                  setOpenDropdown(null);
                                }}
                                className={`w-full px-4 py-2 text-left text-xs capitalize hover:bg-secondary ${
                                  ts.status === opt
                                    ? "font-semibold text-primary"
                                    : "text-foreground"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="flex flex-wrap gap-4 border-t border-border bg-secondary/30 px-6 py-3">
                <SlotCount
                  label="Total"
                  count={slot.timeSlots.length}
                  color="text-foreground"
                />
                <SlotCount
                  label="Available"
                  count={
                    slot.timeSlots.filter((t) => t.status === "available")
                      .length
                  }
                  color="text-success"
                />
                <SlotCount
                  label="Pending"
                  count={
                    slot.timeSlots.filter((t) => t.status === "pending").length
                  }
                  color="text-warning"
                />
                <SlotCount
                  label="Confirmed"
                  count={
                    slot.timeSlots.filter((t) => t.status === "confirmed")
                      .length
                  }
                  color="text-primary"
                />
                <SlotCount
                  label="Cancelled"
                  count={
                    slot.timeSlots.filter((t) => t.status === "cancelled")
                      .length
                  }
                  color="text-danger"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteModal
        isOpen={!!deleteId}
        title="Delete slots?"
        message="All time slots and bookings will be removed."
        isLoading={deleteMutation.isPending}
        onClose={() => setDeleteId(null)}
        onConfirm={() =>
          deleteMutation.mutate(deleteId!, {
            onSuccess: () => setDeleteId(null),
          })
        }
      />
    </div>
  );
}

function SlotCount({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className="text-muted">{label}:</span>
      <span className={`font-semibold ${color}`}>{count}</span>
    </div>
  );
}
