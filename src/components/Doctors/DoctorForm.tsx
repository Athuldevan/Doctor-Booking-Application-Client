import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, User, Mail, Phone, Lock } from "lucide-react";
import RenderField from "../../components/custom/Form";
import { getErrorMessage } from "../../utils/getErrorMessage";
import {
  doctorSchema,
  type DoctorFormData,
} from "../../validations/doctor.validation";
import { useCreateDoctor } from "../../hooks/useDoctor";

const specializations = [
  { value: "cardiology", label: "Cardiology" },
  { value: "dermatology", label: "Dermatology" },
  { value: "neurology", label: "Neurology" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "dentistry", label: "Dentistry" },
  { value: "ophthalmology", label: "Ophthalmology" },
  { value: "general", label: "General Medicine" },
];

export default function DoctorFormPage() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      specialization: "",
      experience: 0 as any,
      consultationFee: 0 as any,
      bio: "",
      hospital: "",
      city: "",
    },
  });

  const { mutate, isPending, error } = useCreateDoctor();

  const onSubmit = (data: DoctorFormData) => {
    mutate(data, {
      onSuccess: () => navigate("/admin/doctors"),
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/doctors")}
          className="rounded-xl border border-border p-2.5 text-muted transition hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Doctor</h1>
          <p className="mt-1 text-sm text-muted">
            Add a new doctor to the platform
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="ui-card p-6 sm:p-8">
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            {getErrorMessage(error)}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ─── Account Info ──────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Account Information
            </h3>

            <RenderField
              name="name"
              label="Full Name"
              type="text"
              control={control}
              errors={errors}
              placeholder="Dr. John Doe"
              icon={<User className="h-4 w-4 text-muted" />}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <RenderField
                name="email"
                label="Email"
                type="email"
                control={control}
                errors={errors}
                placeholder="doctor@example.com"
                icon={<Mail className="h-4 w-4 text-muted" />}
              />

              <RenderField
                name="phone"
                label="Phone"
                type="tel"
                control={control}
                errors={errors}
                placeholder="+1 234 567 890"
                icon={<Phone className="h-4 w-4 text-muted" />}
              />
            </div>

            <RenderField
              name="password"
              label="Password"
              type="password"
              control={control}
              errors={errors}
              placeholder="Min 6 characters"
              icon={<Lock className="h-4 w-4 text-muted" />}
            />
          </div>

          <hr className="border-border" />

          {/* ─── Professional Info ──────────────────────────────────────────── */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Professional Information
            </h3>

            <RenderField
              name="specialization"
              label="Specialization"
              type="select"
              control={control}
              errors={errors}
              options={specializations}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <RenderField
                name="experience"
                label="Experience (years)"
                type="number"
                control={control}
                errors={errors}
                placeholder="10"
              />

              <RenderField
                name="consultationFee"
                label="Consultation Fee (₹)"
                type="number"
                control={control}
                errors={errors}
                placeholder="100"
              />
            </div>

            <RenderField
              name="bio"
              label="Bio"
              type="textarea"
              rows={4}
              control={control}
              errors={errors}
              placeholder="Brief description about the doctor..."
            />
          </div>

          <hr className="border-border" />

          {/* ─── Location ──────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Location
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <RenderField
                name="hospital"
                label="Hospital"
                type="text"
                control={control}
                errors={errors}
                placeholder="City Hospital"
              />

              <RenderField
                name="city"
                label="City"
                type="text"
                control={control}
                errors={errors}
                placeholder="New York"
              />
            </div>
          </div>

          {/* ─── Buttons ───────────────────────────────────────────────────── */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/admin/doctors")}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary flex-1 gap-2 disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Add Doctor"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
