"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";

interface Errors {
  name?: string;
  email?: string;
  interest?: string;
  message?: string;
}

/** Primary consultation request form. */
export function ContactForm() {
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
    if (!String(data.get("interest")))
      next.interest = "Please choose the nature of your enquiry.";
    if (String(data.get("message")).trim().length < 10)
      next.message =
        "A sentence or two about your plans helps us respond meaningfully.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("loading");
    // Simulated submission — connect to your CRM or API route in production.
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <Notice variant="success">
        <p className="font-semibold">Thank you — your enquiry has been received.</p>
        <p className="mt-1">
          A Zylos partner will respond personally within one business day.
          Every conversation is held in complete confidence.
        </p>
      </Notice>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
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
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="phone"
          type="tel"
          label="Phone (optional)"
          autoComplete="tel"
        />
        <SelectField
          name="interest"
          label="Nature of enquiry"
          required
          error={errors.interest}
          defaultValue=""
        >
          <option value="" disabled>
            Select…
          </option>
          <option value="acquisition">Acquiring a residence</option>
          <option value="sale">Selling discreetly</option>
          <option value="investment">Investment advisory</option>
          <option value="stewardship">Estate care</option>
          <option value="other">Something else</option>
        </SelectField>
      </div>
      <TextAreaField
        name="message"
        label="Tell us how you intend to live"
        required
        rows={5}
        error={errors.message}
      />
      <Button type="submit" size="lg" loading={status === "loading"} className="w-full sm:w-auto">
        Request Consultation
      </Button>
      <p className="text-caption leading-relaxed text-mist">
        Your details are held in strict confidence and never shared. We reply
        to every serious enquiry personally.
      </p>
    </form>
  );
}
