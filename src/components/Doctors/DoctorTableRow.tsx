/* eslint-disable @typescript-eslint/no-explicit-any */
// components/doctor/DoctorTableRow.tsx
import {
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";

interface DoctorTableRowProps {
  doctor: any;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function DoctorTableRow({
  doctor,
  onEdit,
  onDelete,
}: DoctorTableRowProps) {
  return (
    <tr className="hover:bg-secondary/30">
      {/* Doctor */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
            {doctor.userId?.name?.charAt(0) || "D"}
          </div>
          <div>
            <p className="font-medium text-foreground">
              Dr. {doctor.userId?.name}
            </p>
            <p className="text-xs text-muted">{doctor.userId?.email}</p>
          </div>
        </div>
      </td>

      {/* Specialization */}
      <td className="px-6 py-4">
        <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">
          {doctor.specialization}
        </span>
      </td>

      {/* Experience */}
      <td className="px-6 py-4 text-sm text-foreground">
        {doctor.experience} yrs
      </td>

      {/* Fee */}
      <td className="px-6 py-4 text-sm font-medium text-foreground">
        ${doctor.consultationFee}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge verified={doctor.isVerified} />
      </td>

      {/* Rating */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-foreground">
            {doctor.rating || 0}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(doctor._id)}
              className="rounded-lg p-2 text-muted hover:bg-primary/10 hover:text-primary"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(doctor._id)}
              className="rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function StatusBadge({ verified }: { verified: boolean }) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
        <CheckCircle className="h-3 w-3" />
        Verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
      <XCircle className="h-3 w-3" />
      Pending
    </span>
  );
}