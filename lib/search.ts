import { locations, type Location } from "@/data/locations";

/** Production vocabulary → index vocabulary. Scouts search by brief, not place name. */
const SYNONYMS: Record<string, string[]> = {
  seaside: ["coast", "coastline", "sea", "waterfront", "beach"],
  "wind mill": ["windmill"],
  windmills: ["windmill"],
  old: ["historic", "traditional", "heritage", "period"],
  "luxury house": ["villa", "palace", "mansion"],
  villa: ["palace", "mansion", "house"],
  factory: ["industrial", "warehouse", "derelict"],
  warehouse: ["industrial", "derelict"],
  rocks: ["rocky", "cliff", "coast", "limestone"],
  rocky: ["cliff", "coast", "limestone", "rugged"],
  abandoned: ["derelict", "empty building", "ruin"],
  derelict: ["abandoned", "empty building", "ruin"],
  desert: ["desert-like", "barren", "quarry", "garigue", "salt flats"],
  "middle eastern": ["desert-like", "limestone", "ancient", "barren"],
  roman: ["ancient", "fort", "period", "temples"],
  greek: ["mediterranean", "limestone", "ancient"],
  italy: ["mediterranean", "historic street", "period"],
  "southern italy": ["mediterranean", "historic street", "coast"],
  sicily: ["mediterranean", "historic street", "fishing village"],
  fishing: ["fishing village", "harbour", "boats"],
  port: ["harbour", "waterfront", "quay"],
  harbor: ["harbour"],
  pool: ["natural pool", "rock pool", "lagoon"],
  street: ["historic street", "alley", "town"],
  city: ["urban", "town", "historic street"],
  field: ["farmland", "countryside", "rural", "terraces"],
  farm: ["farmland", "rural", "countryside"],
  cave: ["grotto", "gorge", "tunnel"],
  sunset: ["west coast", "golden hour", "sunset"],
  dramatic: ["cliff", "rugged", "dramatic"],
  remote: ["isolated", "secluded", "empty", "wilderness"],
  isolated: ["remote", "secluded", "empty"],
  luxury: ["modern", "contemporary"],
  modern: ["contemporary", "glass", "urban"],
  brutalist: ["concrete", "industrial", "modern"],
  cliffs: ["cliff"],
  beaches: ["beach"],
  quarries: ["quarry"],
  forts: ["fort", "fortress"],
  castle: ["fort", "fortress", "citadel"],
  church: ["historic", "baroque"],
  boat: ["boats", "harbour", "luzzu"],
  drone: ["aerial", "drone"],
  aerial: ["drone"],
};

const STOP = new Set([
  "a","an","the","for","with","and","or","of","in","on","at","to","some","that",
  "somewhere","looking","look","like","need","want","find","me","i","is","it","my",
  "we","us","something","place","places","location","locations","malta","maltese",
]);

function normalise(input: string): string[] {
  const base = input
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!base) return [];

  const tokens = new Set<string>();
  const add = (t: string) => {
    const v = t.trim();
    if (!v || STOP.has(v)) return;
    tokens.add(v);
    if (v.endsWith("s") && v.length > 3) tokens.add(v.slice(0, -1)); // plural → singular
  };

  // whole-phrase synonyms first ("middle eastern", "southern italy")
  for (const [k, vals] of Object.entries(SYNONYMS)) {
    if (k.includes(" ") && base.includes(k)) vals.forEach(add);
  }
  for (const word of base.split(" ")) {
    add(word);
    const syn = SYNONYMS[word] ?? (word.endsWith("s") ? SYNONYMS[word.slice(0, -1)] : undefined);
    syn?.forEach(add);
  }
  return [...tokens];
}

const hay = (arr: string[]) => arr.join(" ").toLowerCase();

/** Weights per spec §34: title 10, category 8, keyword 7, tag 6, description 3, featured +1 */
function score(loc: Location, tokens: string[]): number {
  if (!tokens.length) return 0;
  const title = loc.title.toLowerCase();
  const locality = loc.locality.toLowerCase();
  const cats = hay(loc.categories);
  const kws = hay(loc.keywords);
  const tags = hay([...loc.look, ...loc.productionTypes]);
  const desc = (loc.shortDescription + " " + loc.fullDescription).toLowerCase();

  let total = 0;
  let matched = 0;
  for (const t of tokens) {
    let s = 0;
    if (title.includes(t)) s += 10;
    if (locality.includes(t)) s += 8;
    if (cats.includes(t)) s += 8;
    if (kws.includes(t)) s += 7;
    if (tags.includes(t)) s += 6;
    if (desc.includes(t)) s += 3;
    if (s > 0) matched++;
    total += s;
  }
  if (!matched) return 0;
  // reward listings matching more of the brief, not just one term loudly
  total *= 1 + (matched - 1) * 0.35;
  if (loc.featured) total += 1;
  return total;
}

export type Filters = {
  query?: string;
  categories?: string[];
  islands?: string[];
  look?: string[];
};

export function searchLocations(f: Filters): Location[] {
  const tokens = normalise(f.query ?? "");
  let pool = locations;

  if (f.islands?.length) pool = pool.filter((l) => f.islands!.includes(l.island));
  if (f.categories?.length)
    pool = pool.filter((l) => l.categories.some((c) => f.categories!.includes(c)));
  if (f.look?.length) pool = pool.filter((l) => l.look.some((c) => f.look!.includes(c)));

  if (!tokens.length) {
    return [...pool].sort(
      (a, b) => Number(!!b.featured) - Number(!!a.featured) || a.title.localeCompare(b.title),
    );
  }

  return pool
    .map((l) => ({ l, s: score(l, tokens) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.l);
}

/** Fallback when a search returns nothing: nearest neighbours by shared vocabulary. */
export function suggestFor(query: string, limit = 4): Location[] {
  const tokens = normalise(query);
  if (!tokens.length) return locations.filter((l) => l.featured).slice(0, limit);
  const scored = locations
    .map((l) => {
      const bag = hay([...l.categories, ...l.look, ...l.keywords, ...l.productionTypes]);
      const s = tokens.reduce(
        (acc, t) => acc + (t.length > 3 && bag.split(" ").some((w) => w.startsWith(t.slice(0, 4))) ? 1 : 0),
        0,
      );
      return { l, s };
    })
    .sort((a, b) => b.s - a.s);
  const good = scored.filter((x) => x.s > 0).map((x) => x.l);
  return (good.length ? good : locations.filter((l) => l.featured)).slice(0, limit);
}

export function relatedTo(loc: Location, limit = 4): Location[] {
  return locations
    .filter((l) => l.slug !== loc.slug)
    .map((l) => {
      let s = 0;
      s += l.categories.filter((c) => loc.categories.includes(c)).length * 4;
      s += l.look.filter((c) => loc.look.includes(c)).length * 2;
      s += l.productionTypes.filter((c) => loc.productionTypes.includes(c)).length;
      if (l.island === loc.island) s += 1;
      return { l, s };
    })
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.l);
}

export const ALL_CATEGORIES = [...new Set(locations.flatMap((l) => l.categories))].sort();
export const ALL_LOOKS = [...new Set(locations.flatMap((l) => l.look))].sort();

/** Category chips on the homepage — only categories with real depth behind them. */
export const FEATURED_CATEGORIES = ALL_CATEGORIES.map((c) => ({
  name: c,
  count: locations.filter((l) => l.categories.includes(c)).length,
}))
  .filter((c) => c.count >= 2)
  .sort((a, b) => b.count - a.count);
