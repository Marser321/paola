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
import { t } from '../../i18n/index.js'

const TICK_MS = 250          // 4 Hz — presupuesto de PLAN.md §11.8
const SIGNAL_CAP = 12        // cap duro de señales por sesión
const CASE_DWELL = 2.5       // s de card visible para contar como interés
const AWAY_MS = 20000        // ms fuera de la pestaña para considerar retargeting
const PERSIST_MS = 2000      // throttle de escritura en sessionStorage
const STAGES = ['alcance', 'interes', 'consideracion', 'intencion', 'conversion']

// Los nombres de etapa se resuelven en el momento de pedirlos, no al cargar el
// módulo: si fueran constantes, cambiar de idioma no los actualizaría (t.28).
export const stageName = (stage) => t(`stages.${stage}`)

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
      if (state.hud) document.title = t('retargetTitle')
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
    stage: stageName(STAGES[state.stageReached]),
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
