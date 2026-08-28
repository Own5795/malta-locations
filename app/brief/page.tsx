import type { Metadata } from "next";
import BriefForm from "@/components/BriefForm";

export const metadata: Metadata = {
  title: "Send us your production brief",
  description:
    "Can't find the location in your brief? Tell us what you need and we'll source options across Malta, Gozo and Comino.",
};

export default async function BriefPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ref?: string }>;
}) {
  const { q, ref } = await searchParams;

  return (
    <div className="mx-auto max-w-[760px] px-5 py-14 sm:px-8 sm:py-20">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        Location sourcing
      </p>
      <h1 className="mt-3 font-display text-[38px] leading-[1.05] tracking-tight sm:text-[46px]">
        Tell us what the brief calls for
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
        The index is early and deliberately incomplete — most shoot locations in Malta
        are still traded privately rather than listed anywhere. Describe what you need
        and we&apos;ll source options, including places that aren&apos;t public yet, and
        confirm what filming there actually requires.
      </p>

      {q && (
        <p className="mt-5 rounded-sm border border-line bg-paper-2/60 px-4 py-3 text-[13px] text-ink-2">
          You searched for <em className="not-italic text-accent">“{q}”</em> and we
          had nothing. That&apos;s useful to us — it goes straight onto the list of what
          to add next.
        </p>
      )}

      <div className="mt-9">
        <BriefForm
          kind="general_brief"
          hidden={{ searchQuery: q, fromLocation: ref }}
          startEvent="general_brief_started"
          submitEvent="general_brief_submitted"
          submitLabel="Send production brief"
          confirmation="Thanks — your brief is with our location team and we'll follow up."
          fields={[
            { name: "name", label: "Name", required: true, half: true },
            { name: "email", label: "Email", type: "email", required: true, half: true },
            { name: "phone", label: "Phone / WhatsApp", type: "tel", half: true },
            { name: "company", label: "Company / production", half: true },
            {
              name: "productionType",
              label: "Production type",
              type: "select",
              half: true,
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
            { name: "shootDate", label: "Shoot date", type: "date", half: true },
            { name: "crewSize", label: "Crew size", half: true },
            { name: "budgetRange", label: "Budget range", half: true },
            {
              name: "region",
              label: "Preferred region",
              type: "select",
              half: true,
              options: ["Anywhere", "Malta", "Gozo", "Comino"],
            },
            {
              name: "brief",
              label: "What are you looking for?",
              type: "textarea",
              required: true,
              placeholder:
                'Describe it the way you would to a scout — "isolated stone farmhouse with a pool, room for 15 crew, sunset-facing exterior"',
            },
            {
              name: "referenceLinks",
              label: "Reference / mood board links",
              placeholder: "Paste a link to a deck, board or reference images",
            },
          ]}
        />
      </div>
    </div>
  );
}
