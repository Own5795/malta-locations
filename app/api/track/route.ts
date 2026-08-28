import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Event sink. Everything lands in the platform log as one-line JSON so it can be
 * grepped straight out of `vercel logs`. Zero-result searches are the whole point:
 * they are a ranked list of what to source next.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const line = {
      kind: "EVENT",
      event: String(body.event ?? "unknown"),
      props: body.props ?? {},
      path: body.path,
      ref: body.ref,
      ts: body.ts ?? new Date().toISOString(),
      ua: req.headers.get("user-agent")?.slice(0, 120),
    };
    console.log("EVENT " + JSON.stringify(line));
  } catch {
    // never let tracking break a page
  }
  return new NextResponse(null, { status: 204 });
}
