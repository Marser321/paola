# Tarea 31 — Tracker core (estado de sesión + bus de eventos) ⭐

## Objetivo
El núcleo del concepto "LA CAMPAÑA ERES TÚ" (`PLAN.md` §1): un módulo que mide la visita
—tiempo, profundidad, secciones, creatividades, etapa del embudo, señales— y la publica en
un bus de eventos que consumen el HUD (32), los toasts (33), el informe (35) y, solo si hay
consentimiento, la analítica externa (25).

**`tracker.js` no toca el DOM.** Ni una escritura, con una única excepción documentada:
`document.title` durante el retargeting. Todo lo visual son consumidores del bus. Esto es
lo que hace que el opt-out sea real (se desconectan consumidores sin tocar el núcleo), que
el módulo sea testeable desde consola, y que el presupuesto de DOM se cumpla por diseño.

Antes de empezar, lee **`PLAN.md` §11 completo**. Es spec, no recomendación.

## Archivos a crear/editar
- **Crear** `src/js/core/tracker.js`
- **Editar** `src/js/core/cursor.js` (una línea: conteo de hovers sobre el handler ya existente)
- **Editar** `src/main.js`

## Spec

### 1. `src/js/core/tracker.js` (literal)
```js
// Tracker de sesión — "LA CAMPAÑA ERES TÚ" (PLAN.md §1, §11).
//
// REGLAS INNEGOCIABLES:
// · Cero PII, cero fingerprinting, cero identificadores entre visitas.
// · Cero peticiones de red. Este módulo no conoce gtag ni fbq.
// · Cero listeners de scroll. Un solo RAF: gsap.ticker (PLAN.md §9.8).
// · No escribe DOM (excepción: document.title en el retargeting).

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from './lenis.js'

const TICK_MS = 250          // 4 Hz — presupuesto de PLAN.md §11.8
const SIGNAL_CAP = 12        // cap duro de señales por sesión
const CASE_DWELL = 2.5       // s de card visible para contar como interés
const AWAY_MS = 20000        // ms fuera de la pestaña para considerar retargeting
const PERSIST_MS = 2000      // throttle de escritura en sessionStorage
const RETARGET_TITLE = '← Esto es retargeting · PAOLA'

const STAGES = ['alcance', 'interes', 'consideracion', 'intencion', 'conversion']
export const STAGE_NAMES = {
  alcance: 'Alcance',
  interes: 'Interés',
  consideracion: 'Consideración',
  intencion: 'Intención',
  conversion: 'Conversión',
}

// --- Storage defensivo -------------------------------------------------------
// Safari privado y los bloqueadores lanzan al tocar storage: TODO va en try/catch.
// Si el storage falla, la sesión sigue funcionando en memoria.
const safe = {
  get(store, key, fallback) {
    try {
      const raw = window[store].getItem(key)
      return raw === null ? fallback : JSON.parse(raw)
    } catch {
      return fallback
    }
  },
  set(store, key, value) {
    try {
      window[store].setItem(key, JSON.stringify(value))
    } catch {
      /* sin storage: seguimos en memoria */
    }
  },
  del(store, key) {
    try {
      window[store].removeItem(key)
    } catch {
      /* noop */
    }
  },
}

// --- Estado ------------------------------------------------------------------
const state = {
  // Identificador EFÍMERO de sesión. No es un fingerprint, no persiste,
  // no se envía a ningún sitio. Solo sirve para depurar en consola.
  sid: 's-' + Math.random().toString(36).slice(2, 8),

  elapsed: 0,          // segundos de sesión ACTIVA (no cuenta con la pestaña oculta)
  depth: 0,            // 0..1 profundidad actual
  maxDepth: 0,         // 0..1 profundidad máxima alcanzada

  stage: 'alcance',
  stageIndex: 0,
  stageReached: 0,     // nunca decrece

  cases: {},           // slug -> { dwell, hovers, engaged }
  signals: [],         // [{ name, at, slug? }]

  variant: 'A',
  variantForced: false,

  hovers: 0,
  converted: false,
  hud: safe.get('localStorage', 'paola-hud', true),
}

// --- Bus ---------------------------------------------------------------------
const channels = new Map()

function publish(event, payload) {
  const subs = channels.get(event)
  if (!subs) return
  subs.forEach((cb) => {
    try {
      cb(payload)
    } catch (err) {
      // Un consumidor roto no puede tumbar el tick.
      console.error(`[tracker] consumidor de "${event}" ha fallado:`, err)
    }
  })
}

export function on(event, cb) {
  if (!channels.has(event)) channels.set(event, new Set())
  channels.get(event).add(cb)
  return () => off(event, cb)
}

export function off(event, cb) {
  channels.get(event)?.delete(cb)
}

// --- Señales -----------------------------------------------------------------
const fired = new Set()

export function emit(name, meta = {}) {
  if (!state.hud) return                       // opt-out real, no cosmético
  const key = meta.slug ? `${name}:${meta.slug}` : name
  if (fired.has(key)) return                   // dedupe
  if (state.signals.length >= SIGNAL_CAP) return

  fired.add(key)
  const signal = { name, at: Math.round(state.elapsed), ...meta }
  state.signals.push(signal)

  if (name === 'Conversion') {
    state.converted = true
    publish('conversion', signal)
  }
  publish('signal', signal)
  persist()
}

// --- Observadores ------------------------------------------------------------
const visibleSections = new Set()
const visibleCases = new Set()
let sectionIO = null
let caseIO = null

function observeSections() {
  sectionIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const half = entry.intersectionRatio >= 0.5
        if (half) {
          visibleSections.add(entry.target)
          if (entry.target.id && entry.target.id !== 'hero') emit('ViewContent')
        } else {
          visibleSections.delete(entry.target)
        }
      })
    },
    { threshold: [0, 0.5] }
  )
  document.querySelectorAll('main section[data-stage]').forEach((el) => sectionIO.observe(el))
}

function observeCases() {
  caseIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleCases.add(entry.target)
        else visibleCases.delete(entry.target)
      })
    },
    { threshold: 0.5 }
  )
  document.querySelectorAll('.project-card[data-id]').forEach((el) => caseIO.observe(el))
}

// Re-observa las cards tras un re-render (i18n, tarea 28).
export function refresh() {
  if (!caseIO) return
  caseIO.disconnect()
  visibleCases.clear()
  document.querySelectorAll('.project-card[data-id]').forEach((el) => caseIO.observe(el))
}

// --- Medidas cacheadas -------------------------------------------------------
// scrollHeight NUNCA se lee en el tick: fuerza layout. Se cachea y se invalida
// en el refresh de ScrollTrigger, que ya se dispara tras el preloader (t.06)
// y tras cambiar de idioma (t.28).
let maxScroll = 0

function measure() {
  maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
}

// --- Tick --------------------------------------------------------------------
let acc = 0
let lastTime = 0
let lastPersist = 0

function tick(time) {
  const dt = lastTime ? time - lastTime : 0
  lastTime = time

  // La pestaña oculta no acumula tiempo: contarlo sería mentir en el informe.
  if (document.hidden) return

  acc += dt * 1000
  if (acc < TICK_MS) return
  const step = acc / 1000
  acc = 0

  // ---- FASE 1: LECTURAS (ninguna escritura de DOM aquí) ----
  const y = getLenis()?.scroll ?? window.scrollY

  state.elapsed += step
  state.depth = Math.min(Math.max(y / maxScroll, 0), 1)
  if (state.depth > state.maxDepth) state.maxDepth = state.depth

  // Etapa = sección visible cuyo centro está más cerca del centro del viewport.
  // Se itera sobre un Set de 1-2 elementos, no sobre todo el DOM.
  if (visibleSections.size) {
    const mid = window.innerHeight / 2
    let best = null
    let bestDist = Infinity
    visibleSections.forEach((el) => {
      const r = el.getBoundingClientRect()
      const dist = Math.abs(r.top + r.height / 2 - mid)
      if (dist < bestDist) {
        bestDist = dist
        best = el
      }
    })
    const next = best?.dataset.stage
    if (next && next !== state.stage) {
      const from = state.stage
      state.stage = next
      state.stageIndex = STAGES.indexOf(next)
      state.stageReached = Math.max(state.stageReached, state.stageIndex)
      publish('stage', { from, to: next, index: state.stageIndex })
    }
  }

  // Dwell por creatividad
  visibleCases.forEach((el) => {
    const slug = el.dataset.id
    if (!slug) return
    const entry = (state.cases[slug] ||= { dwell: 0, hovers: 0, engaged: false })
    entry.dwell += step
    if (!entry.engaged && entry.dwell >= CASE_DWELL) {
      entry.engaged = true
      publish('case', { slug, dwell: entry.dwell })
      emit('ContentEngagement', { slug })
    }
  })

  // Umbrales de señal
  if (state.maxDepth >= 0.75) emit('Scroll75')
  if (state.elapsed >= 60) emit('Dwell60')

  // ---- FASE 2: EMISIÓN (los consumidores escriben DOM) ----
  publish('tick', {
    elapsed: state.elapsed,
    depth: state.depth,
    stage: state.stage,
    signalCount: state.signals.length,
  })

  if (state.elapsed - lastPersist >= PERSIST_MS / 1000) {
    lastPersist = state.elapsed
    persist()
  }
}

// --- Persistencia ------------------------------------------------------------
// sessionStorage: efímero, primera parte, no transmitido → exento de consentimiento
// (ver tarea 24). Se purga entero si el visitante desactiva el panel.
function persist() {
  if (!state.hud) return
  safe.set('sessionStorage', 'paola-session', {
    elapsed: Math.round(state.elapsed),
    maxDepth: Number(state.maxDepth.toFixed(3)),
    stageReached: state.stageReached,
    signals: state.signals,
    variant: state.variant,
    converted: state.converted,
  })
}

// --- Retargeting -------------------------------------------------------------
// Única escritura de DOM del módulo. setTimeout de un solo disparo: es la
// excepción documentada a PLAN.md §9.8 (que prohíbe setInterval y RAF propios).
let hiddenAt = 0
let awayTimer = null
let titleBeforeBlur = ''

function onVisibility() {
  if (document.hidden) {
    hiddenAt = Date.now()
    // Se captura el título VIGENTE, no una constante: la tarea 28 lo cambia de idioma.
    titleBeforeBlur = document.title
    awayTimer = setTimeout(() => {
      if (state.hud) document.title = RETARGET_TITLE
    }, AWAY_MS)
  } else {
    clearTimeout(awayTimer)
    if (titleBeforeBlur) document.title = titleBeforeBlur
    if (Date.now() - hiddenAt >= AWAY_MS) emit('Retargeting')
  }
}

// --- API pública -------------------------------------------------------------
let started = false

export function initTracker() {
  if (started) return
  started = true

  measure()
  ScrollTrigger.addEventListener('refresh', measure)
  window.addEventListener('resize', measure, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('pagehide', persist)

  gsap.ticker.add(tick)
  emit('PageView')

  // Los observers se conectan cuando el hilo está libre: initTracker() corre
  // antes del preloader y no puede competir con el arranque (PLAN.md §11.8).
  const connect = () => {
    observeSections()
    observeCases()
  }
  if ('requestIdleCallback' in window) requestIdleCallback(connect, { timeout: 1000 })
  else setTimeout(connect, 0)
}

export function getState() {
  return Object.freeze({ ...state })
}

// Objeto derivado que consume el informe (tarea 35).
export function snapshot() {
  const cases = Object.entries(state.cases)
  const engaged = cases.filter(([, c]) => c.engaged)
  const top = cases.slice().sort((a, b) => b[1].dwell - a[1].dwell)[0]

  // Heurística DECLARADA (PLAN.md §11.5). Tope 99: ninguna estimación honesta dice 100.
  const score = Math.round(
    Math.min(
      99,
      30 * Math.min(state.maxDepth / 0.9, 1) +
        20 * Math.min(state.elapsed / 120, 1) +
        20 * (engaged.length / 6) +
        15 * Math.min(state.signals.length / 8, 1) +
        15 * (state.converted ? 1 : 0)
    )
  )

  return {
    elapsed: Math.round(state.elapsed),
    depth: Math.round(state.maxDepth * 100),
    signals: state.signals.length,
    stage: STAGE_NAMES[STAGES[state.stageReached]],
    casesSeen: engaged.length,
    casesTotal: 6,
    topCase: top && top[1].dwell >= 1 ? { slug: top[0], dwell: Math.round(top[1].dwell) } : null,
    variant: state.variant,
    variantForced: state.variantForced,
    converted: state.converted,
    score,
  }
}

export function setVariant(variant, { forced = false } = {}) {
  state.variant = variant
  state.variantForced = forced || state.variantForced
  publish('variant', { variant, forced: state.variantForced })
  persist()
}

// Conteo de hovers. Lo llama el handler delegado que YA existe en cursor.js:
// coste cero, ningún listener nuevo.
export function trackHover() {
  state.hovers += 1
}

// Opt-out. Debe ser REAL: purga storage, silencia emit() y avisa a los consumidores
// para que se destruyan. PLAN.md §11: si no se puede apagar, no entra.
export function setHud(enabled) {
  state.hud = enabled
  safe.set('localStorage', 'paola-hud', enabled)
  if (!enabled) {
    safe.del('sessionStorage', 'paola-session')
    document.title = titleBeforeBlur || document.title
  }
  publish('hud', { enabled })
}

export function isHudEnabled() {
  return state.hud
}

export function destroy() {
  gsap.ticker.remove(tick)
  ScrollTrigger.removeEventListener('refresh', measure)
  window.removeEventListener('resize', measure)
  document.removeEventListener('visibilitychange', onVisibility)
  window.removeEventListener('pagehide', persist)
  sectionIO?.disconnect()
  caseIO?.disconnect()
  visibleSections.clear()
  visibleCases.clear()
  channels.clear()
  started = false
}
```

### 2. Editar `src/js/core/cursor.js` — dos cambios mínimos

Añadir el import al principio:
```js
import { trackHover } from './tracker.js'
```

Y una línea dentro del handler `mouseover` que **ya existe** (tarea 05), justo tras el
`if (!target) return`:
```js
    trackHover()
```

> No se añade ningún listener nuevo: se reutiliza la delegación que ya cubre todo el
> sitio. En táctil y con reduced-motion `initCursor()` sale antes, así que no habrá
> conteo de hovers — es correcto, y el informe lo muestra como `—`.

### 3. Editar `src/main.js` — añadir en el orden exacto de `PLAN.md` §4.3
```js
import { initTracker } from './js/core/tracker.js'

initLenis()
renderProjects()   // el tracker necesita las .project-card ya en el DOM
initTracker()      // 3º — restricción (a) de PLAN.md §4.3
initCursor()
// ... resto sin cambios
```

## Criterios de aceptación
- [ ] `npm run dev` sin errores; `initTracker()` corre **después** de `renderProjects()`.
- [ ] En consola, `getState()` devuelve un objeto cuyo `elapsed` y `depth` avanzan al
  hacer scroll, y cuyo `stage` cambia al pasar de sección.
- [ ] `stageReached` **nunca decrece** al volver a subir.
- [ ] **Panel de red completamente vacío** durante una sesión entera. Ni una petición.
- [ ] `state.elapsed` **no avanza** con la pestaña en segundo plano.
- [ ] Las señales se disparan una sola vez cada una y el array nunca pasa de 12.
- [ ] Cambiar de pestaña >20 s cambia `document.title`; al volver se restaura
  **exactamente** el título que había y se emite `Retargeting` una única vez.
- [ ] Cambiar de pestaña <20 s **no** cambia el título ni emite nada.
- [ ] `setHud(false)` silencia `emit()` y borra `paola-session` de sessionStorage.
- [ ] En Safari privado (o con storage bloqueado) **no hay ni una excepción**: todo
  funciona en memoria.
- [ ] Performance: con DevTools → Performance grabando 10 s de scroll, el tick no aparece
  como long task y no hay *forced reflow* atribuible a `tracker.js`.

## Verificación
```bash
npm run dev
```

En la consola del navegador (el módulo se puede importar desde DevTools o exponer
temporalmente en `window` para probar — **no dejar esa exposición en el código final**):

```js
// 1) El estado avanza
getState().elapsed > 0 && getState().depth >= 0

// 2) Cap de señales
getState().signals.length <= 12

// 3) La etapa no retrocede
// scrollear hasta el final, volver arriba, y comprobar:
getState().stageReached === 4

// 4) El informe cuadra
snapshot()   // → { elapsed, depth, signals, stage, casesSeen, topCase, score, ... }

// 5) La heurística nunca llega a 100
snapshot().score <= 99
```

Prueba de red (la más importante del concepto):
```
DevTools → Network → filtro "All" → recargar → sesión completa de 2 minutos
→ solo deben aparecer: documento, JS/CSS de Vite y las 2 hojas de fuentes.
Ninguna petición más.
```

## ⚠ No hacer
- **No escribir DOM desde este módulo.** La única excepción es `document.title`, y está
  documentada arriba. Si necesitas pintar algo, es tarea de un consumidor.
- **No añadir `window.addEventListener('scroll', …)`.** La posición se lee del ticker.
  Si crees necesitarlo, estás resolviendo el problema mal.
- No usar `setInterval` ni `requestAnimationFrame` propios. El `setTimeout` de un disparo
  del retargeting es la única excepción, y ya está escrita.
- No guardar nada que identifique a nadie: ni user agent, ni idioma, ni resolución, ni
  referrer, ni ningún id persistente entre visitas. `PLAN.md` §11.2.
- No importar `analytics.js`, `gtag` ni `fbq`. La dependencia va siempre al revés (§11.7).
- No añadir mecánicas que no se puedan apagar desde el HUD (§11, regla maestra).
- No exponer el tracker en `window` en el código final (solo para depurar).
