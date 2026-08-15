# Tarea 14 — Contacto (CTA magnético + reloj) + Footer

## Objetivo
El gran cierre: CTA "¿ESCALAMOS?" con efecto magnético, reloj local en mono,
y back-to-top con Lenis. El marquee del footer ya funciona desde la tarea 09.

Además, dos cosas del concepto §1:

- **El CTA es la conversión.** Su click emite la señal `Conversion`, que cierra la
  narrativa: el informe pasa a `Objetivo cumplido`, los toasts se apagan y la
  probabilidad sube en vivo. El visitante recorrió el embudo entero y convirtió.
- **`main.js` queda en su estructura final**, con las seis inicializaciones de la fase E
  en las posiciones exactas de `PLAN.md` §4.3.

## Archivos a crear/editar
- **Crear** `src/js/sections/contact.js`
- **Editar** `src/main.js`

## Spec

### 1. `src/js/sections/contact.js` (literal)
```js
import gsap from 'gsap'
import { shouldReduceMotion } from '../core/lenis.js'
import { getLenis } from '../core/lenis.js'
import { on, emit } from '../core/tracker.js'

export function initContact() {
  // --- Reloj local ---
  // Se cuelga del tick del tracker (4 Hz) en vez de un setInterval: PLAN.md §9.8
  // fija un único reloj para todo el sitio. Solo escribe cuando el string cambia.
  const timeEl = document.getElementById('local-time')
  if (timeEl) {
    let last = ''
    const paint = () => {
      const now = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      if (now === last) return
      last = now
      timeEl.textContent = now
    }
    paint()
    on('tick', paint)
  }

  // --- Conversión ---
  // El click en el CTA cierra el embudo. Se emite ANTES de que el mailto: se
  // lleve el foco de la pestaña.
  document.querySelector('[data-magnetic]')?.addEventListener('click', () => {
    emit('Conversion', { source: 'cta' })
  })

  // --- Back to top ---
  const backToTop = document.getElementById('back-to-top')
  backToTop?.addEventListener('click', () => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { duration: 1.6 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  // --- Reveal de la sección ---
  if (!shouldReduceMotion()) {
    gsap.from('.contact__pre, .contact__cta, .contact__email, .contact__time', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '#contacto', start: 'top 70%', once: true },
    })
  }

  // --- CTA magnético ---
  const cta = document.querySelector('[data-magnetic]')
  if (
    !cta ||
    shouldReduceMotion() ||
    window.matchMedia('(hover: none)').matches
  ) {
    return
  }

  const STRENGTH = 0.35
  const RADIUS = 120 // px alrededor del elemento

  const xTo = gsap.quickTo(cta, 'x', { duration: 0.4, ease: 'power2.out' })
  const yTo = gsap.quickTo(cta, 'y', { duration: 0.4, ease: 'power2.out' })

  window.addEventListener('mousemove', (e) => {
    const r = cta.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)

    if (dist < RADIUS + Math.max(r.width, r.height) / 2) {
      xTo(dx * STRENGTH)
      yTo(dy * STRENGTH)
    } else {
      xTo(0)
      yTo(0)
    }
  })
}
```

### 2. Editar `src/main.js` — resultado completo literal (ESTRUCTURA FINAL)

> Las tres restricciones de orden de `PLAN.md` §4.3 están marcadas en los comentarios.
> Romperlas produce fallos **silenciosos**: nada peta, simplemente el tracker no observa
> nada, o se ve el texto cambiar, o los offsets quedan mal medidos.

```js
import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'
import './styles/tracker.css'

import { initLenis } from './js/core/lenis.js'
import { initTracker } from './js/core/tracker.js'
import { initAbTest } from './js/core/ab-test.js'
import { initHud } from './js/ui/hud.js'
import { initSignals } from './js/ui/signals.js'
import { initCursor } from './js/core/cursor.js'
import { initPreloader } from './js/core/preloader.js'
import { initHero } from './js/sections/hero.js'
import { initHeroScene } from './js/webgl/hero-scene.js'
import { initMarquee } from './js/sections/marquee.js'
import { initMetrics } from './js/sections/metrics.js'
import { renderProjects, initProjects } from './js/sections/projects.js'
import { initServices } from './js/sections/services.js'
import { initProcess } from './js/sections/process.js'
import { initAbout } from './js/sections/about.js'
import { initTestimonials } from './js/sections/testimonials.js'
import { initReport } from './js/sections/report.js'
import { initContact } from './js/sections/contact.js'
import { projects } from './data/projects.js'

initLenis()        // 1º — ScrollTrigger depende de esto
renderProjects()   // 2º — el DOM de las cards debe existir antes de medir
initTracker()      // 3º — (a) necesita las .project-card ya renderizadas
initAbTest()       // 4º — (b) ANTES de initHero(), o se ve cambiar el texto
initHud()
initSignals()
initCursor()
initPreloader()
initHero()
initHeroScene()
initMarquee()
initMetrics()
initProjects()
initServices()
initProcess()
initAbout()
initTestimonials()
initReport()       // (c) ANTES de initContact(): reserva su altura antes de medir
initContact()

console.log(`[paola] ${projects.length} proyectos cargados · todas las secciones ok`)
```

## Criterios de aceptación
- [ ] Al acercar el ratón al CTA (radio 120px + mitad del elemento), el texto
  gigante se desplaza hacia el cursor con factor 0.35 y vuelve suavemente al salir.
- [ ] El reloj muestra la hora local `HH:MM:SS` actualizándose cada segundo.
- [ ] "Volver arriba ↑" hace scroll suave al inicio (Lenis si está activo).
- [ ] Reveal de la sección contacto en cascada.
- [ ] Reduced-motion / táctil: sin magnetismo, reveals off, resto funcional.
- [ ] El CTA es un `<a href="mailto:...">`: sigue siendo clicable con el magnetismo.
- [ ] **Click en el CTA → señal `Conversion`**: sale su toast, el informe pasa a
  `Objetivo cumplido`, la probabilidad sube y **no vuelve a aparecer ningún toast**.
- [ ] La conversión se emite **una sola vez** aunque se pulse el CTA varias veces.
- [ ] El reloj avanza segundo a segundo sin `setInterval` (colgado del `tick`).
- [ ] `main.js` contiene las 20 inicializaciones en el orden exacto, y las tres
  restricciones (a), (b) y (c) se cumplen.

## Verificación
```bash
npm run dev
# 1) Scroll a #contacto: cascada de entrada
# 2) Acercar el ratón alrededor de "¿ESCALAMOS?": atracción magnética visible
# 3) Reloj corriendo; back-to-top funciona
# 4) Click en el CTA → toast "▸ Conversion — objetivo cumplido"
# 5) Volver a subir al informe: "Objetivo cumplido" y probabilidad más alta
# 6) Console limpia
```

Comprobación del orden (consola, tras cargar):
```js
// El tracker tiene cards observadas → initTracker() corrió tras renderProjects()
document.querySelectorAll('.project-card[data-id]').length === 6
```

## ⚠ No hacer
- No añadir formulario de contacto en v1: el CTA es `mailto:`.
- No aplicar magnetismo a otros elementos: solo `[data-magnetic]`.
- No crear un segundo `requestAnimationFrame` ni usar `setInterval`: `quickTo`, listeners
  y el `tick` del tracker bastan (`PLAN.md` §9.8).
- No emitir `Conversion` desde ningún otro sitio en v1. El formulario de la tarea 24 la
  emitirá también, vía `form:success`, y el dedupe del tracker garantiza que solo cuente
  una vez.
- No cambiar el orden de `main.js` "porque parece más lógico": las tres restricciones
  fallan en silencio.
