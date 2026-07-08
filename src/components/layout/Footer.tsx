import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { siteConfig } from "@/config/site";

const exploreLinks = siteConfig.nav.filter((l) => l.href !== "/");
const legalLinks = [
  { label: "Privacy Policy", href: "/contact" },
  { label: "Terms of Service", href: "/contact" },
  { label: "Cookie Preferences", href: "/contact" },
];

/** Site footer — brand, navigation, contact, newsletter, legal. */
export function Footer() {
  return (
    <footer className="border-t border-ivory/10 bg-charcoal">
      <div className="container-content section-padding">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-sm text-body-sm leading-relaxed text-mist">
              {siteConfig.description}
            </p>
            <ul className="mt-8 flex gap-3" aria-label="Social media">
              {siteConfig.socials.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-10 items-center justify-center rounded-full border border-ivory/15 text-caption uppercase tracking-wider text-silver transition-all duration-(--duration-base) hover:border-gold/50 hover:text-champagne hover:shadow-gold-glow"
                  >
                    {s.platform.slice(0, 2)}
                    <span className="sr-only">{s.platform}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <h2 className="text-overline uppercase text-gold">Explore</h2>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-silver transition-colors hover:text-champagne"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="text-overline uppercase text-gold">Contact</h2>
            <ul className="mt-5 space-y-4 text-body-sm text-silver">
              <li className="flex items-start gap-3">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-gold/70" />
                {siteConfig.contact.address}
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/[^+\d]/g, "")}`}
                  className="flex items-center gap-3 transition-colors hover:text-champagne"
                >
                  <Phone aria-hidden className="size-4 shrink-0 text-gold/70" />
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-3 transition-colors hover:text-champagne"
                >
                  <Mail aria-hidden className="size-4 shrink-0 text-gold/70" />
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-overline uppercase text-gold">
              The Zylos Journal
            </h2>
            <p className="mt-5 text-body-sm text-mist">
              Market intelligence and architectural stories, delivered
              quarterly. No noise.
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-ivory/10 pt-8 sm:flex-row">
          <p className="text-caption text-mist">
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights
            reserved.
          </p>
          <ul className="flex gap-6">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-caption text-mist transition-colors hover:text-champagne"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
