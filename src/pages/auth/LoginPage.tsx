/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../../contexts/ThemeContext";
import { useLogin } from "../../hooks/useAuth";
import RenderField from "../../components/custom/Form";
import { Link, useNavigate } from "react-router-dom";
import { LockIcon, Mail } from "lucide-react";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { toast } from "react-toastify";

type LoginRole = "patient" | 'admin';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [role, setRole] = useState<LoginRole>("patient");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending, error } = useLogin();

  const navigate = useNavigate();

  const onSubmit = (data: LoginForm) => {
    mutate(
      { ...data, role },
      {
        onSuccess: (res: any) => {
          toast.success(`Welcome back, ${res.data?.name || "User"}!`);
          if (role === "admin") navigate("/admin");
          else navigate("/patient/doctors");
        },
      }
    );
  };

  return (
    <div className="relative flex min-h-full items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-6 right-6 rounded-control border border-border bg-surface p-2.5 text-muted transition hover:bg-surface-muted hover:text-foreground"
        aria-label="Toggle theme"
      >
        {resolvedTheme === "dark" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </button>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to your MediBook account
          </p>
        </div>

        <div className="ui-card p-6 sm:p-8">
          <div className="mb-6 flex rounded-control border border-border bg-surface-muted p-1">
            {(["patient", "admin"] as LoginRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 rounded-[0.625rem] px-4 py-2.5 text-sm font-medium capitalize transition-all ${
                  role === r
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-control border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mt-0.5 h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {getErrorMessage(error)}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <RenderField
              name="email"
              label="Email address"
              type="email"
              control={control}
              errors={errors}
              placeholder ='Enter your email'
              icon={<Mail />}
            />

            <RenderField
              name="password"
              label="Password"
              type="password"
              control={control}
              errors={errors}
              placeholder="Enter your password"
              icon={<LockIcon />}
            />
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                `Sign in as ${role === "admin" ? "Admin" : "Patient"}`
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
