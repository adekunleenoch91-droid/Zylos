"use client";

import { useId, useMemo, useState } from "react";
import type { Property } from "@/types";

/** Indicative financing calculator for a property's asking price. */
export function MortgageCalculator({ property }: { property: Property }) {
  const id = useId();
  const [downPct, setDownPct] = useState(30);
  const [rate, setRate] = useState(4.2);
  const [years, setYears] = useState(25);

  const symbol =
    property.currency === "EUR" ? "€" : property.currency === "GBP" ? "£" : "$";

  const monthly = useMemo(() => {
    const principal = property.price * (1 - downPct / 100);
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return principal / n;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [property.price, downPct, rate, years]);

  const controls = [
    {
      key: "down",
      label: "Down payment",
      value: downPct,
      display: `${downPct}%`,
      min: 10,
      max: 80,
      step: 5,
      set: setDownPct,
    },
    {
      key: "rate",
      label: "Interest rate",
      value: rate,
      display: `${rate.toFixed(1)}%`,
      min: 1,
      max: 9,
      step: 0.1,
      set: setRate,
    },
    {
      key: "term",
      label: "Term",
      value: years,
      display: `${years} years`,
      min: 5,
      max: 35,
      step: 5,
      set: setYears,
    },
  ];

  return (
    <div className="rounded-lg border border-ivory/10 bg-graphite/40 p-8">
      <h3 className="text-h4 font-semibold text-ivory">
        Financing, indicatively
      </h3>
      <div className="mt-6 space-y-6">
        {controls.map((c) => (
          <div key={c.key}>
            <div className="flex items-center justify-between">
              <label
                htmlFor={`${id}-${c.key}`}
                className="text-body-sm text-mist"
              >
                {c.label}
              </label>
              <output
                htmlFor={`${id}-${c.key}`}
                className="text-body-sm font-semibold text-champagne"
              >
                {c.display}
              </output>
            </div>
            <input
              id={`${id}-${c.key}`}
              type="range"
              min={c.min}
              max={c.max}
              step={c.step}
              value={c.value}
              onChange={(e) => c.set(Number(e.target.value))}
              className="mt-2 w-full accent-[#D4AF37]"
            />
          </div>
        ))}
      </div>
      <div className="mt-8 border-t border-ivory/10 pt-6">
        <p className="text-caption uppercase tracking-widest text-mist">
          Estimated monthly payment
        </p>
        <p aria-live="polite" className="mt-2 font-serif text-h1 font-semibold text-gradient-gold">
          {symbol}
          {Math.round(monthly).toLocaleString()}
        </p>
        <p className="mt-3 text-caption leading-relaxed text-mist">
          Illustrative only. Our advisory team coordinates bespoke financing
          with private banks in every jurisdiction we serve.
        </p>
      </div>
    </div>
  );
}
