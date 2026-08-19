import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const shouldReduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

/**
 * El elemento al que apunta el hash de la URL, o null.
 * `querySelector` LANZA con un hash que no sea un selector válido (`#3d`, `#!`),
 * y aquí el hash lo escribe cualquiera: un enlace compartido a mano, un cliente
 * de correo que añade su basura al final. Un error aquí abortaría initLenis() y
 * dejaría el sitio sin scroll suave.
 */
function anclaDelHash() {
  const hash = window.location.hash
  if (hash.length < 2) return null
  try {
    return document.querySelector(hash)
  } catch {
    return null
  }
}

export function initLenis() {
  if (shouldReduceMotion()) {
    // Sin smooth scroll: ScrollTrigger funciona con el scroll nativo, y ahí el
    // salto al ancla del navegador es exactamente lo que se quiere. Nada de lo
    // de abajo hace falta.
    return null
  }

  // ⚠ EL SCROLL DE ARRANQUE. Lenis lleva SU PROPIA posición y nace creyendo que
  // está donde estaba el documento al construirlo. Dos cosas la mueven antes de
  // que este módulo exista:
  //
  //   · el salto al ancla de `sitio.com/#proceso`, que hace el navegador al
  //     parsear el HTML;
  //   · la restauración de scroll al recargar a media página.
  //
  // En los dos casos el documento acaba a varios miles de píxeles mientras Lenis
  // cree estar en el 0, y ScrollTrigger —que se actualiza desde Lenis— mide
  // contra esa posición falsa: el pin horizontal de #proyectos se queda
  // enganchado tapando la pantalla hasta que alguien hace scroll a mano. Se veía
  // como una página en negro.
  //
  // La salida es que el arranque sea SIEMPRE el mismo: se desactiva la
  // restauración, se vuelve a arriba, y si había ancla se va a ella cuando el
  // sitio está montado y medido (§irAlAncla, más abajo).
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  const ancla = anclaDelHash()
  window.scrollTo(0, 0)

  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  // Anchors con lenis
  document.querySelectorAll('[data-scroll]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href')
      if (!hash || !hash.startsWith('#')) return
      const target = document.querySelector(hash)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target, { offset: 0, duration: 1.4 })
    })
  })

  // --- El ancla, cuando el sitio ya está montado ------------------------------
  // Se espera a `app:ready`, que anuncia el preloader al retirarse (core/
  // preloader.js §finish). Antes de ese momento la página todavía está detrás de
  // una cortina y ScrollTrigger sigue midiendo secciones cuyas imágenes entran.
  //
  // El salto es INSTANTÁNEO: quien abre un enlace a una sección quiere esa
  // sección, no el viaje. Y `force`, porque `scrollTo` normal no hace nada si
  // Lenis está parado — el preloader puede haberlo dejado así.
  let hecho = false
  const irAlAncla = () => {
    if (hecho || !ancla) return
    hecho = true
    // Primero medir, luego saltar. Al revés, los pines recalculan su recorrido
    // con la altura vieja del documento y el destino se mueve bajo los pies.
    ScrollTrigger.refresh()
    lenis.scrollTo(ancla, { immediate: true, force: true })
  }

  if (ancla) window.addEventListener('app:ready', irAlAncla, { once: true })

  // `load` cierra los dos flancos que quedan abiertos, y hace falta porque el
  // `scrollTo(0, 0)` de arriba corre en el módulo: si el navegador restaura la
  // posición DESPUÉS —lo hace, y hay navegadores que lo hacen incluso con
  // `scrollRestoration: 'manual'`—, gana él y volvemos al desajuste.
  window.addEventListener(
    'load',
    () => {
      if (ancla) {
        // Sin preloader no habrá `app:ready` que esperar: nadie lo anuncia.
        if (!document.getElementById('preloader')) irAlAncla()
        return
      }
      // Sin ancla, el arranque es arriba. Pero solo se corrige MIENTRAS SIGUE LA
      // CORTINA: si el preloader ya se retiró, la posición puede ser de alguien
      // que ha empezado a leer, y devolverla a cero sería arrancarle la página
      // de las manos.
      if (window.scrollY > 0 && document.getElementById('preloader')) {
        lenis.scrollTo(0, { immediate: true, force: true })
      }
    },
    { once: true }
  )

  return lenis
}

export function getLenis() {
  return lenis
}
