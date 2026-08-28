# -*- coding: utf-8 -*-
import json, io, sys

imgs = json.load(open('scripts/images2.json'))

# Drop failed / weak fetches
for k in ['grand-harbour-industrial', 'gozo-farmhouse']:
    imgs.pop(k, None)
imgs['maltese-countryside'] = [i for i in imgs['maltese-countryside'] if 'Pigeon' not in i['title']]

# Extreme panoramas upscale into an unreadable blur inside a 4:3 gallery cell.
# Drop them wherever the listing still keeps at least two usable images.
for _k, _v in imgs.items():
    _keep = [i for i in _v if i.get('ratio', 1.5) <= 2.4]
    if len(_keep) >= 2:
        imgs[_k] = _keep

L = [
{
 "slug":"dingli-cliffs","title":"Dingli Cliffs","locality":"Dingli","island":"malta",
 "lat":35.8514,"lng":14.3806,"precision":"exact","featured":True,
 "short":"Malta's highest sea cliffs — 250m of unbroken limestone escarpment with nothing modern in frame.",
 "full":"The island's highest point, where terraced fields stop abruptly at a 250-metre drop. Long uninterrupted sightlines along the escarpment, no buildings in the seaward frame, and a clean western horizon that makes it the default choice for sunset exteriors. Solves briefs asking for dramatic coastline, isolation, or an ending — and doubles convincingly for southern Italy and the Levant.",
 "cat":["Cliff","Coast"],"look":["Rugged","Dramatic","Remote","Mediterranean"],
 "prod":["Film / TV","Fashion","Automotive","Commercial Video","Drone","Editorial"],
 "kw":["cliff","cliffs","dramatic cliff","sea cliff","rocky coast","sunset coast","edge","escarpment","high cliff","clifftop","dramatic coastline","southern italy look","biblical","epic landscape","west coast"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Road runs along the clifftop; vans can park within metres of the edge","parking":"Informal roadside parking, ample outside summer weekends","bestLight":"Late afternoon into sunset — faces due west","footTraffic":"Moderate; heavy at sunset in summer","droneNotes":"Open airspace, but Transport Malta authorisation required for commercial flights","crewNotes":"Comfortable for medium crews; no shelter, exposed to wind"},
},
{
 "slug":"ta-kola-windmill","title":"Ta' Kola Windmill","locality":"Xagħra, Gozo","island":"gozo",
 "lat":36.0494,"lng":14.2669,"precision":"exact","featured":True,
 "short":"18th-century stone windmill with intact sails and vaulted interior rooms.",
 "full":"One of the few surviving Knights-period windmills, in globigerina limestone with its timber machinery still in place. Compact site with a photogenic tower, small courtyard and low interior rooms with heavy stone vaulting. Answers the 'Mediterranean windmill' and 'historic tower' brief directly, and the interiors give a rustic period space that most Maltese exteriors can't provide.",
 "cat":["Windmill","Historic Street"],"look":["Historic","Traditional Maltese","Rustic","Mediterranean"],
 "prod":["Photography","Film / TV","Editorial","Fashion","Commercial Video"],
 "kw":["windmill","wind mill","old windmill","stone windmill","historic tower","maltese windmill","rustic","period","heritage building","mill","sails","limestone tower"],
 "access":"managed","perm":"commercial_approval_required",
 "practical":{"vehicleAccess":"Narrow village streets; small vehicles only","parking":"Limited street parking in Xagħra","bestLight":"Morning for the east face, late afternoon for the tower","footTraffic":"Museum visitors during opening hours","crewNotes":"Small crews only — interior rooms are tight","droneNotes":"Village airspace; residential proximity"},
},
{
 "slug":"fort-ricasoli","title":"Fort Ricasoli","locality":"Kalkara","island":"malta",
 "lat":35.8956,"lng":14.5311,"precision":"exact","featured":True,
 "short":"Malta's largest fort and its most-used film location — vast bastioned courtyards beside the water tanks.",
 "full":"A sprawling 17th-century Hospitaller fort at the mouth of the Grand Harbour, and the backbone of Malta's feature-film industry — its bastions and interior parade grounds have stood in for Rome, Troy and Jerusalem. Enormous enclosed courtyards, weathered limestone curtain walls and open build space, adjacent to the Malta Film Studios water tanks. The answer to 'ancient world', 'large-scale period exterior' or 'somewhere we can build'.",
 "cat":["Fort","Historic Street"],"look":["Historic","Dramatic","Rugged","Cinematic"],
 "prod":["Film / TV","Commercial Video","Fashion","Editorial","Drone"],
 "kw":["fort","fortress","fortification","bastion","castle","roman look","ancient","period","gladiator","stone walls","citadel","ruins","backlot","build space","large crew"],
 "access":"managed","perm":"commercial_approval_required",
 "practical":{"vehicleAccess":"Full vehicle and truck access through the main gate","parking":"Extensive on-site space","bestLight":"All day — courtyards catch light at different hours","footTraffic":"None; closed site","crewNotes":"Suits large crews and multi-day builds","droneNotes":"Restricted — adjacent to harbour operations, authorisation required"},
},
{
 "slug":"marsaxlokk-harbour","title":"Marsaxlokk Harbour","locality":"Marsaxlokk","island":"malta",
 "lat":35.8419,"lng":14.5439,"precision":"exact","featured":True,
 "short":"Working fishing village — hundreds of painted luzzus, low waterfront houses, no high-rise.",
 "full":"A live fishing harbour where painted luzzu boats fill the bay and the waterfront stays low and pastel-coloured. The eyes of Osiris on every bow give an instantly recognisable Mediterranean signature, and the working quayside supplies nets, crates and genuine activity as foreground. The standard answer to 'fishing village', and it can pass for the 1970s with light dressing.",
 "cat":["Harbour","Fishing Village","Town"],"look":["Mediterranean","Traditional Maltese","Coastal","Rustic"],
 "prod":["Photography","Film / TV","Commercial Video","Editorial","Social","Fashion"],
 "kw":["fishing village","harbour","harbor","boats","luzzu","port","quay","waterfront","colourful boats","market","mediterranean village","seaside town","period village","1970s"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Waterfront road, restricted on Sunday market day","parking":"Village car park, busy","bestLight":"Early morning — boats still, light across the bay","footTraffic":"High, very high Sunday mornings","crewNotes":"Public working quay; small crews move most easily","droneNotes":"Harbour area — Transport Malta conditions may apply"},
},
{
 "slug":"mdina-streets","title":"Mdina Old City Streets","locality":"Mdina","island":"malta",
 "lat":35.8861,"lng":14.4028,"precision":"exact","featured":True,
 "short":"Silent, car-free medieval streets — deep shadow, honey limestone, zero modern signage.",
 "full":"A walled medieval city of barely 300 residents, closed to traffic and almost entirely free of modern signage, aerials and shopfronts. Narrow streets run in deep shadow between tall limestone palazzi, opening onto small sunlit squares. The strongest 'old European street' answer in Malta, and the reason it doubles for King's Landing, Renaissance Italy and generic period Europe.",
 "cat":["Historic Street","Town"],"look":["Historic","Dramatic","Traditional Maltese","Cinematic"],
 "prod":["Film / TV","Fashion","Photography","Editorial","Wedding","Commercial Video"],
 "kw":["historic street","old european street","medieval","narrow street","alley","period street","walled city","silent city","cobbled","palazzo","game of thrones","renaissance","old town"],
 "access":"public","perm":"commercial_approval_required",
 "practical":{"vehicleAccess":"Pedestrian city — no vehicles without permit","parking":"Outside the walls, then carry in","bestLight":"Mid-morning and late afternoon; streets go dark quickly","footTraffic":"Heavy daytime, near-empty after dusk","crewNotes":"Residents on site; noise and access strictly managed","droneNotes":"Restricted heritage airspace"},
},
{
 "slug":"comino-blue-lagoon","title":"Blue Lagoon, Comino","locality":"Comino","island":"comino",
 "lat":36.0133,"lng":14.3222,"precision":"exact","featured":True,
 "short":"Fluorescent turquoise channel over white sand between two uninhabited islands.",
 "full":"A shallow channel between Comino and Cominotto where white sand under clear water produces an almost artificial turquoise. Surrounding rock is bare and pale with no vegetation or building in sight. The default answer to briefs asking for tropical or Caribbean water without leaving Europe — best shot at first light before boats arrive.",
 "cat":["Cove","Beach","Island"],"look":["Natural","Coastal","Remote","Dramatic"],
 "prod":["Fashion","Photography","Commercial Video","Social","Drone","Editorial"],
 "kw":["lagoon","turquoise water","blue water","clear water","tropical","caribbean look","swimming","island","beach","cove","paradise","swimwear","boat"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"None — boat access only from Ċirkewwa or Mġarr","parking":"At mainland ferry terminals","bestLight":"Sunrise to 09:00, before day-trip boats","footTraffic":"Extreme in summer; near-empty in winter and at dawn","crewNotes":"Everything arrives by boat — plan kit weight carefully","droneNotes":"Open, but a protected area; authorisation required"},
},
{
 "slug":"xwejni-salt-pans","title":"Xwejni Salt Pans","locality":"Marsalforn, Gozo","island":"gozo",
 "lat":36.0761,"lng":14.2483,"precision":"exact","featured":True,
 "short":"Chequerboard of shallow pans cut into flat coastal rock — geometric, reflective, otherworldly.",
 "full":"Three hundred years of hand-cut salt pans forming a grid of shallow rectangles across a flat coastal shelf, backed by a wind-eroded limestone escarpment. When flooded they mirror the sky; when dry they leave white crust and hard geometry. A rare graphic, near-abstract landscape — strong for automotive, fashion and anything wanting a desert or alien read.",
 "cat":["Salt Pans","Coast"],"look":["Minimal","Natural","Rugged","Dramatic"],
 "prod":["Fashion","Automotive","Photography","Editorial","Commercial Video","Drone"],
 "kw":["salt pans","salt flats","geometric","desert-like","minimal","reflection","abstract landscape","white","alien landscape","flat rock","pattern","otherworldly"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Coast road runs directly alongside — vehicles can park at the pans","parking":"Roadside, straightforward","bestLight":"Sunrise and the hour before sunset; midday is flat and harsh","footTraffic":"Low outside summer","crewNotes":"Salt is still harvested here — the pans are worked, not decorative","droneNotes":"Open coastal airspace; commercial authorisation required"},
},
{
 "slug":"selmun-palace","title":"Selmun Palace","locality":"Mellieħa","island":"malta",
 "lat":35.9583,"lng":14.3694,"precision":"exact","featured":True,
 "short":"Empty 18th-century baroque palace on open scrubland — grand, weathered, abandoned-looking.",
 "full":"A four-towered baroque hunting lodge standing alone on high scrubland above Mellieħa Bay, long disused and visibly weathered. Symmetrical facade, deep window recesses and no surrounding development, so it reads as isolated from every angle. The location to reach for on 'abandoned looking building', 'isolated grand house' or 'gothic' briefs.",
 "cat":["Palace","Derelict","Rural"],"look":["Historic","Dramatic","Remote","Rustic"],
 "prod":["Film / TV","Fashion","Photography","Editorial","Music Video","Drone"],
 "kw":["abandoned","abandoned looking building","derelict","empty building","palace","mansion","isolated house","gothic","haunted","ruin","period house","grand house","tower","country house"],
 "access":"enquire","perm":"verification_pending",
 "practical":{"vehicleAccess":"Track from the Selmun road; vans reach the building","parking":"Open ground adjacent","bestLight":"Late afternoon on the west facade","footTraffic":"Very low","crewNotes":"Exterior straightforward; interior access requires permission","droneNotes":"Open airspace; authorisation required for commercial flights"},
},
{
 "slug":"manoel-island","title":"Manoel Island Derelict Quarter","locality":"Gżira","island":"malta",
 "lat":35.9017,"lng":14.4989,"precision":"approximate",
 "short":"Empty industrial waterfront — peeling boathouses, chain-link, disused yard buildings.",
 "full":"A largely vacant island in Marsamxett Harbour: disused boatyard sheds, an abandoned quarantine hospital, cracked concrete aprons and rusting shutters, with Valletta's skyline directly behind. The nearest thing Malta has to a post-industrial backlot, and it delivers texture — rust, peeling paint, graffiti — that the island's clean limestone otherwise refuses.",
 "cat":["Derelict","Industrial","Urban"],"look":["Industrial","Urban","Rugged","Minimal"],
 "prod":["Fashion","Music Video","Automotive","Photography","Editorial","Commercial Video"],
 "kw":["industrial","abandoned","derelict","warehouse","factory","urban decay","concrete","rust","graffiti","boatyard","garage","gritty","post industrial","empty building","chain link"],
 "access":"private","perm":"commercial_approval_required",
 "practical":{"vehicleAccess":"Bridge access from Gżira; vehicles reach most of the site","parking":"On-site open ground","bestLight":"Afternoon, with Valletta backlit at golden hour","footTraffic":"Low","crewNotes":"Active redevelopment site — access strictly by arrangement","droneNotes":"Harbour airspace; restrictions apply"},
},
{
 "slug":"st-peters-pool","title":"St Peter's Pool","locality":"Delimara, Marsaxlokk","island":"malta",
 "lat":35.8244,"lng":14.5636,"precision":"exact",
 "short":"Natural rock pool in smooth white limestone, sculpted into ledges and shelves.",
 "full":"A deep natural inlet cut into pale limestone that the sea has worn into smooth curved shelves and diving ledges. The rock reads almost white in strong sun against very dark blue water — a clean, high-contrast setting with no vegetation or structures. Strong for swimwear, lifestyle and any 'natural pool' or 'rocky coast' brief.",
 "cat":["Natural Pool","Coast","Cove"],"look":["Natural","Minimal","Coastal","Rugged"],
 "prod":["Fashion","Photography","Social","Editorial","Commercial Video"],
 "kw":["natural pool","rock pool","swimming","rocky coast","white rock","limestone","blue water","cove","inlet","swimwear","cliff jumping","sculpted rock"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Unsurfaced track — 4x4 or careful driving; no large vans","parking":"Rough ground above the pool, then a short walk down","bestLight":"Morning; the inlet loses direct sun in late afternoon","footTraffic":"High in summer, quiet off-season","crewNotes":"Kit must be carried down over uneven rock","droneNotes":"Open coastal airspace; authorisation required"},
},
{
 "slug":"ta-cenc-cliffs","title":"Ta' Ċenċ Cliffs","locality":"Sannat, Gozo","island":"gozo",
 "lat":36.0206,"lng":14.2450,"precision":"exact",
 "short":"Flat garigue plateau ending in a 130m vertical drop — empty, silent, treeless.",
 "full":"An open expanse of bare limestone garigue running to the edge of a sheer 130-metre cliff on Gozo's south coast. No buildings, no trees, almost no vegetation above ankle height — a genuinely empty horizon in every landward direction. Answers briefs for remote, desolate, prehistoric or end-of-the-world landscapes, with easy vehicle access to the plateau.",
 "cat":["Cliff","Rural","Coast"],"look":["Remote","Rugged","Minimal","Dramatic"],
 "prod":["Film / TV","Automotive","Fashion","Drone","Editorial","Commercial Video"],
 "kw":["cliff","remote","desolate","empty landscape","plateau","barren","moonscape","desert-like","wilderness","prehistoric","open ground","no buildings","isolated","garigue"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Road reaches the plateau; vehicles can drive onto open ground","parking":"Unrestricted open ground","bestLight":"Sunrise and sunset both usable — open in all directions","footTraffic":"Very low","crewNotes":"Excellent for larger units; fully exposed to wind","droneNotes":"Protected bird area — permissions required"},
},
{
 "slug":"valletta-streets","title":"Valletta Grid Streets","locality":"Valletta","island":"malta",
 "lat":35.8989,"lng":14.5146,"precision":"exact",
 "short":"Baroque capital on a strict grid — stepped streets, enclosed balconies, washing lines.",
 "full":"A UNESCO-listed 16th-century capital laid out on a rigid grid, so streets run dead straight and drop to the harbour in long flights of steps. Painted timber balconies stack up limestone facades, with washing lines strung between them in the side streets. Delivers both grand baroque frontage and lived-in Mediterranean back-street texture within a few minutes' walk.",
 "cat":["Historic Street","Town","Urban"],"look":["Historic","Mediterranean","Traditional Maltese","Urban"],
 "prod":["Film / TV","Fashion","Photography","Editorial","Commercial Video","Social"],
 "kw":["historic street","old european street","baroque","city street","steps","stepped street","balcony","washing line","capital","urban","narrow street","architecture","alley","period city"],
 "access":"public","perm":"commercial_approval_required",
 "practical":{"vehicleAccess":"Restricted vehicle zone; permits needed for unloading","parking":"Underground car park at City Gate","bestLight":"Mid-morning for the grid; the harbour side goes golden late","footTraffic":"Heavy on the main streets, light in side streets","crewNotes":"Residential — filming permissions and noise limits apply","droneNotes":"Restricted urban and heritage airspace"},
},
{
 "slug":"blue-grotto","title":"Blue Grotto Sea Caves","locality":"Wied iż-Żurrieq, Qrendi","island":"malta",
 "lat":35.8203,"lng":14.4550,"precision":"exact",
 "short":"Sea caves and a natural arch under high cliffs, with luminous underwater blue.",
 "full":"A system of sea caverns beneath the south coast cliffs, where sunlight reflecting off the white seabed throws an intense blue up onto the cave walls. Above, a natural rock arch and a steep tiered viewpoint give wide coastal shots without any built environment in frame. Best in morning light, when the caves are lit and the sea is usually calm.",
 "cat":["Cave","Coast","Cliff"],"look":["Natural","Dramatic","Coastal","Rugged"],
 "prod":["Photography","Commercial Video","Film / TV","Drone","Editorial"],
 "kw":["cave","sea cave","grotto","arch","natural arch","blue water","cliff","rocky coast","boat","coastal","rock formation","tunnel"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Road to the viewpoint and the small quay","parking":"Car park above the quay","bestLight":"09:00–11:00 for the caves; the blue disappears later","footTraffic":"High at the viewpoint, low on the cliff paths","crewNotes":"Cave interiors require boat hire and calm sea","droneNotes":"Coastal airspace; authorisation required"},
},
{
 "slug":"dwejra-gozo","title":"Dwejra Inland Sea","locality":"San Lawrenz, Gozo","island":"gozo",
 "lat":36.0503,"lng":14.1892,"precision":"exact",
 "short":"Enclosed lagoon joined to the open sea by an 80m tunnel through the cliff.",
 "full":"A shallow landlocked lagoon ringed by cliffs, linked to the open Mediterranean by a natural tunnel bored through the headland. Fishermen's boathouses line the shingle, and the water shifts from green in the basin to deep blue at the tunnel mouth. Distinctive geology that photographs unlike anywhere else in the Maltese islands — and the site of the former Azure Window.",
 "cat":["Cave","Cove","Coast"],"look":["Natural","Dramatic","Rugged","Remote"],
 "prod":["Film / TV","Photography","Commercial Video","Drone","Editorial"],
 "kw":["inland sea","lagoon","tunnel","cave","cliff","rock formation","boathouse","natural harbour","azure window","geology","dramatic coast","boats"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Road down to the shingle beach","parking":"Open ground beside the lagoon","bestLight":"Late morning through afternoon","footTraffic":"Moderate; heavier in summer","crewNotes":"Tunnel passage by small boat only, sea-state dependent","droneNotes":"Protected area — permissions required"},
},
{
 "slug":"fomm-ir-rih","title":"Fomm ir-Riħ Bay","locality":"Baħrija, Mġarr","island":"malta",
 "lat":35.9006,"lng":14.3419,"precision":"exact",
 "short":"Malta's most remote bay — blue clay slopes, no road, no buildings, no people.",
 "full":"A wide bay on the exposed west coast reached only on foot down a clay track, which is precisely why it stays empty. Grey-blue clay slopes fall to a boulder shore beneath layered cliffs, with no structure of any kind in view. The strongest answer to genuine isolation, and the closest Malta gets to a raw, unpeopled coastal wilderness.",
 "cat":["Coast","Cove","Cliff","Rural"],"look":["Remote","Rugged","Natural","Dramatic"],
 "prod":["Fashion","Film / TV","Editorial","Drone","Photography"],
 "kw":["remote","isolated","wild coast","empty beach","no buildings","rugged coastline","clay","wilderness","untouched","dramatic bay","hidden","secluded"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"None to the shore — vehicles stop at the ridge, then a steep 15-minute descent","parking":"Limited at the track head","bestLight":"Afternoon into sunset — faces west","footTraffic":"Very low","crewNotes":"Everything is hand-carried down a steep clay path; small units only","droneNotes":"Open airspace; commercial authorisation required"},
},
{
 "slug":"wied-il-ghasri","title":"Wied il-Għasri Gorge","locality":"Żebbuġ, Gozo","island":"gozo",
 "lat":36.0733,"lng":14.2361,"precision":"exact",
 "short":"Narrow rock gorge cut to a hidden pebble inlet — vertical walls, single shaft of light.",
 "full":"A steep-sided valley that narrows to a slot canyon before opening onto a small pebble beach barely ten metres wide. Sheer walls enclose the inlet on both sides, so light reaches the water only in a narrow band for part of the day. Compact, sculptural and unlike anywhere else on the islands — ideal for intimate, high-contrast setups.",
 "cat":["Cave","Cove","Coast"],"look":["Dramatic","Remote","Natural","Minimal"],
 "prod":["Fashion","Photography","Editorial","Music Video","Film / TV"],
 "kw":["gorge","canyon","narrow","inlet","hidden beach","rock walls","dramatic","secluded","slot canyon","cliff","shaft of light","enclosed"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Road to the clifftop; steep stone stairway down to the inlet","parking":"Small area at the top","bestLight":"Midday — the gorge is in shadow outside a narrow window","footTraffic":"Low","crewNotes":"Steep stair carry; small crews only","droneNotes":"Narrow gorge — limited flight space"},
},
{
 "slug":"senglea-grand-harbour","title":"Senglea Point & Grand Harbour","locality":"Senglea (L-Isla)","island":"malta",
 "lat":35.8878,"lng":14.5169,"precision":"exact",
 "short":"Fortified promontory looking across the harbour to Valletta's bastions.",
 "full":"The tip of a fortified peninsula, where the Gardjola watchtower looks straight across the Grand Harbour to Valletta's curtain walls. Below, traditional dgħajsa boats work the creek beneath tightly stacked limestone houses. Delivers monumental harbour scale and lived-in waterfront in a single setup — one of the most recognisable views in Malta.",
 "cat":["Harbour","Fort","Town","Urban"],"look":["Historic","Mediterranean","Dramatic","Traditional Maltese"],
 "prod":["Film / TV","Photography","Commercial Video","Editorial","Drone","Fashion"],
 "kw":["harbour","harbor","grand harbour","fortification","bastion","watchtower","waterfront","boats","city view","historic","port","stone walls","panorama"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Narrow streets to the point; small vehicles","parking":"Limited street parking","bestLight":"Golden hour, with Valletta lit across the water","footTraffic":"Low to moderate","crewNotes":"Residential streets; access is tight but workable","droneNotes":"Harbour airspace — Transport Malta conditions apply"},
},
{
 "slug":"ghajn-tuffieha","title":"Għajn Tuffieħa Bay","locality":"Mġarr","island":"malta",
 "lat":35.9297,"lng":14.3419,"precision":"exact",
 "short":"Red-sand bay below undeveloped clay hills — reached by 190 steps, so it stays empty.",
 "full":"A crescent of reddish sand enclosed by steep clay slopes and a headland, with no development on the surrounding hillsides. The stair descent keeps crowds down even in season, and the west-facing aspect makes it one of the better sunset beaches on the island. Works for lifestyle, swimwear and any brief wanting a natural, unbuilt coastline.",
 "cat":["Beach","Cove","Coast"],"look":["Natural","Coastal","Remote","Mediterranean"],
 "prod":["Fashion","Photography","Social","Commercial Video","Editorial"],
 "kw":["beach","sandy beach","bay","red sand","cove","sunset","swimming","natural","undeveloped","coastline","cliffs","secluded beach"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Car park at the top; 190 steps down to the sand","parking":"Dedicated car park","bestLight":"Late afternoon into sunset — faces west","footTraffic":"Moderate in summer, empty in winter","crewNotes":"All kit hand-carried down the steps","droneNotes":"Open coastal airspace; authorisation required"},
},
{
 "slug":"fort-st-angelo","title":"Fort St Angelo","locality":"Birgu (Vittoriosa)","island":"malta",
 "lat":35.8925,"lng":14.5183,"precision":"exact",
 "short":"Tiered stone fortress rising straight out of the Grand Harbour on its own promontory.",
 "full":"A fortress in continuous military use from the medieval period to the 1970s, stacked in tiers of limestone across a promontory at the centre of the Grand Harbour. Sloped batteries, vaulted chambers, parade ground and chapel, with harbour water on three sides. Reads as castle, citadel or ancient stronghold depending on framing.",
 "cat":["Fort","Harbour","Historic Street"],"look":["Historic","Dramatic","Rugged","Cinematic"],
 "prod":["Film / TV","Photography","Editorial","Commercial Video","Drone","Fashion"],
 "kw":["fort","fortress","castle","citadel","bastion","stone walls","medieval","period","battlements","stronghold","ramparts","harbour","ancient"],
 "access":"managed","perm":"commercial_approval_required",
 "practical":{"vehicleAccess":"Vehicle access to the lower levels; upper levels on foot","parking":"On the approach road","bestLight":"Afternoon on the harbour-facing walls","footTraffic":"Visitors during opening hours","crewNotes":"Heritage site — approval required, movement managed","droneNotes":"Restricted heritage and harbour airspace"},
},
{
 "slug":"cittadella-victoria","title":"Cittadella, Victoria","locality":"Victoria (Rabat), Gozo","island":"gozo",
 "lat":36.0464,"lng":14.2394,"precision":"exact",
 "short":"Walled hilltop citadel over Gozo — bastions, empty lanes, 360° island views.",
 "full":"A fortified citadel on the high ground at the centre of Gozo, with intact bastion walls and a largely uninhabited interior of narrow lanes and roofless stone buildings. From the ramparts the view runs unbroken across the island in every direction. Gives both enclosed period streets and commanding elevated wide shots on one compact site.",
 "cat":["Fort","Historic Street","Town"],"look":["Historic","Dramatic","Traditional Maltese","Cinematic"],
 "prod":["Film / TV","Photography","Fashion","Editorial","Commercial Video","Drone"],
 "kw":["citadel","fort","fortress","walled city","bastion","medieval","historic street","ruins","hilltop","ramparts","period","stone","view","empty streets"],
 "access":"managed","perm":"commercial_approval_required",
 "practical":{"vehicleAccess":"Vehicles to the gate; interior is pedestrian","parking":"Below the citadel in Victoria","bestLight":"Early morning for empty lanes; sunset from the ramparts","footTraffic":"Moderate daytime, empty early","crewNotes":"Commercial filming requires prior approval from the heritage authority","droneNotes":"Restricted heritage airspace"},
},
{
 "slug":"xlendi-bay","title":"Xlendi Bay","locality":"Xlendi, Gozo","island":"gozo",
 "lat":36.0286,"lng":14.2153,"precision":"exact",
 "short":"Deep narrow inlet between high cliffs, with a small waterfront village at its head.",
 "full":"A long, narrow inlet cut deep between steep cliffs, with a compact village of restaurants and low buildings gathered at the water's edge. The enclosing walls give sheltered water and strong vertical framing, and a cliff path leads to a Knights-period watchtower on the point. Combines an intimate harbour setting with dramatic coastal geology at close range.",
 "cat":["Cove","Harbour","Coast","Town"],"look":["Mediterranean","Coastal","Dramatic","Traditional Maltese"],
 "prod":["Photography","Commercial Video","Fashion","Social","Editorial","Wedding"],
 "kw":["bay","inlet","cove","cliffs","village","waterfront","harbour","swimming","sheltered","promenade","seaside","watchtower","sunset"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Road down to the waterfront","parking":"Village car park, tight in summer","bestLight":"Late afternoon; the inlet loses sun early","footTraffic":"Moderate to high in season","crewNotes":"Village promenade is public and busy in the evenings","droneNotes":"Open coastal airspace; authorisation required"},
},
{
 "slug":"mgarr-ix-xini","title":"Mġarr ix-Xini","locality":"Sannat, Gozo","island":"gozo",
 "lat":36.0217,"lng":14.2544,"precision":"exact",
 "short":"Hidden pebble inlet at the end of a wooded valley — quiet, enclosed, no development.",
 "full":"A narrow inlet at the mouth of a wooded valley, once the Knights' galley anchorage and now a small pebble beach flanked by rock ledges. A single track runs down the valley, and there is nothing built at the shore beyond a seasonal kiosk. Sheltered, quiet and completely enclosed — used as a feature location before, and it still reads entirely private on camera.",
 "cat":["Cove","Coast","Rural"],"look":["Remote","Natural","Mediterranean","Rustic"],
 "prod":["Film / TV","Fashion","Photography","Editorial","Commercial Video"],
 "kw":["hidden beach","inlet","cove","secluded","valley","quiet","pebble beach","enclosed","private feel","natural","anchorage","by the sea"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Single-track valley road down to the shore","parking":"Very limited at the inlet","bestLight":"Midday to mid-afternoon; the valley shades early","footTraffic":"Low outside peak summer","crewNotes":"Access road is one vehicle wide — plan unit movement","droneNotes":"Enclosed valley; open coastal airspace beyond"},
},
{
 "slug":"popeye-village","title":"Popeye Village Film Set","locality":"Anchor Bay, Mellieħa","island":"malta",
 "lat":35.9294,"lng":14.3378,"precision":"exact",
 "short":"Intact 1980 timber film set — a whole ramshackle village built into a cove.",
 "full":"A complete purpose-built film village of clapboard houses on stilts, constructed for the 1980 Popeye production and maintained ever since. Bright painted timber, crooked rooflines and wooden walkways stacked around a small anchorage — an entirely built environment with no Maltese limestone in sight. Unique in the region: a standing, walkable set rather than a landscape.",
 "cat":["Film Set","Town","Cove"],"look":["Rustic","Dramatic","Coastal"],
 "prod":["Commercial Video","Photography","Social","Film / TV","Editorial"],
 "kw":["film set","village","wooden houses","colourful","theme park","built set","anchorage","quirky","stilts","clapboard","backlot","standing set"],
 "access":"managed","perm":"commercial_approval_required",
 "practical":{"vehicleAccess":"Road to the site entrance and car park","parking":"On-site car park","bestLight":"Morning; the cove is west-facing and shades in the afternoon","footTraffic":"Visitor attraction — busy in opening hours","crewNotes":"Private attraction — filming by commercial arrangement","droneNotes":"By arrangement with the operator"},
},
{
 "slug":"ghar-lapsi","title":"Għar Lapsi","locality":"Siġġiewi","island":"malta",
 "lat":35.8306,"lng":14.4197,"precision":"exact",
 "short":"Rocky bathing inlet under the south cliffs, with boathouses cut into the rock.",
 "full":"A small rocky inlet at the foot of the southern cliffs, where a natural pool is enclosed by low reef and fishermen's boathouses are cut straight into the rock face. Flat shelves give clean foreground, and the cliffs rise directly behind. Quiet, workable and characterful — a rocky-coast option with genuine vehicle access right to the water.",
 "cat":["Coast","Natural Pool","Cove"],"look":["Rugged","Coastal","Natural","Rustic"],
 "prod":["Photography","Fashion","Commercial Video","Social","Editorial"],
 "kw":["rocky coast","rock pool","swimming","inlet","boathouse","cliffs","south coast","natural pool","flat rocks","bathing","quiet coast"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Road runs to the water's edge — vans can park at the inlet","parking":"Roadside and small car park","bestLight":"Afternoon; cliffs shade the inlet late in the day","footTraffic":"Low to moderate","crewNotes":"Easiest rocky-coast access on the island for a loaded vehicle","droneNotes":"Coastal airspace; authorisation required"},
},
{
 "slug":"salina-salt-pans","title":"Salina Salt Pans","locality":"Naxxar / St Paul's Bay","island":"malta",
 "lat":35.9411,"lng":14.4256,"precision":"exact",
 "short":"Large grid of Roman-era pans on a flat inland lagoon — reflective, geometric, easy access.",
 "full":"An extensive system of shallow salt pans laid out in a rectangular grid around a flat lagoon, worked since Roman times and restored in recent years. Still water gives clean mirror reflections at dawn, and the surrounding ground is flat, open and vehicle-accessible on all sides. The most logistically straightforward graphic landscape on the island.",
 "cat":["Salt Pans","Rural","Coast"],"look":["Minimal","Natural","Coastal","Industrial"],
 "prod":["Automotive","Fashion","Photography","Commercial Video","Drone","Editorial"],
 "kw":["salt pans","salt flats","reflection","geometric","flat","water","grid","mirror","minimal","open ground","lagoon","pattern","sunrise"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Coast road runs alongside; flat open ground for vehicles","parking":"Roadside, straightforward","bestLight":"Sunrise for still water and reflections","footTraffic":"Low","crewNotes":"Flat, open and easy — good for larger units and vehicle shoots","droneNotes":"Open airspace; commercial authorisation required"},
},
{
 "slug":"tigne-point-sliema","title":"Tigné Point","locality":"Sliema","island":"malta",
 "lat":35.9083,"lng":14.5039,"precision":"exact",
 "short":"Contemporary glass-and-concrete development on a harbour headland, facing Valletta.",
 "full":"A modern mixed-use development on a former military point: clean glass frontage, hard concrete landscaping, seafront promenade and a restored 18th-century fort at the tip. Straight lines and contemporary materials, with Valletta's fortifications directly across the water as backdrop. The location for briefs that need present-day, corporate or architectural Malta rather than period stone.",
 "cat":["Urban","Modern","Coast"],"look":["Modern","Urban","Minimal","Coastal"],
 "prod":["Commercial Video","Automotive","Fashion","Photography","Editorial","Social"],
 "kw":["modern","contemporary","glass","concrete","urban","city","architecture","promenade","corporate","clean lines","seafront","apartment","minimal"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Full road access throughout","parking":"Underground car park on site","bestLight":"Late afternoon, with Valletta lit across the harbour","footTraffic":"Moderate to high","crewNotes":"Privately managed public realm — permission needed for anything beyond handheld","droneNotes":"Harbour and urban restrictions apply"},
},
{
 "slug":"mtahleb-cliffs","title":"Mtaħleb & Ras id-Dawwara","locality":"Mtaħleb, Rabat","island":"malta",
 "lat":35.8783,"lng":14.3494,"precision":"exact",
 "short":"Terraced fields running to the west cliff edge — farmland, stone walls, open sea beyond.",
 "full":"A working agricultural landscape on the far west coast, where hand-built rubble walls step down terraces that stop at the cliff edge. Scattered stone farm buildings, dirt tracks, and no development for kilometres. Answers 'rural', 'farmland', 'remote countryside' and 'field' briefs while still carrying a dramatic coastal backdrop.",
 "cat":["Field","Rural","Cliff","Coast"],"look":["Rural","Remote","Rustic","Traditional Maltese"],
 "prod":["Film / TV","Fashion","Automotive","Photography","Drone","Editorial"],
 "kw":["field","farmland","countryside","rural","terraces","rubble walls","dirt track","remote","open field","agricultural","farm","stone walls","west coast","cliffs"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Narrow country lanes; small vans manageable","parking":"Roadside and field entrances","bestLight":"Late afternoon into sunset — faces west","footTraffic":"Very low","crewNotes":"Land is actively farmed — landowner permission needed to enter fields","droneNotes":"Open rural airspace; commercial authorisation required"},
},
{
 "slug":"ras-il-hamrija","title":"Ras il-Ħamrija & Filfla View","locality":"Qrendi","island":"malta",
 "lat":35.8272,"lng":14.4383,"precision":"exact",
 "short":"Coastal ridge with a natural arch framing the uninhabited islet of Filfla offshore.",
 "full":"A low headland on the south coast where a weathered rock arch frames the uninhabited islet of Filfla out at sea. Bare limestone terraces run to the cliff edge beside a 17th-century watchtower, and the neolithic temple complex sits just inland. Empty, ancient and entirely free of modern intrusion — the strongest 'prehistoric' or 'edge of the world' setup on the island.",
 "cat":["Coast","Cliff","Rural"],"look":["Remote","Rugged","Dramatic","Minimal"],
 "prod":["Fashion","Film / TV","Photography","Editorial","Drone","Commercial Video"],
 "kw":["arch","rock arch","natural arch","island","islet","coast","cliff","prehistoric","ancient","remote","tower","temples","empty","dramatic","sea view"],
 "access":"public","perm":"permission_may_be_required",
 "practical":{"vehicleAccess":"Road to the temple car park, then a short walk along the ridge","parking":"Visitor car park nearby","bestLight":"Late afternoon; the arch backlights toward the sea","footTraffic":"Low on the ridge itself","crewNotes":"Adjacent to a UNESCO temple site — stay outside the protected boundary","droneNotes":"Protected area and bird reserve — permissions required"},
},
{
 "slug":"malta-quarry","title":"Gozo Limestone Quarries","locality":"Near Dwejra, Gozo","island":"gozo",
 "lat":36.0480,"lng":14.1950,"precision":"approximate",
 "short":"Working stone quarries — sheer sawn walls, pale dust, hard geometry, heavy machinery.",
 "full":"Active limestone quarries cut in clean vertical planes, leaving sheer sawn faces, stepped benches and stacked block. Everything reads pale and monochrome under dust, with saw marks giving strong repeating geometry. The answer to 'quarry', 'industrial landscape' or 'desert-like' briefs, and a rare Maltese location with genuine scale and machinery on site.",
 "cat":["Quarry","Industrial","Rural"],"look":["Industrial","Rugged","Minimal","Dramatic"],
 "prod":["Automotive","Fashion","Music Video","Commercial Video","Film / TV","Drone"],
 "kw":["quarry","limestone quarry","industrial","stone","desert-like","excavation","machinery","pit","rock face","dust","geometric","brutal","monochrome","mining"],
 "access":"private","perm":"verification_pending",
 "practical":{"vehicleAccess":"Haul roads take heavy vehicles","parking":"On site by arrangement","bestLight":"Midday for hard shadow on the cut faces","footTraffic":"None — closed working sites","crewNotes":"Active industrial sites: owner permission, safety induction and insurance required","droneNotes":"By arrangement with the operator"},
},
{
 "slug":"maltese-countryside","title":"Terraced Fields, Bidnija","locality":"Bidnija, Mosta","island":"malta",
 "lat":35.9247,"lng":14.3697,"precision":"approximate",
 "short":"Classic Maltese farmland — dry-stone terraces, olive groves, narrow dirt lanes.",
 "full":"Small irregular fields divided by hand-built dry-stone rubble walls, stepping down a shallow valley between olive groves and carob trees. Unpaved lanes run between them, and the surrounding ridges hide most modern development from a low camera position. The default rural Malta look: agricultural, quiet, and workable within twenty minutes of Valletta.",
 "cat":["Field","Rural"],"look":["Rural","Rustic","Traditional Maltese","Natural"],
 "prod":["Photography","Fashion","Commercial Video","Automotive","Film / TV","Editorial"],
 "kw":["field","open field","farmland","countryside","rural","olive grove","rubble wall","dry stone","terraces","dirt track","lane","agricultural","trees","valley","remote field"],
 "access":"private","perm":"verification_pending",
 "practical":{"vehicleAccess":"Narrow unpaved lanes; small vehicles only","parking":"Field entrances and passing places","bestLight":"Golden hour in the valley; harsh and flat at midday","footTraffic":"Very low","crewNotes":"All land is privately farmed — access requires landowner permission","droneNotes":"Open rural airspace; commercial authorisation required"},
},
]

def ts(s):
    return json.dumps(s, ensure_ascii=False)

out = io.StringIO()
out.write("""// AUTO-GENERATED by scripts/gen-data.py — edit that file, not this one.
// Imagery: Wikimedia Commons, CC-licensed, credited per image.

export type AccessType = "public" | "private" | "managed" | "enquire";
export type PermissionStatus =
  | "unknown"
  | "permission_may_be_required"
  | "commercial_approval_required"
  | "verification_pending";

export type LocationImage = {
  url: string;
  alt: string;
  credit?: string;
  license?: string;
};

export type Location = {
  slug: string;
  title: string;
  locality: string;
  island: "malta" | "gozo" | "comino";
  lat: number;
  lng: number;
  precision: "exact" | "approximate";
  shortDescription: string;
  fullDescription: string;
  categories: string[];
  look: string[];
  productionTypes: string[];
  keywords: string[];
  accessType: AccessType;
  permissionStatus: PermissionStatus;
  practical: Record<string, string>;
  images: LocationImage[];
  featured?: boolean;
};

export const ACCESS_LABEL: Record<AccessType, string> = {
  public: "Public access",
  private: "Private property",
  managed: "Managed location",
  enquire: "Enquire for access",
};

export const PERMISSION_LABEL: Record<PermissionStatus, string> = {
  unknown: "Filming conditions unknown",
  permission_may_be_required: "Permit may be required",
  commercial_approval_required: "Commercial filming approval required",
  verification_pending: "Verification pending",
};

export const PERMISSION_NOTICE =
  "Access and filming requirements can change. Commercial filming, drone use, larger crews, equipment placement or exclusive use may require permission from the relevant owner or authority. Send an enquiry and we can help confirm requirements.";

export const locations: Location[] = [
""")

missing = []
for x in L:
    pics = imgs.get(x["slug"], [])
    if not pics:
        missing.append(x["slug"]); continue
    out.write("  {\n")
    out.write(f'    slug: {ts(x["slug"])},\n')
    out.write(f'    title: {ts(x["title"])},\n')
    out.write(f'    locality: {ts(x["locality"])},\n')
    out.write(f'    island: {ts(x["island"])},\n')
    out.write(f'    lat: {x["lat"]},\n    lng: {x["lng"]},\n')
    out.write(f'    precision: {ts(x["precision"])},\n')
    out.write(f'    shortDescription: {ts(x["short"])},\n')
    out.write(f'    fullDescription: {ts(x["full"])},\n')
    out.write(f'    categories: {ts(x["cat"])},\n')
    out.write(f'    look: {ts(x["look"])},\n')
    out.write(f'    productionTypes: {ts(x["prod"])},\n')
    out.write(f'    keywords: {ts(x["kw"])},\n')
    out.write(f'    accessType: {ts(x["access"])},\n')
    out.write(f'    permissionStatus: {ts(x["perm"])},\n')
    out.write('    practical: {\n')
    for k, v in x["practical"].items():
        out.write(f'      {k}: {ts(v)},\n')
    out.write('    },\n')
    out.write('    images: [\n')
    for i, p in enumerate(pics):
        alt = f'{x["title"]}, {x["locality"]}'
        out.write('      { url: %s, alt: %s' % (ts(p["url"]), ts(alt)))
        if p.get("credit"): out.write(', credit: %s' % ts(p["credit"]))
        if p.get("license"): out.write(', license: %s' % ts(p["license"]))
        out.write(' },\n')
    out.write('    ],\n')
    if x.get("featured"): out.write('    featured: true,\n')
    out.write("  },\n")

out.write("];\n")
open('data/locations.ts','w').write(out.getvalue())
print("locations written:", len(L)-len(missing), "| missing images:", missing)
