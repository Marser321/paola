# Tarea 06 — Preloader (contador + cortina + evento `app:ready`)

## Objetivo
Animar el preloader existente: contador 0→100%, barra con gradiente, salida con
cortina, y al terminar disparar `window` event `app:ready` (la entrada del hero,
tarea 07, lo escucha).

> **Re-encuadre del concepto §1.** Mismo timeline, misma cortina, mismo evento: lo único
> que cambia respecto a un preloader genérico es el **texto**. El contador no está
> "cargando una experiencia", está lanzando una campaña, y la cortina no revela una
> página: entrega la impresión. Coste técnico cero, identidad ganada.

## Archivos a crear/editar
- **Crear** `src/js/core/preloader.js`
- **Editar** `src/main.js`

## Spec

### 1. `src/js/core/preloader.js` (literal)
```js
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from './lenis.js'

export function initPreloader() {
  const preloader = document.getElementById('preloader')
  if (!preloader) return

  const counter = preloader.querySelector('.preloader__counter')
  const barFill = preloader.querySelector('.preloader__bar-fill')
  const status = preloader.querySelector('.preloader__status')

  const finish = () => {
    preloader.remove()
    window.dispatchEvent(new CustomEvent('app:ready'))
    ScrollTrigger.refresh()
  }

  if (shouldReduceMotion()) {
    finish()
    return
  }

  const progress = { value: 0 }

  const tl = gsap.timeline()
  tl.to(progress, {
    value: 100,
    duration: 1.8,
    ease: 'power2.inOut',
    onUpdate: () => {
      counter.textContent = `${Math.round(progress.value)}%`
      barFill.style.transform = `scaleX(${progress.value / 100})`
    },
  })
    // Al 100%, la campaña pasa a entregar (CONTENT.md §1)
    .call(() => {
      if (status) status.textContent = 'Entregando impresión'
    })
    // Cortina: el preloader sube y revela la página
    .to(preloader, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
    })
    .add(finish)
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
import { projects } from './data/projects.js'

initLenis()
initCursor()
initPreloader()

console.log(`[paola] ${projects.length} proyectos cargados · core ok`)
```

## Criterios de aceptación
- [ ] Al cargar: contador 0%→100% en ~1.8s, barra gradiente sincronizada.
- [ ] El texto de estado empieza en `PAOLA_2026 · Objetivo: conversión` y cambia a
  `Entregando impresión` justo antes de la cortina.
- [ ] Cortina sube con `power4.inOut` y el nodo `#preloader` se elimina del DOM
  (inspeccionar: ya no existe).
- [ ] Tras la cortina, en consola: `window.addEventListener('app:ready', …)` se puede
  comprobar con `monitorEvents(window, 'app:ready')` al recargar.
- [ ] Con reduced-motion: no hay preloader visible en ningún momento.
- [ ] `ScrollTrigger.refresh()` se llama tras el preloader (no rompe nada aunque aún
  no haya triggers).

## Verificación
```bash
npm run dev
# 1) Recarga con cache deshabilitado (Network → Disable cache): secuencia completa
# 2) DevTools → Elements: tras ~3s, #preloader ya no está en el DOM
# 3) Reduced-motion emulado → la página aparece directamente
```

## ⚠ No hacer
- No animar el hero aquí: la tarea 07 escucha `app:ready`.
- **No emitir la señal `PageView` aquí.** La emite `initTracker()` (tarea 31), que corre
  antes que el preloader. El preloader no sabe que el tracker existe.
- No usar librerías de preload de assets: no hay assets que cargar en v1.
- No bloquear el scroll manualmente: el preloader dura <3s y el contenido está detrás.
