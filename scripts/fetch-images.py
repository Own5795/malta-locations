import json, urllib.parse, urllib.request, re, sys, time

QUERIES = {
 "dingli-cliffs": "Dingli Cliffs",
 "ta-kola-windmill": "Ta' Kola Windmill Xaghra",
 "xlendi-bay": "Xlendi Bay Gozo",
 "mdina-streets": "Mdina street Malta",
 "valletta-streets": "Valletta street architecture",
 "senglea-grand-harbour": "Senglea Grand Harbour Malta",
 "marsaxlokk-harbour": "Marsaxlokk luzzu harbour",
 "blue-grotto": "Blue Grotto Malta Wied iz-Zurrieq",
 "ghajn-tuffieha": "Ghajn Tuffieha bay Malta",
 "comino-blue-lagoon": "Comino Blue Lagoon Malta",
 "st-peters-pool": "St Peter's Pool Delimara Malta",
 "fort-st-angelo": "Fort St Angelo Birgu",
 "wied-il-ghasri": "Wied il-Ghasri Gozo",
 "selmun-palace": "Selmun Palace Malta",
 "ta-cenc-cliffs": "Ta' Cenc cliffs Gozo",
 "xwejni-salt-pans": "Xwejni salt pans Gozo",
 "fomm-ir-rih": "Fomm ir-Rih Malta",
 "dwejra-gozo": "Dwejra Gozo inland sea",
 "cittadella-victoria": "Cittadella Victoria Gozo",
 "tigne-point-sliema": "Tigne Point Sliema Malta",
 "mgarr-ix-xini": "Mgarr ix-Xini Gozo",
 "ghar-lapsi": "Ghar Lapsi Malta",
 "salina-salt-pans": "Salina salt pans Malta",
 "popeye-village": "Popeye Village Mellieha Malta",
 "mtahleb-cliffs": "Mtahleb Malta cliffs",
 "hagar-qim-landscape": "Hagar Qim Malta landscape",
}

BAD = re.compile(r"(map|flag|coat.of.arms|plaque|sign|logo|stamp|diagram|plan of|allium|orchid|flower|butterfly|lizard|beetle|snail|gecko|moth|fungus|plant|panorama.of.the.world|360)", re.I)

def fetch(term, n=12):
    url = ("https://commons.wikimedia.org/w/api.php?action=query&generator=search"
           f"&gsrsearch={urllib.parse.quote('filetype:bitmap ' + term)}&gsrlimit={n}"
           "&gsrnamespace=6&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1600&format=json")
    req = urllib.request.Request(url, headers={"User-Agent":"malta-locations-mvp/0.1 (contact: me@owen.com)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def clean_artist(v):
    if not v: return None
    v = re.sub(r"<[^>]+>", "", v)
    return re.sub(r"\s+", " ", v).strip()[:60]

out = {}
for slug, term in QUERIES.items():
    try:
        d = fetch(term)
    except Exception as e:
        print(f"!! {slug}: {e}", file=sys.stderr); out[slug]=[]; continue
    pages = list(d.get("query", {}).get("pages", {}).values())
    pages.sort(key=lambda p: p.get("index", 99))
    picks = []
    for p in pages:
        title = p["title"].replace("File:", "")
        if BAD.search(title): continue
        ii = p.get("imageinfo", [{}])[0]
        w, h = ii.get("width", 0), ii.get("height", 0)
        if not w or not h: continue
        if w / h < 1.25: continue          # landscape only
        if w < 1200: continue
        thumb = (ii.get("thumburl") or "").split("?")[0]
        if not thumb: continue
        em = ii.get("extmetadata", {})
        picks.append({
            "url": thumb,
            "title": title,
            "credit": clean_artist(em.get("Artist", {}).get("value")),
            "license": em.get("LicenseShortName", {}).get("value"),
            "ratio": round(w / h, 2),
        })
        if len(picks) >= 4: break
    out[slug] = picks
    print(f"{slug}: {len(picks)}", file=sys.stderr)
    time.sleep(0.15)

print(json.dumps(out, indent=1))
