### READ lines 1-60 of 98
# Tarea 04 — Smooth scroll (Lenis) + ScrollTrigger + anchors

## Objetivo
Scroll suave global con Lenis integrado en el ticker de GSAP, registro de
ScrollTrigger y navegación por anchors (`data-scroll`) usando Lenis.

## Archivos a crear/editar
- **Crear** `src/js/core/lenis.js`
- **Editar** `src/main.js`

## Spec

### 1. `src/js/core/lenis.js` (literal)
```js
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const shouldReduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

export function initLenis() {
  if (shouldReduceMotion()) {
    // Sin smooth scroll: ScrollTrigger funciona con el scroll nativo.
    return null
  }

  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  // Anchors con lenis
  document.querySelectorAll('[data-scroll]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href')
      if (!hash || !hash.startsWith('#')) return
      const target = document.querySelector(hash)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target, { offset: 0, duration: 1.4 })
    })
  })

  return lenis
}

export function getLenis() {
  return lenis

### EDIT
--- old ---
## Objetivo
Scroll suave global con Lenis integrado en el ticker de GSAP, registro de
ScrollTrigger y navegación por anchors (`data-scroll`) usando Lenis.
--- new ---
## Objetivo
Scroll suave global con Lenis integrado en el ticker de GSAP, registro de
ScrollTrigger y navegación por anchors (`data-scroll`) usando Lenis.

> **Esta tarea establece el único RAF del sitio** (`PLAN.md` §9.8). Todo lo que necesite
> un bucle por frame se cuelga de `gsap.ticker`: nada de `requestAnimationFrame` propio,
> nada de `setInterval`, ningún listener de `scroll`.
>
> Detalle crítico para el tracker (tarea 31): **`gsap.ticker` sigue corriendo aunque
> `initLenis()` salga antes devolviendo `null`** por reduced-motion. Por eso el tracker se
> cuelga del ticker y no de Lenis — y lee la posición con `getLenis()?.scroll ??
> window.scrollY`, que cubre las dos ramas sin duplicar código.