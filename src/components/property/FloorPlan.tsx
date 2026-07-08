import type { Property } from "@/types";

/**
 * Schematic floor plan illustration generated from the property's data —
 * an elegant architectural diagram in the Zylos line-art style. Detailed
 * measured plans are provided privately during viewings.
 */
export function FloorPlan({ property }: { property: Property }) {
  const suiteCount = Math.min(property.bedrooms, 4);
  const suiteWidth = 420 / suiteCount;

  return (
    <figure className="overflow-hidden rounded-lg border border-ivory/10 bg-graphite/30 p-6">
      <svg
        viewBox="0 0 760 420"
        role="img"
        aria-label={`Schematic floor plan of ${property.title}: open living and dining, kitchen, ${property.bedrooms} suites and terrace`}
        className="h-auto w-full"
      >
        <g
          fill="none"
          stroke="#A0AEC0"
          strokeWidth="2"
          strokeLinejoin="round"
        >
          {/* Outer envelope */}
          <rect x="20" y="20" width="720" height="330" stroke="#D4AF37" strokeWidth="2.5" />
          {/* Living / dining */}
          <rect x="20" y="20" width="300" height="200" />
          {/* Kitchen */}
          <rect x="320" y="20" width="140" height="130" />
          {/* Gallery hall */}
          <rect x="320" y="150" width="140" height="70" />
          {/* Suites along the rear */}
          {Array.from({ length: suiteCount }, (_, i) => (
            <rect
              key={i}
              x={20 + i * suiteWidth}
              y="220"
              width={suiteWidth}
              height="130"
            />
          ))}
          {/* Primary suite wing */}
          <rect x="460" y="20" width="280" height="200" />
          {/* Spa bath */}
          <rect x="460" y="220" width="130" height="130" />
          {/* Study */}
          <rect x="590" y="220" width="150" height="130" />
        </g>
        {/* Terrace */}
        <g stroke="#D4AF37" strokeDasharray="6 6" strokeWidth="1.5" fill="none">
          <rect x="20" y="350" width="720" height="50" />
        </g>
        {/* Pool glyph on terrace */}
        <rect x="540" y="362" width="150" height="26" rx="4" fill="#12224C" stroke="#3B5BA5" />
        {/* Door openings */}
        <g stroke="#0A142F" strokeWidth="6">
          <line x1="160" y1="350" x2="220" y2="350" />
          <line x1="320" y1="120" x2="320" y2="80" />
          <line x1="460" y1="120" x2="460" y2="80" />
        </g>
        {/* Labels */}
        <g
          fill="#D9D9D9"
          fontSize="15"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          letterSpacing="1.5"
        >
          <text x="60" y="115">LIVING · DINING</text>
          <text x="345" y="85">KITCHEN</text>
          <text x="345" y="190">GALLERY</text>
          <text x="505" y="115">PRIMARY SUITE</text>
          <text x="485" y="290">SPA BATH</text>
          <text x="628" y="290">STUDY</text>
          {Array.from({ length: suiteCount }, (_, i) => (
            <text key={i} x={40 + i * suiteWidth} y="290">
              SUITE {i + 2}
            </text>
          ))}
          <text x="45" y="380" fill="#D4AF37">TERRACE</text>
          <text x="560" y="380" fill="#7E9BD9">POOL</text>
        </g>
      </svg>
      <figcaption className="mt-4 text-caption uppercase tracking-wider text-mist">
        Schematic plan · {property.area.toLocaleString()} m² interior · measured
        drawings available on request
      </figcaption>
    </figure>
  );
}
