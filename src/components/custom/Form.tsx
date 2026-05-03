/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ReactNode } from "react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form";

export interface SelectOption {
  value: string;
  label: string;
}

interface BaseFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  errors: FieldErrors<T>;
  disabled?: boolean;
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
  onChangeProp?: (value: any, defaultOnChange: (v: any) => void) => void;
}

interface TextFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "text" | "email" | "number" | "password" | "tel" | "textarea";
  rows?: number;
  options?: never;
}

interface SelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "select";
  options: SelectOption[];
}

interface MultiSelectFieldProps<
  T extends FieldValues,
> extends BaseFieldProps<T> {
  type: "multiselect";
  options: SelectOption[];
}

interface CheckboxFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "checkbox";
  checkboxLabel?: string;
}

interface RadioFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "radio";
  options: SelectOption[];
}

interface DateFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "date";
  min?: string;
  max?: string;
}

interface SwitchFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "switch";
  description?: string | ((value: boolean) => string);
  activeColor?: "primary" | "accent" | "success" | "warning" | "danger";
}

type RenderFieldProps<T extends FieldValues> =
  | TextFieldProps<T>
  | SelectFieldProps<T>
  | MultiSelectFieldProps<T>
  | CheckboxFieldProps<T>
  | RadioFieldProps<T>
  | DateFieldProps<T>
  | SwitchFieldProps<T>;

function getNestedError<T extends FieldValues>(
  errors: FieldErrors<T>,
  name: Path<T>,
) {
  const parts = String(name)
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".");
  let current: any = errors;

  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = current[part];
  }

  return current;
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function RenderField<T extends FieldValues>(
  props: RenderFieldProps<T>,
) {
  const {
    name,
    label,
    type,
    control,
    errors,
    disabled,
    placeholder,
    icon,
    className,
    onChangeProp,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const fieldError = getNestedError(errors, name);
  const errorMessage = fieldError?.message as string | undefined;
  const hasError = !!fieldError;

  const wrapperClass = className || "";

  const FieldWrapper = ({ children }: { children: ReactNode }) => (
    <div className={wrapperClass}>
      {type !== "checkbox" && type !== "switch" && (
        <label
          htmlFor={String(name)}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}

      {children}

      {errorMessage && (
        <p className="mt-1.5 text-xs text-danger">{errorMessage}</p>
      )}
    </div>
  );

  if (type === "switch") {
    const { description, activeColor = "primary" } =
      props as SwitchFieldProps<T>;

    const activeStyles = {
      primary: "border-primary bg-primary/5",
      accent: "border-accent bg-accent/5",
      success: "border-success bg-success/5",
      warning: "border-warning bg-warning/5",
      danger: "border-danger bg-danger/5",
    };

    const switchBg = {
      primary: "bg-primary",
      accent: "bg-accent",
      success: "bg-success",
      warning: "bg-warning",
      danger: "bg-danger",
    };

    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => {
          const desc =
            typeof description === "function"
              ? description(!!value)
              : description;

          return (
            <FieldWrapper>
              <div
                onClick={() =>
                  !disabled &&
                  (onChangeProp
                    ? onChangeProp(!value, onChange)
                    : onChange(!value))
                }
                className={`flex items-center justify-between rounded-xl border p-4 transition ${
                  disabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:border-primary"
                } ${
                  value ? activeStyles[activeColor] : "border-border bg-surface"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  {desc && <p className="mt-1 text-xs text-muted">{desc}</p>}
                </div>

                <div
                  className={`relative h-6 w-11 rounded-full transition ${
                    value ? switchBg[activeColor] : "bg-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                      value ? "left-5" : "left-0.5"
                    }`}
                  />
                </div>
              </div>
            </FieldWrapper>
          );
        }}
      />
    );
  }

  if (type === "checkbox") {
    const { checkboxLabel } = props as CheckboxFieldProps<T>;

    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <FieldWrapper>
            <label className="flex items-center gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={!!value}
                disabled={disabled}
                onChange={(e) =>
                  onChangeProp
                    ? onChangeProp(e.target.checked, onChange)
                    : onChange(e.target.checked)
                }
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span>{checkboxLabel || label}</span>
            </label>
          </FieldWrapper>
        )}
      />
    );
  }

  if (type === "radio") {
    const { options } = props as RadioFieldProps<T>;

    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <FieldWrapper>
            <div className="flex flex-wrap gap-3">
              {options.map((opt) => {
                const selected = value === opt.value;

                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition ${
                      selected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-foreground"
                    } ${disabled ? "opacity-60" : "cursor-pointer"}`}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      checked={selected}
                      value={opt.value}
                      disabled={disabled}
                      onChange={() =>
                        onChangeProp
                          ? onChangeProp(opt.value, onChange)
                          : onChange(opt.value as PathValue<T, Path<T>>)
                      }
                    />
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                        selected ? "border-primary" : "border-border"
                      }`}
                    >
                      {selected && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </span>
                    {opt.label}
                  </label>
                );
              })}
            </div>
          </FieldWrapper>
        )}
      />
    );
  }

  if (type === "select") {
    const { options } = props as SelectFieldProps<T>;

    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange, onBlur } }) => (
          <FieldWrapper>
            <div className="relative">
              {icon && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  {icon}
                </div>
              )}

              <select
                id={String(name)}
                value={value ?? ""}
                onChange={(e) =>
                  onChangeProp
                    ? onChangeProp(e.target.value, onChange)
                    : onChange(e.target.value as PathValue<T, Path<T>>)
                }
                onBlur={onBlur}
                disabled={disabled}
                className={`ui-input appearance-none pr-10 ${
                  icon ? "pl-10" : ""
                } ${hasError ? "border-danger" : ""}`}
              >
                <option value="">{placeholder || `Select ${label}`}</option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted">
                <ChevronDownIcon />
              </div>
            </div>
          </FieldWrapper>
        )}
      />
    );
  }

  if (type === "multiselect") {
    const { options } = props as MultiSelectFieldProps<T>;

    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => {
          const selected = (value as string[]) || [];

          const toggleValue = (item: string) => {
            const next = selected.includes(item)
              ? selected.filter((v) => v !== item)
              : [...selected, item];

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            onChangeProp
              ? onChangeProp(next, onChange)
              : onChange(next as PathValue<T, Path<T>>);
          };

          return (
            <FieldWrapper>
              <div className="flex flex-wrap gap-2">
                {options.map((opt) => {
                  const active = selected.includes(opt.value);

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleValue(opt.value)}
                      className={`rounded-lg border px-3 py-2 text-sm transition ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-surface text-foreground"
                      } ${disabled ? "opacity-60" : "hover:border-primary"}`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </FieldWrapper>
          );
        }}
      />
    );
  }

  if (type === "date") {
    const { min, max } = props as DateFieldProps<T>;

    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <FieldWrapper>
            <input
              id={String(name)}
              ref={ref}
              type="date"
              value={value ?? ""}
              min={min}
              max={max}
              onBlur={onBlur}
              disabled={disabled}
              onChange={(e) =>
                onChangeProp
                  ? onChangeProp(e.target.value, onChange)
                  : onChange(e.target.value as PathValue<T, Path<T>>)
              }
              className={`ui-input ${hasError ? "border-danger" : ""}`}
            />
          </FieldWrapper>
        )}
      />
    );
  }

  const { rows = 4 } = props as TextFieldProps<T>;
  const isTextarea = type === "textarea";
  const isPassword = type === "password";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, onBlur, ref } }) => (
        <FieldWrapper>
          <div className="relative">
            {icon && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                {icon}
              </div>
            )}

            {isTextarea ? (
              <textarea
                id={String(name)}
                ref={ref}
                rows={rows}
                value={value ?? ""}
                onBlur={onBlur}
                disabled={disabled}
                placeholder={placeholder}
                onChange={(e) =>
                  onChangeProp
                    ? onChangeProp(e.target.value, onChange)
                    : onChange(e.target.value as PathValue<T, Path<T>>)
                }
                className={`ui-input resize-none ${icon ? "pl-10" : ""} ${
                  hasError ? "border-danger" : ""
                }`}
              />
            ) : (
              <input
                id={String(name)}
                ref={ref}
                type={isPassword ? (showPassword ? "text" : "password") : type}
                value={value ?? ""}
                onBlur={onBlur}
                disabled={disabled}
                placeholder={placeholder}
                onChange={(e) => {
                  let nextValue: string | number = e.target.value;

                  if (type === "number") {
                    nextValue =
                      e.target.value === "" ? "" : Number(e.target.value);
                  }

                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  onChangeProp
                    ? onChangeProp(nextValue, onChange)
                    : onChange(nextValue as PathValue<T, Path<T>>);
                }}
                className={`ui-input ${icon ? "pl-10" : ""} ${
                  isPassword ? "pr-11" : ""
                } ${hasError ? "border-danger" : ""}`}
              />
            )}

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted hover:text-foreground"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            )}
          </div>
        </FieldWrapper>
      )}
    />
  );
}
