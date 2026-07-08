import { MapPin } from "lucide-react";

interface LocationMapProps {
  label: string;
  sublabel?: string;
  /** Marker position as percentages of the map area. */
  markerX?: number;
  markerY?: number;
}

/**
 * Stylized, self-contained location map — an original cartographic
 * illustration in the Zylos palette (no external tile services, which also
 * keeps the strict CSP intact). Exact coordinates are intentionally
 * abstracted; precise addresses are shared privately with clients.
 */
export function LocationMap({
  label,
  sublabel,
  markerX = 54,
  markerY = 46,
}: LocationMapProps) {
  return (
    <figure className="relative overflow-hidden rounded-lg border border-ivory/10 shadow-md">
      <svg
        viewBox="0 0 800 440"
        role="img"
        aria-label={`Stylized map showing the location of ${label}`}
        className="h-auto w-full bg-charcoal"
      >
        {/* Water */}
        <path
          d="M0,300 C120,270 210,330 330,310 C470,290 520,350 640,330 C720,315 770,340 800,330 L800,440 L0,440 Z"
          fill="#0E1B3E"
        />
        {/* Districts */}
        <g fill="#1A2238">
          <path d="M40,60 L280,40 L300,180 L60,200 Z" />
          <path d="M320,50 L560,70 L540,210 L310,190 Z" />
          <path d="M590,80 L760,60 L740,220 L570,220 Z" />
          <path d="M70,230 L300,215 L290,290 L80,300 Z" />
          <path d="M330,220 L550,235 L560,300 L340,295 Z" />
        </g>
        {/* Park */}
        <ellipse cx="180" cy="130" rx="70" ry="42" fill="#12233A" />
        {/* Roads */}
        <g stroke="#2A3552" strokeWidth="6" fill="none" strokeLinecap="round">
          <path d="M0,210 C200,190 500,240 800,200" />
          <path d="M310,0 C300,150 350,300 330,440" />
          <path d="M600,0 C580,120 620,260 590,360" />
        </g>
        <g stroke="#232D4A" strokeWidth="2.5" fill="none">
          <path d="M0,110 C180,120 420,90 800,120" />
          <path d="M120,0 C140,140 110,260 140,380" />
          <path d="M460,20 C450,120 480,220 460,320" />
          <path d="M0,330 C240,320 560,360 800,340" />
        </g>
        {/* Radial focus around the marker */}
        <circle
          cx={markerX * 8}
          cy={markerY * 4.4}
          r="60"
          fill="none"
          stroke="#D4AF37"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <circle
          cx={markerX * 8}
          cy={markerY * 4.4}
          r="24"
          fill="#D4AF37"
          fillOpacity="0.12"
        />
      </svg>
      {/* Marker */}
      <span
        aria-hidden
        className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
        style={{ left: `${markerX}%`, top: `${markerY}%` }}
      >
        <MapPin className="size-8 fill-gold/20 text-gold drop-shadow-md" />
      </span>
      <figcaption className="glass absolute bottom-4 left-4 rounded-md px-4 py-3">
        <span className="block text-body-sm font-semibold text-ivory">
          {label}
        </span>
        {sublabel && (
          <span className="block text-caption text-mist">{sublabel}</span>
        )}
      </figcaption>
    </figure>
  );
}
