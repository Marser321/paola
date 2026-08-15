# Tarea 05 — Cursor custom (dot + ring + píldora de audiencia)

## Objetivo
Cursor personalizado con dos capas (dot inmediato + ring con inercia), estados
según `DESIGN.md` §6, y desactivación total en dispositivos táctiles.

> **Desviación documentada respecto a `DESIGN.md` §6.** El estado de las cards de
> proyecto deja de ser `data-hover="view"` con el texto "VER" y pasa a
> `data-hover="audience"`, que muestra la audiencia real del caso
> (`p.audienceShort`, tarea 03). Es la mecánica del concepto §1: el cursor habla el
> idioma de la profesión. Como "Mujeres 25-44 · ES" no cabe en un círculo de 40px, el
> ring se convierte en **píldora** en ese estado — es la única forma que cambia.

> **Corrección aplicada en ejecución (2026-08-15).** El spec original ponía el centrado
> (`translate: -50% -50%`) y el escalado de hover (`scale: 1` / `.is-hover{scale:1.6}`) en
> CSS. No funciona: al escribir `transform`, GSAP pone inline
> `translate: none; rotate: none; scale: none`, que gana a la hoja de estilos — el ring
> nunca crecía. GSAP pasa a ser el único dueño del transform: centrado con
> `xPercent/yPercent` y escala con un tween. Ojo, `quickTo()` **no** sirve para `scale`
> (es un alias de CSSPlugin y no renderiza); se usa `gsap.to()`, que además es lo apropiado
> para un evento esporádico como el hover.

## Archivos a crear/editar
- **Crear** `src/js/core/cursor.js`
- **Editar** `src/main.js`
- **Editar** `src/styles/sections.css` (añadir bloque al final)

## Spec

### 1. `src/js/core/cursor.js` (literal)
```js
import gsap from 'gsap'
import { shouldReduceMotion } from './lenis.js'

export function initCursor() {
  const isTouch = window.matchMedia('(hover: none)').matches
  if (isTouch || shouldReduceMotion()) return

  // Elementos (creados por JS para mantener el HTML limpio)
  const dot = document.createElement('div')
  dot.className = 'cursor-dot'
  dot.setAttribute('aria-hidden', 'true')
  const ring = document.createElement('div')
  ring.className = 'cursor-ring'
  ring.setAttribute('aria-hidden', 'true')
  ring.innerHTML = '<span class="cursor-ring__label"></span>'
  document.body.append(dot, ring)

  const label = ring.querySelector('.cursor-ring__label')

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' })
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' })
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' })
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' })

  window.addEventListener('mousemove', (e) => {
    dotX(e.clientX)
    dotY(e.clientY)
    ringX(e.clientX)
    ringY(e.clientY)
  })

  // Estados hover — delegación de eventos (un solo listener para todo el sitio).
  // La tarea 31 engancha aquí el conteo de hovers del tracker: coste cero.
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-hover]')
    if (!target) return
    ring.classList.add('is-hover')
    if (target.dataset.hover === 'audience') {
      ring.classList.add('is-audience')
      label.textContent = target.dataset.cursorLabel || ''
    }
  })
  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-hover]')
    if (!target) return
    ring.classList.remove('is-hover', 'is-audience')
    label.textContent = ''
  })

  // Ocultar cursor nativo solo cuando el custom está activo
  document.documentElement.classList.add('has-custom-cursor')
}
```

### 2. Editar `src/main.js` — resultado completo literal
```js
import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'

import { initLenis } from './js/core/lenis.js'
import { initCursor } from './js/core/cursor.js'
import { projects } from './data/projects.js'

initLenis()
initCursor()

console.log(`[paola] ${projects.length} proyectos cargados · lenis + cursor ok`)
```

### 3. Añadir AL FINAL de `src/styles/sections.css`
```css
/* ===== CURSOR CUSTOM (tarea 05) ===== */
.cursor-dot,
.cursor-ring {
  position: fixed; top: 0; left: 0; z-index: var(--z-cursor);
  pointer-events: none; border-radius: 50%;
  translate: -50% -50%; /* centra sobre el puntero; x/y las pone GSAP */
}
.cursor-dot { width: 8px; height: 8px; background: var(--text); }
.cursor-ring {
  width: 40px; height: 40px;
  border: 1px solid var(--muted);
  mix-blend-mode: difference;
  display: flex; align-items: center; justify-content: center;
  transition: scale var(--dur-fast) var(--ease-out),
              background-color var(--dur-fast) var(--ease-out);
  scale: 1;
}
.cursor-ring.is-hover { scale: 1.6; border-color: var(--accent-pink); }

/* Píldora de audiencia: la única variación de FORMA del ring.
   Se escala con scale:1 y crece por padding, no por scale, para que
   el texto no se deforme. */
.cursor-ring.is-audience {
  scale: 1;
  width: auto; height: auto;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: var(--text); border-color: var(--text);
  mix-blend-mode: normal;
  white-space: nowrap;
}
.cursor-ring__label {
  font-family: var(--font-mono); font-size: 10px;
  text-transform: uppercase; letter-spacing: 0.08em; color: var(--bg);
  opacity: 0; transition: opacity var(--dur-fast);
}
.cursor-ring.is-audience .cursor-ring__label { opacity: 1; }
.has-custom-cursor, .has-custom-cursor a, .has-custom-cursor button {
  cursor: none;
}
```

## Criterios de aceptación
- [ ] El cursor nativo desaparece; dot sigue al ratón al instante y el ring con retardo suave.
- [ ] Al pasar sobre enlaces/botones (`data-hover`) el ring escala 1.6 con borde rosa.
- [ ] El estado `is-audience` existe y es una píldora, no un círculo (se probará de verdad
  en la tarea 11, cuando existan las cards).
- [ ] En táctil (DevTools → emulación móvil) no existe cursor custom ni `cursor: none`.
- [ ] Sin errores de consola.

## Verificación
```bash
npm run dev
# 1) Mover el ratón: dot + ring con inercia
# 2) Hover sobre el nav: ring crece y cambia de color
# 3) DevTools → Toggle device toolbar (iPhone) → recargar: cursor nativo
```

Prueba manual del estado píldora sin cards (consola del navegador):
```js
const a = document.querySelector('.site-nav a')
a.dataset.hover = 'audience'; a.dataset.cursorLabel = 'Mujeres 25-44 · ES'
// hover sobre ese enlace: el ring debe ser una píldora con el texto legible
```

## ⚠ No hacer
- No añadir el estado `is-audience` a ninguna card todavía (las cards se crean en la
  tarea 11 con `data-hover="audience"` y `data-cursor-label`).
- No usar librerías de cursor: solo GSAP `quickTo`.
- No importar `tracker.js` aquí: el conteo de hovers lo engancha la tarea 31 sobre este
  mismo handler delegado.
- No tocar el preloader.
