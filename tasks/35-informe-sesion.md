# Tarea 35 — Informe de sesión ⭐⭐

## Objetivo
El clímax del concepto. Al llegar a `#informe`, el panel **compila delante del visitante**
y le devuelve los datos reales de su propia visita: tiempo, profundidad, señales, etapa
alcanzada, creatividades vistas, cuál miró más, qué variante se le sirvió, y una
probabilidad de conversión declarada como heurística.

Y debajo, la frase que sostiene todo el proyecto: **nada de esto ha salido de su
navegador**.

Es el momento que hace que el sitio se comparta. También es donde el concepto puede
volverse humo si se hace mal, así que dos reglas antes de escribir una línea:

- **La heurística se declara, no se disfraza** (`PLAN.md` §11.5). Etiqueta permanente,
  fórmula visible a un click, tope 99. La clienta dice literalmente "sin humo"
  (`CONTENT.md` §10): un porcentaje sin fórmula sería exactamente eso.
- **Este panel es la superficie accesible del concepto.** El HUD no anuncia y los toasts
  no anuncian, precisamente para que este sí lo haga: una vez, bien.

## Archivos a crear/editar
- **Crear** `src/js/sections/report.js`
- **Editar** `src/styles/tracker.css` (añadir bloque al final)
- **Editar** `src/main.js`

## Spec

### 1. `src/js/sections/report.js` (literal)
```js
// Informe de sesión — el clímax del concepto (PLAN.md §1, CONTENT.md §14).
// Consumidor del bus: no calcula nada, solo hidrata.

import gsap from 'gsap'
import { on, snapshot, isHudEnabled } from '../core/tracker.js'
import { shouldReduceMotion } from '../core/lenis.js'
import { projects } from '../../data/projects.js'

function mmss(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function titleOf(slug) {
  return projects.find((p) => p.id === slug)?.title || slug
}

export function initReport() {
  const section = document.getElementById('informe')
  if (!section) return

  const panel = section.querySelector('.report__panel')
  const out = {}
  section.querySelectorAll('[data-report]').forEach((el) => {
    out[el.dataset.report] = el
  })

  const cache = {}
  let visible = false
  let compiled = false
  let frozen = !isHudEnabled()

  // Región de anuncio ÚNICA. Se dispara una sola vez, al terminar de compilar.
  const live = document.createElement('p')
  live.className = 'sr-only'
  live.setAttribute('aria-live', 'polite')
  section.appendChild(live)

  function write(key, value) {
    const el = out[key]
    if (!el || cache[key] === value) return
    cache[key] = value
    el.textContent = value
  }

  function hydrate() {
    if (frozen) return
    const s = snapshot()

    write('elapsed', mmss(s.elapsed))
    write('depth', `${s.depth}%`)
    write('signals', String(s.signals))
    write('stage', s.stage)
    write('cases', `${s.casesSeen} / ${s.casesTotal}`)
    write('topcase', s.topCase ? `${titleOf(s.topCase.slug)} (${mmss(s.topCase.dwell)})` : '—')
    write('variant', s.variant + (s.variantForced ? ' · cambiada manualmente' : ''))
    write('score', `${s.score}%`)

    if (out.scorebar) out.scorebar.style.transform = `scaleX(${(s.score / 100).toFixed(3)})`
    if (s.converted) write('status', 'Objetivo cumplido')
  }

  // --- Compilación -------------------------------------------------------------
  function compile() {
    if (compiled) return
    compiled = true

    if (shouldReduceMotion()) {
      write('status', 'Compilado')
      hydrate()
      live.textContent = 'Informe de tu visita listo'
      return
    }

    const text = 'Compilando…'
    const cursor = { i: 0 }

    gsap
      .timeline()
      // Typing SOLO de la línea de estado, con el ticker de GSAP (nunca setInterval,
      // nunca un carácter por timer). El contenido no se teclea: sería ilegible
      // con lector de pantalla y costoso.
      .to(cursor, {
        i: text.length,
        duration: 0.6,
        ease: 'none',
        onUpdate: () => {
          if (out.status) out.status.textContent = text.slice(0, Math.round(cursor.i))
        },
      })
      .from(section.querySelectorAll('.report__row'), {
        opacity: 0,
        y: 12,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.06,
        onStart: hydrate,
      }, '-=0.2')
      .call(() => {
        write('status', 'Compilado')
        live.textContent = 'Informe de tu visita listo'
      })
  }

  // --- Gate por visibilidad ------------------------------------------------------
  // Fuera de pantalla el informe no hace absolutamente nada.
  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting
      if (visible) compile()
    },
    { threshold: 0.25 }
  )
  io.observe(panel || section)

  on('tick', () => {
    if (!visible || !compiled) return
    hydrate()
  })

  // La conversión actualiza el informe en vivo, PERO no vuelve a anunciar:
  // un segundo aviso de lector de pantalla aquí sería ruido.
  on('conversion', () => {
    if (!frozen) {
      hydrate()
      write('status', 'Objetivo cumplido')
    }
  })

  on('hud', ({ enabled }) => {
    frozen = !enabled
    if (frozen) {
      write('status', 'Panel desactivado')
      let note = section.querySelector('.report__off')
      if (!note) {
        note = document.createElement('p')
        note.className = 'report__off mono'
        note.textContent = 'Has apagado la medición. El informe se queda como estaba.'
        panel?.appendChild(note)
      }
    } else {
      section.querySelector('.report__off')?.remove()
      hydrate()
    }
  })

  // --- Fórmula -------------------------------------------------------------------
  const formulaBtn = section.querySelector('.report__formula-btn')
  const formula = section.querySelector('.report__formula')
  formulaBtn?.addEventListener('click', () => {
    const open = formulaBtn.getAttribute('aria-expanded') === 'true'
    formulaBtn.setAttribute('aria-expanded', String(!open))
    formulaBtn.textContent = open ? 'ver fórmula' : 'ocultar fórmula'
    if (formula) formula.hidden = open
  })
}
```

### 2. Añadir AL FINAL de `src/styles/tracker.css`
```css
/* ===== INFORME DE SESIÓN (tarea 35) ===== */
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip-path: inset(50%); white-space: nowrap; border: 0;
}

.report__panel {
  margin-top: 3rem;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  /* Reserva de altura: si el panel creciera al compilarse, desplazaría #contacto
     y descuadraría los ScrollTriggers ya calculados. */
  min-height: 30rem;
}
.report__head {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--line);
}
.report__dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--muted); flex-shrink: 0;
}
.report__title { color: var(--text); }
.report__status { margin-left: auto; }

.report__grid { padding: 0.5rem 1.5rem; }
.report__row {
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 1rem; padding-block: 0.85rem;
  border-bottom: 1px solid var(--line);
}
.report__row dt { color: var(--muted); }
.report__row dd { color: var(--text); text-align: right; font-variant-numeric: tabular-nums; }

.report__score { padding: 1.5rem; }
.report__score-head { display: flex; align-items: baseline; gap: 0.75rem; flex-wrap: wrap; color: var(--text); }
.report__score-tag { color: var(--muted); }
.report__formula-btn {
  color: var(--muted); border-bottom: 1px solid var(--line);
  transition: color var(--dur-fast) var(--ease-out);
}
.report__formula-btn:hover { color: var(--text); }
.report__score-value {
  font-family: var(--font-mono); font-weight: 500;
  font-size: var(--fs-metric); line-height: 1; letter-spacing: -0.04em;
  margin-top: 0.75rem; font-variant-numeric: tabular-nums;
}
/* ÚNICA aplicación del gradiente en todo el concepto (PLAN.md §11.4). */
.report__score-bar {
  height: 2px; background: var(--line);
  margin-top: 1rem; overflow: hidden;
}
.report__score-bar span {
  display: block; height: 100%; width: 100%;
  background: var(--gradient-meta);
  transform: scaleX(0); transform-origin: left;
  transition: transform var(--dur-med) var(--ease-out);
}
.report__formula { margin-top: 1rem; max-width: 60ch; line-height: 1.7; }
.report__off { padding: 0 1.5rem 1.5rem; color: var(--muted); }

@media (max-width: 767px) {
  .report__panel { min-height: 34rem; }
  .report__row { flex-direction: column; gap: 0.2rem; }
  .report__row dd { text-align: left; }
}
@media (prefers-reduced-motion: reduce) {
  .report__score-bar span { transition: none; }
}
```

### 3. Editar `src/main.js` — orden de `PLAN.md` §4.3, restricción (c)
```js
import { initReport } from './js/sections/report.js'

initTestimonials()
initReport()      // ANTES de initContact(): el panel debe existir con su
initContact()     // min-height reservado antes de que se midan offsets
```

## Criterios de aceptación
- [ ] Al llegar a `#informe` el estado pasa de `En espera` a `Compilando…` (tecleado) y
  luego a `Compilado`, mientras las 7 filas entran en cascada.
- [ ] **Los datos cuadran con lo que el visitante ha hecho de verdad.** Comprobarlo a mano:
  recorrer el sitio abriendo 3 backstages y verificar que `Creatividades vistas` dice 3.
- [ ] `Más atención` muestra el **nombre del cliente**, no el slug, con su tiempo en `mm:ss`.
- [ ] Los datos siguen **actualizándose en vivo** mientras el informe está en pantalla.
- [ ] Fuera de pantalla el informe **no hace nada** (gate por IntersectionObserver).
- [ ] La probabilidad **nunca llega a 100** y lleva la etiqueta `Estimación heurística`
  permanente, no un asterisco.
- [ ] `ver fórmula` despliega los pesos y alterna `aria-expanded` y su propio texto.
- [ ] Click en el CTA de contacto → el estado pasa a `Objetivo cumplido` y la
  probabilidad sube en vivo.
- [ ] El panel **no crece al compilarse**: `#contacto` no se desplaza (comparar la
  posición de `#contacto` antes y después — debe ser idéntica).
- [ ] Sin JS, las 7 filas muestran `—` y las dos notas se leen enteras.
- [ ] Con el panel desactivado: estado `Panel desactivado`, datos congelados y nota
  explicativa. Reactivarlo lo descongela.
- [ ] **Accesibilidad:** VoiceOver lee el panel como lista de definición; se anuncia
  **una sola vez** "Informe de tu visita listo"; la conversión **no** re-anuncia.
- [ ] Reduced-motion: sin typing y sin cascada, panel completo con estado `Compilado`,
  datos igualmente en vivo.

## Verificación
```bash
npm run dev
# 1) Recorrer el sitio entero con calma, abriendo algunos backstages
# 2) Al llegar al informe: se compila delante y los números cuadran con la visita
# 3) DevTools → anotar el offsetTop de #contacto antes y después de compilar: idéntico
# 4) Click en "ver fórmula": aparecen los pesos
# 5) Click en el CTA: estado "Objetivo cumplido" y la barra sube
# 6) Desactivar el panel desde el HUD: el informe se congela con su nota
# 7) Emulate prefers-reduced-motion: sin typing, datos correctos
```

Comprobación de la heurística (consola):
```js
snapshot().score <= 99   // → true, siempre
```

## ⚠ No hacer
- **No teclear el contenido carácter a carácter.** Solo la línea de estado. Teclear las
  filas sería costoso y dejaría el panel ilegible para un lector de pantalla.
- No usar `setInterval` ni un RAF propio para el typing: se usa el ticker vía GSAP.
- No quitar el `min-height` del panel: es lo que impide que `#contacto` se desplace.
- No redondear la probabilidad al alza ni presentarla como certeza. Tope 99, etiqueta
  permanente, fórmula a un click (`PLAN.md` §11.5).
- No añadir un segundo `aria-live` ni re-anunciar en cada actualización.
- No cambiar el texto de las dos notas finales sin releer `PLAN.md` §11.6: el tono es
  declarativo, nunca ufano. No es "mira todo lo que sé de ti".
- No añadir aquí ninguna métrica que el HUD no pueda apagar (regla maestra §11).
