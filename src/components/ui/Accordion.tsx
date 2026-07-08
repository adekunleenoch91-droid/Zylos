"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

/** Elegant FAQ accordion with smooth height animation and full a11y. */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const baseId = useId();

  return (
    <div className="divide-y divide-ivory/10 border-y border-ivory/10">
      {items.map((item) => {
        const open = openId === item.id;
        const headerId = `${baseId}-h-${item.id}`;
        const panelId = `${baseId}-p-${item.id}`;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span
                  className={cn(
                    "text-h4 font-medium transition-colors duration-(--duration-base)",
                    open ? "text-champagne" : "text-ivory group-hover:text-champagne",
                  )}
                >
                  {item.question}
                </span>
                <Plus
                  aria-hidden
                  className={cn(
                    "size-5 shrink-0 text-gold transition-transform duration-(--duration-base) ease-(--ease-out-quart)",
                    open && "rotate-45",
                  )}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 pr-12 text-body-lg leading-relaxed text-mist">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
