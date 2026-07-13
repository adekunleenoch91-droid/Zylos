"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { TextAreaField, TextField } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { track } from "@/lib/analytics";

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

/** Direct message form on an advisor's profile. */
export function AgentContactForm({ agentName }: { agentName: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    if (!String(data.get("name")).trim())
      next.name = "Please share your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email"))))
      next.email = "Please enter a valid email address.";
    if (String(data.get("message")).trim().length < 10)
      next.message = "A sentence or two helps us respond meaningfully.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("loading");
    // Simulated submission — connect to your CRM or API route in production.
    await new Promise((r) => setTimeout(r, 1000));
    track("agent_contact", { agent: agentName });
    setStatus("success");
  }

  if (status === "success") {
    return (
      <Notice variant="success">
        Your message is on its way to {agentName}. Expect a personal reply
        within one business day.
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
      <TextAreaField
        name="message"
        label="How can I help?"
        required
        rows={4}
        error={errors.message}
      />
      <Button type="submit" loading={status === "loading"} className="w-full">
        Send Message
      </Button>
    </form>
  );
}
