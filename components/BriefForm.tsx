"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  half?: boolean;
};

export const CROSS_SELL = [
  "Camera equipment",
  "Lighting",
  "Crew",
  "Drone operator",
  "Location / permit support",
];

export default function BriefForm({
  kind,
  fields,
  hidden = {},
  submitLabel,
  confirmation,
  crossSell = true,
  startEvent,
  submitEvent,
  compact = false,
}: {
  kind: "location_enquiry" | "general_brief" | "location_submission";
  fields: FieldDef[];
  hidden?: Record<string, unknown>;
  submitLabel: string;
  confirmation: string;
  crossSell?: boolean;
  startEvent: string;
  submitEvent: string;
  compact?: boolean;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [started, setStarted] = useState(false);
  const [needs, setNeeds] = useState<string[]>([]);

  function onFirstInput() {
    if (started) return;
    setStarted(true);
    track(startEvent, hidden);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = { kind, ...hidden };
    fd.forEach((v, k) => {
      if (v !== "") payload[k] = v;
    });
    if (needs.length) payload.alsoNeeds = needs.join(", ");
    payload.pageUrl = window.location.href;
    payload.referrer = document.referrer || undefined;
    const params = new URLSearchParams(window.location.search);
    ["utm_source", "utm_medium", "utm_campaign"].forEach((k) => {
      const v = params.get(k);
      if (v) payload[k] = v;
    });

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      track(submitEvent, { ...hidden, alsoNeeds: needs.join(",") });
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="fade-up rounded-sm border border-line bg-paper-2/60 p-6">
        <p className="font-display text-xl leading-snug">{confirmation}</p>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          We do not confirm availability or filming permission until it has been
          checked with the relevant owner or authority — we&apos;ll come back to you
          with what&apos;s actually possible.
        </p>
      </div>
    );
  }

  const input =
    "w-full rounded-sm border border-line bg-paper px-3 py-2.5 text-[14px] outline-none transition-colors placeholder:text-muted/70 focus:border-ink/45";

  return (
    <form onSubmit={onSubmit} onInput={onFirstInput} className="space-y-3">
      <div className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        {fields.map((f) => (
          <div
            key={f.name}
            className={!compact && !f.half ? "sm:col-span-2" : undefined}
          >
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
              {f.label}
              {f.required && <span className="text-accent"> *</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea
                name={f.name}
                required={f.required}
                rows={compact ? 3 : 4}
                placeholder={f.placeholder}
                className={input + " resize-y"}
              />
            ) : f.type === "select" ? (
              <select name={f.name} required={f.required} defaultValue="" className={input}>
                <option value="" disabled>
                  Select…
                </option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={f.type ?? "text"}
                name={f.name}
                required={f.required}
                placeholder={f.placeholder}
                className={input}
              />
            )}
          </div>
        ))}
      </div>

      {crossSell && (
        <fieldset className="pt-1">
          <legend className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
            Anything else needed for the shoot?
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {CROSS_SELL.map((c) => {
              const on = needs.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setNeeds((p) => (on ? p.filter((x) => x !== c) : [...p, c]));
                    if (!on) track("equipment_cross_sell_selected", { item: c });
                  }}
                  className={`rounded-full border px-3 py-1.5 text-[12px] transition-colors ${
                    on
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-line text-ink-2 hover:border-ink/35"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-full bg-ink px-6 py-3 text-[13px] font-medium tracking-wide text-paper transition-all hover:bg-accent disabled:opacity-50"
        >
          {state === "sending" ? "Sending…" : submitLabel}
        </button>
        {state === "error" && (
          <span className="text-[12px] text-accent">
            Something went wrong — try again, or email us directly.
          </span>
        )}
      </div>
    </form>
  );
}
