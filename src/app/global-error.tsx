"use client";

import { useEffect } from "react";

/**
 * Global error boundary — the last line of defence. It replaces the root
 * layout, so it ships its own minimal, self-contained markup and styles
 * (no design-system dependencies are guaranteed to be available here).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A142F",
          color: "#F8F7F3",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "32rem" }}>
          <p
            style={{
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontSize: "0.8125rem",
              color: "#E5C76B",
            }}
          >
            Zylos
          </p>
          <h1
            style={{
              fontFamily: "ui-serif, Georgia, serif",
              fontSize: "2rem",
              fontWeight: 500,
              margin: "1.25rem 0 0",
            }}
          >
            Something went wrong
          </h1>
          <p style={{ color: "#A0AEC0", marginTop: "1rem", lineHeight: 1.7 }}>
            An unexpected error occurred. Please refresh the page to continue.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.85rem 2rem",
              backgroundColor: "#D4AF37",
              color: "#0A142F",
              border: "none",
              borderRadius: "0.375rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
