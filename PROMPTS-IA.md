# PROMPTS-IA.md — generation briefs for the 21 missing images

> **Why this file is in English while the rest of the repo is in Spanish.**
> Deliberate, and the only file like this. Every line below is meant to be pasted
> straight into an image or video generator, and these models are measurably more
> literal and more predictable in English. Mixing languages inside a prompt is
> what produces drift. The reasoning *about* the media stays where it belongs, in
> [MEDIA-BRIEF.md](MEDIA-BRIEF.md).

**Read [MEDIA-BRIEF.md](MEDIA-BRIEF.md) §5 first.** This file does not replace it — it
turns its rules into ready-to-paste prompts. If the two ever disagree, MEDIA-BRIEF wins.

---

## 0 · Status and guard rails

Everything produced from this file is **AI placeholder material**, exactly like the current
photography. It keeps `placeholder: true` in [src/data/media.js](src/data/media.js) and
`_status: 'ia-propuesto'` in [src/data/projects.js](src/data/projects.js).

`npm run check:media` **will keep blocking publication** while those flags are set. That is
not a bug to route around — it is the guard from MEDIA-BRIEF §7, and it is the reason the
site can honestly claim what it claims. Clearing the flags is a decision for Paola, once
real material exists.

### Delivery format

| | |
|---|---|
| Service samples | **1000 × 1250** (4:5), PNG or JPG, no compression games — the encoder handles that |
| Case creatives | **1600 × 1000** (8:5), same |
| Where they go | `Selección/` (originals live there, never in `public/`) |
| Then | `build-media.py` crops and writes the `.avif` + `.webp` pair |

> **Why 1000 × 1250 and not the 480 × 600 the code used to request.** The samples are now an
> elastic gallery: the open card goes from ~380 px to ~780 px wide, and on a 2× display that
> is ~1560 real pixels. 480 px source would visibly mush. This raises the `galleries` budget
> in [media.js](src/data/media.js) from 600 KB to ~1200 KB for all fifteen — still tiny, and
> they are lazy-loaded below the fold.

---

## 1 · Shared style preamble

**Prepend this to every image prompt in section 2 and 3.** It encodes MEDIA-BRIEF §5.

```
Cinematic product photography for a luxury performance-marketing brand.
Deep near-black background (#0E0E0E), single warm key light entering from one
side, deep falloff into shadow. Restrained champagne-gold accents (#D4AF37,
#8A6A1F, #F2DFA6) as reflections and rim light only. Shallow depth of field,
calm composition, generous negative space, nothing centred and busy.
Photographic realism, clean and un-grained, no post effects.
```

**Append this to every image prompt:**

```
Negative: any text, letters, numbers, words, logos, watermarks, UI labels,
captions, charts with readable axis labels; film grain, noise, vignette;
bright or white backgrounds; purple-orange gradient as a dominant colour;
faces looking at camera; cluttered composition; HDR, oversaturation.
```

### The four rules people break

1. **No text anywhere in the image.** The site is ES/EN — burnt-in text cannot be translated,
   and the ad chrome (`PAOLA® · Patrocinado`, format badge, CTA) is already drawn in HTML on
   top. Where a prompt calls for a dashboard or a chart, ask for **shapes without labels**:
   bars, lines, blocks. Illegible is correct here.
2. **Born dark.** Composed on `#0E0E0E`. Never generate light and darken later — it always
   shows.
3. **No grain.** The site applies 5% grain globally in CSS. Grain in the file doubles it.
4. **The Meta gradient is an accent.** A rim, a reflection, never the subject. The one place
   it leads is the probability bar in `#informe`.

---

## 2 · Service samples (15)

Three per service. The Spanish caption already written in
[src/i18n/es.js](src/i18n/es.js) `services.items[i].samples` **is the brief** — it tells the
visitor what they are looking at, so the image has to actually show that. Both captions are
reproduced below so the prompt and the alt text stay in sync.

File naming: `sample-<service>-<n>`. Declare in `galleries['<service>'].items[n-1].src`.

### 2.1 Meta Ads — `meta-ads`

| # | File | Caption (ES / EN) |
|---|---|---|
| 1 | `sample-meta-ads-1` | Estructura de campaña por fase de funnel / Campaign structure by funnel stage |
| 2 | `sample-meta-ads-2` | Anuncio de catálogo en Reels / Catalogue ad running as a Reel |
| 3 | `sample-meta-ads-3` | Panel de escala con ROAS por conjunto / Scaling dashboard with ROAS per ad set |

**1 —** `An elegant dark desk surface seen from above at a slight angle. Three tiers of matte
black cards laid out in a descending hierarchy, connected by fine brushed-gold lines, like a
strategy diagram made of physical objects. The top tier is widest, the bottom narrowest. Warm
light rakes across from the left. No writing on any card.`

**2 —** `A vertical smartphone standing upright on a dark reflective surface, screen facing
camera, filling the frame at 9:16 proportion. The screen shows an abstract soft-focus scene of
warm champagne fabric folds in motion — no interface, no buttons, no text. Gold rim light
traces the phone edge.`

**3 —** `A dark glass wall panel glowing faintly from within, showing an abstract analytics
display: a rising stepped bar formation and one clean ascending curve, rendered in warm gold
light. Completely unlabelled — pure shape and glow, no numbers, no axis, no legend. Deep
shadow around the edges.`

### 2.2 Paid Social — `paid-social`

| # | File | Caption (ES / EN) |
|---|---|---|
| 1 | `sample-paid-social-1` | Misma campaña adaptada a tres plataformas / The same campaign adapted to three platforms |
| 2 | `sample-paid-social-2` | Creatividad nativa de TikTok / Native TikTok creative |
| 3 | `sample-paid-social-3` | Comparativa de coste por canal / Cost comparison across channels |

**1 —** `Three blank screens of different proportions — one tall vertical, one square, one wide
— floating at slightly different depths against near-black, each showing the same abstract warm
gold composition adapted to its own shape. Soft focus on the outer two, sharp on the centre.`

**2 —** `A vertical phone held in one hand at a casual angle, dark room, screen showing a warm
out-of-focus lifestyle scene with strong gold backlight. Handheld and immediate rather than
studio-perfect. No interface elements.`

**3 —** `Three vertical glass columns of different heights standing on a dark surface, lit from
behind so they glow warm amber, like a bar chart built from physical material. Unlabelled.
Strong shadows between the columns.`

### 2.3 Funnels & CRO — `funnels-cro`

| # | File | Caption (ES / EN) |
|---|---|---|
| 1 | `sample-funnels-cro-1` | Landing antes y después del rediseño / Landing page before and after the redesign |
| 2 | `sample-funnels-cro-2` | Embudo con caída por paso / Funnel with drop-off per step |
| 3 | `sample-funnels-cro-3` | Test A/B con la variante ganadora / A/B test with the winning variant |

**1 —** `Two tall dark panels side by side against near-black, the left one dim and cluttered
with small grey blocks, the right one clean and open with generous spacing and a single warm
gold highlight. Same size, same framing, obvious contrast in order. No readable content.`

**2 —** `A physical funnel form built from stacked dark glass rings, each ring narrower than
the one above, warm gold light pouring through from the top and diminishing as it descends.
Shot slightly from above. Dramatic falloff.`

**3 —** `Two identical matte black cards standing upright side by side on a dark surface. The
right one is lit by a warm gold spotlight and casts a longer shadow; the left sits in shadow.
Nothing written on either.`

### 2.4 UGC & Creatividades — `ugc`

| # | File | Caption (ES / EN) |
|---|---|---|
| 1 | `sample-ugc-1` | Guion de UGC con sus tres hooks / UGC script with its three hooks |
| 2 | `sample-ugc-2` | Tanda de creatividades de una semana / One week's batch of creatives |
| 3 | `sample-ugc-3` | Ranking de ángulos por retención / Angles ranked by retention |

**1 —** `A dark desk with an open notebook, its pages blank cream paper, three small brushed-gold
paper clips marking three separate points down the page. A warm desk lamp pool of light from the
upper left. Shallow depth of field. Nothing written.`

**2 —** `A grid of nine small vertical screens arranged in a 3×3 formation against near-black,
each showing a different abstract warm-toned composition, a couple of them dimmer than the rest.
Even spacing, catalogue-like. No interfaces.`

**3 —** `Five vertical cards of descending height standing in a row on a dark reflective surface,
the tallest on the left catching the strongest gold light and the rest falling into shadow. Like
a podium made of blank cards. Unlabelled.`

### 2.5 Auditorías & Consultoría — `auditorias`

| # | File | Caption (ES / EN) |
|---|---|---|
| 1 | `sample-auditorias-1` | Diagnóstico de cuenta con fugas marcadas / Account audit with leaks flagged |
| 2 | `sample-auditorias-2` | Roadmap a 90 días por prioridad / 90-day roadmap by priority |
| 3 | `sample-auditorias-3` | Revisión de eventos y CAPI / Event and CAPI review |

**1 —** `A dark tabletop with a large sheet of deep charcoal paper, several small warm amber
markers placed at scattered points across it as if flagging problems. Raking light from one side
picks out the paper texture. No writing, no diagrams.`

**2 —** `A horizontal timeline built from physical objects: a long brushed-gold rail running left
to right across a dark surface, with three clusters of small matte blocks positioned along it at
uneven intervals. Shot low and along the rail so it recedes into shadow.`

**3 —** `Two dark panels connected by a single continuous thread of warm gold light arcing between
them, against near-black. Clean, technical, minimal — a connection made visible. No screens, no
text, no icons.`

---

## 3 · Case creatives (6)

Ad mockups, one per case. They are shown **inside** the ad chrome the site draws in HTML, so:
no `PAOLA®`, no `Patrocinado`, no format badge, no CTA button in the image — all of that is
already rendered on top and would appear twice.

Declare as `image` + `imageAlt` in [src/data/projects.js](src/data/projects.js). **1600 × 1000.**
Compose the subject for the case's own `adFormat`, but deliver the full 8:5 frame.

Each case carries brand colours in its `gradient` field. Use them as **accent light only** — a
rim, a reflection. See rule 4 above.

| Case | File | Format | Sector | Accent |
|---|---|---|---|---|
| Atelier Nord | `atelier-nord` | Reels 9:16 | E-commerce moda | `#7B19C8` → `#C559C4` |
| Flowstack | `flowstack` | Estático 4:5 | SaaS B2B | `#C559C4` → `#F57327` |
| Masterclass Pro | `masterclass-pro` | Vídeo 1:1 | Infoproducto | `#2B0A4A` → `#7B19C8` |
| Casa Verde | `casa-verde` | Carrusel 1:1 | Retail local | `#F57327` → `#C559C4` |
| Zenfit | `zenfit` | Reels 9:16 | App móvil | `#161616` → `#7B19C8` |
| Glow Skin | `glow-skin` | Reels 9:16 | DTC belleza | `#7B19C8` → `#F57327` |

**`atelier-nord` —** `Draped charcoal and camel wool fabric falling in soft folds, shot close and
vertical, warm key light from the right, a faint violet rim along the top fold. Editorial fashion
still life. Deep shadow, no model, no garment tags.`

**`flowstack` —** `A dark brushed-metal surface with a single sheet of matte glass resting on it,
catching a cool magenta-to-amber reflection along one edge. Restrained, corporate, technical.
Nothing displayed on the glass.`

**`masterclass-pro` —** `An empty dark auditorium seat row seen from behind, one warm spotlight
falling on the centre seat, deep violet ambience filling the background. Square-friendly framing.
Nobody present.`

**`casa-verde` —** `A dark storefront interior at dusk, terracotta planters and green foliage lit
by a warm amber lamp, one shaft of orange light crossing the floor. Intimate, local, tactile. No
signage.`

**`zenfit` —** `A dark gym floor seen at a low angle, a single dumbbell resting in shadow, a violet
LED strip along the far wall throwing a thin cold rim across the rubber surface. No people.`

**`glow-skin` —** `An unmarked frosted glass cosmetic bottle on a dark wet stone surface, water
beading on it, warm gold key light with a violet-to-orange rim along one side. Extreme shallow
depth of field. No label of any kind.`

---

## 4 · Animation prompts

**Not wired up yet, and on purpose.** The site currently has no video playback anywhere —
samples render as `<picture>`. These prompts exist so the material can be generated; the
playback support (poster frame, muted autoplay, pause off-screen, `prefers-reduced-motion`,
weight budget) gets built when the files exist and we know what we are dealing with.

### Hard rules

- **3–4 seconds, seamless loop.** First and last frame must be interchangeable.
- **One continuous take.** No cuts, no shot changes — MEDIA-BRIEF §4.3. A visitor can scroll
  back and a cut reads as a bug.
- **Almost no movement.** Camera drift under 3% of frame width. The subject breathes, it does
  not perform.
- Same darkness, same gold, same no-text rules as the stills.

### Which ones move

Six, chosen because they have something that can move *without* the camera doing the work:

| Source still | Motion |
|---|---|
| `sample-meta-ads-2` | `The fabric on the phone screen shifts slowly, one fold rolling gently. Phone and camera perfectly still.` |
| `sample-funnels-cro-2` | `Warm gold light descends slowly through the stacked glass rings, dimming as it goes, then restores. Nothing else moves.` |
| `sample-ugc-2` | `The nine screens crossfade their abstract contents at staggered intervals, two at a time, never all at once. Grid stays fixed.` |
| `atelier-nord` | `The draped fabric settles almost imperceptibly, as if air moved past it. Light unchanged.` |
| `casa-verde` | `The shaft of amber light drifts a few degrees across the floor, as a passing cloud would. Foliage still.` |
| `glow-skin` | `A single water bead runs slowly down the frosted bottle. Everything else frozen.` |

Prepend to each: `Seamless 4-second loop, single continuous take, locked-off camera, near-black
cinematic scene, warm gold key light.` Append: `No cuts, no zoom, no camera shake, no text, no
people entering frame.`

---

## 5 · Acceptance checklist

Before declaring anything in `media.js` or `projects.js`:

- [ ] No readable text, digits or logo anywhere in the frame.
- [ ] Background reads as near-black in its darkest third.
- [ ] Gold is reflection and rim, not fill.
- [ ] No grain in the file (the CSS adds 5%).
- [ ] The service samples still *say* what their caption claims they show.
- [ ] Case creatives leave the top and bottom eighth quiet — the HTML ad chrome sits there.
- [ ] Video loops with no visible seam and no cut.
- [ ] `placeholder: true` / `_status: 'ia-propuesto'` still set.
- [ ] `node scripts/check-media.mjs` finds both `.avif` **and** `.webp` for every file declared.
