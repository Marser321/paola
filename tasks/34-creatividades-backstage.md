# Tarea 34 — Creatividades: chrome de anuncio + backstage ⭐

## Objetivo
Cada caso deja de ser una card de portfolio y pasa a presentarse como **la creatividad que
fue**: chrome de anuncio real (cabecera `PAOLA® · Patrocinado`, badge de formato, botón CTA)
y un panel de **backstage** que revela lo que hay detrás del anuncio — audiencia,
presupuesto, objetivo, y el test A/B con su ganadora.

Es el contenido que ningún otro portfolio del rubro tiene, porque es la parte del trabajo
que normalmente no se enseña. Y es coherente con el concepto: la sección `Etapa 02 ·
Interés` no muestra proyectos, muestra anuncios que funcionaron y por qué.

**Decisión de arquitectura: el backstage es un overlay dentro del visual**, no un panel que
empuja el layout. Se desliza sobre la creatividad — que es literalmente la metáfora: se
levanta el anuncio para ver lo que hay detrás. Ventaja técnica decisiva: **la altura de la
card nunca cambia**, así que no toca ni un ScrollTrigger del pin horizontal y no hace falta
ningún `refresh()`.

## Archivos a crear/editar
- **Editar** `src/js/sections/projects.js` (template de `renderProjects` + toggle)
- **Editar** `src/styles/tracker.css` (añadir bloque al final)

## Spec

### 1. Reemplazar el template de `renderProjects()` en `src/js/sections/projects.js`
```js
export function renderProjects() {
  const track = document.querySelector('.projects__track')
  if (!track) return

  track.innerHTML = projects
    .map((p) => {
      const winner = p.abTest.winner
      const variant = (key) => `
        <div class="backstage__variant${winner === key ? ' is-winner' : ''}">
          <span class="backstage__variant-key mono">${key.toUpperCase()}</span>
          <p class="backstage__variant-text">${p.abTest[key]}</p>
          ${winner === key ? '<span class="backstage__badge mono">Ganadora</span>' : ''}
        </div>`

      return `
      <article class="project-card" data-hover="audience" data-cursor-label="${p.audienceShort}" data-id="${p.id}">
        <!-- Chrome de anuncio: atrezo. aria-hidden para no ensuciar la lectura del caso. -->
        <header class="ad-chrome" aria-hidden="true">
          <span class="ad-chrome__avatar" style="background: linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})"></span>
          <span class="ad-chrome__brand">PAOLA<sup>®</sup></span>
          <span class="ad-chrome__meta mono">Patrocinado</span>
        </header>

        <div class="project-card__visual">
          <div class="project-card__gradient"
               style="background: linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})"></div>
          <span class="project-card__sector mono">${p.sector} — ${p.year}</span>
          <span class="ad-chrome__format mono" aria-hidden="true">${p.adFormat}</span>

          <!-- Backstage: overlay sobre el visual. NO altera la altura de la card. -->
          <div class="backstage" id="bs-${p.id}" hidden>
            <p class="backstage__title mono">Backstage</p>
            <dl class="backstage__rows mono">
              <div><dt>Audiencia</dt><dd>${p.audience}</dd></div>
              <div><dt>Presupuesto</dt><dd>${p.budget}</dd></div>
              <div><dt>Objetivo</dt><dd>${p.objective}</dd></div>
            </dl>
            <p class="backstage__test-title mono">Test A/B</p>
            <div class="backstage__variants">
              ${variant('a')}
              ${variant('b')}
            </div>
            <p class="backstage__result mono">
              ${p.abTest.result} · ${p.beforeAfter.before} → ${p.beforeAfter.after}
            </p>
          </div>
        </div>

        <!-- CTA decorativo: es un <span>, no un <button>. No lleva a ninguna parte. -->
        <div class="ad-chrome__cta mono" aria-hidden="true"><span>${p.cta}</span></div>

        <div class="project-card__body">
          <span class="project-card__index mono">${p.index}/06</span>
          <h3 class="project-card__title">${p.title}</h3>
          <p class="project-card__tags mono">${p.tags}</p>
          <div class="project-card__kpis">
            <div>
              <p class="project-card__kpi-value">${p.kpi1.value}</p>
              <p class="project-card__kpi-label mono">${p.kpi1.label}</p>
            </div>
            <div>
              <p class="project-card__kpi-value">${p.kpi2.value}</p>
              <p class="project-card__kpi-label mono">${p.kpi2.label}</p>
            </div>
          </div>
          <p class="project-card__desc">${p.desc}</p>
          <button type="button" class="project-card__more mono"
                  aria-expanded="false" aria-controls="bs-${p.id}">Ver backstage</button>
        </div>
      </article>`
    })
    .join('')
}
```

### 2. Añadir a `src/js/sections/projects.js` — toggle del backstage
```js
// Un solo listener delegado para las 6 cards.
function initBackstage() {
  const track = document.querySelector('.projects__track')
  if (!track) return

  track.addEventListener('click', (event) => {
    const button = event.target.closest('.project-card__more')
    if (!button) return

    const panel = document.getElementById(button.getAttribute('aria-controls'))
    if (!panel) return

    const open = button.getAttribute('aria-expanded') === 'true'
    button.setAttribute('aria-expanded', String(!open))
    button.textContent = open ? 'Ver backstage' : 'Ocultar backstage'
    panel.hidden = open
    // El overlay no cambia la altura de la card: no hace falta ScrollTrigger.refresh()
  })
}
```

Y llamarlo desde `initProjects()`, junto a `initTilt()`:
```js
export function initProjects() {
  initTilt()
  initBackstage()
  // ... resto sin cambios
}
```

### 3. Añadir AL FINAL de `src/styles/tracker.css`
```css
/* ===== CHROME DE ANUNCIO + BACKSTAGE (tarea 34) ===== */
.ad-chrome {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.9rem 1.1rem;
  border-bottom: 1px solid var(--line);
}
.ad-chrome__avatar {
  width: 24px; height: 24px; border-radius: 4px; flex-shrink: 0;
}
.ad-chrome__brand {
  font-family: var(--font-display); font-weight: 700;
  font-size: 0.85rem; letter-spacing: -0.02em;
}
.ad-chrome__brand sup { font-size: 0.5em; }
.ad-chrome__meta { margin-left: auto; }

.ad-chrome__format {
  position: absolute; top: 1rem; right: 1rem; z-index: 2;
  color: var(--text);
  background: rgba(14, 14, 14, 0.6);
  border: 1px solid var(--line);
  padding: 0.3rem 0.6rem;
}
.ad-chrome__cta {
  padding: 0.85rem 1.1rem; text-align: center;
  background: var(--surface);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  color: var(--text);
}

/* Backstage: overlay que sube sobre la creatividad. Altura de la card intacta. */
.backstage {
  position: absolute; inset: 0; z-index: 3;
  background: var(--bg);
  padding: 1.25rem;
  overflow-y: auto;
  display: flex; flex-direction: column; gap: 0.6rem;
  transform: translateY(100%);
  transition: transform var(--dur-med) var(--ease-out);
}
.backstage:not([hidden]) { transform: translateY(0); }
/* [hidden] con display:none rompería la transición: se anula y se usa el transform. */
.backstage[hidden] { display: flex; visibility: hidden; }
.backstage:not([hidden]) { visibility: visible; }

.backstage__title, .backstage__test-title { color: var(--text); }
.backstage__rows div {
  display: flex; justify-content: space-between; gap: 1rem;
  padding-block: 0.35rem; border-bottom: 1px solid var(--line);
}
.backstage__rows dt { color: var(--muted); }
.backstage__rows dd { color: var(--text); text-align: right; }

.backstage__variants { display: grid; gap: 0.5rem; }
.backstage__variant {
  position: relative;
  border: 1px solid var(--line); padding: 0.6rem 0.75rem;
  display: flex; align-items: baseline; gap: 0.6rem;
  opacity: 0.45;
}
.backstage__variant.is-winner { opacity: 1; border-color: var(--muted); }
.backstage__variant-key { color: var(--muted); }
.backstage__variant-text { font-size: 0.9rem; }
.backstage__badge {
  margin-left: auto;
  background: var(--text); color: var(--bg);
  padding: 0.15rem 0.45rem;
}
.backstage__result { color: var(--text); margin-top: auto; }

.project-card__more {
  margin-top: 1.5rem;
  color: var(--muted);
  border-bottom: 1px solid var(--line);
  transition: color var(--dur-fast) var(--ease-out),
              border-color var(--dur-fast) var(--ease-out);
}
.project-card__more:hover { color: var(--text); border-color: var(--muted); }

@media (prefers-reduced-motion: reduce) {
  .backstage { transition: none; }
}
```

## Criterios de aceptación
- [ ] Las 6 cards muestran cabecera `PAOLA® · Patrocinado` con el avatar en el gradiente
  del caso, badge de formato sobre el visual y barra de CTA bajo él.
- [ ] `Ver backstage` desliza el panel sobre la creatividad y **la altura de la card no
  cambia ni un píxel** (medirlo en DevTools antes y después).
- [ ] El backstage muestra audiencia completa, presupuesto en rango, objetivo, las dos
  variantes del test con la **ganadora destacada** y la perdedora a `opacity: .45`, y el
  resultado con el antes → después.
- [ ] El botón alterna `aria-expanded` y su propio texto (`Ver` / `Ocultar backstage`).
- [ ] **El pin horizontal sigue funcionando exactamente igual** con backstages abiertos:
  abrir tres y recorrer la sección no produce saltos ni desincroniza la barra de progreso.
- [ ] El chrome (`ad-chrome`, badge, CTA) es `aria-hidden`: con VoiceOver no se lee
  "Patrocinado" ni el formato. **La audiencia sí se lee**, dentro del backstage.
- [ ] El CTA es un `<span>` dentro de un `<div>`, **no** un `<button>` ni un enlace: no es
  tabulable y no lleva a ninguna parte.
- [ ] El único elemento tabulable nuevo por card es `Ver backstage`.
- [ ] Reduced-motion: el panel aparece sin deslizamiento.
- [ ] En <1024px (columna vertical) el backstage sigue funcionando y es legible.

## Verificación
```bash
npm run dev
# 1) Scroll hasta la galería: las 6 cards parecen anuncios, no cards de portfolio
# 2) DevTools → seleccionar una .project-card → anotar su height
#    → abrir el backstage → la height es IDÉNTICA
# 3) Abrir 3 backstages y recorrer todo el pin horizontal: sin saltos
# 4) Tab por la galería: solo se enfocan los 6 botones "Ver backstage"
# 5) VoiceOver: no se anuncia "Patrocinado"; sí se anuncia la audiencia al abrir
# 6) 900px: columna vertical, backstage legible
```

## ⚠ No hacer
- **No convertir el backstage en un panel que empuje el layout.** Es un overlay por una
  razón técnica concreta (el pin horizontal) y por una razón conceptual (levantar el
  anuncio para ver lo de detrás).
- No llamar a `ScrollTrigger.refresh()` al abrir el backstage: no hace falta, y hacerlo
  dentro de una sección pinneada provoca saltos.
- No hacer clicable la card entera. El título lo reserva la tarea 29 para navegar; el
  botón despliega. Nada más.
- No poner cifras exactas de presupuesto ni datos de cliente sin permiso
  (`CONTENT.md` §7.1, regla NDA).
- No usar el gradiente Meta en el backstage: el avatar ya usa el gradiente **del caso**,
  que es otra cosa. El acento del sitio se reserva para el informe.
- No añadir imágenes reales aquí: llegan en la tarea 23.
