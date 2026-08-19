import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'

// COSTURAS ENTRE SECCIONES (estilos en styles/seams.css).
//
// El problema que resuelve: el sitio pasaba de una sección a la siguiente con un
// corte plano. Todo el trabajo de profundidad —los platos fotográficos, las
// capas de parallax— vivía DENTRO de cada sección y se acababa en su borde.
//
// La costura es lo que pasa en ese borde: un filete de luz que recorre el ancho
// mientras cruzas, el contenido de la sección que entra subiendo los últimos
// píxeles hasta su sitio, y el de la que sale alejándose un poco. Es scrub puro:
// no hay nada que se dispare, todo va atado a la posición del scroll.
//
// ⚠ POR QUÉ ES OPT-IN (`data-seam` en el HTML) Y NO AUTOMÁTICO. Dos secciones de
// esta página tienen recorridos de scroll propios —#proyectos va PINNEADO y
// #servicios lleva cabecera sticky— y una costura encima pelearía con
// ScrollTriggers ya medidos. Que haya que pedirla sección a sección obliga a
// pensarlo cada vez.

// Viaje del contenido, en px. Deliberadamente corto: la costura tiene que
// notarse al cruzarla, no convertirse en una animación de entrada. Lo que sube
// la sección entrante, lo baja la saliente multiplicado por SALIDA.
const VIAJE = 48
const SALIDA = 0.4
const ESCALA = 0.985   // la que sale se aleja; más que esto ya se lee como zoom
const APAGADO = 0.55   // opacidad mínima de la que sale

// ⚠ LO QUE NO SE PUEDE TRANSFORMAR. Un `transform` en un ancestro cambia el
// sistema de referencia de lo que lleva dentro: un `position: sticky` deja de
// pegarse donde debe y un pin de ScrollTrigger se descuadra. Estas cuatro son
// todas las piezas del sitio que se posicionan solas; si aparece una quinta,
// tiene que entrar en esta lista o su sección dejará de moverse bien EN SILENCIO.
const INTOCABLE = '.projects__cases, .services__header, .about__media, .testimonial'

/** El bloque de contenido de una sección, o null si no se puede tocar. */
function movible(seccion) {
  if (!seccion) return null
  const contenedor = seccion.querySelector(':scope > .container')
  if (!contenedor || contenedor.querySelector(INTOCABLE)) return null
  return contenedor
}

/** El filete de luz. Va SIEMPRE, también donde no se puede transformar nada. */
function montarFilete(seccion) {
  const filete = document.createElement('span')
  filete.className = 'seam'
  filete.setAttribute('aria-hidden', 'true') // decorado
  filete.innerHTML = '<i></i>'
  seccion.prepend(filete)
  return filete
}

function animarCostura(seccion, filete) {
  const entra = movible(seccion)
  const sale = movible(seccion.previousElementSibling)

  // UNA línea de tiempo por costura. La ventana va desde que el borde de la
  // sección asoma por abajo hasta que toca el techo: es exactamente el tramo en
  // el que las dos secciones comparten pantalla.
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: seccion,
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      invalidateOnRefresh: true,
    },
  })

  // El segmento luminoso cruza el filete de lado a lado. `ease: 'none'` es
  // obligatorio en todo lo scrubbeado (DESIGN.md §4, regla de oro).
  tl.fromTo(filete.firstElementChild,
    { xPercent: -120, opacity: 0 },
    { xPercent: 460, opacity: 1, ease: 'none' }, 0)

  if (entra) tl.fromTo(entra, { y: VIAJE }, { y: 0, ease: 'none' }, 0)
  if (sale) {
    tl.fromTo(sale,
      { y: 0, scale: 1, opacity: 1 },
      { y: -VIAJE * SALIDA, scale: ESCALA, opacity: APAGADO, ease: 'none' }, 0)
  }

  // Limpieza: mata SOLO su trigger y devuelve los dos bloques a su sitio. Nunca
  // `ScrollTrigger.getAll().kill()`, que en esta página serían más de cuarenta e
  // incluiría el pin horizontal de #proyectos (el porqué largo está en
  // fx/parallax.js §cabecera).
  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    gsap.set([entra, sale].filter(Boolean), { clearProps: 'transform,opacity' })
  }
}

export function initSeams() {
  const secciones = [...document.querySelectorAll('main section[data-seam]')]
  if (!secciones.length) return

  // El filete se monta SIEMPRE, en todos los tamaños y también con
  // reduced-motion: en reposo es lo que dice styles/seams.css, una línea de
  // separación. Lo que se condiciona es el movimiento, no la pieza.
  const filetes = secciones.map(montarFilete)
  if (shouldReduceMotion()) return

  // Por debajo de 768px, ni segmento viajero ni desplazamiento: el recorrido de
  // scroll de una sección es tan corto que la costura se consume de un tirón.
  // Con `gsap.matchMedia` el montaje y el desmontaje al cruzar el breakpoint son
  // automáticos, igual que en el scroll horizontal de sections/projects.js.
  gsap.matchMedia().add('(min-width: 768px)', () => {
    const limpiezas = secciones.map((seccion, i) => animarCostura(seccion, filetes[i]))
    // Las costuras insertan un hijo en cada sección: se remide una vez montadas
    // todas, no una por una.
    ScrollTrigger.refresh()
    return () => limpiezas.forEach((fn) => fn?.())
  })
}
