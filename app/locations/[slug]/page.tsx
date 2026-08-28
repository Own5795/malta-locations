import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import {
  locations,
  ACCESS_LABEL,
  PERMISSION_LABEL,
  PERMISSION_NOTICE,
} from "@/data/locations";
import { relatedTo } from "@/lib/search";
import LocationCard from "@/components/LocationCard";
import BriefForm from "@/components/BriefForm";

const LocationMap = dynamic(() => import("@/components/LocationMap"));

const PRACTICAL_LABELS: Record<string, string> = {
  vehicleAccess: "Vehicle access",
  parking: "Parking",
  bestLight: "Best light",
  footTraffic: "Foot traffic",
  droneNotes: "Drone",
  crewNotes: "Crew notes",
};

export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loc = locations.find((l) => l.slug === slug);
  if (!loc) return {};
  const title = `${loc.title} Film & Photography Location | Malta`;
  const description = `Explore ${loc.title} in ${loc.locality} as a film and photography location. Photos, production notes, access information and location enquiry.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/locations/${loc.slug}` },
    openGraph: { title, description, images: [loc.images[0].url] },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loc = locations.find((l) => l.slug === slug);
  if (!loc) notFound();

  const related = relatedTo(loc);
  const practical = Object.entries(loc.practical).filter(([, v]) => v);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: loc.title,
    description: loc.fullDescription,
    address: { "@type": "PostalAddress", addressLocality: loc.locality, addressCountry: "MT" },
    geo: { "@type": "GeoCoordinates", latitude: loc.lat, longitude: loc.lng },
    image: loc.images.map((i) => i.url),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-[1400px] px-5 pt-6 sm:px-8">
        <nav className="text-[12px] text-muted">
          <Link href="/" className="hover:text-accent">Locations</Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink-2">{loc.title}</span>
        </nav>

        <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[36px] leading-[1.05] tracking-tight sm:text-[48px]">
              {loc.title}
            </h1>
            <p className="mt-1.5 text-[14px] text-muted">
              {loc.locality} ·{" "}
              {loc.island === "malta" ? "Malta" : loc.island === "gozo" ? "Gozo" : "Comino"}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {loc.categories.map((c) => (
              <span
                key={c}
                className="rounded-full border border-line bg-paper-2/60 px-3 py-1 text-[11.5px] text-ink-2"
              >
                {c}
              </span>
            ))}
          </div>
        </header>
      </div>

      {/* Gallery */}
      <section className="mx-auto mt-6 max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
          {loc.images.slice(0, 5).map((img, i) => (
            <div
              key={img.url}
              className={`relative overflow-hidden rounded-sm bg-paper-2 ${
                i === 0 ? "aspect-[16/10] sm:col-span-2 sm:row-span-2 sm:aspect-auto" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes={i === 0 ? "(max-width:640px) 100vw, 50vw" : "25vw"}
                className="object-cover"
                priority={i === 0}
              />
              {img.credit && (
                <span className="absolute bottom-1 right-1.5 rounded bg-black/35 px-1.5 py-0.5 text-[9px] text-white/85 backdrop-blur-sm">
                  {img.credit} · {img.license}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Left column */}
          <div className="min-w-0">
            <p className="max-w-2xl font-display text-[21px] leading-[1.45] text-ink-2 sm:text-[23px]">
              {loc.fullDescription}
            </p>

            <Section title="Shoot suitability">
              <div className="flex flex-wrap gap-1.5">
                {loc.productionTypes.map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-paper-2 px-3 py-1.5 text-[12.5px] text-ink-2"
                  >
                    {p}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {loc.look.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-line px-3 py-1.5 text-[12px] text-muted"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </Section>

            {practical.length > 0 && (
              <Section title="Production details">
                <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {practical.map(([k, v]) => (
                    <div key={k} className="border-t border-line pt-3">
                      <dt className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                        {PRACTICAL_LABELS[k] ?? k}
                      </dt>
                      <dd className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
            )}

            <Section title="Access &amp; permissions">
              <div className="rounded-sm border border-line bg-paper-2/50 p-5">
                <div className="flex flex-wrap gap-2">
                  <Badge>{ACCESS_LABEL[loc.accessType]}</Badge>
                  <Badge accent>{PERMISSION_LABEL[loc.permissionStatus]}</Badge>
                  {loc.precision === "approximate" && <Badge>Approximate location</Badge>}
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-ink-2">{PERMISSION_NOTICE}</p>
              </div>
            </Section>

            <Section title="Location">
              <div className="h-[340px] overflow-hidden rounded-sm border border-line">
                <LocationMap locs={[loc]} className="h-full w-full" interactive={false} fit={false} />
              </div>
              <p className="mt-2 text-[11.5px] text-muted">
                {loc.precision === "exact" ? "Exact position" : "Approximate position"} ·{" "}
                {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
              </p>
            </Section>
          </div>

          {/* Right column — enquiry */}
          <aside>
            <div className="lg:sticky lg:top-[76px]">
              <div className="rounded-sm border border-ink/15 bg-paper p-6 shadow-[0_2px_24px_rgba(0,0,0,0.05)]">
                <h2 className="font-display text-[24px] leading-tight">Interested in shooting here?</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  Send the brief and our team will confirm access, permissions and what
                  the location realistically supports.
                </p>
                <div className="mt-5">
                  <BriefForm
                    kind="location_enquiry"
                    compact
                    hidden={{ locationSlug: loc.slug, locationTitle: loc.title }}
                    startEvent="location_enquiry_started"
                    submitEvent="location_enquiry_submitted"
                    submitLabel="Send location enquiry"
                    confirmation="Thanks — our location team has your brief and will follow up."
                    fields={[
                      { name: "name", label: "Name", required: true },
                      { name: "email", label: "Email", type: "email", required: true },
                      { name: "phone", label: "Phone / WhatsApp", type: "tel" },
                      { name: "company", label: "Company" },
                      {
                        name: "productionType",
                        label: "Production type",
                        type: "select",
                        options: [
                          "Photography",
                          "Commercial / advert",
                          "Film / TV",
                          "Music video",
                          "Fashion / editorial",
                          "Social content",
                          "Wedding",
                          "Other",
                        ],
                      },
                      { name: "shootDate", label: "Preferred date", type: "date" },
                      { name: "crewSize", label: "Crew size" },
                      {
                        name: "brief",
                        label: "Production brief",
                        type: "textarea",
                        required: true,
                        placeholder: "What are you shooting, and what does the location need to do?",
                      },
                    ]}
                  />
                </div>
              </div>

              <Link
                href={`/brief?ref=${loc.slug}`}
                className="mt-3 block rounded-sm border border-line px-5 py-4 text-center text-[13px] text-ink-2 transition-colors hover:border-ink/35 hover:bg-paper-2"
              >
                Have a similar brief? Send it to us →
              </Link>
            </div>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-line pt-10">
            <h2 className="mb-6 font-display text-[26px]">Related locations</h2>
            <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r, i) => (
                <LocationCard key={r.slug} loc={r} index={i} source="related" />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{title}</h2>
      {children}
    </section>
  );
}

function Badge({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-[11.5px] font-medium ${
        accent ? "bg-accent-soft text-accent" : "bg-paper-2 text-ink-2"
      }`}
    >
      {children}
    </span>
  );
}
