# Tarea 36 — Test A/B del hero

## Objetivo
Servir una de dos variantes del subtítulo del hero al azar, mostrarla en el HUD, permitir
conmutarla con un click y reportarla en el informe.

Es el detalle más barato del concepto y uno de los que mejor funcionan: **es literalmente
su trabajo**. Un visitante que entiende de paid social ve `VARIANTE B` en el panel, pulsa
`Cambiar`, y capta la broma entera en dos segundos. Cuesta unas 40 líneas.

## Archivos a crear/editar
- **Crear** `src/js/core/ab-test.js`
- **Editar** `src/main.js`

## Spec

### 1. `src/js/core/ab-test.js` (literal)
```js
// Test A/B del subtítulo del hero (CONTENT.md §3.1).
// El h1 "PAOLA" NO entra en el test: la marca es marca.

import gsap from 'gsap'
import { setVariant } from './tracker.js'
import { shouldReduceMotion } from './lenis.js'

// Los textos salen de CONTENT.md §3.1. La parte acentuada lleva .accent-text.
const VARIANTS = {
  A: 'Convierto presupuesto publicitario en <span class="accent-text">crecimiento medible</span>.',
  B: 'Cada euro invertido tiene que <span class="accent-text">volver acompañado</span>.',
}

function readAssigned() {
  try {
    const stored = sessionStorage.getItem('paola-variant')
    return stored === 'A' || stored === 'B' ? stored : null
  } catch {
    return null
  }
}

function storeAssigned(variant) {
  try {
    sessionStorage.setItem('paola-variant', variant)
  } catch {
    /* sin storage: la variante vive solo en memoria */
  }
}

let current = 'A'
let slot = null

function paint(variant, { animate }) {
  if (!slot) return
  if (!animate) {
    slot.innerHTML = VARIANTS[variant]
    return
  }
  gsap
    .timeline()
    .to(slot, { opacity: 0, duration: 0.2, ease: 'power2.in' })
    .call(() => {
      slot.innerHTML = VARIANTS[variant]
    })
    .to(slot, { opacity: 1, duration: 0.3, ease: 'power2.out' })
}

export function initAbTest() {
  slot = document.querySelector('[data-variant-slot="subtitle"]')
  if (!slot) return

  // Asignación estable dentro de la sesión: recargar no cambia de variante,
  // que es como funciona un test de verdad.
  current = readAssigned() || (Math.random() < 0.5 ? 'A' : 'B')
  storeAssigned(current)

  // Escritura INSTANTÁNEA: initHero() (tarea 07) anima el subtítulo justo después
  // desde el estado del DOM. Animar aquí haría visible el cambio de texto.
  paint(current, { animate: false })
  setVariant(current, { forced: false })

  // Listener delegado: el botón del HUD se construye más tarde (primer scroll),
  // así que no se puede referenciar directamente.
  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-hud-action="variant"]')) return
    current = current === 'A' ? 'B' : 'A'
    storeAssigned(current)
    paint(current, { animate: !shouldReduceMotion() })
    setVariant(current, { forced: true })
  })
}
```

### 2. Editar `src/main.js` — orden de `PLAN.md` §4.3, restricción (b)
```js
import { initAbTest } from './js/core/ab-test.js'

initTracker()
initAbTest()   // 4º — ANTES de initHero(), o se vería el cambio de texto
initHud()
```

## Criterios de aceptación
- [ ] Al recargar varias veces, el hero muestra a veces la variante A y a veces la B
  (en ~20 recargas con la sesión limpia deben salir las dos).
- [ ] **Dentro de una misma sesión, recargar no cambia la variante** (sessionStorage).
  Abrir una pestaña nueva sí puede servir otra.
- [ ] El HUD muestra la variante servida y el botón `Cambiar` la conmuta con un fundido.
- [ ] Tras conmutarla, el informe muestra `B · cambiada manualmente`.
- [ ] **Nunca se ve el texto cambiar durante la entrada del hero**: la primera escritura
  es instantánea y ocurre antes de `initHero()`.
- [ ] Ambas variantes caben sin desbordar a 1440px (dos líneas) y a 360px (tres líneas),
  gracias al `min-height` de `.hero__subtitle` (tarea 02).
- [ ] El `h1` "PAOLA" es idéntico en las dos variantes.
- [ ] Con storage bloqueado (Safari privado) no hay excepciones: se asigna en memoria.
- [ ] Reduced-motion: la conmutación es instantánea, sin fundido.

## Verificación
```bash
npm run dev
# 1) Recargar 10 veces con sessionStorage limpio (DevTools → Application → Session
#    Storage → borrar): deben aparecer las dos variantes
# 2) Recargar sin borrar: siempre la misma
# 3) Scroll mínimo para que aparezca el HUD → click en "Cambiar": el subtítulo
#    hace fundido y cambia; el HUD muestra la otra letra
# 4) Bajar al informe: "Variante servida: B · cambiada manualmente"
# 5) DevTools 360px: la variante más larga no desborda
```

## ⚠ No hacer
- **No meter el `h1` en el test.** La marca no se testea.
- No animar la primera escritura: rompería la entrada del hero (restricción b).
- No usar `localStorage` para la asignación: el test es por sesión, y persistir entre
  visitas sería reconocer al visitante — eso es la tarea 37 y requiere opt-in
  (`PLAN.md` §11.2).
- No añadir una tercera variante ni un test multivariante: dos opciones, una decisión.
- No inventar textos: las dos variantes están en `CONTENT.md` §3.1.
