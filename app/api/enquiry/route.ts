import { NextResponse } from "next/server";

export const runtime = "nodejs";

const AGENT_EMAIL = process.env.ENQUIRY_TO ?? "";
const RESEND_KEY = process.env.RESEND_API_KEY ?? "";
const FROM = process.env.ENQUIRY_FROM ?? "Malta Locations <onboarding@resend.dev>";

type Kind = "location_enquiry" | "general_brief" | "location_submission";

const LABEL: Record<Kind, string> = {
  location_enquiry: "Location Enquiry",
  general_brief: "Production Brief",
  location_submission: "Location Submission",
};

function esc(s: unknown) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot — bots fill hidden fields, humans do not.
  if (typeof data.website === "string" && data.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const kind = (data.kind as Kind) ?? "general_brief";
  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();

  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "name and valid email required" }, { status: 422 });
  }

  const record = {
    kind: "ENQUIRY",
    type: kind,
    receivedAt: new Date().toISOString(),
    ...data,
    ua: req.headers.get("user-agent")?.slice(0, 160),
  };

  // Primary durable capture: structured single-line JSON in the platform log.
  console.log("ENQUIRY " + JSON.stringify(record));

  // Optional email forward — activates the moment RESEND_API_KEY + ENQUIRY_TO exist.
  if (RESEND_KEY && AGENT_EMAIL) {
    const subject =
      kind === "location_enquiry"
        ? `New Location Enquiry — ${data.locationTitle ?? "Unknown"}`
        : `New ${LABEL[kind]} — Malta Locations`;

    const rows = Object.entries(data)
      .filter(([k, v]) => k !== "website" && k !== "kind" && v !== "" && v != null)
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 12px 4px 0;color:#7a726a;font-size:12px;vertical-align:top;white-space:nowrap">${esc(
            k,
          )}</td><td style="padding:4px 0;font-size:13px">${esc(v)}</td></tr>`,
      )
      .join("");

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM,
          to: [AGENT_EMAIL],
          reply_to: email,
          subject,
          html: `<h2 style="font-family:Georgia,serif;font-weight:400">${esc(
            LABEL[kind],
          )}</h2><table style="font-family:system-ui,sans-serif;border-collapse:collapse">${rows}</table>`,
        }),
      });
      if (!res.ok) console.error("RESEND_FAILED", res.status, await res.text());
    } catch (e) {
      console.error("RESEND_ERROR", e);
    }
  }

  return NextResponse.json({ ok: true });
}
