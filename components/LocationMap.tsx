"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { useRouter } from "next/navigation";
import type { Location } from "@/data/locations";
import { track } from "@/lib/analytics";

export default function LocationMap({
  locs,
  activeSlug,
  onHover,
  className = "",
  interactive = true,
  fit = true,
}: {
  locs: Location[];
  activeSlug?: string | null;
  onHover?: (slug: string | null) => void;
  className?: string;
  interactive?: boolean;
  fit?: boolean;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<Record<string, Marker>>({});
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current || map.current) return;

      const m = L.map(el.current, {
        zoomControl: interactive,
        scrollWheelZoom: false,
        dragging: interactive,
        attributionControl: true,
      }).setView(
        locs.length === 1 ? [locs[0].lat, locs[0].lng] : [35.94, 14.37],
        locs.length === 1 ? 14 : 10,
      );

      // Keyless OSM tiles, muted in CSS to sit under the editorial palette.
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(m);

      if (interactive) m.on("click", () => onHover?.(null));
      map.current = m;
      draw(L);
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      markers.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function draw(L: any) {
    const m = map.current;
    if (!m) return;
    Object.values(markers.current).forEach((mk) => mk.remove());
    markers.current = {};

    locs.forEach((loc) => {
      const icon = L.divIcon({
        className: "",
        html: `<span class="loc-marker" data-slug="${loc.slug}"></span>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });
      const mk = L.marker([loc.lat, loc.lng], { icon, riseOnHover: true }).addTo(m);
      mk.bindPopup(
        `<a href="/locations/${loc.slug}" style="display:block;text-decoration:none;color:inherit">
           <img src="${loc.images[0].url}" alt="" style="width:100%;height:104px;object-fit:cover;display:block"/>
           <span style="display:block;padding:9px 11px 11px">
             <span style="display:block;font-family:Georgia,serif;font-size:15px;line-height:1.2">${loc.title}</span>
             <span style="display:block;font-size:11px;color:#7a726a;margin-top:2px">${loc.locality}</span>
             <span style="display:block;font-size:11px;color:#9a4a25;margin-top:6px">View location →</span>
           </span>
         </a>`,
        { closeButton: false, offset: [0, -4] },
      );
      mk.on("mouseover", () => onHover?.(loc.slug));
      mk.on("mouseout", () => onHover?.(null));
      mk.on("click", () => {
        track("location_map_marker_clicked", { slug: loc.slug, title: loc.title });
        if (!interactive) router.push(`/locations/${loc.slug}`);
      });
      markers.current[loc.slug] = mk;
    });

    if (fit && locs.length) {
      const b = L.latLngBounds(locs.map((l) => [l.lat, l.lng] as [number, number]));
      m.invalidateSize({ animate: false });
      m.fitBounds(b, { padding: [24, 24], maxZoom: 14 });
      // container height settles after layout; refit once it has
      setTimeout(() => {
        m.invalidateSize({ animate: false });
        m.fitBounds(b, { padding: [24, 24], maxZoom: 14 });
      }, 120);
    }
  }

  // redraw when the result set changes — filters drive the map
  useEffect(() => {
    if (!map.current) return;
    import("leaflet").then(({ default: L }) => draw(L));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locs]);

  // card hover ⇄ marker highlight
  useEffect(() => {
    Object.entries(markers.current).forEach(([slug, mk]) => {
      const node = mk.getElement()?.querySelector(".loc-marker");
      node?.classList.toggle("is-active", slug === activeSlug);
    });
  }, [activeSlug, locs]);

  return <div ref={el} className={className} />;
}
