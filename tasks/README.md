# tasks/README.md — Cómo ejecutar este proyecto

> Instrucciones para el agente (o persona) que construye el portfolio.
> Antes de empezar, lee `../PLAN.md`, `../DESIGN.md` y `../CONTENT.md`.
> **`../PLAN.md` §11 (reglas de contención del tracker) es spec, no recomendación.**

## Fases

| Fase | Tareas | Qué es |
|---|---|---|
| **v1 — Construcción** | 00→16 | El sitio completo con placeholder content y todos los efectos |
| **E — Campaña** | 31→37 | El concepto de autor: tracker, HUD, señales, informe, A/B |
| **A — Endurecimiento** | 17→19 | Performance, SEO técnico, QA |
| **C — Producción** | 23→27 | Contenido real, formulario, legal, analytics, deploy, branding |
| **B — Wow v2** | 20→22 | Efectos avanzados (cuando se quiera subir el listón) |
| **D — Crecimiento** | 28→30 | i18n, casos de estudio, mantenimiento |

## ⚠ Orden real de ejecución

**La numeración es por grupos temáticos y NO es el orden de ejecución.** Manda esta tabla.

| Bloque | Tareas | Nota |
|---|---|---|
| 1 | `00 → 13` | Base del sitio |
| 2 | **`31 → 36`** | **Fase E — el concepto.** Va aquí, no al final: ver justificación abajo |
| 3 | `14 → 16` | Contacto, responsive/a11y y QA — ya **con** HUD e informe presentes |
| 4 | `17 → 19` | Endurecimiento |
| 5 | `23 → 27` | Producción y lanzamiento |
| 6 | `20 → 22`, `28 → 29` | Bajo demanda |
| 7 | `37` | Opcional, y solo con opt-in explícito |
| 8 | `30` | Permanente (trimestral) |

**Por qué la fase E va entre la 13 y la 14, y no al final:**

1. El tracker necesita las `.project-card` ya renderizadas (tarea 11).
2. La tarea 14 fija la "estructura final" de `main.js`. Si el concepto entrara después,
   habría que reescribir esa estructura dos veces.
3. Las tareas 15 (responsive/a11y) y 16 (QA final) tienen que auditar el sitio **ya con**
   HUD, toasts e informe. Auditar sin ellos y volver a auditar es trabajo duplicado.

## Índice completo (00→37)

| # | Archivo | Qué construye | Depende de |
|---|---|---|---|
| 00 | `00-scaffold.md` | Proyecto Vite + dependencias + carpetas | — |
| 01 | `01-design-tokens.md` | `tokens.css` + `base.css` | 00 |
| 02 | `02-html-markup.md` | `index.html` completo (11 secciones, etapas de embudo) | 00, 01 |
| 03 | `03-projects-data.md` | `src/data/projects.js` (KPIs + datos de anuncio) | 00 |
| 04 | `04-smooth-scroll.md` | Lenis + ScrollTrigger + anchors | 00–02 |
| 05 | `05-custom-cursor.md` | Cursor dot+ring + píldora de audiencia | 04 |
| 06 | `06-preloader.md` | Preloader ("iniciando campaña") + evento `app:ready` | 04 |
| 07 | `07-hero-typography.md` | Hero: split de letras + entrada | 06 |
| 08 | `08-hero-webgl.md` | Partículas Three.js con shader | 07 |
| 09 | `09-marquee.md` | Marquee con velocidad ∝ scroll | 04 |
| 10 | `10-metrics.md` | Contadores con overshoot + sparklines | 04 |
| 11 | `11-projects-gallery.md` | Pin horizontal + chrome de anuncio + tilt 3D | 03, 04, 05 |
| 12 | `12-services-process.md` | Reveals servicios + timeline proceso | 04 |
| 13 | `13-about-testimonials.md` | About + testimonios sticky | 04 |
| **31** | `31-tracker-core.md` | **`core/tracker.js`: estado + bus + tick** | 04, 11 |
| **32** | `32-hud-sesion.md` | **`ui/hud.js` + `tracker.css`** | 31 |
| **33** | `33-senales-toasts.md` | **`ui/signals.js`** | 31, 32 |
| **34** | `34-creatividades-backstage.md` | **Chrome de anuncio + backstage en cards** | 03, 11, 31 |
| **35** | `35-informe-sesion.md` | **`sections/report.js`** | 31, 13 |
| **36** | `36-ab-test-hero.md` | **`core/ab-test.js`** | 31, 07 |
| 14 | `14-contact-footer.md` | CTA magnético (emite `Conversion`) + footer + reloj | 04, 09, 35 |
| 15 | `15-responsive-accessibility.md` | Responsive, reduced-motion, teclado | 07–14, 31–36 |
| 16 | `16-seo-build-qa.md` | Meta/OG, favicon SVG, build, QA final | 00–15, 31–36 |
| 17 | `17-performance-hardening.md` | Code-splitting three, budgets CWV, self-hosting fuentes | 16 |
| 18 | `18-seo-tecnico.md` | JSON-LD, robots.txt, sitemap.xml | 16 |
| 19 | `19-testing-matrix.md` | Matriz QA + quirks iOS + refs | 16 (re-run tras 20–29) |
| 20 | `20-webgl-image-distortion.md` | Shader distorsión en cards | 08, 11, 17, 34 |
| 21 | `21-text-effects.md` | Scramble mono + split H2 | 04 (⚠ ajusta 12/13, excluye 32/33/35) |
| 22 | `22-hero-interactions-plus.md` | Click burst + cámara scroll | 08, 17 |
| 23 | `23-contenido-real-pipeline.md` | BRIEFING.md + imágenes + migración | 00–16 |
| 24 | `24-formulario-legal-rgpd.md` | Netlify Forms + legal + consent | 00–16, 31 |
| 25 | `25-analytics-pixel.md` | GA4 + Meta Pixel suscritos al bus del tracker | 24, 31 |
| 26 | `26-deploy-dominio.md` | Netlify, dominio, lanzamiento | 16, 17, 24 (rec. 25) |
| 27 | `27-branding-completo.md` | Wordmark, favicon set, og-image | 16 (activa OG en 26) |
| 28 | `28-i18n-es-en.md` | Diccionarios + switcher ES/EN | 00–16, 31–36 (si existe: 24) |
| 29 | `29-casos-estudio.md` | `caso.html` MPA + detalle de casos | 11, 24, 34 |
| 30 | `30-mantenimiento.md` | MAINTENANCE.md trimestral | 26 |
| **37** | `37-frecuencia-fatiga.md` | **Frecuencia entre visitas (opt-in obligatorio)** | 31–36, 24 |
| **38** | `38-media-pipeline-ia.md` | **Pipeline de medios: manifiesto, fondos parallax, secuencias y `MEDIA-BRIEF.md`** | 23, 28, 29 |

## Protocolo por tarea

1. Lee el archivo de la tarea completo antes de tocar código.
2. Aplica la **Spec** de forma literal (los textos salen de `../CONTENT.md`).
3. Ejecuta la **Verificación** indicada. Si pasa → marca la tarea como hecha y
   continúa. Si falla → corrige antes de avanzar.
4. Respeta la sección **⚠ No hacer**: define el anti-alcance.
5. Las tareas 20-22 y 28-29 modifican módulos de la v1: tras ellas, re-ejecutar
   la matriz de testing (`19`) en las secciones afectadas.

## Reglas críticas (resumen de PLAN.md §9 y §11)

- Una tarea por vez, en el orden de la tabla de arriba. El proyecto debe compilar al
  cerrar cada tarea.
- `tokens.css` = única fuente de verdad visual (excepción documentada: `public/og.html`,
  tarea 27). Sin colores/fuentes hardcodeados.
- Sin librerías nuevas (solo `gsap`, `lenis`, `three`). Sin imágenes externas en v1.
- **Un solo RAF en todo el sitio: `gsap.ticker`.** Ningún listener de `scroll`, ningún
  `setInterval`, ningún `requestAnimationFrame` propio.
- **`analytics → tracker`, nunca al revés.** `tracker.js` no hace peticiones de red.
- Todo módulo de animación respeta `prefers-reduced-motion`.
- **Si una mecánica del tracker no puede apagarse desde el propio HUD, no entra.**
- Si una tarea se bloquea 2 veces → anotar en `tasks/BLOCKERS.md` y seguir con la
  siguiente que no dependa de ella.

## Estado de ejecución

**v1:** `[x] 00 · [x] 01 · [x] 02 · [x] 03 · [x] 04 · [x] 05 · [x] 06 · [x] 07 · [x] 08 · [x] 09 · [x] 10 · [x] 11 · [x] 12 · [x] 13`
**E:** `[x] 31 · [x] 32 · [x] 33 · [x] 34 · [x] 35 · [x] 36`
**v1 (cierre):** `[x] 14 · [x] 15 · [x] 16`

> **Estado al cerrar la v1 (2026-08-15).** Las 23 tareas de arriba están hechas y
> verificadas. Tres puntos quedan abiertos **a propósito**, cada uno con dueño:
> el peso del JS inicial (190 kB gzip por `three`) → **tarea 17**; el self-hosting de
> fuentes, que es bloqueante para el lanzamiento (`PLAN.md` §11.9) → **tarea 17 §5**;
> y Lighthouse + matriz de navegadores + 60fps, no ejecutables en el entorno de esta
> sesión → **tarea 19**.
>
> ♻ **Veinte archivos de tarea se perdieron el 2026-08-15.** Diecinueve se han
> reconstruido según se llegaba a ellos, y **todos llevan cabecera ♻ diciendo de dónde
> sale su contenido**:
>
> - **Desde fragmentos del transcript** (partes literales + relleno):
>   `04 · 07 · 16 · 17 · 20 · 21 · 23 · 24 · 25* · 28 · 29 · 30`
> - **Desde cero**, a partir de `PLAN.md` / `DESIGN.md` / `CONTENT.md`:
>   `08 · 09 · 12 · 13 · 18 · 22 · 27`
> - **Sigue perdida y sin reconstruir:** `26` (deploy) — se reconstruirá al ejecutarla.
>
> \* de la `25` solo se ha recuperado el fragmento; la tarea no se ha ejecutado.
>
> La `08` es la de mayor divergencia posible respecto al original: no dejó ni un
> fragmento y su shader es de esta implementación, no del spec perdido.
**A:** `[x] 17 · [x] 18 · [~] 19` — **B:** `[!] 20 · [x] 21 · [x] 22`

> **Fase B (2026-08-15).** 21 y 22 hechas. **La 20 está escrita pero desactivada**: sus 6
> contextos WebGL (7 con el hero) hacen que la página entera deje de pintar. Aislado y
> documentado en [`BLOCKERS.md`](BLOCKERS.md) §B-02. Reactivarla exige un único renderer
> compartido y probarlo en navegadores reales (tarea 19).

> **Fase A (2026-08-15).** 17 y 18 cerradas. **La 19 queda abierta a propósito**: la
> columna de Chromium está hecha y registrada en [`QA-LOG.md`](QA-LOG.md), pero Firefox,
> Safari, iOS real, Lighthouse y VoiceOver no existen en el entorno de esta sesión. No se
> marcan como pasados checks que no se han ejecutado.
>
> Lo que sí cerró la fase A, y era lo importante: **el JS inicial baja de 190 a 62,55 kB
> gzip** (`three` a chunk diferido) y **desaparecen las peticiones a terceros** con el
> self-hosting de las tres familias tipográficas — con lo que la frase del informe pasa a
> ser literalmente cierta (`PLAN.md` §11.9). Una retirada documentada:
> [`BLOCKERS.md`](BLOCKERS.md) §B-01.
**C:** `[~] 23 · [~] 24 · 25 · 26 · [x] 27` — **Medios:** `[x] 38`

> **Tarea 38 (2026-08-15).** Añadida fuera del plan original: el sitio no tenía dónde
> recibir imágenes. Deja el manifiesto `src/data/media.js`, las capas de fondo con
> parallax, el reproductor de secuencias en canvas 2D, el retrato real en "Sobre mí",
> `npm run check:media` y **[`MEDIA-BRIEF.md`](../MEDIA-BRIEF.md)**, que es el encargo
> completo para el agente que genera las imágenes. — **D:** `[x] 28 · [x] 29 · [x] 30` — **E (opc.):** `37`

> **Fase D (2026-08-15).** Las tres cerradas. La **28** (i18n ES/EN) es la que más
> superficie tocó: motor propio sin librerías, y reconexión de `tracker`, `hud`,
> `signals`, `report`, `ab-test` y `projects`. La **29** añade `caso.html` como MPA con
> una plantilla y query string. La **30** deja `MAINTENANCE.md` en la raíz.
>
> Pendiente en la 28: **que un nativo repase el inglés**, sobre todo el copy del informe.

> **Fase C (2026-08-15), parcial.** La **27** está cerrada: wordmark, set de iconos,
> manifiesto y `og.jpg` de 1200×630 generada con las fuentes reales. `og:image` sigue
> desactivado a propósito hasta tener dominio (tarea 26).
>
> La **23** deja el pipeline listo — `BRIEFING.md`, `src-assets/` fuera del build y
> soporte de `<picture>` AVIF/WebP en las cards con fallback al gradiente — pero **la
> migración en sí está bloqueada**: no hay contenido de la clienta.
>
> La **24** está construida y funcionando (formulario, banner, consent.js y las tres
> páginas legales), pero **los textos legales son un borrador con huecos marcados en
> naranja y sin revisión jurídica**: no se puede publicar así. Y el formulario no envía
> hasta que exista Netlify (t.26).
>
> **25 y 26 siguen necesitando datos que solo puede aportar el cliente**: IDs de GA4 y del
> píxel, dominio y cuenta de Netlify.

Marcar cada una con `[x]` cuando pase su verificación.
