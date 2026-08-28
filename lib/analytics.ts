"use client";

type Payload = Record<string, unknown>;

/** Fire-and-forget event capture. Search terms are the product research. */
export function track(event: string, props: Payload = {}) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({
    event,
    props,
    path: window.location.pathname + window.location.search,
    ref: document.referrer || undefined,
    ts: new Date().toISOString(),
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      return;
    }
  } catch {
    /* fall through */
  }
  fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(
    () => {},
  );
}
