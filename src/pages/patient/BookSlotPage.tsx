import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Loader2, 
  ChevronRight, 
  Clock, 
  Stethoscope,
  Info,
  XCircle
} from "lucide-react";
import { useGetSlotsByDoctor, useBookSlot } from "../../hooks/useSlot";
import { useGetDoctor } from "../../hooks/useDoctor";
import PageHeader from "../../components/custom/PageHeader";
import EmptyState from "../../components/custom/EmptyState";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { ISlot, ITimeSlot } from "../doctor/types/ISlot";
import { toast } from "react-toastify";

export default function PatientBookSlotPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState<string>(""); // Empty means all
  const { data: doctor, isLoading: isDoctorLoading } = useGetDoctor(doctorId || "");
  const { data, isLoading, error } = useGetSlotsByDoctor(doctorId || "", date || undefined);
  const bookSlotMutation = useBookSlot();

  const [selectedSlot, setSelectedSlot] = useState<{ 
    doctorSlotId: string; 
    timeSlotId: string;
    startTime: string;
    endTime: string;
  } | null>(null);

  const slots = data?.data || data || [];

  const handleBook = () => {
    if (!selectedSlot) return;
    
    const toastId = toast.loading("Processing your booking...");
    
    bookSlotMutation.mutate(
      { 
        doctorSlotId: selectedSlot.doctorSlotId, 
        timeSlotId: selectedSlot.timeSlotId 
      },
      {
        onSuccess: () => {
          toast.update(toastId, {
            render: "Appointment booked successfully! We've notified the doctor.",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          });
          navigate("/patient/doctors");
        },
        onError: (err) => {
          toast.update(toastId, {
            render: getErrorMessage(err),
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
        }
      }
    );
  };

  if (isDoctorLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20">
      {/* Top Navigation & Info */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate("/patient/doctors")}
            className="mt-1 rounded-2xl border border-border bg-surface p-3 text-muted shadow-sm transition hover:text-foreground hover:shadow-md active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <PageHeader
              title={`Book Appointment`}
              description={`Secure your session with Dr. ${doctor?.user?.name || "the specialist"}`}
            />
          </div>
        </div>
        
        {selectedSlot && (
          <div className="flex animate-in fade-in slide-in-from-right-4 duration-300">
            <button
              onClick={handleBook}
              disabled={bookSlotMutation.isPending}
              className="group btn-primary h-14 min-w-[240px] gap-3 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              {bookSlotMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <span className="flex flex-col items-start leading-none">
                    <span className="text-xs opacity-80 font-medium">Confirm Booking</span>
                    <span className="text-sm font-bold mt-1">{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                  </span>
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Doctor Brief Info Card */}
      <div className="ui-card p-6 border-l-4 border-l-primary flex flex-wrap gap-8 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
            {doctor?.user?.name?.charAt(0) || "D"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Dr. {doctor?.user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium text-muted flex items-center gap-1">
                <Stethoscope className="h-3.5 w-3.5" />
                {doctor?.specialization}
              </span>
              <span className="h-1 w-1 rounded-full bg-muted/30" />
              <span className="text-sm font-medium text-muted flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {doctor?.experience} Yrs Exp
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-xl bg-secondary/50 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted">Consultation Fee</p>
            <p className="text-lg font-bold text-foreground">₹{doctor?.consultationFee}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Calendar & Selection Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="ui-card p-6 space-y-6 sticky top-6">
            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-muted">
                1. Select Date
              </label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary transition-transform group-focus-within:scale-110" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="ui-input h-14 pl-12 font-medium focus:ring-4 ring-primary/5"
                  min={new Date().toISOString().split("T")[0]}
                />
                {date && (
                  <button 
                    onClick={() => setDate("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-primary hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-muted">
                  Booking is subject to availability. Please arrive 10 minutes before your scheduled time.
                </p>
              </div>
            </div>

            {selectedSlot && (
              <div className="animate-in zoom-in-95 duration-300 rounded-2xl bg-primary/5 p-5 border border-primary/20 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Booking Summary</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Date</span>
                    <span className="font-bold text-foreground">
                      {new Date(date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Time Slot</span>
                    <span className="font-bold text-foreground">{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-primary/10 flex justify-between text-base">
                    <span className="text-foreground font-medium">Amount Due</span>
                    <span className="font-black text-primary">₹{doctor?.consultationFee}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Time Slots Grid */}
        <div className="lg:col-span-8">
          <div className="mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted">2. Choose Available Time</h3>
          </div>

          {!selectedSlot && slots.length > 0 && (
            <div className="mb-6 rounded-2xl bg-primary/5 p-4 border border-primary/10 flex items-center gap-3 animate-pulse">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <p className="text-sm font-semibold text-primary">
                Select a preferred time slot below
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-danger/20 bg-danger/5 px-6 py-4 text-sm text-danger flex items-center gap-3">
              <div className="h-4 w-4 rounded-full bg-danger flex items-center justify-center text-[10px] text-white font-bold">!</div>
              {getErrorMessage(error)}
            </div>
          )}

          {isLoading ? (
            <div className="flex h-80 items-center justify-center rounded-[2.5rem] border-2 border-dashed border-border bg-surface/30">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Clock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
                </div>
                <p className="text-base font-bold text-foreground">Finding the best times...</p>
                <p className="text-sm text-muted">Syncing with Dr. {doctor?.user?.name}'s schedule</p>
              </div>
            </div>
          ) : slots.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={
                  <div className="relative">
                    <Calendar className="h-20 w-20 text-muted/20" />
                    <XCircle className="absolute -bottom-2 -right-2 h-8 w-8 text-danger/40 bg-surface rounded-full" />
                  </div>
                }
                title="Fully Booked"
                description={`Dr. ${doctor?.user?.name} has no available slots for ${new Date(date).toLocaleDateString("en-US", { month: 'long', day: 'numeric' })}.`}
                action={
                  <button onClick={() => setDate("")} className="btn-secondary">
                    View All Dates
                  </button>
                }
              />
            </div>
          ) : (
            <div className="space-y-8">
              {slots.map((slot: ISlot) => (
                <div key={slot._id} className="ui-card p-1">
                  <div className="p-6 md:p-8">
                    <div className="mb-8 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          {new Date(slot.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </h3>
                        <p className="text-sm text-muted mt-0.5">Choose from {slot.timeSlots.filter(t => t.status === "available").length} available sessions</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2 text-[10px] font-black uppercase text-muted tracking-widest shadow-inner">
                        {slot.slotDuration} MINS
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {slot.timeSlots.map((ts: ITimeSlot) => {
                        const isAvailable = ts.status === "available";
                        const isSelected = selectedSlot?.timeSlotId === ts._id;
                        
                        return (
                          <button
                            key={ts._id}
                            disabled={!isAvailable || bookSlotMutation.isPending}
                            onClick={() => setSelectedSlot({ 
                              doctorSlotId: slot._id, 
                              timeSlotId: ts._id!,
                              startTime: ts.startTime,
                              endTime: ts.endTime
                            })}
                            className={`group relative flex flex-col items-center justify-center rounded-[1.25rem] border-2 py-5 px-3 transition-all duration-300
                              ${
                                isSelected
                                  ? "border-primary bg-primary shadow-xl shadow-primary/20 -translate-y-1"
                                  : isAvailable
                                    ? "border-border bg-surface hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-0.5"
                                    : "border-border bg-secondary/30 opacity-40 cursor-not-allowed"
                              }
                            `}
                          >
                            <p className={`text-base font-black ${isSelected ? "text-white" : isAvailable ? "text-foreground" : "text-muted"}`}>
                              {ts.startTime}
                            </p>
                            <p className={`mt-1 text-[10px] font-bold uppercase tracking-widest ${isSelected ? "text-white/80" : isAvailable ? "text-success" : "text-muted"}`}>
                              {isSelected ? "Selected" : isAvailable ? "Open" : "Booked"}
                            </p>
                            
                            {isSelected && (
                              <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary shadow-lg ring-2 ring-primary animate-in zoom-in-50 duration-300">
                                <ChevronRight className="h-4 w-4" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
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

