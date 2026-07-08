"use client";

import { Check, Link2, Linkedin, Mail, Twitter } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  path: string;
}

/** Article share row: X, LinkedIn, email and copy-link. */
export function ShareButtons({ title, path }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin + path : path;

  const links = [
    {
      label: "Share on X",
      Icon: Twitter,
      href: `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "Share on LinkedIn",
      Icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: "Share by email",
      Icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — no-op; the URL is in the address bar.
    }
  }

  const buttonClass =
    "flex size-10 items-center justify-center rounded-full border border-ivory/15 text-silver transition-all duration-(--duration-base) hover:border-gold/50 hover:text-champagne hover:shadow-gold-glow";

  return (
    <div className="flex items-center gap-2" aria-label="Share this article">
      {links.map(({ label, Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={buttonClass}
        >
          <Icon aria-hidden className="size-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Link copied" : "Copy link"}
        className={buttonClass}
      >
        {copied ? (
          <Check aria-hidden className="size-4 text-success" />
        ) : (
          <Link2 aria-hidden className="size-4" />
        )}
      </button>
    </div>
  );
}
