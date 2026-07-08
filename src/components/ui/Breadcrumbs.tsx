import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

/** Accessible breadcrumb trail; pairs with BreadcrumbList JSON-LD. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-body-sm text-mist">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li>
                {item.href && !last ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-champagne"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={last ? "page" : undefined}
                    className="text-silver"
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {!last && (
                <ChevronRight aria-hidden className="size-3.5 text-mist/60" />
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
