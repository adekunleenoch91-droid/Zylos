"use client";

import {
  useId,
  useState,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Premium form fields with floating labels, validation states and full
 * keyboard/screen-reader support. Errors are announced via aria-describedby.
 */

const shell =
  "relative rounded-md border bg-graphite/50 transition-colors duration-(--duration-base)";
const shellIdle = "border-ivory/15 focus-within:border-gold/70";
const shellError = "border-error/60 focus-within:border-error";

const inputBase =
  "peer w-full bg-transparent px-4 pt-6 pb-2 text-body text-ivory placeholder-transparent " +
  "focus:outline-none autofill:shadow-[inset_0_0_0_1000px_#1A2238]";

const labelBase =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-body text-mist " +
  "transition-all duration-(--duration-fast) " +
  "peer-focus:top-3.5 peer-focus:text-caption peer-focus:tracking-wider peer-focus:text-gold " +
  "peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-caption peer-[:not(:placeholder-shown)]:tracking-wider";

interface FieldWrapperProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-body-sm text-error">
      {error}
    </p>
  );
}

export function TextField({
  label,
  error,
  required,
  className,
  ...props
}: FieldWrapperProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={className}>
      <div className={cn(shell, error ? shellError : shellIdle)}>
        <input
          id={id}
          placeholder={label}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputBase}
          {...props}
        />
        <label htmlFor={id} className={labelBase}>
          {label}
          {required && (
            <span aria-hidden className="text-gold">
              {" "}
              *
            </span>
          )}
        </label>
      </div>
      <ErrorText id={`${id}-error`} error={error} />
    </div>
  );
}

export function TextAreaField({
  label,
  error,
  required,
  className,
  rows = 4,
  ...props
}: FieldWrapperProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div className={className}>
      <div className={cn(shell, error ? shellError : shellIdle)}>
        <textarea
          id={id}
          rows={rows}
          placeholder={label}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(inputBase, "resize-none pt-7")}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(labelBase, "top-6 peer-focus:top-3.5")}
        >
          {label}
          {required && (
            <span aria-hidden className="text-gold">
              {" "}
              *
            </span>
          )}
        </label>
      </div>
      <ErrorText id={`${id}-error`} error={error} />
    </div>
  );
}

export function SelectField({
  label,
  error,
  required,
  className,
  children,
  ...props
}: FieldWrapperProps &
  SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  const id = useId();
  const [hasValue, setHasValue] = useState(
    !!props.defaultValue || !!props.value,
  );
  return (
    <div className={className}>
      <div className={cn(shell, error ? shellError : shellIdle)}>
        <select
          id={id}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            inputBase,
            "appearance-none pr-10",
            !hasValue && "text-mist",
          )}
          {...props}
          onChange={(e) => {
            setHasValue(!!e.target.value);
            props.onChange?.(e);
          }}
        >
          {children}
        </select>
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-4 text-caption tracking-wider text-mist transition-colors",
            "top-3.5",
          )}
        >
          {label}
          {required && (
            <span aria-hidden className="text-gold">
              {" "}
              *
            </span>
          )}
        </label>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-mist"
        />
      </div>
      <ErrorText id={`${id}-error`} error={error} />
    </div>
  );
}
