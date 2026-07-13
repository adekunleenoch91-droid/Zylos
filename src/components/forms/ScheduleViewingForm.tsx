"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { TextAreaField, TextField } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { track } from "@/lib/analytics";

interface ScheduleViewingFormProps {
  propertyTitle: string;
}

interface Errors {
  name?: string;
  email?: string;
  date?: string;
}

/** Private viewing request with inline validation and status feedback. */
export function ScheduleViewingForm({
  propertyTitle,
}: ScheduleViewingFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    if (!String(data.get("name")).trim())
      next.name = "Please share your name so we can address you properly.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email"))))
      next.email = "Please enter a valid email address.";
    if (!String(data.get("date")))
      next.date = "Please choose a preferred date.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("loading");
    // Simulated submission — connect to your CRM or API route in production.
    await new Promise((r) => setTimeout(r, 1100));
    track("viewing_request", { property: propertyTitle });
    setStatus("success");
  }

  if (status === "success") {
    return (
      <Notice variant="success">
        Thank you — your private viewing request for{" "}
        <strong>{propertyTitle}</strong> has been received. A Zylos partner
        will confirm arrangements within one business day.
      </Notice>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <TextField
        name="name"
        label="Full name"
        autoComplete="name"
        required
        error={errors.name}
      />
      <TextField
        name="email"
        type="email"
        label="Email address"
        autoComplete="email"
        required
        error={errors.email}
      />
      <TextField
        name="phone"
        type="tel"
        label="Phone (optional)"
        autoComplete="tel"
      />
      <TextField
        name="date"
        type="date"
        label="Preferred date"
        required
        error={errors.date}
        min={new Date().toISOString().split("T")[0]}
      />
      <TextAreaField
        name="message"
        label="Anything we should know? (optional)"
        rows={3}
      />
      <Button type="submit" loading={status === "loading"} className="w-full">
        Request Private Viewing
      </Button>
      <p className="text-caption leading-relaxed text-mist">
        Viewings are always private and scheduled for the property&apos;s best
        hour. Your details are never shared.
      </p>
    </form>
  );
}
