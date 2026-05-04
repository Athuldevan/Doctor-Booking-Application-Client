import { useState, useMemo } from "react";
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useGetPatientAppointments, useCancelSlot } from "../../hooks/useSlot";
import PageHeader from "../../components/custom/PageHeader";
import EmptyState from "../../components/custom/EmptyState";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../utils/getErrorMessage";

const statusColors: Record<string, string> = {
  confirmed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  cancelled: "bg-danger/10 text-danger border-danger/20",
  completed: "bg-primary/10 text-primary border-primary/20",
};

const statusIcons: Record<string, any> = {
  confirmed: CheckCircle2,
  pending: AlertCircle,
  cancelled: XCircle,
  completed: CheckCircle2,
};

export default function PatientAppointmentsPage() {
  const { data, isLoading, refetch } = useGetPatientAppointments();
  const cancelMutation = useCancelSlot();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const appointments = useMemo(() => {
    const list = data?.data || [];
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data]);

  const handleCancel = async (slotId: string, timeSlotId: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    
    try {
      await cancelMutation.mutateAsync({
        doctorSlotId: slotId,
        timeSlotId: timeSlotId,
      });
      toast.success("Appointment cancelled successfully");
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="My Appointments"
        description="View and manage your scheduled sessions"
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-16 w-16 text-muted/20" />}
          title="No appointments yet"
          description="You haven't booked any appointments. Start by finding a specialist."
        />
      ) : (
        <div className="grid gap-4">
          {appointments.map((slot: any) => (
            <div key={slot._id} className="space-y-3">
              {slot.timeSlots
                .filter((ts: any) => ["pending", "confirmed", "completed"].includes(ts.status))
                .map((ts: any) => {
                const StatusIcon = statusIcons[ts.status] || AlertCircle;
                const isPast = new Date(slot.date) < new Date();
                
                return (
                  <div 
                    key={ts._id}
                    className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-border bg-surface p-5 transition-all hover:border-primary/30 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Doctor Info */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                        {slot.doctorId?.user?.name?.charAt(0) || "D"}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">Dr. {slot.doctorId?.user?.name}</h3>
                        <p className="text-xs font-medium text-primary/80 uppercase tracking-wider">
                          {slot.doctorId?.specialization}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {ts.startTime} - {ts.endTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center justify-between border-t border-border/50 pt-4 sm:border-t-0 sm:pt-0">
                      <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusColors[ts.status]}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {ts.status}
                      </div>

                      <div className="flex items-center gap-2">
                        {ts.status === 'pending' || ts.status === 'confirmed' ? (
                          <button
                            onClick={() => handleCancel(slot._id, ts._id)}
                            disabled={cancelMutation.isPending}
                            className="rounded-xl px-4 py-2 text-xs font-bold text-danger transition hover:bg-danger/10"
                          >
                            Cancel
                          </button>
                        ) : null}
                        <button className="rounded-xl p-2 text-muted hover:bg-secondary/50">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
