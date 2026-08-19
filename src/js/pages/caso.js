// Página de detalle de caso (tarea 29).
//
// UNA plantilla + query string, no seis HTML a mano. Navegación nativa: ni router
// ni pushState.
//
// Los bloques del backstage que esta página reutiliza viven en sections.css
// (§CHROME DE ANUNCIO Y BACKSTAGE). Estuvieron en una hoja aparte, tracker.css,
// mientras existió el concepto «la campaña eres tú»; esa hoja se borró entera el
// 2026-08-16 y lo que se salvó se mudó allí.

import '../../styles/tokens.css'
import '../../styles/base.css'
import '../../styles/sections.css'
import '../../styles/caso.css'
import '../../styles/neon.css' // el borde de foco del marco de la creatividad
import '../../styles/pill-nav.css'

import { projects } from '../../data/projects.js'
import { initI18n, t } from '../../i18n/index.js'
import { initPillNav } from '../ui/pill-nav.js'
import { initTheme } from '../ui/theme.js'

initI18n()
// Mismo menú que la portada. Antes del conmutador de tema: los dos se cuelgan de
// .site-nav y el orden decide si el botón entra dentro de la lista o al lado.
initPillNav()
initTheme(() => t('theme'))

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

function render(project) {
  const cs = project.caseStudy
  const winner = project.abTest.winner
  const variant = (key) => `
    <div class="backstage__variant${winner === key ? ' is-winner' : ''}">
      <span class="backstage__variant-key mono">${key.toUpperCase()}</span>
      <p class="backstage__variant-text">${esc(project.abTest[key])}</p>
      ${winner === key ? `<span class="backstage__badge mono">${t('backstage.winner')}</span>` : ''}
    </div>`

  const visual = project.image
    ? `<picture class="caso__picture">
         <source srcset="/img/${project.image}.avif" type="image/avif" />
         <source srcset="/img/${project.image}.webp" type="image/webp" />
         <img src="/img/${project.image}.webp" alt="${esc(project.imageAlt || '')}"
              width="1200" height="750" loading="eager" decoding="async" />
       </picture>`
    : `<div class="caso__visual-gradient"
           style="background: linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})"></div>`

  return `
    <article class="container caso__body">
      <p class="section-label mono">
        <span class="section-label__stage">${esc(project.sector)}</span>
        <span class="section-label__name">${esc(project.year)}</span>
      </p>
      <h1 class="caso__title">${esc(project.title)}</h1>
      <p class="caso__lead">${esc(project.desc)}</p>

      <div class="caso__kpis">
        <div><p class="caso__kpi-value">${esc(project.kpi1.value)}</p><p class="caso__kpi-label mono">${esc(project.kpi1.label)}</p></div>
        <div><p class="caso__kpi-value">${esc(project.kpi2.value)}</p><p class="caso__kpi-label mono">${esc(project.kpi2.label)}</p></div>
        <div><p class="caso__kpi-value">${esc(project.beforeAfter.before)} → ${esc(project.beforeAfter.after)}</p><p class="caso__kpi-label mono">Antes / después</p></div>
      </div>

      <div class="caso__visual">${visual}</div>

      ${cs ? `
      <section class="caso__section">
        <h2 class="caso__h2">El reto</h2>
        <p class="caso__text">${esc(cs.challenge)}</p>
      </section>
      <section class="caso__section">
        <h2 class="caso__h2">Qué hicimos</h2>
        <ol class="caso__steps">
          ${cs.approach.map((s) => `<li>${esc(s)}</li>`).join('')}
        </ol>
      </section>
      <section class="caso__section">
        <h2 class="caso__h2">Resultado</h2>
        <p class="caso__text">${esc(cs.outcome)}</p>
        ${cs.quote ? `<blockquote class="caso__quote">${esc(cs.quote)}</blockquote>` : ''}
      </section>` : ''}

      <!-- El backstage va COMPLETO Y ABIERTO: en la página de detalle no hay
           nada que ocultar, así que aquí no existe el botón de la tarea 34. -->
      <section class="caso__section caso__backstage">
        <h2 class="caso__h2">${t('backstage.title')}</h2>
        <dl class="backstage__rows mono">
          <div><dt>Formato</dt><dd>${esc(project.adFormat)}</dd></div>
          <div><dt>${t('backstage.audience')}</dt><dd>${esc(project.audience)}</dd></div>
          <div><dt>${t('backstage.budget')}</dt><dd>${esc(project.budget)}</dd></div>
          <div><dt>${t('backstage.objective')}</dt><dd>${esc(project.objective)}</dd></div>
          <div><dt>CTA</dt><dd>${esc(project.cta)}</dd></div>
        </dl>
        <p class="backstage__test-title mono">${t('backstage.test')}</p>
        <div class="backstage__variants">${variant('a')}${variant('b')}</div>
        <p class="backstage__result mono">${esc(project.abTest.result)}</p>
      </section>

      <nav class="caso__nav mono" aria-label="Otros casos">
        ${projects
          .filter((p) => p.id !== project.id)
          .map((p) => `<a href="caso.html?id=${p.id}" data-hover>${esc(p.title)}</a>`)
          .join('')}
      </nav>
    </article>`
}

const id = new URLSearchParams(location.search).get('id')
const project = projects.find((p) => p.id === id)

if (project) {
  document.title = `${project.title} — Caso · PAOLA`
  const root = document.getElementById('caso')
  root.innerHTML = render(project)
  litBorders()
} // si no, se queda el fallback que ya está en el HTML

/**
 * Borde de foco en el marco de la creatividad, con los estilos de neon.css.
 *
 * NO se usa initNeon() aquí a propósito: arrastraría gsap, ScrollTrigger y
 * cursor.js a una página que hoy no lleva ninguno de los tres (ver la cabecera
 * de este archivo). Lo único que necesita el efecto son dos variables, y eso
 * son doce líneas y un listener.
 *
 * Sin ScrollTrigger no hay trazo de entrada, así que --neon-progress se fija a
 * 1 a mano: en la one-page lo escribe el scrub, aquí el borde nace encendido.
 */
function litBorders() {
  const surfaces = [...document.querySelectorAll('.caso__visual')]
  surfaces.forEach((el) => {
    el.classList.add('neon')
    el.style.setProperty('--neon-progress', '1')
  })

  if (!surfaces.length) return
  if (window.matchMedia('(hover: none)').matches) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  surfaces.forEach((el) => {
    const halo = document.createElement('i')
    halo.className = 'neon__halo'
    halo.setAttribute('aria-hidden', 'true')
    el.prepend(halo)
    // `is-live` de forma fija: sin IntersectionObserver, y con una sola
    // superficie en la página el gate del blur no compra nada.
    el.classList.add('is-live')

    // El rect se relee en el enter, no en cada movimiento: dentro de la caja no
    // cambia, y leerlo por evento forzaría un layout tras escribir las
    // variables.
    let rect = null
    el.addEventListener('pointerenter', () => {
      rect = el.getBoundingClientRect()
      el.classList.add('is-lit')
    })
    el.addEventListener('pointerleave', () => el.classList.remove('is-lit'))
    el.addEventListener('pointermove', (e) => {
      if (!rect) return
      el.style.setProperty('--neon-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
      el.style.setProperty('--neon-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
    })
  })
}
