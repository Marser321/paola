# PLAN MAESTRO — Portfolio "PAOLA" · Meta Ads Specialist

> Documento central del proyecto. Lee también: `DESIGN.md` (sistema de diseño),
> `CONTENT.md` (textos y datos) y `tasks/` (38 micro-tareas de ejecución).

---

## 1. Visión y concepto

### Concepto rector: **"LA CAMPAÑA ERES TÚ"**

Esta profesional vive de trackear, testear y mover gente por un embudo. El sitio no
**cuenta** que sabe hacerlo: lo **hace contigo**.

El visitante es el tráfico. El sitio es la campaña. Un panel de sesión discreto registra
la visita con el vocabulario real de Ads Manager (`ViewContent`, `Scroll75`,
`ContentEngagement`), las secciones están etiquetadas por etapa del embudo, y justo antes
del CTA el visitante recibe **el informe real de su propia visita** — calculado en su
navegador, sin enviar un solo dato a ningún servidor.

Eso hace tres cosas a la vez:

1. **Demuestra la habilidad en vez de afirmarla.** Cualquiera puede escribir "ROAS 4.2x".
   Muy pocos pueden medirte y enseñártelo.
2. **Convierte la estética en función.** La dirección de arte (§5) tiene aire de terminal
   de datos: labels mono, grid de 1px, KPIs. Con el concepto esos elementos dejan de ser
   decoración y pasan a mostrar datos de verdad.
3. **Es un statement post-cookie.** "Nada de esto ha salido de tu navegador" es una
   posición profesional sobre cómo se mide bien, no un truco.

### Firma visual

El contraste entre:

- **Editorial de lujo**: titulares gigantes (Clash Display), espacio negro, grano fílmico.
- **Terminal de datos**: KPIs en monoespaciada (`ROAS 4.2X / +$2M / 2026`), líneas de grid
  de 1px, etiquetas técnicas — porque esta profesional vende *resultados medibles*.

### Los 4 momentos de impacto

Concentrados, no repartidos: saturar es lo que hace que un sitio se lea como plantilla.

1. **Hero WebGL** — campo de partículas con shader que reacciona al ratón.
2. **Galería de creatividades** — scroll horizontal pinneado, cards con chrome de anuncio
   y backstage (audiencia, presupuesto, test A/B con su ganadora).
3. **Micro-interacciones finas** — cursor custom, CTA magnético, contadores, marquees.
4. **El informe de sesión** — el clímax. Ver §7 y tarea 35.

## 2. Referencias de nivel mundial (benchmark)

| Referencia | URL | Qué tomamos |
|---|---|---|
| Robby Yeager | robbyyeager.com | Portfolio de marketing premiado; benchmark directo del rubro |
| HAOQI.DESIGN | haoqi.design | Hero WebGL + scroll (SOTD ago-2026) |
| NOTHIN' | noth.in | Minimalismo extremo con interacciones finas |
| Léo Parpeix | leoparpeix.com | Estructura hero → trabajo → about |
| OKC Media | okc.media/en | Scroll storytelling para agencia de medios |
| ULTRAGRID | ultragrid.studio | Estética grid técnico para visualizar datos |
| Noomo Showcase | showcase.noomoagency.com | Escenas 3D para presentar casos |
| Behance — media buyers | behance.net (búsqueda "media buyer portfolio") | Cómo estructurar casos: KPIs, antes/después, ROAS |

> **Advertencia de uso.** Estas referencias sirven para el listón de ejecución, no para
> copiar mecánicas. El material que hace este sitio irrepetible es el concepto §1, que no
> sale de ninguna de ellas: sale de la profesión de la persona.

## 3. Stack (bloqueado — no añadir librerías)

| Capa | Elección | Uso |
|---|---|---|
| Build | **Vite** (template `vanilla`) | Dev server + build estático |
| Animación | **gsap** + ScrollTrigger (v3) | Pin, scrub, reveals, contadores |
| Smooth scroll | **lenis** | Scroll suave integrado con ScrollTrigger |
| 3D / WebGL | **three** | Solo hero (partículas shader) |
| Fuentes | Fontshare CDN: **Clash Display** (600/700), **Satoshi** (400/500/700) · Google Fonts: **JetBrains Mono** (400/500) | Self-hosting **obligatorio antes del lanzamiento** — ver §11 |
| Imágenes | **Placeholders CSS/canvas** (gradientes del sistema) | Prohibido hotlink externo |

El tracker del concepto §1 **no añade dependencias**: es JS propio (~14 KB gzip).

Instalación exacta:
```bash
npm create vite@latest . -- --template vanilla
npm install
npm install gsap lenis three
```

## 4. Arquitectura de archivos

### 4.1 Al cerrar la v1 (tarea 16)

```
Paola/
├── PLAN.md  DESIGN.md  CONTENT.md      ← esta documentación
├── tasks/                               ← README + 38 tareas (00→37)
├── index.html
├── package.json  vite.config.js
├── public/                              ← favicon.svg, og.jpg
└── src/
    ├── main.js                          ← orquestador: importa e inicializa módulos
    ├── styles/
    │   ├── tokens.css                   ← ÚNICA fuente de verdad visual (variables)
    │   ├── base.css                     ← reset, tipografía base, utilidades, grain
    │   ├── sections.css                 ← bloques por sección (banners comentados)
    │   └── tracker.css                  ← HUD, toasts, informe, chrome de anuncio
    ├── data/
    │   └── projects.js                  ← 6 casos con KPIs + datos de anuncio
    └── js/
        ├── core/
        │   ├── lenis.js                 ← smooth scroll + integración ScrollTrigger
        │   ├── cursor.js                ← cursor custom (dot + ring + píldora audiencia)
        │   ├── preloader.js             ← contador 0→100 + cortina + evento app:ready
        │   ├── tracker.js               ← ★ estado de sesión + bus de eventos + tick
        │   └── ab-test.js               ← ★ variante A/B del hero
        ├── ui/
        │   ├── hud.js                   ← ★ panel de sesión (rail lateral)
        │   └── signals.js               ← ★ micro-toasts de señal
        ├── webgl/
        │   └── hero-scene.js            ← partículas Three.js con shader de repulsión
        └── sections/
            ├── hero.js                  ← split de título + animación de entrada
            ├── marquee.js               ← marquee con velocidad ligada al scroll
            ├── metrics.js               ← contadores + sparklines
            ├── projects.js              ← render de cards + pin horizontal + tilt 3D
            ├── services.js              ← reveals de servicios
            ├── process.js               ← timeline con línea scrub
            ├── about.js                 ← reveal + efecto hover imagen
            ├── testimonials.js          ← cards sticky apiladas
            ├── report.js                ← ★ informe de sesión
            └── contact.js               ← CTA magnético, reloj, back-to-top
```

★ = módulos del concepto "LA CAMPAÑA ERES TÚ" (fase E, tareas 31→36).

### 4.2 Estructura final (todas las fases)

Añaden sobre lo anterior:

```
├── caso.html                            ← t.29 (casos de estudio, MPA)
├── netlify.toml  robots.txt  sitemap.xml← t.26, t.18
├── legal/                               ← t.24: aviso, privacidad, cookies
├── public/
│   ├── fonts/                           ← t.17 §5 (self-hosting, obligatorio §11)
│   ├── img/                             ← t.23 (WebP/AVIF de la clienta)
│   ├── og.html                          ← t.27 (plantilla para generar og-image)
│   └── favicon set + site.webmanifest   ← t.27
└── src/
    ├── i18n/                            ← t.28 (diccionarios ES/EN)
    ├── styles/caso.css                  ← t.29
    └── js/
        ├── core/consent.js  analytics.js← t.24, t.25
        ├── fx/                          ← t.21 (scramble, split de H2)
        └── pages/caso.js                ← t.29
```

### 4.3 Orden de inicialización en `main.js`

**Convención de módulos:** cada archivo en `js/` exporta una función `initXxx()`
(o `renderProjects()` en el caso de data-driven).

```js
import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/sections.css'
import '../styles/tracker.css'
// ... imports de módulos

initLenis()            // 1º — ScrollTrigger depende de esto
renderProjects()       // 2º — el DOM de proyectos debe existir ANTES de medir scroll
initTracker()          // 3º — ver restricción (a)
initAbTest()           // 4º — ver restricción (b)
initHud()              // 5º — se suscribe al bus del tracker
initSignals()          // 6º — cola de toasts
initCursor()
initPreloader()        // dispara 'app:ready' al terminar → activa entrada del hero
initHeroScene()        // WebGL (con guards internos: móvil/reduced-motion)
initHero()             // escucha 'app:ready'
initMarquee()
initMetrics()
initProjects()
initServices()
initProcess()
initAbout()
initTestimonials()
initReport()           // ver restricción (c)
initContact()
initConsent()          // t.24
initContactForm()      // t.24
initAnalytics()        // t.25 — se suscribe al bus; NUNCA al revés
```

**Tres restricciones de orden que no son obvias** (si se rompen, el fallo es silencioso):

- **(a)** `initTracker()` va **después** de `renderProjects()`: si no, no existen las
  `.project-card` que tiene que observar.
- **(b)** `initAbTest()` va **antes** de `initHero()`: `initHero()` anima el subtítulo desde
  el estado del DOM. Si la variante se aplicara después, se vería el cambio de texto.
- **(c)** `initReport()` va **antes** de `initContact()`: el panel del informe debe existir
  con su `min-height` reservado antes de que se midan los offsets de ScrollTrigger.

## 5. Sistema de diseño (resumen)

Todo el detalle en **`DESIGN.md`**. Claves:

- Fondo `#0E0E0E`, texto `#F3F2F2`, muted `#8A8A8A`, líneas `rgba(243,242,242,.08)`.
- Acento único: gradiente Meta `#7B19C8 → #C559C4 → #F57327` (clase `.accent-text`),
  máximo una aplicación visible por viewport.
- Tipos: Clash Display (titulares, uppercase), Satoshi (cuerpo), JetBrains Mono (datos).
- Héroe a `clamp(4rem, 14vw, 13rem)`. Contenedor `min(92vw, 1440px)`.
- Grano global fijo al 5% de opacidad, `pointer-events: none`.
- **Prohibido hardcodear** colores/fuentes/tamaños fuera de `tokens.css`.
- La UI del concepto (HUD, toasts, informe, chrome de anuncio) está en `DESIGN.md` §10–13
  y usa **solo** `--muted` y `--line`, salvo una excepción deliberada: la barra de
  probabilidad del informe (§11 de este documento).

## 6. Contenido

Todo el copy placeholder en español vive en **`CONTENT.md`** y en `src/data/projects.js`.
Regla: ningún texto visible se inventa en ejecución; se copia de `CONTENT.md`.

Excepción documentada: los **nombres de señal** (`PageView`, `ViewContent`, `Scroll75`…)
son vocabulario literal de Ads Manager y no se traducen ni se castellanizan nunca, tampoco
en la tarea 28 de i18n. Sus glosas en español sí.

## 7. Mapa de secciones, etapas y efectos

Los índices genéricos (`01 —`, `02 —`) se sustituyen por **etapas del embudo**: 5 etapas
para 10 secciones. Que dos secciones compartan etapa es lo que hace que se lea como un
embudo y no como una numeración renombrada. Nombres exactos en `CONTENT.md` §5.

| Etapa | Sección | id | Efecto |
|---|---|---|---|
| — | Preloader | `#preloader` | Contador 0→100 mono + barra + cortina ("iniciando campaña") |
| — | Header | `.site-header` | Fijo, mix-blend-difference, anchors con lenis |
| 01 ALCANCE | Hero | `#hero` | WebGL partículas + título 14vw con reveal por letras + variante A/B |
| 01 ALCANCE | Marquee | `.marquee` | Loop infinito, velocidad ∝ scroll |
| 01 ALCANCE | Métricas | `#metricas` | 4 contadores con overshoot + sparklines de 1px |
| 02 INTERÉS | Proyectos | `#proyectos` | Pin horizontal + chrome de anuncio + backstage + tilt 3D |
| 03 CONSIDERACIÓN | Servicios | `#servicios` | Header sticky + reveals escalonados |
| 03 CONSIDERACIÓN | Proceso | `#proceso` | Línea vertical dibujada con scrub + 6 pasos |
| 04 INTENCIÓN | Sobre mí | `#sobre-mi` | Imagen con hover parallax + CV en mono |
| 04 INTENCIÓN | Testimonios | `#testimonios` | 3 sticky cards apiladas |
| 05 CONVERSIÓN | **Informe** | `#informe` | **Panel que compila los datos reales de la visita** |
| 05 CONVERSIÓN | Contacto | `#contacto` | CTA magnético 12vw (emite `Conversion`) + reloj local |
| — | Footer | `.footer` | Marquee inverso + reactivar panel + back-to-top |

Sobre todo ello, persistente: el **panel de sesión (HUD)**, rail lateral en ≥1024px.

## 8. Flujo de ejecución

**38 tareas** en `tasks/`, numeradas `00`→`37`, organizadas en 5 fases. El **orden real de
ejecución no es el orden numérico**: está en la tabla de `tasks/README.md`, que manda.

Se ejecutan una por vez. Cada tarea contiene: Objetivo · Archivos · Spec literal ·
Criterios de aceptación · Verificación · ⚠ No hacer.

## 9. Reglas globales del agente ejecutor

1. **Una tarea por vez**, en el orden de la tabla de `tasks/README.md`. No mezclar tareas
   ni adelantar trabajo de tareas futuras.
2. `tokens.css` es la única fuente de verdad visual. Cero valores literales de
   color/fuente en otro archivo (excepto shaders GLSL, donde se documenta el hex, y
   `public/og.html` de la tarea 27).
3. **Sin librerías nuevas.** Solo `gsap`, `lenis`, `three`.
4. Textos visibles: siempre en español y copiados de `CONTENT.md` (excepción: §6).
5. Sin imágenes externas. Placeholders = gradientes del sistema (definidos por sección).
6. Todo módulo de animación debe respetar `prefers-reduced-motion` usando el helper
   `shouldReduceMotion()`.
7. WebGL: pausar cuando el hero salga del viewport (IntersectionObserver) y no
   inicializar en `<768px` o reduced-motion (fallback CSS ya definido).
8. **Un solo RAF en todo el sitio**: `gsap.ticker`. Nada de `requestAnimationFrame`
   propio, nada de `setInterval`, y **ningún listener de `scroll`** — la posición se lee
   del ticker. Ver §11.
9. Tras cada tarea: ejecutar su **Verificación** y solo continuar si pasa.
10. Si una tarea falla tras 2 intentos: dejar el código en el último estado que compile,
    anotar el bloqueo en `tasks/BLOCKERS.md` y continuar con la siguiente tarea que no
    dependa de la fallida.
11. Nunca romper `npm run dev`: cada tarea termina con el proyecto compilando.

## 10. Criterios de calidad global (se auditan en tarea 16)

- `npm run build` sin errores ni warnings de Vite.
- Sin errores de consola en Chrome/Firefox/Safari (últimas 2 versiones).
- 60fps en hero y proyectos en un portátil medio (DevTools → Performance).
- Sin scroll horizontal no intencionado en ningún viewport 320px→1920px.
- **JS inicial < 150KB gzip**, excluido el chunk dinámico de `three`. La **tarea 17 es la
  autoridad** sobre este número y sobre el resto de budgets de Core Web Vitals (LCP <2.5s,
  CLS <0.05, TBT <200ms). Ninguna otra tarea puede fijar una cifra distinta.
- **Cero peticiones de red originadas por el tracker** durante una sesión completa.
- Accesibilidad base: navegable por teclado, `aria-label` en elementos no textuales,
  foco visible, reduced-motion funcional.

## 11. Reglas de contención del tracker

> El concepto §1 vive o muere en la diferencia entre *"qué elegante, me ha leído"* y
> *"esta web me está vigilando"*. Sus riesgos no son técnicos, son de tono. Estas reglas
> son parte de la spec, no recomendaciones.

**Regla maestra: si una mecánica del tracker no puede apagarse desde el propio HUD, no
entra.** El opt-out visible es lo que convierte la vigilancia en demostración.

1. **El HUD describe la campaña, no a la persona.** Nunca "interés: alto", "perfil",
   "usuario indeciso". Solo mecánicas: tiempo, profundidad, etapa, señales, variante.
2. **Cero PII, cero fingerprinting.** Ningún `navigator.userAgent`, ningún identificador
   persistente entre visitas (salvo el opt-in explícito de la tarea 37), ningún dato que
   permita reconocer a nadie. Es lo que hace defendible la declaración de `CONTENT.md` §14.
3. **Toasts, en números:** máximo **1 cada 4 s**, máximo **12 por sesión** (cap duro),
   duración 1,5 s, desplazamiento máximo 8 px, sin sonido, sin icono, sin color de acento.
   **Se apagan tras `Conversion`** — la campaña convirtió; seguir avisando sería ruido.
   No existen en móvil ni con `prefers-reduced-motion`.
4. **El gradiente Meta aparece UNA sola vez en todo el concepto:** la barra de
   probabilidad del informe. Es el clímax y por eso tiene que estar solo. HUD, barra de
   profundidad y compilación van en `--muted` / `--line`.
5. **La heurística se declara, no se disfraza.** Etiqueta `ESTIMACIÓN HEURÍSTICA`
   permanente (no un asterisco), botón que enseña los pesos, y tope en **99**, nunca 100.
   La clienta dice literalmente "sin humo" (`CONTENT.md` §10): un porcentaje sin fórmula
   sería humo.
6. **Tono declarativo, nunca ufano.** No es "mira todo lo que sé de ti", es "esto es todo
   lo que se puede saber sin enviar nada". El contraste es con la industria, no con quien
   visita.
7. **Dirección de dependencia innegociable:** `analytics → tracker`, jamás al revés.
   `tracker.js` no importa `analytics.js`, no conoce `gtag` ni `fbq`, y no hace una sola
   petición de red. Sin consentimiento el bus sigue vivo y local.
8. **Presupuesto de trabajo:** el tracker se cuelga de `gsap.ticker` a 4 Hz, con
   IntersectionObserver para la visibilidad. Cero listeners de scroll propios, máximo 4
   escrituras de DOM por segundo, y cada consumidor cachea su último valor escrito. El
   tiempo de sesión **no acumula con la pestaña oculta**: contarlo sería mentir en el
   informe.
9. **Self-hosting de fuentes obligatorio antes del lanzamiento.** El sitio afirma "nada
   sale de tu navegador" mientras carga fuentes desde `api.fontshare.com` y
   `fonts.googleapis.com`, lo que expone la IP del visitante a dos terceros. La tarea 17
   §5 documenta el self-hosting como opcional: **para este proyecto es obligatorio**, y la
   tarea 26 no puede cerrarse sin él. Dejar esa contradicción sería el fallo más caro del
   proyecto, porque es justo lo que un jurado o un cliente técnico comprueba primero.
