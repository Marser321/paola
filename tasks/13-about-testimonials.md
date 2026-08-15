# Tarea 13 — Sobre mí (reveal + parallax) + Testimonios (sticky apilados)

> ♻ **Archivo reconstruido desde cero** (2026-08-15): el original se perdió sin dejar
> fragmentos. Escrito a partir de `PLAN.md` §7 ("Imagen con hover parallax + CV en mono" /
> "3 sticky cards apiladas") y `DESIGN.md` §4 y §9.

## Objetivo
Cerrar la etapa 04 (Intención): entrada del bloque "Sobre mí" con parallax de hover en el
retrato, y apilado de los 3 testimonios.

## Archivos a crear/editar
- **Crear** `src/js/sections/about.js`
- **Crear** `src/js/sections/testimonials.js`
- **Editar** `src/main.js`

## Spec

### 1. `src/js/sections/about.js` — `initAbout()`
- Reveal de `.about__content > *`: `y: 40, opacity: 0`, `stagger: 0.08`, `once: true`.
- Reveal de `.about__media`: `y: 60, opacity: 0`, `duration: 1.2`, `once: true`.
- **Parallax de hover** sobre `.about__media`: `mousemove` mueve `.about__img` hasta
  ±12px en cada eje con `gsap.quickTo` (`duration: 0.6`); `mouseleave` la devuelve a 0.
  No se monta en dispositivos `(hover: none)`.
- Con reduced-motion: `return` antes de todo.

### 2. `src/js/sections/testimonials.js` — `initTestimonials()`
El apilado es `position: sticky` puro (CSS de la tarea 02, con `top` escalonado a
20/23/26vh). JS solo añade:
- Reveal de entrada por card (`y: 60, opacity: 0`, `once: true`).
- **Retroceso de la card de debajo**: cuando la siguiente entra, la anterior baja a
  `scale: 0.94` con `scrub`. Da profundidad al montón sin ocultar nada.

> **Una propiedad, un dueño.** El scrub anima **solo `scale`**. La primera versión también
> tocaba `opacity`, que ya es del reveal de entrada: con dos tweens sobre la misma
> propiedad el resultado depende del `overwrite` y se comprobó que quedaba en 1 mientras
> la escala sí bajaba. Detectado y corregido en ejecución.

### 3. Editar `src/main.js`
```js
import { initAbout } from './js/sections/about.js'
import { initTestimonials } from './js/sections/testimonials.js'
...
initAbout()
initTestimonials()
```

## Criterios de aceptación
- [ ] El bloque "Sobre mí" entra escalonado y el retrato sigue al ratón con retardo suave.
- [ ] El retrato es sticky y acompaña al texto durante el scroll de la sección.
- [ ] Los 3 testimonios se apilan: al llegar el segundo, el primero queda detrás a
  `scale: 0.94`; al llegar el tercero, el segundo hace lo mismo.
- [ ] El tercer testimonio **no** se reduce (es el último del montón).
- [ ] Con reduced-motion: todo visible y quieto.
- [ ] Sin errores de consola.

## Verificación
```bash
npm run dev
```
```js
// Con los 3 testimonios en pantalla:
[...document.querySelectorAll('.testimonial')].map(t => new DOMMatrix(getComputedStyle(t).transform).a)
// → [0.94, 0.94, 1]
```

## ⚠ No hacer
- No sustituir el sticky del CSS por un pin de ScrollTrigger: tres pins encadenados
  compiten con el pin de la galería y descuadran los offsets.
- No mover el retrato con scroll (parallax vertical): el parallax aquí es de **hover**.
- No dar `opacity` al scrub del apilado (ver nota arriba).
