# Tarea 11 — Galería de proyectos: pin horizontal + cards 3D ⭐

## Objetivo
La sección estrella. Renderiza las 6 cards desde `src/data/projects.js` y aplica:
1. **Desktop (≥1024px):** sección pinneada; el scroll vertical desplaza el track
   horizontalmente (scrub) + barra de progreso con gradiente.
2. **Todas las pantallas con hover:** tilt 3D por card (rotateX/Y ≤ 8°) con capas
   internas en profundidad (`translateZ`).
3. **<1024px:** columna vertical con reveals (sin pin).

> **Alcance respecto al concepto §1.** Esta tarea construye la card *base*. El chrome de
> anuncio (cabecera "Patrocinado", badge de formato, CTA) y el panel de backstage
> (audiencia completa, presupuesto, test A/B con su ganadora) los añade la **tarea 34**.
> Aquí solo se adelanta una cosa: `data-hover="audience"` con `data-cursor-label`, para
> que el cursor de la tarea 05 muestre la audiencia del caso en vez de un genérico "VER".
>
> ⚠ **Interacción con la tarea 34.** El chrome de anuncio añade ~90px de alto por card,
> pero se aplica dentro de `renderProjects()`, que corre **antes** de que ScrollTrigger
> mida nada: no hay problema. Y el backstage es un **overlay** dentro del visual, así que
> abrirlo no cambia la altura de la card ni afecta al pin. Aun así, `invalidateOnRefresh:
> true` es obligatorio aquí y **no puede quitarse**.

## Archivos a crear/editar
- **Crear** `src/js/sections/projects.js`
- **Editar** `src/main.js`
- **Editar** `src/styles/sections.css` (añadir reglas al final)

## Spec

### 1. `src/js/sections/projects.js` (literal)
```js
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../../data/projects.js'
import { shouldReduceMotion } from '../core/lenis.js'

// --- Render (se ejecuta ANTES de cualquier ScrollTrigger de sección) ---
export function renderProjects() {
  const track = document.querySelector('.projects__track')
  if (!track) return

  track.innerHTML = projects
    .map(
      (p) => `
      <article class="project-card" data-hover="audience" data-cursor-label="${p.audienceShort}" data-id="${p.id}">
        <div class="project-card__visual">
          <div class="project-card__gradient"
               style="background: linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})"></div>
          <span class="project-card__sector mono">${p.sector} — ${p.year}</span>
        </div>
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
        </div>
      </article>`
    )
    .join('')
}

// --- Tilt 3D por card ---
function initTilt() {
  if (window.matchMedia('(hover: none)').matches || shouldReduceMotion()) return

  document.querySelectorAll('.project-card').forEach((card) => {
    const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power2.out' })
    const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power2.out' })

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      rotX(-py * 8)
      rotY(px * 8)
    })
    card.addEventListener('mouseleave', () => {
      rotX(0)
      rotY(0)
    })
  })
}

// --- Scroll horizontal pinneado (desktop) / reveals (resto) ---
export function initProjects() {
  initTilt()
  if (shouldReduceMotion()) return

  const mm = gsap.matchMedia()

  mm.add('(min-width: 1024px)', () => {
    const track = document.querySelector('.projects__track')
    const viewport = document.querySelector('.projects__viewport')
    const progress = document.querySelector('.projects__progress-fill')

    const distance = () => track.scrollWidth - viewport.clientWidth

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.projects',
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress.style.transform = `scaleX(${self.progress})`
        },
      },
    })

    return () => tween.scrollTrigger?.kill() // cleanup de matchMedia
  })

  mm.add('(max-width: 1023px)', () => {
    document.querySelectorAll('.project-card').forEach((card) => {
      gsap.from(card, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      })
    })
  })
}
```

### 2. Editar `src/main.js` — resultado completo literal
```js
import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'

import { initLenis } from './js/core/lenis.js'
import { initCursor } from './js/core/cursor.js'
import { initPreloader } from './js/core/preloader.js'
import { initHero } from './js/sections/hero.js'
import { initHeroScene } from './js/webgl/hero-scene.js'
import { initMarquee } from './js/sections/marquee.js'
import { initMetrics } from './js/sections/metrics.js'
import { renderProjects, initProjects } from './js/sections/projects.js'
import { projects } from './data/projects.js'

initLenis()
renderProjects() // ANTES de cualquier ScrollTrigger que mida la página
initCursor()
initPreloader()
initHero()
initHeroScene()
initMarquee()
initMetrics()
initProjects()

console.log(`[paola] ${projects.length} proyectos cargados · + gallery ok`)
```

### 3. Añadir AL FINAL de `src/styles/sections.css`
```css
/* ===== PROYECTOS — 3D / RESPONSIVE (tarea 11) ===== */
.projects__viewport { perspective: 1000px; }
.project-card__sector {
  position: absolute; top: 1rem; left: 1rem; z-index: 1;
  color: var(--text);
  background: rgba(14, 14, 14, 0.55);
  backdrop-filter: blur(6px);
  padding: 0.4rem 0.75rem; border-radius: 999px;
}
/* Capas con profundidad (el tilt las separa visualmente) */
.project-card__visual { transform: translateZ(0); }
.project-card__body { transform: translateZ(30px); }

@media (max-width: 1023px) {
  .projects__track {
    flex-direction: column; width: auto;
    padding-inline: 0; gap: 2rem;
  }
  .project-card { width: 100%; }
  .projects__hint { display: none; }
}
```

## Criterios de aceptación
- [ ] Las 6 cards se renderizan con datos de `projects.js` (índice, título, tags,
  2 KPIs, descripción, gradiente propio, pill sector-año).
- [ ] Desktop ≥1024px: la sección se pinnea y el scroll vertical mueve el track
  horizontal de principio a fin; la barra de progreso refleja `progress` 0→1.
- [ ] Al salir de la sección, el pin se libera limpiamente y el resto del scroll
  continúa sin saltos.
- [ ] Hover sobre una card: tilt ≤8° siguiendo el ratón, el cuerpo de la card
  "flota" (translateZ 30px) y el cursor se convierte en la **píldora con la audiencia
  del caso** (p. ej. `MUJERES 25-44 · ES`) — estado `is-audience` de la tarea 05,
  activado por `data-hover="audience"` + `data-cursor-label`.
- [ ] Las 6 audiencias caben en la píldora sin cortarse ni desbordar la ventana al
  pasar por una card pegada al borde derecho.
- [ ] <1024px: cards en columna, cada una con reveal y+opacity al entrar.
- [ ] Resize entre breakpoints no rompe el layout (`invalidateOnRefresh` + cleanup
  de matchMedia). Recargar tras cambiar de tamaño si fuera necesario en pruebas.
- [ ] Reduced-motion: sin pin, sin tilt; cards visibles en columna en desktop también
  (el CSS de <1024px no aplica; verificar que el track en fila no desborda:
  si reduced-motion + desktop → añadir al bloque reduced-motion de `base.css`:
  `.projects__track{flex-wrap:wrap;width:auto}` — incluirlo en esta tarea).

Añade también AL FINAL de `src/styles/sections.css`:
```css
@media (prefers-reduced-motion: reduce) {
  .projects__track { flex-wrap: wrap; width: auto; }
}
```

## Verificación
```bash
npm run dev
# 1) Scroll hasta "Etapa 02 · Interés — Creatividades": la sección se queda fija y
#    el track se desplaza horizontalmente hasta la última card
# 2) Barra de progreso 0→100% sincronizada
# 3) Hover card: tilt 3D + cursor con la audiencia del caso
# 4) DevTools 900px: columna vertical con reveals
# 5) Console limpia
```

## ⚠ No hacer
- No usar otra escena Three.js aquí: el 3D de las cards es CSS (`perspective` +
  `rotationX/Y`), más ligero y suficiente.
- No hacer draggable/swipe en v1: el scrub cubre la interacción.
- **No añadir el chrome de anuncio ni el backstage aquí**: es la tarea 34. Esta card
  todavía no es un anuncio, es una card.
- No hacer clicable la card entera: la tarea 29 reserva el click del título para navegar
  y la 34 el del botón para desplegar. Un click en toda la card rompería el scrub.
- No olvidar el orden en `main.js`: `renderProjects()` SIEMPRE antes de
  `initMetrics()`/`initProjects()` (ScrollTrigger mide alturas con las cards ya en DOM).
