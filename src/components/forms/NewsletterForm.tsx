"use client";

import { ArrowRight } from "lucide-react";
import { useId, useState } from "react";
import { Notice } from "@/components/ui/Notice";
import { track } from "@/lib/analytics";

type Status = "idle" | "loading" | "success" | "error";

/** Newsletter subscription with inline validation and status feedback. */
export function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    setError("");
    setStatus("loading");
    // Simulated subscription — swap for a real endpoint or CMS integration.
    await new Promise((r) => setTimeout(r, 900));
    track("newsletter_subscribe");
    setStatus("success");
    setEmail("");
  }

  if (status === "success") {
    return (
      <Notice variant="success">
        Welcome to the Journal. Your first edition arrives this quarter.
      </Notice>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className="flex overflow-hidden rounded-md border border-ivory/15 bg-graphite/50 transition-colors focus-within:border-gold/70">
        <input
          id={id}
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={status === "error" || undefined}
          aria-describedby={status === "error" ? `${id}-error` : undefined}
          className="w-full bg-transparent px-4 py-3 text-body-sm text-ivory placeholder:text-mist focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={status === "loading"}
          className="flex items-center bg-gold px-4 text-midnight transition-colors hover:bg-champagne disabled:opacity-60"
        >
          <ArrowRight
            aria-hidden
            className={status === "loading" ? "size-4 animate-pulse" : "size-4"}
          />
        </button>
      </div>
      {status === "error" && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-body-sm text-error">
          {error}
        </p>
      )}
    </form>
  );
}
