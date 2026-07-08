"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { transitions } from "@/lib/motion";

type NoticeVariant = "success" | "error" | "warning" | "info";

const styles: Record<
  NoticeVariant,
  { className: string; Icon: typeof CheckCircle2 }
> = {
  success: {
    className: "border-success/40 bg-success/10 text-[#86efac]",
    Icon: CheckCircle2,
  },
  error: {
    className: "border-error/40 bg-error/10 text-[#fca5a5]",
    Icon: XCircle,
  },
  warning: {
    className: "border-warning/40 bg-warning/10 text-[#fcd34d]",
    Icon: AlertTriangle,
  },
  info: {
    className: "border-info/40 bg-info/10 text-[#93c5fd]",
    Icon: Info,
  },
};

interface NoticeProps {
  variant: NoticeVariant;
  children: ReactNode;
  show?: boolean;
  className?: string;
}

/** Inline notification with entrance animation and live-region semantics. */
export function Notice({
  variant,
  children,
  show = true,
  className,
}: NoticeProps) {
  const { className: toneClass, Icon } = styles[variant];
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={transitions.base}
          className={cn(
            "flex items-start gap-3 rounded-md border px-4 py-3 text-body-sm",
            toneClass,
            className,
          )}
        >
          <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
          <div>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
