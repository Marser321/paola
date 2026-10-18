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

import { sectores, esCasoPublicable } from '../../data/sectores.js'
import { initI18n, getLang, t } from '../../i18n/index.js'
import { initPillNav } from '../ui/pill-nav.js'
import { initTheme } from '../ui/theme.js'

initI18n()
document.documentElement.lang = t('htmlLang')
// Mismo menú que la portada. Antes del conmutador de tema: los dos se cuelgan de
// .site-nav y el orden decide si el botón entra dentro de la lista o al lado.
initPillNav()
initTheme(() => t('theme'))

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

/** Campo de un caso en el idioma actual: `caso.en.<campo>` si existe; si no, el español. */
function campo(caso, clave) {
  if (getLang() === 'en' && caso.en?.[clave] != null) return caso.en[clave]
  return caso[clave]
}

// Solo los casos que pasan esCasoPublicable() (src/data/sectores.js). Hasta el
// 2026-10-17 esta página servía seis casos de plantilla; los enlaces viejos
// (?id=atelier-nord…) caen ahora en el aviso de «Caso no encontrado» del HTML.
const publicables = sectores.filter((s) => esCasoPublicable(s.caso))

function render(sector) {
  const caso = sector.caso
  const titulo = campo(caso, 'titulo')
  const resultados = (campo(caso, 'resultados') || []).filter((r) => r?.valor && r?.etiqueta)
  const pasos = (campo(caso, 'queHicimos') || []).filter(Boolean)
  const alt = (getLang() === 'en' && caso.en?.alt) || caso.creativo.alt
  const ad = caso.antesDespues

  // La ficha lleva solo lo que el caso trae: nada de filas con un guion.
  const ficha = [
    [t('caso.periodo'), caso.periodo],
    [t('caso.inversion'), caso.inversion],
    [t('caso.stack'), caso.stack],
    [t('caso.cta'), caso.cta],
  ].filter(([, v]) => v)

  return `
    <article class="container caso__body">
      <p class="section-label mono">
        <span class="section-label__stage">${esc(t(`sectores.${sector.id}.nombre`))}</span>
        <span class="section-label__name">${esc(caso.periodo)}</span>
      </p>
      <h1 class="caso__title">${esc(titulo)}</h1>

      <div class="caso__kpis">
        ${resultados
          .map((r) => `<div><p class="caso__kpi-value">${esc(r.valor)}</p><p class="caso__kpi-label mono">${esc(r.etiqueta)}</p></div>`)
          .join('')}
        ${
          ad?.antes && ad?.despues
            ? `<div><p class="caso__kpi-value">${esc(ad.antes)} → ${esc(ad.despues)}</p><p class="caso__kpi-label mono">${esc(t('caso.antesDespues'))}</p></div>`
            : ''
        }
      </div>

      <div class="caso__visual">
        <picture class="caso__picture">
          <source srcset="/img/${esc(caso.creativo.src)}.avif" type="image/avif" />
          <source srcset="/img/${esc(caso.creativo.src)}.webp" type="image/webp" />
          <img src="/img/${esc(caso.creativo.src)}.webp" alt="${esc(alt)}"
               width="1200" height="750" loading="eager" decoding="async" />
        </picture>
      </div>

      <section class="caso__section">
        <h2 class="caso__h2">${esc(t('caso.reto'))}</h2>
        <p class="caso__text">${esc(campo(caso, 'reto'))}</p>
      </section>
      <section class="caso__section">
        <h2 class="caso__h2">${esc(t('caso.queHicimos'))}</h2>
        <ol class="caso__steps">
          ${pasos.map((paso) => `<li>${esc(paso)}</li>`).join('')}
        </ol>
      </section>
      <section class="caso__section">
        <h2 class="caso__h2">${esc(t('caso.resultado'))}</h2>
        <dl class="backstage__rows mono">
          ${resultados.map((r) => `<div><dt>${esc(r.etiqueta)}</dt><dd>${esc(r.valor)}</dd></div>`).join('')}
        </dl>
      </section>

      ${
        ficha.length
          ? `<section class="caso__section caso__backstage">
        <h2 class="caso__h2">${esc(t('caso.ficha'))}</h2>
        <dl class="backstage__rows mono">
          ${ficha.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
        </dl>
      </section>`
          : ''
      }

      ${
        publicables.length > 1
          ? `<nav class="caso__nav mono" aria-label="${esc(t('caso.otros'))}">
        ${publicables
          .filter((s) => s.id !== sector.id)
          .map((s) => `<a href="caso.html?id=${s.id}" data-hover>${esc(campo(s.caso, 'titulo'))}</a>`)
          .join('')}
      </nav>`
          : ''
      }
    </article>`
}

const id = new URLSearchParams(location.search).get('id')
const sector = publicables.find((s) => s.id === id)

if (sector) {
  document.title = t('caso.title', { titulo: campo(sector.caso, 'titulo') })
  const root = document.getElementById('caso')
  root.innerHTML = render(sector)
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
