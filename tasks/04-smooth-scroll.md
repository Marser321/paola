# Tarea 04 — Smooth scroll (Lenis) + ScrollTrigger + anchors

> ♻ **Archivo reconstruido** (2026-08-15) tras la pérdida del original. El bloque de Spec
> §1 procede literal del transcript; criterios y verificación se han reescrito a partir de
> `PLAN.md` §9 y del protocolo de `tasks/README.md`.

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
}
```

> `shouldReduceMotion()` se exporta **desde aquí**: es el helper canónico de `DESIGN.md` §9
> y todos los módulos de animación lo importan de este archivo. No duplicarlo.

### 2. `src/main.js` (literal completo)
```js
import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'

import { initLenis } from './js/core/lenis.js'
import { projects } from './data/projects.js'

initLenis()            // 1º — ScrollTrigger depende de esto

console.log(`[paola] ${projects.length} proyectos cargados`)
console.log('[paola] smooth scroll ok')
```

## Criterios de aceptación
- [ ] `npm run dev` sin errores; consola muestra `[paola] smooth scroll ok`.
- [ ] El scroll con rueda es suave (interpolado), no salta.
- [ ] `<html>` recibe la clase `lenis` (Lenis la añade al arrancar; `lenis-smooth` solo
  aparece en las configuraciones con wrapper propio, aquí no).
- [ ] Los 5 anchors del header llevan a su sección con animación de 1,4 s, sin salto nativo
  y sin modificar el hash de la URL.
- [ ] `ScrollTrigger` está registrado: `gsap.core.globals().ScrollTrigger` existe.
- [ ] Con `prefers-reduced-motion: reduce`, `initLenis()` devuelve `null`, no hay clases
  `lenis` en `<html>` y el scroll nativo sigue funcionando.
- [ ] **Cero listeners de `scroll` propios y cero `requestAnimationFrame`/`setInterval`**
  en el código del proyecto (`PLAN.md` §9.8).

## Verificación
```bash
npm run dev
```
En la consola del navegador:
```js
// Lenis activo e integrado
document.documentElement.classList.contains('lenis') && !!gsap.core.globals().ScrollTrigger
// → true
```
Después: emular `prefers-reduced-motion: reduce` en DevTools → Rendering, recargar, y
comprobar que la página sigue scrolleando (sin clases `lenis`).

## ⚠ No hacer
- No añadir reveals ni ScrollTriggers de sección todavía (van en sus tareas).
- No importar `lenis/dist/lenis.css`: las reglas necesarias ya están en `base.css` (tarea 01).
- No crear un `requestAnimationFrame` propio para Lenis: se cuelga de `gsap.ticker`.
- No duplicar `shouldReduceMotion()` en otros módulos: se importa de aquí.
