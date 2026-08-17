import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'
import { parallax as manifiesto } from '../../data/media.js'

// Profundidad multicapa por sección. Port del componente de parallax de Osmo
// (osmo.supply, vía 21st.dev), reescrito contra este proyecto.
//
// ⚠ DOS COSAS DEL ORIGINAL QUE AQUÍ HABRÍAN SIDO DESTRUCTIVAS, y por eso no
// están. No son cuestión de estilo:
//
//   1. El original hace `new Lenis()` dentro del componente y le engancha su
//      propio `gsap.ticker`. Este sitio YA tiene una instancia de Lenis
//      (core/lenis.js) y la regla de un solo RAF (PLAN.md §9.8). Dos Lenis se
//      pelean por el scroll: el movimiento sale a tirones y ninguno de los dos
//      manda. Aquí no se crea ninguno — se usa el que ya hay.
//
//   2. Su limpieza hace `ScrollTrigger.getAll().forEach(st => st.kill())`, o sea
//      mata TODOS los ScrollTriggers de la página. En este sitio son ~43, e
//      incluyen el pin horizontal de #proyectos, el dibujado de barras y los
//      reveals de todas las secciones. Sería un apagón de la coreografía entera.
//      Cada capa de aquí mata solo el suyo.
//
// Lo que sí se conserva es la mecánica: una línea de tiempo por sección,
// `scrub`, y cada capa desplazándose a su propio ritmo dentro de ella.

// Tope de viaje. Los backdrops de sección lo tienen en 0.35 porque llevan texto
// encima y por encima de ahí compiten con él; estas capas son escenografía del
// hero, sin texto propio, así que admiten algo más. No mucho más: pasado medio
// viewport el desplazamiento deja de leerse como profundidad y empieza a
// leerse como que algo se ha descolocado.
const DEPTH_MAX = 0.5

// En vertical el recorrido de scroll de una sección es mucho más corto: el mismo
// viaje se consume de golpe y se lee como un salto, no como profundidad. Se
// recorta a la mitad. Se consulta EN CADA REFRESH y no una vez al arrancar —
// girar el teléfono o estrechar la ventana cambia el resultado, que es el fallo
// que tenían los guards de WebGL antes de 3248f1b.
const esVertical = window.matchMedia('(max-width: 767px)')
const FACTOR_MOVIL = 0.5
const factor = () => (esVertical.matches ? FACTOR_MOVIL : 1)

/** Una capa de resplandor: radial atmosférico por tokens, sin archivo. */
function pintarGlow(el, glow) {
  const { x = '50%', y = '50%', size = '50% 50%', token = '--glow-warm' } = glow
  el.style.backgroundImage = `radial-gradient(${size} at ${x} ${y}, var(${token}), transparent 70%)`
}

/** Una capa de imagen. `alt` vacío + aria-hidden: es decorado, no contenido. */
function pintarImagen(el, capa) {
  el.innerHTML = `<picture>
      <source srcset="/img/${capa.src}.avif" type="image/avif" />
      <source srcset="/img/${capa.src}.webp" type="image/webp" />
      <img src="/img/${capa.src}.webp" alt="${capa.alt || ''}"
           loading="lazy" decoding="async" />
    </picture>`
}

function montarSeccion(id, config) {
  const seccion = document.getElementById(id)
  const capas = config?.layers?.filter((c) => c && (c.src || c.glow)) || []
  if (!seccion || !capas.length) return

  const contenedor = document.createElement('div')
  contenedor.className = 'parallax'
  contenedor.setAttribute('aria-hidden', 'true') // decorado: no es contenido

  const elementos = capas.map((capa) => {
    const el = document.createElement('div')
    el.className = 'parallax__layer'
    el.dataset.plane = ['back', 'mid', 'front'].includes(capa.plane) ? capa.plane : 'mid'

    if (capa.src) pintarImagen(el, capa)
    else pintarGlow(el, capa.glow)

    // La opacidad viaja como par [oscuro, claro] y elige el CSS, igual que en
    // los backdrops: así cambiar de tema no tiene que volver a pasar por JS.
    const [oscuro, claro] = Array.isArray(capa.opacity)
      ? capa.opacity
      : [capa.opacity ?? 1, (capa.opacity ?? 1) * 0.8]
    el.style.setProperty('--capa-opacity-dark', String(oscuro))
    el.style.setProperty('--capa-opacity-light', String(claro))

    contenedor.appendChild(el)
    return { el, depth: Math.min(Math.max(capa.depth ?? 0.1, 0), DEPTH_MAX) }
  })

  // El hero ya coloca sus hijos por z-index (canvas, figura, contenido). El
  // contenedor se inserta el PRIMERO para que `data-plane` decida el orden desde
  // el CSS y no dependa de dónde caiga en el DOM.
  seccion.classList.add('has-parallax')
  seccion.prepend(contenedor)

  // Con reduced-motion las capas se QUEDAN, quietas. Son imagen, no movimiento:
  // el mismo criterio que backdrops.js.
  if (shouldReduceMotion()) return

  // UNA línea de tiempo por sección, no una por capa: es un solo ScrollTrigger
  // que medir y refrescar en vez de cinco. `ease: 'none'` es obligatorio en todo
  // lo scrubbeado (DESIGN.md §4, regla de oro).
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: seccion,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    },
  })
  for (const { el, depth } of elementos) {
    // El valor va como FUNCIÓN, no como número: con `invalidateOnRefresh` GSAP
    // la vuelve a llamar en cada remedida, así que cruzar el breakpoint recalcula
    // el viaje en lugar de dejarlo con el del ancho anterior.
    tl.to(el, { yPercent: () => depth * 100 * factor(), ease: 'none' }, 0)
  }

  // Cruzar el breakpoint no dispara por sí solo una remedida de ScrollTrigger:
  // el alto del documento no ha cambiado. Sin esto, el factor nuevo no se
  // aplicaría hasta el siguiente refresh que pidiera otro.
  esVertical.addEventListener('change', () => ScrollTrigger.refresh())
}

export function initParallax() {
  for (const [id, config] of Object.entries(manifiesto || {})) montarSeccion(id, config)
}
