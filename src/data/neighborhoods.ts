import type { Neighborhood } from "@/types";

export const neighborhoods: Neighborhood[] = [
  {
    id: "n-01",
    name: "Cap Lumière",
    city: "Côte d'Azur",
    description:
      "A guarded peninsula of pine and glass where the Riviera keeps its quietest addresses. Morning light on the water, evening light on the cliffs.",
    propertyCount: 14,
    image: { src: "/images/neighborhoods/neighborhood-1.jpg", alt: "Cap Lumière coastline with lit villas at dusk" },
  },
  {
    id: "n-02",
    name: "Tribeca",
    city: "New York",
    description:
      "Cast-iron heritage and full-floor lofts above cobblestone streets — Manhattan's most discreet concentration of significant residences.",
    propertyCount: 22,
    image: { src: "/images/neighborhoods/neighborhood-2.jpg", alt: "Tribeca skyline with warm windows at dusk" },
  },
  {
    id: "n-03",
    name: "Les Hauts",
    city: "Courchevel",
    description:
      "The highest chalets in the valley, ski-in and silent, where the glacier fills every window and the season never truly ends.",
    propertyCount: 9,
    image: { src: "/images/neighborhoods/neighborhood-3.jpg", alt: "Les Hauts chalet lights against the evening mountains" },
  },
  {
    id: "n-04",
    name: "Minami-Azabu",
    city: "Tokyo",
    description:
      "Embassy quiet in the heart of the metropolis. Garden walls, mature maples, and residences that reveal nothing to the street.",
    propertyCount: 11,
    image: { src: "/images/neighborhoods/neighborhood-4.jpg", alt: "Minami-Azabu residences glowing softly at dusk" },
  },
];
