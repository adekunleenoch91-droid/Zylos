import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { LocationMap } from "@/components/property/LocationMap";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/three/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getFaqs } from "@/services/content";

export const metadata: Metadata = {
  title: "Contact — Begin the Conversation",
  description:
    "Request a private consultation with a Zylos partner. Offices in New York, Milan and Tokyo; every enquiry answered personally within one business day.",
  alternates: { canonical: "/contact" },
};

const crumbs = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
];

const details = [
  {
    Icon: MapPin,
    label: "Gallery & Offices",
    value: siteConfig.contact.address,
  },
  {
    Icon: Phone,
    label: "Telephone",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/[^+\d]/g, "")}`,
  },
  {
    Icon: Mail,
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    Icon: Clock,
    label: "Hours",
    value: siteConfig.contact.hours,
  },
];

export default async function ContactPage() {
  const faqs = await getFaqs();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        overline="Contact"
        title={
          <>
            Begin the{" "}
            <span className="italic text-gradient-gold">conversation</span>
          </>
        }
        description="Tell us how you intend to live. A partner — never a pipeline — will respond personally within one business day."
        variant="orbit"
        breadcrumbs={crumbs}
      />

      <section className="pb-24" aria-label="Contact form and details">
        <div className="container-content grid gap-12 lg:grid-cols-5">
          {/* Form */}
          <Reveal className="lg:col-span-3">
            <div className="rounded-lg border border-ivory/10 bg-graphite/40 p-8 sm:p-10">
              <h2 className="font-serif text-h2 font-medium text-ivory">
                Request a consultation
              </h2>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>

          {/* Details + map */}
          <div className="space-y-8 lg:col-span-2">
            <Reveal delay={0.1}>
              <div className="rounded-lg border border-ivory/10 bg-graphite/40 p-8">
                <h2 className="text-overline uppercase text-gold">
                  The New York gallery
                </h2>
                <dl className="mt-6 space-y-5">
                  {details.map(({ Icon, label, value, href }) => (
                    <div key={label} className="flex gap-4">
                      <Icon
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-gold/80"
                      />
                      <div>
                        <dt className="text-caption uppercase tracking-wider text-mist">
                          {label}
                        </dt>
                        <dd className="mt-1 text-body-sm text-silver">
                          {href ? (
                            <a
                              href={href}
                              className="transition-colors hover:text-champagne"
                            >
                              {value}
                            </a>
                          ) : (
                            value
                          )}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <LocationMap
                label="Zylos New York"
                sublabel="12 Meridian Avenue, Tribeca"
                markerX={46}
                markerY={52}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="section-padding bg-charcoal/50"
        aria-labelledby="faq-title"
      >
        <div className="container-content grid gap-12 lg:grid-cols-3">
          <SectionHeading
            overline="Questions"
            title={<span id="faq-title">Asked before, answered honestly</span>}
            description="If your question is not here, it belongs in the form above — we answer everything personally."
          />
          <Reveal delay={0.1} className="lg:col-span-2">
            <Accordion items={faqs} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
