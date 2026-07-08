"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { useScrolled } from "@/hooks/useScrolled";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Fixed premium navigation: transparent over the hero, glass once scrolled,
 * animated active indicator, and a full-screen animated mobile menu.
 */
export function Navbar() {
  const scrolled = useScrolled(32);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  // Close the mobile menu on route change and lock scroll while open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-(--duration-slow)",
        scrolled ? "glass-strong shadow-md" : "bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:text-midnight"
      >
        Skip to main content
      </a>
      <nav
        aria-label="Main navigation"
        className="container-content flex h-18 items-center justify-between lg:h-20"
      >
        <Logo />

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) => (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative block px-4 py-2 text-body-sm tracking-wide transition-colors duration-(--duration-base)",
                  isActive(item.href)
                    ? "text-champagne"
                    : "text-silver hover:text-gold",
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-indicator"
                    aria-hidden
                    transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                    className="absolute inset-x-4 -bottom-0.5 h-px bg-gold"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="/contact" variant="secondary" size="sm">
            Private Consultation
          </Button>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-md p-2.5 text-ivory transition-colors hover:text-champagne lg:hidden"
        >
          {open ? (
            <X aria-hidden className="size-6" />
          ) : (
            <Menu aria-hidden className="size-6" />
          )}
        </button>
      </nav>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            className="glass-strong fixed inset-0 top-18 z-40 flex flex-col bg-midnight/95 lg:hidden"
          >
            <ul className="flex flex-1 flex-col justify-center gap-2 px-8">
              {siteConfig.nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: reduced ? 0 : -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.05 + i * 0.06,
                    ease: EASE_OUT_EXPO,
                  }}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "block py-3 font-serif text-h2 transition-colors",
                      isActive(item.href)
                        ? "text-champagne"
                        : "text-ivory hover:text-champagne",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: EASE_OUT_EXPO }}
              className="border-t border-ivory/10 p-8"
            >
              <Button href="/contact" variant="primary" className="w-full">
                Private Consultation
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
