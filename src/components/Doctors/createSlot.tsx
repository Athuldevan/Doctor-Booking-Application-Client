import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Clock, Timer, User } from "lucide-react";
import type { IDoctor } from "../../pages/doctor/types/doctor";
import { useGetDoctors } from "../../hooks/useDoctor";
import { slotSchema, type SlotFormData } from "../../validations/slot.validation";
import { useCreateSlot } from "../../hooks/useSlot";
import RenderField from "../custom/Form";
import { getErrorMessage } from "../../utils/getErrorMessage";

const durations = [
  { value: "15", label: "15 minutes" },
  { value: "20", label: "20 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
];

export default function CreateSlotPage() {
  const navigate = useNavigate();

  const { data: doctorsData, isLoading: isDoctorsLoading } = useGetDoctors();
  const doctors = doctorsData?.data || doctorsData || [];

  const doctorOptions = doctors.map((doc: IDoctor) => ({
    value: doc._id,
    label: `Dr. ${doc.user?.name} — ${doc.specialization}`,
  }));

  const {
    control,
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = useForm<SlotFormData>({
    resolver: zodResolver(slotSchema),
    defaultValues: {
      doctorId: "",
      date: "",
      startTime: "",
      endTime: "",
      slotDuration: "30",
    },
  });

  const { mutate, isPending, error } = useCreateSlot();

  // preview
  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const slotDuration = watch("slotDuration");
  const preview = generatePreview(startTime, endTime, Number(slotDuration));

  const onSubmit = (data: SlotFormData) => {
    mutate(
      {
        doctorId: data.doctorId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        slotDuration: Number(data.slotDuration),
      },
      { onSuccess: () => navigate("/admin/appointments") }
    );
  };

  // loading state for doctors
  if (isDoctorsLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/appointments")}
          className="rounded-xl border border-border p-2.5 text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Create Appointment Slots
          </h1>
          <p className="text-sm text-muted">
            Set up time slots for a doctor
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="ui-card p-6 sm:p-8">
        {error && (
          <div className="mb-6 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            {getErrorMessage(error)}
          </div>
        )}

        {/* No doctors warning */}
        {doctors.length === 0 && (
          <div className="mb-6 rounded-xl border border-warning/20 bg-warning/5 px-4 py-3 text-sm text-warning">
            No doctors found. Please add a doctor first.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ─── Select Doctor ──────────────────────────────────────────── */}
          <RenderField
            name="doctorId"
            label="Select Doctor"
            type="select"
            control={control}
            errors={errors}
            options={doctorOptions}
            placeholder="Choose a doctor"
            icon={<User className="h-4 w-4 text-muted" />}
          />

          {/* ─── Date ──────────────────────────────────────────────────── */}
          <RenderField
            name="date"
            label="Date"
            type="date"
            control={control}
            errors={errors}
            min={new Date().toISOString().split("T")[0]}
          />

          {/* ─── Start Time + End Time ─────────────────────────────────── */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Start Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="time"
                  {...register("startTime")}
                  className="ui-input pl-10"
                />
              </div>
              {errors.startTime && (
                <p className="mt-1.5 text-xs text-danger">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                End Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="time"
                  {...register("endTime")}
                  className="ui-input pl-10"
                />
              </div>
              {errors.endTime && (
                <p className="mt-1.5 text-xs text-danger">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          {/* ─── Slot Duration ─────────────────────────────────────────── */}
          <RenderField
            name="slotDuration"
            label="Slot Duration"
            type="select"
            control={control}
            errors={errors}
            options={durations}
            icon={<Timer className="h-4 w-4 text-muted" />}
          />

          {/* ─── Preview ───────────────────────────────────────────────── */}
          {preview.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted">
                Preview — {preview.length} slots will be created
              </h3>
              <div className="flex flex-wrap gap-2">
                {preview.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                  >
                    {s.start} — {s.end}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ─── Buttons ───────────────────────────────────────────────── */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/admin/appointments")}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || preview.length === 0 || doctors.length === 0}
              className="btn-primary flex-1 gap-2 disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                `Create ${preview.length} Slots`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generatePreview(start: string, end: string, duration: number) {
  if (!start || !end || !duration) return [];

  const slots: { start: string; end: string }[] = [];
  let current = start;

  while (current < end) {
    const next = addMinutes(current, duration);
    if (next > end) break;
    slots.push({ start: current, end: next });
    current = next;
  }

  return slots;
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return time;
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60).toString().padStart(2, "0");
  const newM = (total % 60).toString().padStart(2, "0");
  return `${newH}:${newM}`;
}