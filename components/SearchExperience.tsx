"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { locations, type Location } from "@/data/locations";
import { searchLocations, suggestFor, FEATURED_CATEGORIES, ALL_LOOKS } from "@/lib/search";
import LocationCard from "@/components/LocationCard";
import { track } from "@/lib/analytics";

const LocationMap = dynamic(() => import("@/components/LocationMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-paper-2" />,
});

const EXAMPLES = [
  "windmill",
  "rugged coastline",
  "abandoned looking building",
  "old european street",
  "desert-like landscape",
  "fishing village",
  "quarry",
  "remote field",
];

const ISLANDS = [
  { id: "malta", label: "Malta" },
  { id: "gozo", label: "Gozo" },
  { id: "comino", label: "Comino" },
];

export default function SearchExperience({ initialMap = false }: { initialMap?: boolean }) {
  const [query, setQuery] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [islands, setIslands] = useState<string[]>([]);
  const [looks, setLooks] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(initialMap);
  const [active, setActive] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () => searchLocations({ query, categories: cats, islands, look: looks }),
    [query, cats, islands, looks],
  );

  const filtersOn = cats.length + islands.length + looks.length > 0;
  const searching = query.trim().length > 0 || filtersOn;

  // Debounced search logging — every term typed is product research.
  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    const t = setTimeout(() => {
      track("location_search", { query: q, results: results.length });
      if (results.length === 0) track("location_zero_results", { query: q });
    }, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, results.length]);

  function toggle(list: string[], set: (v: string[]) => void, v: string, facet: string) {
    const next = list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
    set(next);
    track("location_filter_applied", { facet, value: v, active: next.length > 0 });
  }

  function clearAll() {
    setCats([]);
    setIslands([]);
    setLooks([]);
    setQuery("");
  }

  const suggestions = results.length === 0 ? suggestFor(query) : [];

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 opacity-[0.09]">
          <div className="grid h-full grid-cols-3 sm:grid-cols-5">
            {locations.slice(0, 5).map((l) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={l.slug} src={l.images[0].url} alt="" className="h-full w-full object-cover" />
            ))}
          </div>
        </div>
        <div className="relative mx-auto max-w-[1400px] px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            Malta · Gozo · Comino
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[38px] leading-[1.04] tracking-tight sm:text-[58px]">
            Find film &amp; photography locations across Malta
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-2">
            Coastlines, historic streets, forts, quarries, salt pans, fields and
            derelict buildings — searchable by what you actually need, not by place
            name.
          </p>

          <div className="mt-7 max-w-2xl">
            <div className="flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-2 py-2 shadow-[0_2px_20px_rgba(0,0,0,0.05)] transition-shadow focus-within:border-ink/40 focus-within:shadow-[0_4px_28px_rgba(0,0,0,0.09)]">
              <svg
                viewBox="0 0 24 24"
                className="ml-3 h-4 w-4 shrink-0 text-muted"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Try "windmill", "rocky coastline" or "abandoned building"'
                className="min-w-0 flex-1 bg-transparent py-2 text-[15px] outline-none placeholder:text-muted/80"
                aria-label="Search locations"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="px-2 text-[12px] text-muted hover:text-ink"
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-accent"
              >
                Search
              </button>
            </div>

            <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-1">
              <span className="shrink-0 py-1.5 text-[11px] uppercase tracking-[0.1em] text-muted">
                Try
              </span>
              {EXAMPLES.map((e) => (
                <button
                  key={e}
                  onClick={() => {
                    setQuery(e);
                    track("example_search_clicked", { query: e });
                  }}
                  className="shrink-0 rounded-full border border-line px-3 py-1.5 text-[12px] text-ink-2 transition-colors hover:border-ink/35 hover:bg-paper-2"
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Category chips ---------------- */}
      <section className="border-b border-line bg-paper/60">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto py-3">
            {FEATURED_CATEGORIES.map((c) => {
              const on = cats.includes(c.name);
              return (
                <button
                  key={c.name}
                  onClick={() => toggle(cats, setCats, c.name, "category")}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors ${
                    on
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-ink-2 hover:border-ink/35 hover:bg-paper-2"
                  }`}
                >
                  {c.name}
                  <span className={`ml-1.5 text-[10px] ${on ? "text-paper/55" : "text-muted"}`}>
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Toolbar ---------------- */}
      <div
        ref={resultsRef}
        className="sticky top-14 z-[800] border-b border-line bg-paper/90 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <p className="text-[13px] text-ink-2">
            <span className="font-medium">{results.length}</span>{" "}
            {results.length === 1 ? "location" : "locations"}
            {searching && <span className="text-muted"> matching</span>}
            {filtersOn && (
              <button onClick={clearAll} className="ml-3 text-[12px] text-accent underline-offset-2 hover:underline">
                Clear filters
              </button>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors ${
                showFilters || looks.length || islands.length
                  ? "border-ink/40 bg-paper-2"
                  : "border-line hover:border-ink/35"
              }`}
            >
              Filters
              {(looks.length + islands.length > 0) && (
                <span className="ml-1.5 text-accent">{looks.length + islands.length}</span>
              )}
            </button>
            <button
              onClick={() => {
                setShowMap((v) => {
                  if (!v) track("location_map_opened", { results: results.length });
                  return !v;
                });
              }}
              className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors ${
                showMap ? "border-ink bg-ink text-paper" : "border-line hover:border-ink/35"
              }`}
            >
              {showMap ? "Hide map" : "Show map"}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="fade-up border-t border-line bg-paper-2/40">
            <div className="mx-auto max-w-[1400px] space-y-4 px-5 py-4 sm:px-8">
              <Facet
                label="Island"
                options={ISLANDS.map((i) => i.label)}
                values={islands.map((i) => ISLANDS.find((x) => x.id === i)!.label)}
                onToggle={(label) => {
                  const id = ISLANDS.find((x) => x.label === label)!.id;
                  toggle(islands, setIslands, id, "island");
                }}
              />
              <Facet
                label="Setting / look"
                options={ALL_LOOKS}
                values={looks}
                onToggle={(v) => toggle(looks, setLooks, v, "look")}
              />
            </div>
          </div>
        )}
      </div>

      {/* ---------------- Results ---------------- */}
      <section className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
        {results.length === 0 ? (
          <ZeroResults query={query} suggestions={suggestions} onPick={setQuery} />
        ) : (
          <div className={showMap ? "flex gap-6" : ""}>
            <div className={showMap ? "min-w-0 flex-1" : ""}>
              <div
                className={`grid gap-x-5 gap-y-9 ${
                  showMap ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {results.map((loc, i) => (
                  <LocationCard
                    key={loc.slug}
                    loc={loc}
                    index={i}
                    active={active === loc.slug}
                    onHover={setActive}
                    source={searching ? "search" : "browse"}
                  />
                ))}
              </div>
            </div>

            {showMap && (
              <div className="hidden w-[42%] shrink-0 lg:block">
                <div className="sticky top-[124px] h-[calc(100vh-150px)] overflow-hidden rounded-sm border border-line">
                  <LocationMap
                    locs={results}
                    activeSlug={active}
                    onHover={setActive}
                    className="h-full w-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {showMap && results.length > 0 && (
          <div className="mt-6 h-[420px] overflow-hidden rounded-sm border border-line lg:hidden">
            <LocationMap locs={results} activeSlug={active} onHover={setActive} className="h-full w-full" />
          </div>
        )}
      </section>

      {/* ---------------- Conversion module ---------------- */}
      {results.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 pb-4 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-5 rounded-sm border border-line bg-paper-2/50 px-6 py-7 sm:flex-row sm:items-center">
            <div className="max-w-lg">
              <h2 className="font-display text-[24px] leading-tight">
                Have a brief but can&apos;t find the location?
              </h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">
                This index is early and deliberately incomplete. Tell us what the brief
                calls for — we know places that aren&apos;t listed yet, and we&apos;ll
                confirm what filming there actually requires.
              </p>
            </div>
            <Link
              href="/brief"
              onClick={() => track("general_brief_started", { source: "results_module" })}
              className="shrink-0 rounded-full bg-ink px-6 py-3 text-[13px] font-medium text-paper transition-colors hover:bg-accent"
            >
              Send us your brief
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

function Facet({
  label,
  options,
  values,
  onToggle,
}: {
  label: string;
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = values.includes(o);
          return (
            <button
              key={o}
              onClick={() => onToggle(o)}
              className={`rounded-full border px-3 py-1.5 text-[12px] transition-colors ${
                on ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-2 hover:border-ink/35"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * With a young index most searches miss. That is the most valuable event on the
 * site, so it gets a real screen: capture the brief, then offer the nearest thing.
 */
function ZeroResults({
  query,
  suggestions,
  onPick,
}: {
  query: string;
  suggestions: Location[];
  onPick: (q: string) => void;
}) {
  return (
    <div className="fade-up">
      <div className="rounded-sm border border-line bg-paper-2/50 px-6 py-9 sm:px-10 sm:py-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          No exact match yet
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-[30px] leading-[1.1] sm:text-[38px]">
          We don&apos;t have {query.trim() ? <em className="text-accent not-italic">“{query.trim()}”</em> : "that"} in
          the index yet.
        </h2>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-ink-2">
          That doesn&apos;t mean it doesn&apos;t exist here. Most shoot locations in
          Malta are still sourced through people, not listings — send us the brief and
          we&apos;ll go and find it.
        </p>
        <Link
          href={`/brief?q=${encodeURIComponent(query)}`}
          onClick={() => track("general_brief_started", { source: "zero_results", query })}
          className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-[13px] font-medium text-paper transition-colors hover:bg-accent"
        >
          Send us this brief
        </Link>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-11">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h3 className="font-display text-[22px]">You may also like</h3>
            <button onClick={() => onPick("")} className="text-[12px] text-accent hover:underline">
              Browse everything
            </button>
          </div>
          <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((loc, i) => (
              <LocationCard key={loc.slug} loc={loc} index={i} source="zero_results" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
