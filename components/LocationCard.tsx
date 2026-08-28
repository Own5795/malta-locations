"use client";

import Image from "next/image";
import Link from "next/link";
import { ACCESS_LABEL, type Location } from "@/data/locations";
import { track } from "@/lib/analytics";

export default function LocationCard({
  loc,
  index = 0,
  onHover,
  active,
  source = "grid",
}: {
  loc: Location;
  index?: number;
  onHover?: (slug: string | null) => void;
  active?: boolean;
  source?: string;
}) {
  return (
    <Link
      href={`/locations/${loc.slug}`}
      onMouseEnter={() => onHover?.(loc.slug)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() =>
        track("location_card_clicked", { slug: loc.slug, title: loc.title, source, position: index })
      }
      className={`group block ${active ? "opacity-100" : ""}`}
    >
      <div
        className={`relative aspect-[4/3] overflow-hidden rounded-sm bg-paper-2 ring-1 transition-all duration-300 ${
          active ? "ring-accent" : "ring-line group-hover:ring-ink/25"
        }`}
      >
        <Image
          src={loc.images[0].url}
          alt={loc.images[0].alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          priority={index < 3}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
        <span className="absolute bottom-2.5 left-3 text-[10px] font-medium uppercase tracking-[0.14em] text-white/90">
          {loc.categories.slice(0, 2).join(" · ")}
        </span>
      </div>

      <div className="pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[19px] leading-tight tracking-tight transition-colors group-hover:text-accent">
            {loc.title}
          </h3>
          <span className="shrink-0 text-[11px] uppercase tracking-[0.1em] text-muted">
            {loc.island === "malta" ? "Malta" : loc.island === "gozo" ? "Gozo" : "Comino"}
          </span>
        </div>
        <p className="mt-0.5 text-[12px] text-muted">{loc.locality}</p>
        <p className="mt-2 text-[13px] leading-[1.5] text-ink-2">{loc.shortDescription}</p>
        {loc.accessType !== "public" && (
          <p className="mt-2.5 text-[11px] uppercase tracking-[0.1em] text-muted">
            {ACCESS_LABEL[loc.accessType]}
          </p>
        )}
      </div>
    </Link>
  );
}
