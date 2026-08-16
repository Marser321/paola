# Batería V2 — imágenes y animaciones para tarjetas

Prompts listos para producción de las **6 tarjetas de proyecto** y las **15 muestras de servicio** de la web. Esta versión corrige el principal riesgo de la tanda anterior: una imagen puede compartir la estética de PAOLA y aun así no explicar el trabajo. Aquí cada visual debe reconocer el sector, el formato publicitario o el entregable concreto antes de leer el pie.

Los nombres y resultados de los casos siguen siendo propuestas IA. No retirar `_status: 'ia-propuesto'` ni `placeholder: true` sin material y autorización reales.

---

## 1. Sistema visual común

### Prefijo para todas las imágenes

```text
Premium editorial advertising still for PAOLA, a performance-marketing specialist. Born on a deep near-black #0E0E0E set with matte charcoal #161616 surfaces. One directional warm champagne-gold key light, restrained violet-to-orange Meta-spectrum rim light used only as a subtle reflection, never as a full background. Photorealistic materials, crisp commercial lighting, controlled highlights, deep clean shadows, sophisticated and credible rather than futuristic. One clear visual idea, asymmetrical composition, generous negative space for the website overlay, no baked-in film grain.
```

### Sufijo negativo para todas las imágenes

```text
Negative: text, letters, words, numbers, logos, brand marks, watermarks, captions, subtitles, readable dashboards, readable app interfaces, fake social-media chrome, CTA buttons, badges, UI labels, floating icons, holograms, neon cyberpunk, blue corporate stock-photo lighting, generic smiling office team, face looking directly at camera, clutter, collage, split screen, white background, dominant purple-orange gradient, heavy grain, bloom, vignette, HDR, oversaturation, distorted hands, extra fingers, malformed products.
```

### Reglas de composición

- Proyectos: `1600 × 1000`, relación `8:5`. La web añade marca, “Patrocinado”, formato y CTA; la imagen no debe repetirlos.
- Servicios: `1000 × 1250`, relación `4:5`. El sujeto importante debe quedar dentro del 70 % central porque la galería cambia de ancho.
- El oro unifica la colección. El acento de cada proyecto identifica el caso, pero nunca llena el fondo.
- Los gráficos se construyen con formas físicas, bloques o luz; nunca con texto generado.
- Cuando aparezca una persona, se priorizan manos, perfil, torso o acción. No modelos posando a cámara.

---

## 2. Tarjetas de proyecto y galería WebGL — seis anuncios, seis servicios demostrados

Estas seis imágenes tienen doble uso: alimentan la tarjeta de cada caso y los planos que
avanzan en profundidad dentro de `projects-gallery.js`. No se genera una segunda tanda para
el scrollytelling; reutilizar el mismo visual mantiene la identidad de cada proyecto y evita
que la cabecera inmersiva prometa creatividades diferentes de las que se explican debajo.

### 01 · Atelier Nord — Meta Ads + escala creativa

**Archivo:** `atelier-nord` · **Formato comunicado:** Reels 9:16 · **Sector:** e-commerce moda

```text
[COMMON PREFIX] A high-end fashion Reel keyframe captured mid-action: a female creator seen from shoulders to hands, never facing camera, pulls a camel wool coat from a matte-black garment bag and lets the fabric unfold toward the lens. The coat texture and movement are the hero; a second charcoal garment hangs softly out of focus behind it. Vertical-video energy inside an 8:5 master frame, subject kept in the central safe area. Warm gold key light reveals the weave; a very thin violet rim catches one fold. Feels like native UGC elevated by luxury art direction, not a catalogue still life. [COMMON NEGATIVE]
```

**Qué demuestra:** producto en el primer segundo, formato nativo y capacidad de producir variaciones para escalar.

### 02 · Flowstack — lead generation B2B + landing/demo

**Archivo:** `flowstack` · **Formato comunicado:** estático 4:5 · **Sector:** SaaS B2B

```text
[COMMON PREFIX] A restrained B2B demand-generation ad: an open dark laptop seen at a three-quarter angle on a clean executive desk, displaying an abstract workflow made of unlabelled connected modules and one clear ascending activity line. A decision-maker's hand rests near the trackpad, suggesting an active product demo without showing a face. One translucent glass card projects slightly forward from the screen as a physical metaphor for a qualified lead, subtle and believable rather than holographic. Magenta-to-amber edge reflection only along the laptop and glass. Precise 4:5 ad composition placed within the 8:5 master frame, ample clean space around the product. [COMMON NEGATIVE]
```

**Qué demuestra:** producto SaaS, demo de landing y generación de leads cualificados.

### 03 · Masterclass Pro — funnel de webinar multicanal

**Archivo:** `masterclass-pro` · **Formato comunicado:** vídeo 1:1 · **Sector:** infoproducto

```text
[COMMON PREFIX] A square-video keyframe for an expert masterclass: a presenter in side profile at a small dark studio desk, gesturing toward a large monitor with one elegant unlabelled lesson diagram made of three simple blocks. In the foreground, an open laptop shows a tiny warm audience grid as soft anonymous silhouettes with no faces or interface details. One gold spotlight isolates the presenter and screen; deep violet ambience remains only at the far edge. Calm authority, real educational production, not an empty auditorium and not a corporate conference. Square-safe action centred inside the 8:5 master frame. [COMMON NEGATIVE]
```

**Qué demuestra:** webinar real, captación y entrega de contenido, no solo “educación” en abstracto.

### 04 · Casa Verde — tráfico local + catálogo geolocalizado

**Archivo:** `casa-verde` · **Formato comunicado:** carrusel 1:1 · **Sector:** retail local

```text
[COMMON PREFIX] A premium local-retail carousel hero: hands of a shopkeeper arrange three tactile home-and-garden products on a dark wooden counter — a terracotta planter with healthy green leaves, a small ceramic watering vessel and a folded natural-fibre cloth. The open storefront and warm street light are visible in soft focus behind, making the physical shop unmistakable. One product is sharp in front while the next two recede like upcoming carousel cards, without borders or graphic frames. Warm amber light, a restrained coral-magenta reflection on the counter edge. Square-safe product grouping within the 8:5 master frame. [COMMON NEGATIVE]
```

**Qué demuestra:** catálogo, producto disponible y visita a tienda física.

### 05 · Zenfit — app installs + optimización por evento

**Archivo:** `zenfit` · **Formato comunicado:** Reels 9:16 · **Sector:** app móvil

```text
[COMMON PREFIX] A dynamic but controlled fitness Reel keyframe: close low angle of an athlete's forearm and hand tapping a smartphone mounted beside a matte-black exercise bike just before beginning a workout. The phone shows an abstract workout timer made only of a circular progress ring and three unlabelled blocks. A dumbbell and rubber floor sit in deep soft-focus background. Condensation and realistic skin texture, no face visible. Warm gold key light on the hand and phone; a thin violet LED rim across the equipment. Native vertical-video immediacy inside the central safe area of an 8:5 master. [COMMON NEGATIVE]
```

**Qué demuestra:** instalación, uso real de la app y evento de activación posterior al install.

### 06 · Glow Skin — UGC + testing creativo semanal

**Archivo:** `glow-skin` · **Formato comunicado:** Reels 9:16 · **Sector:** DTC belleza

```text
[COMMON PREFIX] A polished skincare UGC Reel keyframe captured during a real routine: close crop of a woman's cheek in three-quarter profile and her hand pressing one drop of serum into luminous natural skin, with an unlabelled frosted bottle sharp in the foreground on dark wet stone. The face is partial, candid and never looking at camera. Visible water bead, honest skin texture, clean beauty lighting rather than plastic retouching. Warm champagne key light shapes the skin; a narrow violet-to-orange rim traces the bottle only. Vertical-safe action in the centre of the 8:5 master frame. [COMMON NEGATIVE]
```

**Qué demuestra:** rutina de 15 segundos, producto DTC y lenguaje UGC usable para testing.

---

## 3. Muestras de servicio — entregables reconocibles

Cada grupo usa un caso de la web como hilo conductor. Así las muestras no parecen proyectos nuevos desconectados del portfolio.

### 3.1 Meta Ads — sistema Atelier Nord / Glow Skin

#### `sample-meta-ads-1` — Estructura de campaña por fase de funnel

```text
[COMMON PREFIX] A campaign architecture for a fashion e-commerce account represented as a physical planning board: three clearly separated horizontal stages made of matte-black cards, wide at the top and progressively more focused below. Small product-photo thumbnails show only fabric folds, never text. Fine brushed-gold rails connect prospecting, consideration and conversion groups; one separate cluster at the side suggests creative testing. Seen from above at a slight angle, logically ordered and immediately readable as campaign structure, not a generic chart. [COMMON NEGATIVE]
```

#### `sample-meta-ads-2` — Anuncio de catálogo en Reels

```text
[COMMON PREFIX] A vertical smartphone on a near-black studio surface playing a catalogue-style fashion Reel: a hand swipes through three unlabelled garment product cards while a camel coat fills most of the active frame. The finger is captured mid-swipe, the next garment just entering from below, creating clear native vertical motion. Gold rim light outlines the phone and textile; faint violet reflection on the glass edge only. No social interface and no price tags. [COMMON NEGATIVE]
```

#### `sample-meta-ads-3` — Panel de escala con ROAS por conjunto

```text
[COMMON PREFIX] A media-buying scaling decision visualised on a dark glass analytics panel: four unlabelled ad-set columns, three stable at medium height and one clearly rising in stepped gold segments; a thin efficiency curve stays level above them. Beside the panel, one hand moves a small physical budget token toward the winning column. Clean, credible operator's desk, no futuristic holograms, no figures or axis labels. [COMMON NEGATIVE]
```

### 3.2 Paid Social — sistema Masterclass Pro / Zenfit

#### `sample-paid-social-1` — Misma campaña adaptada a tres plataformas

```text
[COMMON PREFIX] One masterclass campaign adapted into three native placements on a dark creative-review wall: a tall vertical screen shows the presenter's side profile, a square screen shows the lesson diagram, and a wide screen shows the presenter plus audience silhouettes. The same gold-lit studio and visual motif appear consistently across all three, recomposed rather than merely cropped. Screens sit at slightly different depths, centre one sharp, outer two softly receding. No interfaces or platform logos. [COMMON NEGATIVE]
```

#### `sample-paid-social-2` — Creatividad nativa de TikTok

```text
[COMMON PREFIX] A candid vertical fitness clip seen on a phone held loosely in one hand: an athlete in profile begins a short exercise beside a mounted phone, framed close and imperfectly like genuine creator footage. A gym towel briefly crosses the lower foreground, adding immediacy. Warm practical backlight, thin violet equipment rim, realistic handheld composition but a sharp commercial frame. No platform interface, no captions, no direct-to-camera pose. [COMMON NEGATIVE]
```

#### `sample-paid-social-3` — Comparativa de coste por canal

```text
[COMMON PREFIX] A channel cost comparison built as three sets of physical media tokens on a dark analyst's table. Each channel has the same small gold campaign tile beside a different stack of matte discs; the middle stack is visibly shortest, communicating lower cost without labels. A fine warm light line connects the three for direct comparison. Top-down oblique view, rigorous spacing, tactile materials, no generic bar chart and no currency symbols. [COMMON NEGATIVE]
```

### 3.3 Funnels & CRO — sistema Flowstack / Masterclass Pro

#### `sample-funnels-cro-1` — Landing antes y después del rediseño

```text
[COMMON PREFIX] Two dark laptop screens on the same desk show the same SaaS landing page before and after optimisation, entirely without readable copy. The left version has many cramped grey blocks, competing buttons and weak hierarchy; the right version has one strong product-demo panel, one warm gold action block and generous spacing. Identical screen size and camera angle, with a clear old-to-new reading from left to right. Real interface composition, not floating abstract rectangles. [COMMON NEGATIVE]
```

#### `sample-funnels-cro-2` — Embudo con caída por paso

```text
[COMMON PREFIX] A webinar conversion funnel represented as four translucent dark-glass chambers descending from a broad warm entry plane to a narrow final registration chamber. A stream of small gold light particles enters at the top; progressively fewer continue through each gate, with a visible accumulation before the third step that signals drop-off. Architectural, precise and physically plausible, shot three-quarter view against near-black, no labels or percentages. [COMMON NEGATIVE]
```

#### `sample-funnels-cro-3` — Test A/B con la variante ganadora

```text
[COMMON PREFIX] An A/B test review on two identical dark tablets displaying two abstract SaaS landing compositions. Variant on the left uses a small demo area and several weak grey blocks; variant on the right uses one large product demo and a single warm action block. A restrained gold verification light runs beneath the right tablet while the left remains neutral. Same framing, same scale, only the layout changes; no letters A or B and no readable metrics. [COMMON NEGATIVE]
```

### 3.4 UGC & Creatividades — sistema Glow Skin / Atelier Nord

#### `sample-ugc-1` — Guion de UGC con sus tres hooks

```text
[COMMON PREFIX] A skincare UGC shot plan on a dark production desk: three small vertical storyboard cards arranged at the top, respectively showing a serum drop close-up, a hand opening the bottle, and a partial three-quarter cheek applying product. Below them lies one blank cream script sheet divided by three subtle folds, with three gold clips aligned to the storyboard cards. A phone rig and compact light sit softly out of focus at the edge. No writing anywhere. [COMMON NEGATIVE]
```

#### `sample-ugc-2` — Tanda de creatividades de una semana

```text
[COMMON PREFIX] A weekly creative batch displayed as a rigorous three-by-three contact sheet of vertical frames on a dark review monitor. All nine belong to the same skincare campaign but test visibly different hooks: product macro, hand routine, texture, bathroom shelf, partial profile, water drop, packaging reveal, application gesture and final product hero. Shared bottle and lighting make the set coherent; two frames carry a subtle gold outline as shortlisted winners. No interfaces, labels or captions. [COMMON NEGATIVE]
```

#### `sample-ugc-3` — Ranking de ángulos por retención

```text
[COMMON PREFIX] Five vertical creative thumbnails from the same fashion campaign stand in a receding row on a dark review table, ordered by performance. The first shows the coat unfolding toward camera and receives the strongest gold edge light; the following cards show progressively less immediate product reveals and fall gradually into shadow. Their height and spacing remain equal so the ranking is communicated by order and light, not a misleading chart. No numbers or badges. [COMMON NEGATIVE]
```

### 3.5 Auditorías & Consultoría — sistema de diagnóstico transversal

#### `sample-auditorias-1` — Diagnóstico de cuenta con fugas marcadas

```text
[COMMON PREFIX] An account audit laid out on a large dark strategy board: campaign groups are connected by thin gold routes, but three routes visibly leak warm light through small gaps before reaching the conversion block. A media buyer's hand places a small amber marker beside the largest leak. Fashion-product thumbnails tie the account to Atelier Nord; everything is unlabelled. Clear diagnosis and causality, not random warning dots or a generic dashboard. [COMMON NEGATIVE]
```

#### `sample-auditorias-2` — Roadmap a 90 días por prioridad

```text
[COMMON PREFIX] A ninety-day consulting roadmap represented as a physical dark rail with three consecutive work zones. The first zone contains tracking connectors, the second a set of creative thumbnails, the third a stepped scaling structure. Each zone has fewer but larger gold priority tiles, showing ordered focus over time. Shot low along the rail so the path recedes into shadow, with the first actions crisp and the later phase slightly softer. No calendar dates or text. [COMMON NEGATIVE]
```

#### `sample-auditorias-3` — Revisión de eventos y CAPI

```text
[COMMON PREFIX] A precise event and server-side tracking review visualised as a real technical test bench: a smartphone, a dark browser panel and a small server module are connected by one continuous warm-gold signal path. Four unlabelled event pulses travel from the phone; one duplicated pulse is held apart under a small amber inspection light before the clean stream reaches the server. Technical and understandable, no cloud icons, no code, no futuristic holograms. [COMMON NEGATIVE]
```

---

## 4. Animación — solo donde el movimiento explica el servicio

### Reglas comunes para vídeo

```text
Seamless 4-second loop, single continuous take, locked composition, 24 fps. Preserve the exact subject, products, hands, wardrobe, lighting and geometry of the source still. Motion is local and subtle; total camera drift below 2% of frame width. First and last frame must match. No cuts, no transitions, no zoom, no orbit, no camera shake, no new objects, no text, no logo, no UI generation, no facial morphing, no distorted hands, no colour shift, no blue light, no flicker, no speed ramp.
```

### Prioridad A — tarjetas de proyecto que deben sentirse como anuncio en vídeo

#### Atelier Nord · Reel

```text
[VIDEO RULES] The creator's hands complete one slow, elegant unfolding motion of the camel coat toward the lens; the lower fabric rolls once and settles, while the violet edge reflection remains fixed. The face stays outside frame. End with the coat returning naturally to the opening fold position for a seamless loop.
```

#### Masterclass Pro · vídeo 1:1

```text
[VIDEO RULES] The presenter makes one small explanatory hand gesture toward the lesson diagram while a single gold connection line on the screen advances through its three unlabelled blocks and resets softly. Presenter profile and body remain stable; audience silhouettes do not change.
```

#### Zenfit · Reel

```text
[VIDEO RULES] One finger taps the phone once; the abstract progress ring fills a short arc and returns to its initial position while the exercise-bike flywheel begins one very slow rotation. Arm, phone mount and camera remain stable; no interface details appear.
```

#### Glow Skin · Reel

```text
[VIDEO RULES] The serum drop slides slowly from fingertip to cheek and is pressed into the skin with one minimal natural motion; one water bead travels a short distance down the bottle in the foreground. Preserve honest skin texture and keep all visible facial features perfectly stable.
```

### Prioridad B — muestras de servicio donde el dato puede “respirar”

#### Meta Ads · catálogo en Reels

```text
[VIDEO RULES] The finger performs one slow vertical swipe and the camel coat card moves upward as the next garment enters by no more than one third of the phone screen. The phone and camera stay fixed; the motion reverses invisibly into the opening frame.
```

#### Meta Ads · panel de escala

```text
[VIDEO RULES] The winning stepped column gains one restrained gold segment while the hand slides one budget token a few centimetres toward it; the efficiency curve remains stable. At the loop point both return softly to their initial state without a visible jump.
```

#### Funnels & CRO · caída por paso

```text
[VIDEO RULES] A small stream of warm particles descends through the four chambers; some pause and fade before the third gate while a smaller clean stream reaches the final chamber. Chamber geometry and camera remain perfectly fixed; particle flow loops continuously.
```

#### UGC · tanda semanal

```text
[VIDEO RULES] Three of the nine skincare thumbnails update one at a time with a subtle internal action: a serum drop falls, a hand turns the bottle, a water bead moves. The grid, bottle identity, lighting and all other frames remain unchanged. Never crossfade the entire grid.
```

#### Auditoría · eventos y CAPI

```text
[VIDEO RULES] Four warm signal pulses travel from smartphone to browser panel; the duplicated pulse pauses under the amber inspection light while three clean pulses continue to the server module. The continuous path and all devices remain fixed. Loop the pulse sequence without flicker.
```

### Mantener estáticas

- Flowstack: es un anuncio estático por definición; animarlo debilitaría la variedad de formatos.
- Casa Verde: la tarjeta comunica un carrusel, pero en la web conviene que el gesto de “siguiente producto” lo aporte la composición; un vídeo competiría con el scroll horizontal.
- Comparativa de coste, landing antes/después, test A/B, ranking y roadmap: son piezas de lectura comparativa. El movimiento introduciría ambigüedad donde interesa inspección.

---

## 5. Control de coherencia antes de aprobar

- ¿Se entiende el sector sin leer el título?
- ¿Se entiende la acción de marketing sin ver el pie?
- ¿La imagen parece un anuncio o entregable real, no una metáfora decorativa genérica?
- ¿El mismo producto, vestuario y luz se mantienen entre imágenes del mismo caso?
- ¿Existe un solo foco visual y suficiente aire para el chrome HTML?
- ¿No hay texto, cifras, logos ni interfaz social horneados?
- ¿El vídeo añade información al servicio y sigue funcionando como imagen fija con `prefers-reduced-motion`?
