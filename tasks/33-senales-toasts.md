# Tarea 33 — Señales: micro-toasts

## Objetivo
El aviso efímero que aparece cuando la campaña registra una señal. Es **la mecánica más
fácil de estropear** de todo el proyecto: la distancia entre un guiño elegante y una
notificación de app se mide en milisegundos y en píxeles.

Por eso los números de `PLAN.md` §11.3 no son recomendaciones, son la spec:
**1 cada 4 s · 12 por sesión · 1,5 s de vida · 8 px de desplazamiento · sin color de
acento · sin sonido · sin icono · se apagan tras `Conversion` · no existen en móvil ni con
reduced-motion.**

Los nombres de señal son vocabulario literal de Ads Manager y **no se traducen nunca**
(`CONTENT.md` §13). Las glosas en español sí.

## Archivos a crear/editar
- **Crear** `src/js/ui/signals.js`
- **Editar** `src/styles/tracker.css` (añadir bloque al final)
- **Editar** `src/main.js`

## Spec

### 1. `src/js/ui/signals.js` (literal)
```js
// Toasts de señal. Consumidor del bus. PLAN.md §11.3 — los números son spec.

import { on } from '../core/tracker.js'
import { shouldReduceMotion } from '../core/lenis.js'
import { projects } from '../../data/projects.js'

const DURATION = 1.5   // s en pantalla
const GAP = 4          // s mínimos entre dos toasts
const SHIFT = 8        // px de desplazamiento — el máximo permitido

// Glosa en español por señal (CONTENT.md §13). El NOMBRE no se traduce.
const GLOSS = {
  PageView: 'impresión servida',
  ViewContent: 'contenido visto',
  Scroll75: '75% de profundidad',
  Dwell60: '60 s en página',
  Retargeting: 'has vuelto',
  Conversion: 'objetivo cumplido',
}

function glossFor(signal) {
  if (signal.name === 'ContentEngagement') {
    const project = projects.find((p) => p.id === signal.slug)
    return `interés en ${project ? project.title : signal.slug}`
  }
  return GLOSS[signal.name] || ''
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
```

### 2. Añadir AL FINAL de `src/styles/tracker.css`
```css
/* ===== TOASTS DE SEÑAL (tarea 33) ===== */
/* Anclados al HUD: encima del rail en desktop, bajo la línea en tablet. */
.signal-layer {
  position: fixed; right: 1.25rem; bottom: 1.5rem;
  z-index: var(--z-toast);
  pointer-events: none;
  display: flex; flex-direction: column; gap: 0.5rem;
}
.signal-toast {
  font-size: var(--fs-hud);
  color: var(--muted);
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 0.5rem 0.75rem;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(8px); /* SHIFT — el máximo permitido */
  transition: opacity var(--dur-fast) var(--ease-out),
              transform var(--dur-fast) var(--ease-out);
}
.signal-toast.is-in { opacity: 1; transform: translateY(0); }

@media (min-width: 768px) and (max-width: 1023px) {
  .signal-layer { top: 7.5rem; bottom: auto; right: 4vw; }
}
@media (max-width: 767px) {
  .signal-layer { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .signal-layer { display: none; }
}
```

### 3. Editar `src/main.js`
```js
import { initSignals } from './js/ui/signals.js'

// orden de PLAN.md §4.3:
initHud()
initSignals()   // 6º
```

## Accesibilidad — decisión deliberada

Los toasts llevan `aria-hidden="true"`. **No son una live region y no deben serlo.**

Un `aria-live="polite"` que se dispara hasta 12 veces con vocabulario técnico en inglés
(`ContentEngagement`, `Scroll75`) interrumpiría la lectura del contenido real sin aportar
nada que el informe no dé mejor, completo y en un solo sitio. La superficie accesible del
concepto es `#informe` (tarea 35), y ahí sí hay un anuncio `polite`, uno solo.

Si en el futuro se quisiera paridad estricta, la forma correcta sería **una única** región
`role="status" aria-live="polite" aria-atomic="true"`, activable desde el HUD y
**desactivada por defecto** — nunca 12 anuncios sueltos.

## Criterios de aceptación
- [ ] Aparece un toast al dispararse cada señal, con el formato
  `▸ ViewContent — contenido visto`.
- [ ] **Nunca hay dos toasts en pantalla a la vez** y **nunca aparecen a menos de 4 s**
  uno de otro, aunque se disparen tres señales seguidas (se encolan).
- [ ] Cada toast dura ~1,5 s y se desplaza como máximo 8 px.
- [ ] Tras la señal `Conversion` se muestra ese toast y **no vuelve a aparecer ninguno**.
- [ ] Nunca se superan los 12 en una sesión (lo garantiza el cap del tracker).
- [ ] Los nombres de señal están en inglés y sin traducir; las glosas, en español.
- [ ] `ContentEngagement` muestra el nombre del cliente, no el slug
  (`interés en Atelier Nord`, no `interés en atelier-nord`).
- [ ] Ningún toast usa el gradiente, ni icono, ni sonido.
- [ ] En <768px **no existen**. Con reduced-motion tampoco (y el HUD muestra
  `Última señal` en su lugar).
- [ ] Desactivar el panel vacía la cola y quita el toast en curso.
- [ ] Con VoiceOver, recorrer la página no anuncia ninguna señal.

## Verificación
```bash
npm run dev
# 1) Recargar y hacer scroll rápido hasta el 80% de la página:
#    las señales se ENCOLAN y salen de una en una, separadas ~4 s
# 2) Cronometrar dos toasts consecutivos: ≥4 s entre inicios
# 3) Click en el CTA de contacto: sale "▸ Conversion — objetivo cumplido"
#    y a partir de ahí ningún toast más aunque se siga navegando
# 4) DevTools 500px: no hay toasts
# 5) Emulate prefers-reduced-motion: no hay toasts; el HUD muestra "Última señal"
```

## ⚠ No hacer
- **No tocar los números.** 1/4s, 12, 1,5s y 8px son la spec (`PLAN.md` §11.3). Subirlos
  convierte el concepto en una notificación de app y arruina el tono de lujo.
- No apilar toasts. Uno cada vez, siempre.
- No usar `setTimeout`/`setInterval` para la cola: el reloj es el `tick` del tracker.
- No añadir color de acento, icono, emoji ni sonido.
- No convertirlos en live region (ver arriba).
- No mostrarlos en móvil "porque hay sitio": ahí es donde peor sientan.
