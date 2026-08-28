# Malta Locations — MVP Build Doc

**Working title:** Malta Locations (film & photo shoot locations directory)
**Status:** ✅ live — hour-one build shipped
**Live:** https://malta-locations.vercel.app
**Repo:** https://github.com/Own5795/malta-locations
**Local:** `npm run dev` → http://localhost:3000 (LAN: http://10.70.1.154:3000)
**Source spec:** `malta-film-photo-locations-directory-mvp.md` (42 sections, full product vision)
**This doc:** what we actually build first, and why the rest waits.

---

## 1. The reframe

The spec describes a **product**. What we need this week is an **experiment**.

That changes the definition of done. The build is not finished when the directory
exists — it's finished when a stranger with a real brief has sent us one. Everything
in the spec that doesn't move a stranger toward that action is deferred, no matter how
sensible it looks on paper.

**The one question we are paying to answer:**

> Will film/photo people in Malta, who currently source locations through closed
> WhatsApp groups and personal contacts, use an open searchable index instead —
> and will they hand over a brief?

Captive audience is ~9,000/yr. We do not need scale to answer this. We need
**a few dozen real users and a handful of real briefs.**

---

## 2. What actually gets validated (and what doesn't)

| Signal | What it proves | Weight |
|---|---|---|
| Enquiry / brief submitted | Real commercial intent | **Decisive** |
| Search terms typed | The vocabulary the market actually uses | **High** |
| Zero-result searches | Demand that exceeds supply — the map of what to source next | **High** |
| Listing detail views | Discovery works, imagery is credible | Medium |
| Return visits | It became a tool, not a novelty | Medium |
| Traffic volume | Nearly nothing at this stage | Low |
| Time on site | Nothing | Ignore |

### The counter-intuitive one

With ~20 listings at launch, **most searches will return nothing.** That is not a
failure state to hide — it is the highest-value data the MVP produces, and it converts
directly into a lead.

So the zero-result screen gets *first-class design attention*, equal to the results
screen:

> **No exact match yet.** We're building this index location by location.
> Tell us what you're looking for and we'll source it — we know places that aren't
> listed.
> `[ Send us the brief ]`

Every dead end becomes: a captured lead + a sourcing instruction + a ranked backlog of
what to add next. A thin directory that handles emptiness well beats a thick one that
dead-ends.

---

## 3. Scope for hour one

### Building

- Directory home: hero search, category chips, featured locations grid
- Search + results: keyword/tag/synonym matching over seed data, live filtering
- Filters: **three only** — Location type, Island (Malta/Gozo/Comino), Look/style
- Location detail page: gallery, production-focused summary, structured facts,
  access & permission block, map, related locations
- Map view: Leaflet + OpenStreetMap, markers, card↔marker interaction
- Enquiry form (per-location) + general brief form (global)
- Event tracking incl. **every search string and every zero-result**
- ~20–25 real, accurate Malta/Gozo seed locations
- Live on a public URL

### Deliberately not building

| Cut | Why |
|---|---|
| Admin CMS | Content is a file in the repo. An admin panel is an hour spent serving a team of one. |
| Database | Seed data is static; enquiries go to email + log. Add Postgres when there are enquiries worth querying. |
| Image uploads / storage | Curated, correctly-licensed images referenced directly. |
| Accounts, favourites, shortlists | Nothing to save yet. |
| 40-field filter taxonomy | Three filters. More filters on 20 listings is theatre. |
| All 18 categories | Only categories with real listings behind them. Empty chips destroy credibility faster than missing features. |
| Mapbox / Google Maps | Both need billing accounts. OSM+Leaflet is free and good enough. |
| AI/semantic search | Spec §30 agrees: taxonomy + keywords first. |
| SEO landing page matrix | Metadata + sitemap yes; the 8-page SEO fan-out after we know which terms people search. |

---

## 4. Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | Detail pages need to be indexable and shareable |
| Styling | Tailwind | Speed |
| Data | `data/locations.ts` — typed, in-repo | Zero infra; edits are commits |
| Map | Leaflet + OpenStreetMap tiles | No key, no billing, no signup |
| Enquiries | `/api/enquiry` → structured log + email forward | Durable enough for hour one; swap in a DB when volume justifies it |
| Analytics | Vercel Analytics + custom `/api/track` events | Search strings are the product research |
| Hosting | Vercel | CLI already authed |

**Principle:** nothing in the hour-one build should require creating an account we
don't already have.

---

## 5. Trimmed data model

The spec's `Location` type is right for v2. This is what we fill in now — every field
here must be either *real* or *absent*. No placeholder facts.

```ts
type Location = {
  slug: string
  title: string
  locality: string
  island: 'malta' | 'gozo' | 'comino'

  shortDescription: string   // card: one production-relevant line
  fullDescription: string    // detail: "what brief does this solve?"

  lat: number
  lng: number

  categories: string[]       // windmill, cliff, harbour, street...
  look: string[]             // rugged, historic, Mediterranean, remote...
  productionTypes: string[]  // fashion, film, commercial, automotive, drone...
  keywords: string[]         // how a scout would ACTUALLY type it

  accessType: 'public' | 'private' | 'managed' | 'enquire'
  permissionStatus: 'unknown' | 'permission_may_be_required'
                  | 'commercial_approval_required' | 'verification_pending'

  practical?: {              // only fields we genuinely know
    vehicleAccess?: string
    parking?: string
    bestLight?: string
    footTraffic?: string
    droneNotes?: string
    crewNotes?: string
  }

  images: { url: string; alt: string; credit?: string }[]
  featured?: boolean
}
```

`keywords` is the highest-leverage field in the schema. Scouts search by **visual
brief**, not place name — "abandoned looking building", "rocky coast facing sunset",
"old European street". Every listing carries the words a scout would type, not the
words a tourist board would print.

---

## 6. The permission rule (non-negotiable)

Spec §4, and it's the thing most likely to cause real damage. The directory tells
people where to *look*, never that filming there is *legal*.

- Never: "permit free", "no permission needed", "free to shoot"
- Always: access status + `Filming conditions may apply` + verification date where known
- Every listing carries the standing notice:

> Access and filming requirements can change. Commercial filming, drone use, larger
> crews, equipment placement or exclusive use may require permission from the relevant
> owner or authority. Send an enquiry and we'll help confirm requirements.

This is also commercially correct: "we'll confirm the requirements for you" is exactly
the service that justifies the agent in the loop, and it's the reason someone submits a
brief rather than just noting the coordinates and leaving.

---

## 7. Seed content strategy

~20–25 listings, chosen for **spread across briefs, not fame.** Three windmills beats
twenty famous landmarks, because a windmill search resolving three ways feels like an
index, and twenty landmarks feels like a tourist guide.

Rough spread:
coast/cliff ×4 · historic street/town ×4 · harbour/marina ×2 · fort ×2 ·
windmill/tower ×2 · rural/field ×2 · quarry/industrial ×2 · cave/natural ×2 ·
beach/cove ×2 · Gozo & Comino throughout

Every listing must answer one question in its first line: **what visual brief does this
solve?** Not "a 17th-century watchtower built by the Knights" — "isolated stone tower
on open headland, no modern buildings in frame, reads as Middle Eastern or biblical."

Imagery: correctly-licensed only (Wikimedia Commons / Unsplash), credited. Bad or
mismatched photography kills a location directory faster than a missing feature —
this is a visual-confidence product.

---

## 8. Hour-one plan

| Min | Step | Done when |
|---|---|---|
| 0–10 | Scaffold + **deploy an empty page to Vercel immediately** | Public URL exists |
| 10–25 | Data model + seed listings | ~20 real locations |
| 25–40 | Home + search + results + cards + filters | You can search "windmill" |
| 40–50 | Detail page + map | A listing page is shareable |
| 50–58 | Enquiry + brief forms + tracking | A submitted form arrives |
| 58–60 | Redeploy, share | Link in hand |

**Deploy first, at minute 10, before the app does anything.** Deployment is the only
step that can fail in an unbounded way. Everything after is content and UI, which
degrade gracefully — a directory with 12 listings still demonstrates the concept, a
directory with no URL demonstrates nothing.

---

## 9. After the hour — the part the code can't do

The build is the cheap half. Distribution is what actually runs the experiment, and
the asymmetry matters: the closed WhatsApp groups that make this market opaque are the
same groups that make it *reachable*.

1. **Share into the existing WhatsApp/FB groups.** Not "check out my site" —
   "I got tired of asking here every time, so I started indexing them. What's missing?"
   The ask for missing locations is what converts a link-drop into a conversation.
2. **Watch the search log daily.** Zero-result terms are a ranked build order,
   handed to you by the market for free.
3. **Answer every enquiry personally, fast.** At this volume the agent is you, and
   response quality is the whole product.
4. **Add listings against demand, not intuition.** Search log first, taste second.

### Read the result honestly, in this order

1. Did anyone outside your immediate circle search? — *is there pull, or only politeness*
2. Did search terms repeat across different people? — *shared vocabulary = a real category*
3. Did anyone submit a brief? — *commercial intent*
4. Did any brief become a real production conversation? — *the only conclusive proof*

Friends clicking a link is a smoke test, not validation. Warm traffic will always be
generous; it tells you the thing works, never that anyone wants it. **Nobody submitting
a brief in 30 days is a real answer too** — a cheap one, delivered early, which is the
entire point of spending an hour instead of a quarter.

---

## 10. What shipped

30 seed locations across Malta, Gozo and Comino — each with real coordinates,
production-focused copy answering "what brief does this solve?", CC-licensed
Wikimedia imagery with credits, access/permission status, and practical notes
(vehicle access, parking, best light, foot traffic, drone, crew).

Spread: cliffs & coast, historic streets (Mdina, Valletta), forts (Ricasoli,
St Angelo, Cittadella), harbours, a windmill, salt pans, quarries, caves and
gorges, beaches and coves, derelict/industrial, farmland, one standing film set,
plus a modern-urban option.

| Built | Notes |
|---|---|
| Weighted search + synonyms | Title 10 / category 8 / keyword 7 / tag 6 / description 3, per spec §34. Maps production language onto the index: "abandoned looking building", "middle eastern", "southern italy", "desert-like" all resolve |
| Zero-result screen | Full-width capture module + nearest-neighbour suggestions. Never dead-ends |
| Filters | Category chips (with counts), island, setting/look. Three facets, not forty |
| Map | Leaflet + Carto light tiles, card-hover ⇄ marker highlight, filters drive markers, popups link through |
| Detail pages | 5-image gallery, production details table, access/permission block, map, related locations, sticky enquiry form |
| Forms | Location enquiry, general brief, owner submission — all with cross-sell checkboxes and a honeypot |
| Tracking | Every search term, zero-result, filter, card click, marker click, form start and submit |
| SEO | Per-listing metadata, Place + ItemList JSON-LD, sitemap, robots |

### Reading the data

Enquiries and events are one-line JSON in the platform log, tagged for grepping:

```bash
vercel logs malta-locations.vercel.app | grep ENQUIRY   # leads
vercel logs malta-locations.vercel.app | grep location_zero_results   # what to source next
```

To switch on email delivery — no code change needed, the route is already wired:

```bash
vercel env add RESEND_API_KEY production   # from resend.com
vercel env add ENQUIRY_TO production       # the agent's inbox
vercel deploy --prod
```

---

## 11. Still open

- **Enquiry destination.** Currently log-only. Two env vars turn on email (above).
- **Domain.** On `malta-locations.vercel.app`. A real domain matters before this
  goes into WhatsApp groups — a `.vercel.app` link reads as a side project, which
  will depress the very response rate you're trying to measure.
- **Parent business.** Built neutral by choice. Whether it eventually lives at
  `/locations` on the production-services site changes the cross-sell design.
- **Imagery.** Wikimedia is correctly licensed and credited, but it's tourist
  photography, not location photography — no access shots, no opposite angles, no
  approach. Replacing it on the top ~10 listings is the single highest-leverage
  content upgrade, and the one thing a competitor can't copy.

---

## 12. Verification

Three headless visual passes ran against the live build, because HTTP 200s and a
green typecheck proved nothing about what the page looked like. They caught, in
order:

1. **A watermarked basemap.** CARTO now stamps "API KEY REQUIRED" diagonally
   across unkeyed tiles. Tiles returned 200, Malta drew, markers worked — no
   automated check would have flagged it. Swapped to keyless OSM, muted in CSS.
2. **A gallery collapse I introduced.** `sm:aspect-auto` stripped the only thing
   giving the grid rows height; every desktop gallery rendered as an 8px smear.
   Typecheck passed, build passed, all routes 200. Now measured at 520/389/340px
   across all 30 pages and all four span branches.
3. **Design drift.** A bleached four-photo hero band with visible butt-joins, an
   Airbnb-idiom search capsule, counted facet chips, and an access line repeated
   identically on all 30 cards. All four reworked.

The lesson worth keeping: for a visual product, "it builds and returns 200" is not
evidence of anything a user would care about. Look at the page.

---

## 13. The honest caveat

30 listings is enough to *look* real and nowhere near enough to *be* useful. That
is the intended state: it makes the zero-result path the main event, and that path
is instrumented precisely because the gap between what people search for and what
the index holds is the finding. Do not fill the index from intuition before the
search log has told you what's missing — that log is the entire return on this
hour.
