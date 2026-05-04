// src/pages/auth/RegisterPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Lock, Mail, Phone, User, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RenderField from "../../components/custom/Form";
import { useRegister } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/getErrorMessage";
import {
  registerSchema,
  type RegisterFormData,
} from "../../validations/auth.validator";

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "patient",
      phone: "",
    },
  });

  const { mutate, isPending, error } = useRegister();

  const onSubmit = (data: RegisterFormData) => {
    console.log("Sending:", data);
    mutate(data);
  };

  return (
    <div className="relative flex min-h-full items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted">
            Join MediBook and book appointments easily
          </p>
        </div>

        <div className="ui-card p-6 sm:p-8">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {getErrorMessage(error)}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">


            <RenderField
              name="name"
              label="Full Name"
              type="text"
              control={control}
              errors={errors}
              placeholder="John Doe"
              icon={<User className="h-4 w-4 text-muted" />}
            />

            <RenderField
              name="email"
              label="Email address"
              type="email"
              control={control}
              errors={errors}
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4 text-muted" />}
            />
            <RenderField
              name="phone"
              label="Phone Number"
              type="text"
              control={control}
              errors={errors}
              placeholder="1234567890"
              icon={<Phone className="h-4 w-4 text-muted" />}
            />

            <RenderField
              name="password"
              label="Password"
              type="password"
              control={control}
              errors={errors}
              placeholder="Min 6 characters"
              icon={<Lock className="h-4 w-4 text-muted" />}
            />

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="btn-outline w-full gap-2 transition-all duration-200 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn className="h-4 w-4" />
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
