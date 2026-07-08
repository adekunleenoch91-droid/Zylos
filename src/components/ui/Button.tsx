"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "icon";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = BaseProps & {
  href: string;
  "aria-label"?: string;
  target?: string;
  rel?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide " +
  "transition-all duration-(--duration-base) ease-(--ease-out-quart) " +
  "focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-3 " +
  "disabled:opacity-45 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold text-midnight rounded-md shadow-sm " +
    "hover:bg-champagne hover:shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-transparent text-gold border border-gold/60 rounded-md " +
    "hover:border-champagne hover:text-champagne hover:shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "bg-transparent text-silver rounded-md " +
    "hover:text-champagne hover:bg-ivory/5 active:bg-ivory/10",
  outline:
    "bg-transparent text-ivory border border-ivory/25 rounded-md " +
    "hover:border-ivory/60 hover:-translate-y-0.5 active:translate-y-0",
  icon:
    "bg-graphite/70 text-silver rounded-full border border-ivory/10 " +
    "hover:text-champagne hover:border-gold/40 hover:shadow-gold-glow",
};

const sizes: Record<Size, string> = {
  sm: "text-body-sm px-4 py-2",
  md: "text-body-sm px-6 py-3",
  lg: "text-body px-8 py-4",
};

const iconSizes: Record<Size, string> = {
  sm: "p-2",
  md: "p-2.5",
  lg: "p-3",
};

/**
 * Unified button. Renders a Next.js `Link` when `href` is provided so CTAs
 * stay crawlable, and a native `button` otherwise.
 */
export function Button(props: ButtonProps | LinkProps) {
  const {
    variant = "primary",
    size = "md",
    loading = false,
    children,
    className,
    ...rest
  } = props;

  const classes = cn(
    base,
    variants[variant],
    variant === "icon" ? iconSizes[size] : sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...linkRest } = rest as Omit<LinkProps, keyof BaseProps> & {
      href: string;
    };
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      className={classes}
      aria-busy={loading || undefined}
      {...buttonRest}
      disabled={buttonRest.disabled || loading}
    >
      {loading && (
        <Loader2 aria-hidden className="size-4 animate-spin" />
      )}
      {children}
    </button>
  );
}
