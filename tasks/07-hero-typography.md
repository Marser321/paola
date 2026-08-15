# Tarea 07 — Hero: split de letras + animación de entrada

> ♻ **Archivo reconstruido** (2026-08-15) tras la pérdida del original. Objetivo, notas de
> orden y el arranque de `splitTitle()` proceden literales del transcript; el resto de la
> Spec se ha reescrito siguiendo las duraciones canónicas de `DESIGN.md` §4.

## Objetivo
Dividir el título "PAOLA" en caracteres animables y ejecutar la entrada cinematográfica
del hero cuando el preloader dispara `app:ready`.

> **Restricción de orden con el test A/B (tarea 36).** `initAbTest()` corre **antes** que
> `initHero()` en `main.js` (`PLAN.md` §4.3, restricción b): esta tarea anima el subtítulo
> desde el estado que encuentre en el DOM, así que la variante debe estar ya escrita o se
> vería el cambio de texto durante el reveal.
>
> **El `h1` "PAOLA" no entra en el test A/B.** La marca es marca: solo varía el subtítulo
> (`[data-variant-slot="subtitle"]`). El split de letras nunca toca contenido variable.

> **Guard de `app:ready` (añadido en ejecución).** `initPreloader()` corre **antes** que
> `initHero()`, y en reduced-motion despacha `app:ready` de forma **síncrona** dentro de esa
> llamada: cuando `initHero()` se suscribe, el evento ya pasó. Por eso `initHero()` arranca
> de inmediato si `#preloader` ya no está en el DOM. Sin este guard, el hero se quedaría
> con el estado inicial de la animación — invisible — en reduced-motion.

## Archivos a crear/editar
- **Crear** `src/js/sections/hero.js`
- **Editar** `src/main.js`
- **Editar** `src/styles/sections.css` (añadir reglas al final)

## Spec

### 1. `src/js/sections/hero.js` (literal)
```js
import gsap from 'gsap'
import { shouldReduceMotion } from '../core/lenis.js'

function splitTitle() {
  const title = document.querySelector('.hero__title')
  if (!title || title.dataset.split) return
  const text = title.textContent
  title.textContent = ''
  // aria-label="Paola" ya existe en el HTML (tarea 02) → accesibilidad OK
  ;[...text].forEach((char) => {
    const span = document.createElement('span')
    span.className = 'char'
    span.textContent = char
    span.setAttribute('aria-hidden', 'true')
    title.appendChild(span)
  })
  title.dataset.split = 'true'
}

function enter() {
  const chars = document.querySelectorAll('.hero__title .char')
  const label = document.querySelector('.hero__label')
  const subtitle = document.querySelector('.hero__subtitle')
  const meta = document.querySelector('.hero__meta')
  const scroll = document.querySelector('.hero__scroll')

  if (shouldReduceMotion()) {
    // Sin movimiento: nada que revelar, el HTML ya es visible por defecto.
    return
  }

  gsap.timeline()
    .from(label, { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' })
    .from(chars, {
      yPercent: 110,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.04,
    }, '-=0.5')
    .from([subtitle, meta], {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.1,
    }, '-=0.8')
    .from(scroll, { opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
}

export function initHero() {
  splitTitle()
  // initPreloader() corre ANTES que initHero() y en reduced-motion despacha
  // 'app:ready' de forma síncrona: si el preloader ya no está, el evento ya pasó.
  if (!document.getElementById('preloader')) {
    enter()
    return
  }
  window.addEventListener('app:ready', enter, { once: true })
}
```

> Se usa `.from()` a propósito: el estado final es el del HTML, así que **si el JS falla el
> hero se ve igualmente**. Nunca dejar `opacity: 0` en CSS (`PLAN.md` §9, tarea 02).

### 2. Añadir AL FINAL de `src/styles/sections.css`
```css
/* ===== HERO — split de letras (tarea 07) ===== */
.hero__title { overflow: clip; } /* máscara del yPercent:110 de cada .char */
```

### 3. Editar `src/main.js` — resultado completo literal
```js
import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'

import { initLenis } from './js/core/lenis.js'
import { initCursor } from './js/core/cursor.js'
import { initPreloader } from './js/core/preloader.js'
import { initHero } from './js/sections/hero.js'
import { projects } from './data/projects.js'

initLenis()
initCursor()
initPreloader()
initHero()

console.log(`[paola] ${projects.length} proyectos cargados · hero ok`)
```

## Criterios de aceptación
- [ ] El `h1` contiene 5 `<span class="char">` (P·A·O·L·A), todos `aria-hidden="true"`,
  y el `aria-label="Paola"` sigue en el `h1`.
- [ ] Tras la cortina del preloader: las letras suben desde abajo con stagger 0,04 s,
  y label / subtítulo / meta / scroll entran escalonados.
- [ ] Ninguna letra se ve fuera del bloque del título durante la animación (máscara).
- [ ] Con reduced-motion: el hero se ve completo y legible desde el primer frame.
- [ ] `splitTitle()` es idempotente: llamarla dos veces no duplica los spans.
- [ ] Sin errores de consola.

## Verificación
```bash
npm run dev
```
En la consola del navegador:
```js
const chars = document.querySelectorAll('.hero__title .char')
chars.length === 5 && document.querySelector('.hero__title').getAttribute('aria-label') === 'Paola'
// → true
```

## ⚠ No hacer
- No tocar el subtítulo más allá de animarlo: su texto lo fija la tarea 36.
- No usar SplitText (plugin de pago) ni ninguna librería nueva.
- No dejar estados iniciales en CSS: se usa `.from()` para que el HTML sea el estado final.
- No inicializar WebGL aquí (tarea 08).
