# Tarea 10 — Métricas: contadores con overshoot + sparklines

## Objetivo
Los 4 KPIs cuentan de 0 a su valor al entrar en viewport (una sola vez), con formato según
`data-decimals`, `data-prefix` y `data-suffix` (valores en `CONTENT.md` §6). Cada métrica
dibuja además una **sparkline de 1px** con su serie histórica (`data-spark`).

Dos detalles del concepto §1, ambos con la misma intención: que los números se lean como
**una métrica en vivo**, no como un contador de plantilla.

- **Overshoot.** El número pasa ligeramente de su objetivo y se estabiliza, igual que un
  dato que se está consolidando. Es la diferencia entre "count-up" y "telemetría".
- **Sparkline.** El KPI deja de ser una cifra suelta y pasa a tener historia. El último
  punto de la serie coincide siempre con `data-count`.

## Archivos a crear/editar
- **Crear** `src/js/sections/metrics.js`
- **Editar** `src/main.js`

## Spec

### 1. `src/js/sections/metrics.js` (literal)
```js
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'

function format(el, value) {
  const decimals = Number(el.dataset.decimals || 0)
  const prefix = el.dataset.prefix || ''
  const suffix = el.dataset.suffix || ''
  return `${prefix}${value.toFixed(decimals)}${suffix}`
}

// Inyecta el <svg> de la sparkline y devuelve su <path> (o null).
// Sin librerías: es una polilínea normalizada al alto del contenedor.
function buildSparkline(el) {
  const points = (el.dataset.spark || '')
    .split(',')
    .map(Number)
    .filter((n) => !Number.isNaN(n))
  if (points.length < 2) return null

  const W = 100
  const H = 24
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1

  const d = points
    .map((value, i) => {
      const x = (i / (points.length - 1)) * W
      const y = H - 1 - ((value - min) / span) * (H - 2)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')

  // preserveAspectRatio="none" estira en X; non-scaling-stroke mantiene el trazo en 1px.
  el.innerHTML =
    `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" width="100%" height="${H}" fill="none">` +
    `<path d="${d}" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/>` +
    `</svg>`

  return el.querySelector('path')
}

export function initMetrics() {
  const values = document.querySelectorAll('.metric__value[data-count]')
  if (!values.length) return

  const reduced = shouldReduceMotion()

  values.forEach((el) => {
    const target = Number(el.dataset.count)
    const metric = el.closest('.metric')
    const sparkEl = metric?.querySelector('.metric__spark')
    const path = sparkEl ? buildSparkline(sparkEl) : null

    if (reduced) {
      el.textContent = format(el, target)
      return // la sparkline queda dibujada y estática
    }

    // Trazo oculto hasta que entre en viewport
    let length = 0
    if (path) {
      length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
    }

    const state = { value: 0 }
    const tl = gsap.timeline({
      scrollTrigger: { trigger: metric || el, start: 'top 85%', once: true },
    })

    // back.out overshoot: el número se pasa y se asienta. 1.1 es deliberadamente
    // contenido — por encima de ~1.4 se lee como rebote de juguete, no como dato.
    tl.to(state, {
      value: target,
      duration: 2,
      ease: 'back.out(1.1)',
      onUpdate: () => {
        el.textContent = format(el, state.value)
      },
      onComplete: () => {
        el.textContent = format(el, target) // cierre exacto, sin residuo del easing
      },
    })

    if (path) {
      tl.to(path, { strokeDashoffset: 0, duration: 2, ease: 'power2.out' }, 0)
    }
  })

  // Reveal suave de las tarjetas de métrica
  if (!reduced) {
    gsap.from('.metric', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.metrics__grid',
        start: 'top 80%',
        once: true,
      },
    })
  }
}
```

### 2. Editar `src/main.js` — resultado completo literal
```js
import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'

import { initLenis } from './js/core/lenis.js'
import { initCursor } from './js/core/cursor.js'
import { initPreloader } from './js/core/preloader.js'
import { initHero } from './js/sections/hero.js'
import { initHeroScene } from './js/webgl/hero-scene.js'
import { initMarquee } from './js/sections/marquee.js'
import { initMetrics } from './js/sections/metrics.js'
import { projects } from './data/projects.js'

initLenis()
initCursor()
initPreloader()
initHero()
initHeroScene()
initMarquee()
initMetrics()

console.log(`[paola] ${projects.length} proyectos cargados · + metrics ok`)
```

## Criterios de aceptación
- [ ] Al hacer scroll hasta la sección: cada número cuenta 0 → objetivo en 2s
  (`4.2x` con un decimal; `+2M€`, `98%`, `120+` enteros con afijos).
- [ ] **El número se pasa ligeramente del objetivo y vuelve** — visible pero discreto —
  y **termina exactamente en el valor final** (sin `4.19x` ni `4.21x` residuales).
- [ ] Las 4 sparklines se dibujan de izquierda a derecha en 2s, con trazo de **1px real**
  a cualquier ancho de columna (`vector-effect` funcionando).
- [ ] El último punto de cada sparkline está a la altura máxima de su serie y coincide
  visualmente con el KPI (las 4 series son crecientes).
- [ ] Ocurre UNA sola vez (subir y bajar no reinicia contadores ni trazos).
- [ ] Las 4 métricas entran con reveal escalonado (y+opacity, stagger 0.1).
- [ ] Reduced-motion: valores finales directos y **sparklines dibujadas pero estáticas**
  (no desaparecen: son datos, no decoración).
- [ ] Los números no "saltan" de ancho durante el conteo (`font-variant-numeric:
  tabular-nums` ya está en el CSS de la tarea 02).

## Verificación
```bash
npm run dev
# 1) Scroll hasta "Etapa 01 · Alcance — Resultados": contadores animan con overshoot
#    y terminan en 4.2x / +2M€ / 98% / 120+
# 2) Las 4 sparklines se trazan a la vez que los números
# 3) Subir y bajar: no se repiten
# 4) DevTools → Rendering → Emulate prefers-reduced-motion: valores finales,
#    sparklines visibles y estáticas
# 5) Estrechar la ventana: el trazo sigue siendo de 1px, no engorda
```

## ⚠ No hacer
- No usar IntersectionObserver propio: ScrollTrigger con `once: true` basta.
- No cambiar los textos/valores: vienen de `CONTENT.md` §6 vía atributos `data-*`
  ya presentes en el HTML.
- No colorear la sparkline con el gradiente: va en `--muted` vía `currentColor`
  (`DESIGN.md` §1 — el gradiente de este viewport ya se lo lleva otro elemento).
- No subir el overshoot por encima de `back.out(1.4)`: deja de leerse como dato.
- No animar la sparkline con scrub: entra una vez, como el contador.
