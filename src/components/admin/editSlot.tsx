// components/admin/editSlot.tsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Clock, Timer, User } from "lucide-react";
import { useGetDoctors } from "../../hooks/useDoctor";
import { useGetSlot, useUpdateSlotGroup } from "../../hooks/useSlot";
import type { IDoctor } from "../../pages/doctor/types/doctor";
import { slotSchema, type SlotFormData } from "../../validations/slot.validation";
import { getErrorMessage } from "../../utils/getErrorMessage";
import RenderField from "../custom/Form";
import { toast } from "react-toastify";

const durations = [
  { value: "15", label: "15 minutes" },
  { value: "20", label: "20 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
];

export default function EditSlotPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: slotData, isLoading: isFetching } = useGetSlot(id!);
  const { data: doctorsData } = useGetDoctors();
  const { mutate, isPending, error } = useUpdateSlotGroup();

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
    reset,
    formState: { errors },
  } = useForm<SlotFormData>({
    resolver: zodResolver(slotSchema),
  });

  useEffect(() => {
    if (slotData) {
      reset({
        doctorId: slotData.doctorId?._id || "",
        date: slotData.date ? new Date(slotData.date).toISOString().split("T")[0] : "",
        startTime: slotData.startTime || "",
        endTime: slotData.endTime || "",
        slotDuration: String(slotData.slotDuration || 30),
      });
    }
  }, [slotData, reset]);

  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const slotDuration = watch("slotDuration");
  const preview = generatePreview(startTime, endTime, Number(slotDuration));

  const onSubmit = (data: SlotFormData) => {
    const timeSlots = preview.map((p) => ({
      startTime: p.start,
      endTime: p.end,
      status: "available", // Note: This might overwrite existing bookings if not careful
    }));

    mutate(
      {
        id: id!,
        data: {
          doctorId: data.doctorId,
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          slotDuration: Number(data.slotDuration),
          timeSlots,
        },
      },
      {
        onSuccess: () => {
          toast.success("Appointment slots updated!");
          navigate("/admin/appointments");
        },
      }
    );
  };

  if (isFetching) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/appointments")}
          className="rounded-xl border border-border p-2.5 text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground text-surface-foreground">
            Edit Appointment Slots
          </h1>
          <p className="text-sm text-muted">
            Update time slots for this session
          </p>
        </div>
      </div>

      <div className="ui-card p-6 sm:p-8">
        {error && (
          <div className="mb-6 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            {getErrorMessage(error)}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <RenderField
            name="date"
            label="Date"
            type="date"
            control={control}
            errors={errors}
          />

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

          <RenderField
            name="slotDuration"
            label="Slot Duration"
            type="select"
            control={control}
            errors={errors}
            options={durations}
            icon={<Timer className="h-4 w-4 text-muted" />}
          />

          {preview.length > 0 && (
            <div className="rounded-2xl bg-primary/5 p-4 border border-primary/10">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
                Preview — {preview.length} slots will be re-generated
              </h3>
              <div className="flex flex-wrap gap-2">
                {preview.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-surface border border-border px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    {s.start} — {s.end}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[10px] text-danger font-medium uppercase">
                ⚠️ Warning: Re-generating slots will reset existing status for this group.
              </p>
            </div>
          )}

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
              disabled={isPending || preview.length === 0}
              className="btn-primary flex-1 gap-2 disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                `Update to ${preview.length} Slots`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
