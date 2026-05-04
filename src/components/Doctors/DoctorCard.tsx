/* eslint-disable @typescript-eslint/no-explicit-any */
// components/doctor/DoctorCard.tsx
import { useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

interface DoctorCardProps {
  doctor: any;
  variant?: "patient" | "admin";
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onBook?: (id: string) => void;
}

export default function DoctorCard({
  doctor,
  variant = "patient",
  onEdit,
  onDelete,
  onBook,
}: DoctorCardProps) {
  const navigate = useNavigate();

  return (
    <div className="ui-card overflow-hidden transition hover:shadow-lg">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
            {doctor.userId?.name?.charAt(0) || "D"}
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-foreground">
              Dr. {doctor.userId?.name}
            </h3>
            <span className="mt-1 inline-block rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-primary">
              {doctor.specialization}
            </span>
          </div>

          {doctor.isVerified && (
            <CheckCircle className="h-5 w-5 text-success" />
          )}
        </div>

        {/* Details */}
        <div className="mt-4 space-y-2">
          <DoctorDetail
            icon={<Clock className="h-4 w-4" />}
            text={`${doctor.experience} years experience`}
          />
          {doctor.hospital && (
            <DoctorDetail
              icon={<MapPin className="h-4 w-4" />}
              text={`${doctor.hospital}${doctor.city ? `, ${doctor.city}` : ""}`}
            />
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-5 py-3">
        <p className="text-lg font-bold text-foreground">
          ₹{doctor.consultationFee}
          <span className="text-xs font-normal text-muted"> / visit</span>
        </p>

        {variant === "patient" && (
          <button
            onClick={() => onBook?.(doctor._id) || navigate(`/doctors/${doctor._id}`)}
            className="btn-primary gap-1 py-2 text-sm"
          >
            Book
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {variant === "admin" && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(doctor._id)}
              className="btn-secondary py-2 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(doctor._id)}
              className="rounded-xl bg-danger/10 px-4 py-2 text-sm font-medium text-danger"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DoctorDetail({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted">
      {icon}
      {text}
    </div>
  );
}