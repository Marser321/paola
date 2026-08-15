# Tarea 32 — Panel de sesión (HUD)

## Objetivo
El rail lateral que muestra el estado de la campaña en curso. Es la pieza más visible del
concepto y, por eso, la que más contenida tiene que estar: 11px, `--muted`, seis líneas,
sin iconos, sin color de acento. **Describe la campaña, nunca a la persona**
(`PLAN.md` §11.1).

Crea también `src/styles/tracker.css`, la hoja de la UI del concepto. Las tareas 33, 34 y
35 le añaden sus bloques al final, igual que hacen con `sections.css`.

## Archivos a crear/editar
- **Crear** `src/js/ui/hud.js`
- **Crear** `src/styles/tracker.css`
- **Editar** `src/main.js` (import de la hoja + `initHud()`)

## Spec

### 1. `src/js/ui/hud.js` (literal)
```js
// Panel de sesión. Consumidor del bus del tracker: no calcula nada, solo pinta.
// PLAN.md §11.1 — describe la campaña, nunca a la persona.

import { on, snapshot, setHud, isHudEnabled, STAGE_NAMES } from '../core/tracker.js'
import { shouldReduceMotion } from '../core/lenis.js'

const mmDesktop = window.matchMedia('(min-width: 1024px)')
const mmMobile = window.matchMedia('(max-width: 767px)')

function mmss(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function initHud() {
  const footerToggle = document.getElementById('hud-toggle')
  let root = null
  let out = null          // referencias a los nodos de valor
  let cache = {}          // último string escrito por clave — evita tocar el DOM en balde
  let built = false

  // --- Construcción diferida --------------------------------------------------
  // Se construye en el PRIMER SCROLL, no en el arranque: initHud() corre antes del
  // preloader y no puede competir con él (PLAN.md §11.8). El disparador es el propio
  // tick del tracker, así que no hace falta ningún listener de scroll.
  function build() {
    if (built) return
    built = true

    root = document.createElement('aside')
    root.className = 'hud'
    root.setAttribute('aria-label', 'Panel de sesión')

    const reduced = shouldReduceMotion()

    root.innerHTML = `
      <p class="hud__title mono">Sesión en curso</p>
      <dl class="hud__rows mono" aria-hidden="true">
        <div class="hud__row"><dt>Tiempo</dt><dd data-hud="elapsed">00:00</dd></div>
        <div class="hud__row"><dt>Profundidad</dt><dd data-hud="depth">0%</dd></div>
        <div class="hud__depth"><span data-hud="bar"></span></div>
        <div class="hud__row"><dt>Etapa</dt><dd data-hud="stage">Alcance</dd></div>
        <div class="hud__row"><dt>Señales</dt><dd data-hud="signals">1</dd></div>
        <div class="hud__row"><dt>Variante</dt><dd><span data-hud="variant">A</span>
          <button type="button" class="hud__link" data-hud-action="variant">Cambiar</button></dd></div>
        ${reduced ? '<div class="hud__row"><dt>Última señal</dt><dd data-hud="last">—</dd></div>' : ''}
      </dl>
      <button type="button" class="hud__off mono" data-hud-action="off" aria-pressed="true">Desactivar panel</button>
    `

    // Al final del body → último en el orden de tabulación (DESIGN.md §10).
    document.body.appendChild(root)

    out = {
      elapsed: root.querySelector('[data-hud="elapsed"]'),
      depth: root.querySelector('[data-hud="depth"]'),
      bar: root.querySelector('[data-hud="bar"]'),
      stage: root.querySelector('[data-hud="stage"]'),
      signals: root.querySelector('[data-hud="signals"]'),
      variant: root.querySelector('[data-hud="variant"]'),
      last: root.querySelector('[data-hud="last"]'),
    }

    root.querySelector('[data-hud-action="off"]').addEventListener('click', () => {
      setHud(false)
    })

    if (!reduced) {
      requestAnimationFrame(() => root.classList.add('is-in'))
    } else {
      root.classList.add('is-in')
    }
  }

  function destroy() {
    root?.remove()
    root = null
    out = null
    cache = {}
    built = false
  }

  // Escritura con caché: si el string no ha cambiado, no se toca el DOM.
  function write(key, value) {
    if (!out?.[key]) return
    if (cache[key] === value) return
    cache[key] = value
    out[key].textContent = value
  }

  // --- Visibilidad por breakpoint ---------------------------------------------
  // <768px el HUD está oculto por defecto (DESIGN.md §10): ahí compite con la barra
  // del navegador, el banner de consentimiento y el pulgar.
  function shouldShow() {
    return isHudEnabled() && !mmMobile.matches
  }

  function syncFooterToggle() {
    if (!footerToggle) return
    const off = !isHudEnabled()
    const hiddenByViewport = mmMobile.matches && isHudEnabled()
    footerToggle.hidden = !(off || hiddenByViewport)
    footerToggle.textContent = off ? 'Panel desactivado' : 'Reactivar panel de sesión'
  }

  footerToggle?.addEventListener('click', () => {
    if (!isHudEnabled()) setHud(true)
    else build() // caso móvil: existe pero está oculto por viewport
    syncFooterToggle()
  })

  // --- Suscripciones al bus ----------------------------------------------------
  let tickCount = 0

  on('tick', (t) => {
    if (!shouldShow()) return
    if (t.depth > 0) build()
    if (!built) return

    // Con reduced-motion el temporizador baja a 1 Hz; profundidad y etapa siguen
    // a 4 Hz porque son datos, no movimiento (DESIGN.md §10).
    tickCount += 1
    const slowClock = shouldReduceMotion() && tickCount % 4 !== 0
    if (!slowClock) write('elapsed', mmss(t.elapsed))

    const pct = Math.round(t.depth * 100)
    write('depth', `${pct}%`)
    if (out?.bar) out.bar.style.transform = `scaleX(${t.depth.toFixed(3)})`

    write('signals', String(t.signalCount))
  })

  on('stage', ({ to }) => {
    write('stage', STAGE_NAMES[to] || '—')
  })

  on('variant', ({ variant }) => {
    write('variant', variant)
  })

  on('signal', ({ name }) => {
    if (shouldReduceMotion()) write('last', name)
  })

  // Única celebración permitida en el HUD (DESIGN.md §10).
  on('conversion', () => {
    root?.classList.add('is-converted')
  })

  on('hud', ({ enabled }) => {
    if (enabled) {
      const s = snapshot()
      if (s.depth > 0) build()
    } else {
      destroy()
    }
    syncFooterToggle()
  })

  mmMobile.addEventListener('change', () => {
    if (!shouldShow()) destroy()
    syncFooterToggle()
  })

  syncFooterToggle()
}
```

### 2. `src/styles/tracker.css` (literal — bloque del HUD)
```css
/* ============================================================
   TRACKER.CSS — UI del concepto "LA CAMPAÑA ERES TÚ".
   Hoja aparte a propósito: sections.css ya recibe bloques de 9 tareas
   y es el archivo más frágil del proyecto.
   Bloques: HUD (t.32) · Toasts (t.33) · Chrome de anuncio (t.34) · Informe (t.35)
   ============================================================ */

/* ===== HUD (tarea 32) ===== */
.hud {
  position: fixed; right: 1.25rem; top: 50%;
  transform: translateY(-50%);
  z-index: var(--z-hud);
  width: var(--hud-w);
  padding-left: 0.75rem;
  border-left: 1px solid var(--line);
  font-size: var(--fs-hud);
  opacity: 0;
  transition: opacity var(--dur-med) var(--ease-out);
}
.hud.is-in { opacity: 1; }

.hud__title {
  font-size: var(--fs-hud);
  opacity: 0.6;
  margin-bottom: 0.75rem;
}
.hud__row {
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 0.5rem;
  padding-block: 0.2rem;
}
.hud__row dt { color: var(--muted); }
.hud__row dd { color: var(--text); font-variant-numeric: tabular-nums; }

/* Barra de profundidad: --muted, NUNCA gradiente (DESIGN.md §1). */
.hud__depth {
  height: 1px; background: var(--line);
  margin-block: 0.4rem 0.6rem; overflow: hidden;
}
.hud__depth span {
  display: block; height: 100%; width: 100%;
  background: var(--muted);
  transform: scaleX(0); transform-origin: left;
  transition: transform var(--dur-fast) linear;
}

.hud__link, .hud__off {
  font-family: var(--font-mono); font-size: var(--fs-hud);
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--muted);
  border-bottom: 1px solid transparent;
  transition: color var(--dur-fast) var(--ease-out),
              border-color var(--dur-fast) var(--ease-out);
}
.hud__link { margin-left: 0.5rem; }
.hud__link:hover, .hud__off:hover { color: var(--text); border-color: var(--muted); }
.hud__off { margin-top: 1rem; display: block; }

.hud.is-converted .hud__row:nth-of-type(3) dd { color: var(--text); }

/* Tablet: una sola línea BAJO EL HEADER.
   Nunca abajo: ahí colisiona con el banner de consentimiento (tarea 24). */
@media (min-width: 768px) and (max-width: 1023px) {
  .hud {
    top: 4.5rem; right: 4vw; left: 4vw;
    width: auto; transform: none;
    padding-left: 0; padding-top: 0.5rem;
    border-left: 0; border-top: 1px solid var(--line);
  }
  .hud__title, .hud__depth, .hud__off { display: none; }
  .hud__rows { display: flex; flex-wrap: wrap; gap: 1.25rem; }
  .hud__row { padding-block: 0; }
  .hud__row dt::after { content: ':'; }
}

/* Móvil: oculto por defecto. Se reactiva desde el footer. */
@media (max-width: 767px) {
  .hud { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .hud { transition: none; }
  .hud__depth span { transition: none; }
}
```

### 3. Editar `src/main.js`
```js
import './styles/tracker.css'          // tras sections.css
import { initHud } from './js/ui/hud.js'

// ... orden de PLAN.md §4.3:
initTracker()
// initAbTest()  ← tarea 36
initHud()        // 5º
```

## Criterios de aceptación
- [ ] El HUD **no existe en el DOM al cargar**: aparece con el primer scroll, con fade.
- [ ] Muestra las 5 filas con datos correctos: tiempo `mm:ss`, profundidad con su barra,
  etapa, señales y variante.
- [ ] La etapa del HUD **coincide con la sección que hay en pantalla** en todo momento.
- [ ] El HUD **nunca supera las 6 líneas** ni usa el gradiente Meta.
- [ ] `Desactivar panel` destruye el HUD, y el enlace del footer aparece con el texto
  `Panel desactivado`. Al recargar, sigue desactivado (localStorage).
- [ ] Reactivarlo desde el footer lo devuelve, y el botón se vuelve a ocultar.
- [ ] ≥1024px rail lateral · 768–1023px línea única bajo el header · <768px oculto con
  el enlace del footer visible.
- [ ] A 1024px exactos la transición rail→línea no deja el panel a medias.
- [ ] **Accesibilidad:** con VoiceOver, el HUD no anuncia números cambiantes (`aria-hidden`
  en `.hud__rows`); el botón de apagado es alcanzable por tabulación y es el **último**
  elemento del orden de tab.
- [ ] Contraste del texto mono sobre el fondo ≥ 4.5:1 (medido: ~5.9:1).
- [ ] Reduced-motion: sin fade de entrada, sin transición en la barra, temporizador a 1 Hz
  y **fila extra `Última señal`** presente.
- [ ] DevTools → Performance: durante 10 s de scroll continuo, las escrituras de DOM del
  HUD no superan 4/s (el caché evita el resto).

## Verificación
```bash
npm run dev
# 1) Cargar: no hay HUD. Hacer un scroll mínimo: aparece con fade
# 2) Recorrer la página: la etapa va cambiando Alcance → … → Conversión
# 3) Click en "Desactivar panel": desaparece; recargar: sigue sin aparecer
# 4) Click en el enlace del footer: vuelve
# 5) Redimensionar 1440 → 900 → 500: rail → línea → oculto
# 6) DevTools → Rendering → Emulate prefers-reduced-motion: aparece la fila
#    "Última señal" y el reloj avanza de segundo en segundo sin transiciones
# 7) Tab hasta el final de la página: el último foco es "Desactivar panel"
```

## ⚠ No hacer
- **No calcular nada aquí.** El HUD es un consumidor: si necesitas un dato que el bus no
  publica, el sitio correcto es `tracker.js`.
- No usar el gradiente Meta en ninguna parte del HUD (§11.4). Se lo lleva el informe.
- No añadir iconos, emojis ni sonido.
- No mostrar juicios sobre el visitante ("interés alto", "usuario indeciso"): solo
  mecánicas de campaña (§11.1).
- No poner el HUD por encima del header: `--z-hud` (90) está por debajo de `--z-header`
  (100) a propósito.
- No añadir un listener de `scroll` para detectar el primer scroll: se usa el `tick`.
- No pasar de 6 líneas. Si algo no cabe, es que no debe estar.
