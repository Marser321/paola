// Toasts de señal. Consumidor del bus. PLAN.md §11.3 — los números son spec.

import { on } from '../core/tracker.js'
import { shouldReduceMotion } from '../core/lenis.js'
import { projects } from '../../data/projects.js'
import { t } from '../../i18n/index.js'

const DURATION = 1.5   // s en pantalla
const GAP = 4          // s mínimos entre dos toasts
const SHIFT = 8        // px de desplazamiento — el máximo permitido

// El NOMBRE de la señal nunca se traduce (es vocabulario de Ads Manager);
// la glosa sí, y sale del diccionario del idioma activo (t.28).
function glossFor(signal) {
  if (signal.name === 'ContentEngagement') {
    const project = projects.find((p) => p.id === signal.slug)
    return t('signals.ContentEngagement', { case: project ? project.title : signal.slug })
  }
  return t(`signals.${signal.name}`)
}

export function initSignals() {
  // Sin toasts en móvil ni con reduced-motion. La información no se pierde:
  // el HUD muestra "Última señal" y el informe los recoge todos.
  if (shouldReduceMotion()) return
  if (window.matchMedia('(max-width: 767px)').matches) return

  const layer = document.createElement('div')
  layer.className = 'signal-layer'
  layer.setAttribute('aria-hidden', 'true') // ver "Accesibilidad" abajo
  document.body.appendChild(layer)

  const queue = []
  let current = null
  let lastShownAt = -Infinity
  let stopped = false

  on('signal', (signal) => {
    if (stopped) return
    queue.push(signal)
    // La conversión es el último aviso: la campaña ya convirtió, seguir
    // avisando sería ruido (PLAN.md §11.3).
    if (signal.name === 'Conversion') stopped = true
  })

  on('hud', ({ enabled }) => {
    if (enabled) return
    stopped = true
    queue.length = 0
    if (current) hide()
  })

  function show(signal, at) {
    const el = document.createElement('p')
    el.className = 'signal-toast mono'
    el.textContent = `▸ ${signal.name} — ${glossFor(signal)}`
    layer.appendChild(el)
    requestAnimationFrame(() => el.classList.add('is-in'))
    current = { el, at }
    lastShownAt = at
  }

  function hide() {
    if (!current) return
    const { el } = current
    current = null
    el.classList.remove('is-in')
    el.addEventListener('transitionend', () => el.remove(), { once: true })
  }

  // El reloj de la cola es el tick del tracker (4 Hz): ni un timer propio,
  // ni un RAF nuevo (PLAN.md §9.8).
  on('tick', ({ elapsed }) => {
    if (current && elapsed - current.at >= DURATION) hide()
    if (!current && queue.length && elapsed - lastShownAt >= GAP) {
      show(queue.shift(), elapsed)
    }
  })
}
