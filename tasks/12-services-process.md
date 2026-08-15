# Tarea 12 — Servicios (reveals) + Proceso (timeline con scrub)

> ♻ **Archivo reconstruido desde cero** (2026-08-15): el original se perdió sin dejar
> fragmentos. Escrito a partir de `PLAN.md` §7 ("Header sticky + reveals escalonados" /
> "Línea vertical dibujada con scrub + 6 pasos") y `DESIGN.md` §4 y §9.

## Objetivo
Dar movimiento a las dos secciones de la etapa 03 sin inventar layout: el markup y el
sticky del header ya están en `sections.css` (tarea 02).

## Archivos a crear/editar
- **Crear** `src/js/sections/services.js`
- **Crear** `src/js/sections/process.js`
- **Editar** `src/main.js`

## Spec

### 1. `src/js/sections/services.js` — `initServices()`
Reveal escalonado de los 5 `.service`: `y: 60, opacity: 0 → visible`, `duration: 1`,
`ease: 'power3.out'`, `stagger: 0.12`, trigger en `.services__list` a `top 80%`,
`once: true`. Con reduced-motion: `return` (el HTML ya es el estado final).

### 2. `src/js/sections/process.js` — `initProcess()`

| Elemento | Comportamiento |
|---|---|
| `.process__line` | `scaleY: 0 → 1` con **`scrub: true`** y **`ease: 'none'`** (`DESIGN.md` §4, regla de oro), de `top 75%` a `bottom 75%` del `.process__timeline` |
| `.step` (6) | Reveal `y: 40, opacity: 0`, `duration: 0.9`, `stagger: 0.1`, `once: true` |
| Reduced motion | `gsap.set(line, { scaleY: 1 })` — la línea **se pinta entera**: marca el recorrido, es información, no decoración. Los pasos ya son visibles |

### 3. Editar `src/main.js`
```js
import { initServices } from './js/sections/services.js'
import { initProcess } from './js/sections/process.js'
...
initServices()
initProcess()
```

## Criterios de aceptación
- [ ] Al entrar en Servicios, los 5 items aparecen escalonados y el header queda sticky.
- [ ] La línea del Proceso se dibuja de arriba abajo **ligada al scroll** (va y viene si
  se scrollea hacia atrás) y llega a completarse al final de la sección.
- [ ] Los 6 pasos entran una sola vez.
- [ ] Con reduced-motion: todo visible y la línea del proceso **pintada al 100%**.
- [ ] Sin errores de consola.

## Verificación
```bash
npm run dev
```
```js
// Con la sección de proceso pasada, la línea debe estar completa:
new DOMMatrix(getComputedStyle(document.querySelector('.process__line')).transform).m22
// → ~1
```

## ⚠ No hacer
- No animar la línea con `once: true`: su gracia es el scrub.
- No usar `ease` distinto de `'none'` en nada scrubbeado.
- No tocar el `position: sticky` del header de servicios: es CSS de la tarea 02.
- No aplicar el efecto scramble a los títulos aquí: es la tarea 21, que además
  documenta que ajusta esta tarea.
