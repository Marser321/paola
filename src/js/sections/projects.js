import gsap from 'gsap'
import { destacados, esCasoPublicable, enMiles, porcentaje } from '../../data/sectores.js'
import { shouldReduceMotion } from '../core/lenis.js'
import { getLang, t } from '../../i18n/index.js'

// SECTORES (#proyectos) — las cuatro industrias donde está la experiencia.
//
// Hasta el 2026-10-17 aquí había seis casos de plantilla: marcas inventadas,
// creatividades generadas para ellas y métricas de ejemplo (5.8x, +212 %, −47 %).
// La auditoría lo dejó claro —«si un cliente busca esas marcas, no te
// encuentra»— y lo que queda es lo que se puede afirmar: dónde se ha invertido.
//
// Dos plantillas, y quien elige es el DATO, no este archivo:
//   · FICHA de sector: tipográfica, sin chrome de anuncio y sin imagen. Una ficha
//     con un creativo inventado sería exactamente lo que se acaba de retirar.
//   · TARJETA de caso: solo si el sector trae un caso que pasa
//     esCasoPublicable() (src/data/sectores.js). Entonces sí: creativo real,
//     chrome de anuncio con la marca anonimizada y enlace a caso.html.
// Pasar de una a otra es rellenar un objeto en sectores.js; aquí no se toca nada.

const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )

// «01/04». El total ya no va escrito («/06» lo estuvo): sale de cuántas hay.
const indice = (i, total) => `${String(i + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`

/** Campo de un caso en el idioma actual: `caso.en.<campo>` si existe; si no, el español. */
function campo(caso, clave) {
  if (getLang() === 'en' && caso.en?.[clave] != null) return caso.en[clave]
  return caso[clave]
}

function fichaSector(sector, i, total) {
  const pct = porcentaje(sector.invertido)
  // UN solo bloque, y no visual + cuerpo como la tarjeta de caso: con la sección
  // pineada, todo lo que cae por debajo del borde de la ventana no se ve en todo
  // el recorrido horizontal. Con el nombre abajo, en un portátil de 800px de alto
  // se leía «US$219K» y no de qué sector. Aquí el nombre va ARRIBA.
  // La barra es la parte de ESTE sector sobre el total: base cero y escala
  // completa, para que 19 % se vea como lo que es. Va aria-hidden porque repite
  // el porcentaje que está escrito justo encima.
  return `
      <article class="project-card project-card--sector" data-hover data-id="${sector.id}">
        <div class="sector-card">
          <div class="sector-card__head">
            <span class="project-card__index mono">${indice(i, total)}</span>
            <h3 class="sector-card__name">${esc(t(`sectores.${sector.id}.nombre`))}</h3>
          </div>
          <div class="sector-card__data">
            <p class="sector-card__amount">${enMiles(sector.invertido)}</p>
            <p class="sector-card__label mono">${esc(t('projects.invested'))} · <span class="sector-card__share">${esc(t('projects.share', { pct }))}</span></p>
            <span class="sector-card__bar" aria-hidden="true" style="--parte: ${pct}%"><i></i></span>
          </div>
          <p class="sector-card__conversion mono">${esc(t(`sectores.${sector.id}.conversion`))}</p>
        </div>
      </article>`
}

function tarjetaCaso(sector, i, total) {
  const caso = sector.caso
  const titulo = campo(caso, 'titulo')
  const alt = (getLang() === 'en' && caso.en?.alt) || caso.creativo.alt
  const resultados = (campo(caso, 'resultados') || [])
    .filter((r) => r?.valor && r?.etiqueta)
    .slice(0, 2)
  const ad = caso.antesDespues

  return `
      <article class="project-card" data-hover data-id="${sector.id}">
        <!-- Chrome de anuncio: atrezo, aria-hidden. La marca es la del CLIENTE
             (anonimizada si así se pactó), nunca la de quien lleva la cuenta. -->
        <header class="ad-chrome" aria-hidden="true">
          <span class="ad-chrome__avatar" style="background: var(--gradient-gold)"></span>
          <span class="ad-chrome__brand">${esc(caso.marca || titulo)}</span>
          <span class="ad-chrome__meta mono">${esc(t('backstage.sponsored'))}</span>
        </header>

        <div class="project-card__visual">
          <picture class="project-card__picture">
            <source srcset="/img/${esc(caso.creativo.src)}.avif" type="image/avif" />
            <source srcset="/img/${esc(caso.creativo.src)}.webp" type="image/webp" />
            <img src="/img/${esc(caso.creativo.src)}.webp" alt="${esc(alt)}"
                 width="1200" height="750" loading="lazy" decoding="async" />
          </picture>
          <span class="project-card__sector mono">${esc(t(`sectores.${sector.id}.nombre`))} — ${esc(caso.periodo)}</span>
        </div>

        ${caso.cta ? `<div class="ad-chrome__cta mono" aria-hidden="true"><span>${esc(caso.cta)}</span></div>` : ''}

        <div class="project-card__body">
          <span class="project-card__index mono">${indice(i, total)}</span>
          <h3 class="project-card__title">
            <a class="project-card__link" href="caso.html?id=${sector.id}">${esc(titulo)}</a>
          </h3>
          ${caso.stack ? `<p class="project-card__tags mono">${esc(caso.stack)}</p>` : ''}
          <div class="project-card__kpis">
            ${resultados
              .map(
                (r) => `<div>
              <p class="project-card__kpi-value">${esc(r.valor)}</p>
              <p class="project-card__kpi-label mono">${esc(r.etiqueta)}</p>
            </div>`,
              )
              .join('')}
          </div>
          ${
            ad?.antes && ad?.despues
              ? `<p class="project-card__delta mono" aria-label="${esc(t('projects.delta', { antes: ad.antes, despues: ad.despues }))}">
            <span>${esc(ad.antes)}</span>
            <span class="project-card__delta-arrow" aria-hidden="true">→</span>
            <span class="project-card__delta-after">${esc(ad.despues)}</span>
          </p>`
              : ''
          }
          <a class="project-card__more mono" href="caso.html?id=${sector.id}">${esc(t('projects.caseLink'))}</a>
        </div>
      </article>`
}

// --- Render (se ejecuta ANTES de cualquier ScrollTrigger de sección) ---
export function renderProjects() {
  const track = document.querySelector('.projects__track')
  if (!track) return

  const total = destacados.length
  track.innerHTML = destacados
    .map((s, i) => (esCasoPublicable(s.caso) ? tarjetaCaso(s, i, total) : fichaSector(s, i, total)))
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
      rotX(-py * 4)
      rotY(px * 4)
    })
    card.addEventListener('mouseleave', () => {
      rotX(0)
      rotY(0)
    })
  })
}

/**
 * Re-render tras cambiar de idioma (tarea 28). Recrear el track destruye los
 * listeners de tilt (son por card), así que hay que volver a montarlos.
 */
export function refreshProjects() {
  renderProjects()
  initTilt()
}

// Native horizontal exploration: vertical scrolling remains uninterrupted.
export function initProjects() {
  initTilt()
  const viewport = document.querySelector('.projects__viewport')
  const track = document.querySelector('.projects__track')
  const progress = document.querySelector('.projects__progress-fill')
  if (!viewport || !track) return
  viewport.tabIndex = 0
  const controls = document.createElement('div')
  controls.className = 'projects__controls'
  controls.innerHTML =
    '<button type="button" data-sector-prev>←</button><button type="button" data-sector-next>→</button>'
  document.querySelector('.projects__header').append(controls)
  const previous = controls.querySelector('[data-sector-prev]'),
    next = controls.querySelector('[data-sector-next]')
  function labels() {
    previous.setAttribute('aria-label', t('experience.previous'))
    next.setAttribute('aria-label', t('experience.following'))
    viewport.setAttribute('aria-label', t('labels.cases'))
  }
  const update = () => {
    const distance = viewport.scrollWidth - viewport.clientWidth
    if (progress)
      progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, viewport.scrollLeft / distance) : 1})`
    previous.disabled = viewport.scrollLeft < 2
    next.disabled = viewport.scrollLeft >= distance - 2
  }
  function move(direction) {
    const card = track.querySelector('.project-card')
    viewport.scrollBy({
      left: direction * ((card?.getBoundingClientRect().width || 400) + window.innerWidth * 0.04),
      behavior: shouldReduceMotion() ? 'instant' : 'smooth',
    })
  }
  previous.addEventListener('click', () => move(-1))
  next.addEventListener('click', () => move(1))
  viewport.addEventListener('scroll', update, { passive: true })
  const observer = new ResizeObserver(update)
  observer.observe(viewport)
  window.addEventListener('i18n:change', () => {
    labels()
    update()
  })
  labels()
  update()
  if (!shouldReduceMotion())
    gsap.from(track.querySelectorAll('.project-card'), {
      y: 35,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: viewport, start: 'top 85%', once: true },
    })
}
