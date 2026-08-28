import type { Metadata } from "next";
import BriefForm from "@/components/BriefForm";

export const metadata: Metadata = {
  title: "Submit a location",
  description:
    "Own a property, land or building in Malta that could work for film or photography? Submit it to the index.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-[760px] px-5 py-14 sm:px-8 sm:py-20">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        For owners
      </p>
      <h1 className="mt-3 font-display text-[38px] leading-[1.05] tracking-tight sm:text-[46px]">
        Have a location suitable for filming or photography?
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
        Houses, villas, farmhouses, pools, fields, warehouses, rooftops, garages,
        boats, quarries and commercial buildings. Submissions are reviewed before
        anything is published — nothing goes live automatically, and we&apos;ll speak to
        you first.
      </p>

      <div className="mt-9">
        <BriefForm
          kind="location_submission"
          crossSell={false}
          startEvent="submit_location_started"
          submitEvent="submit_location_completed"
          submitLabel="Submit location for review"
          confirmation="Thanks — we've got your location and we'll be in touch before anything is listed."
          fields={[
            { name: "name", label: "Your name", required: true, half: true },
            { name: "email", label: "Email", type: "email", required: true, half: true },
            { name: "phone", label: "Phone / WhatsApp", type: "tel", half: true },
            { name: "locationName", label: "Location name", half: true },
            {
              name: "locationType",
              label: "Location type",
              type: "select",
              half: true,
              options: [
                "House / villa",
                "Farmhouse",
                "Pool",
                "Field / land",
                "Warehouse / industrial",
                "Rooftop",
                "Garage",
                "Boat / marine",
                "Quarry",
                "Commercial building",
                "Other",
              ],
            },
            { name: "area", label: "Area / locality", half: true },
            {
              name: "ownership",
              label: "Public or private",
              type: "select",
              half: true,
              options: ["Private property", "Managed / commercial", "Public land"],
            },
            {
              name: "paidShoots",
              label: "Available for paid shoots?",
              type: "select",
              half: true,
              options: ["Yes", "Open to discussing", "Not sure yet"],
            },
            {
              name: "description",
              label: "Brief description",
              type: "textarea",
              required: true,
              placeholder: "What does it look like, and what kind of shoot would suit it?",
            },
            {
              name: "accessNotes",
              label: "Vehicle / crew access notes",
              placeholder: "Can a van get to it? How many people could work there comfortably?",
            },
            {
              name: "photoLinks",
              label: "Photo links",
              placeholder: "Link to 4+ photos — exterior, interior, wide and approach",
            },
            { name: "pricing", label: "Approximate pricing, if known" },
          ]}
        />
        <p className="mt-5 text-[12px] leading-relaxed text-muted">
          By submitting you consent to us contacting you about this location. We
          won&apos;t publish it, your name or your contact details without speaking to
          you first.
        </p>
      </div>
    </div>
  );
}
