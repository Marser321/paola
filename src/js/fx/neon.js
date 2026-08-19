// Bordes de neón dorado (estilos en styles/neon.css).
//
// Este módulo NO anima nada por fotograma. Se limita a:
//   1. encender/apagar el giro de reposo según visibilidad (IntersectionObserver)
//   2. dibujar el trazo al entrar (scrub de ScrollTrigger, sobre el ticker)
//   3. mover el resplandor con el cursor (suscrito al único mousemove del sitio)
//
// Reglas que respeta: un solo RAF (PLAN.md §9.8), cero listeners de `scroll`,
// cero listeners de puntero propios, y salida limpia en reduced-motion (§9.6).

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'
import { onPointerMove } from '../core/cursor.js'

// Selector de las superficies que llevan neón. Añadir aquí, no en el HTML de
// cada sección, mantiene la lista de superficies en un solo sitio legible.
//
// Son las CAJAS reales del sitio: fondo, filete y radio propios, donde un marco
// de luz tiene sentido.
//
// `.service` se probó y se descartó: sus renglones se separan con un filete
// superior, no son cajas, así que el neón les dibujaba un rectángulo completo y
// convertía la lista en cinco tarjetas. Además la sección ya tiene su propia
// interacción fuerte (la galería de muestras). Para recuperarlo basta con
// añadir `, .service` aquí y darle un `border-radius`.
//
// `.caso__visual` (caso.html) tampoco entra: es el marco de la creatividad, no
// una tarjeta, y esa página no carga gsap ni cursor a propósito.
// `.sample` son las muestras de la galería elástica de servicios. Nacen en el
// primer despliegue de cada tira, así que quien las crea avisa con refreshNeon()
// (sections/services.js).
// `.report__panel` y `.hud` salieron de aquí el 2026-08-16 con el concepto
// «la campaña eres tú»; sus superficies las heredan las del bloque de venta.
const SURFACES =
  '.project-card, .contact-form, .testimonial, .sample, .plan-card, .calc__panel, .faq__item'

// Observer del gate de la floración. En scope de módulo para que refreshNeon()
// pueda observar las superficies nuevas sin montar un segundo observer.
let haloObserver = null

export function initNeon() {
  const surfaces = decorate()

  // Lo que sí se salta reduced-motion es todo lo que se mueve.
  if (shouldReduceMotion()) return

  mountFrame()
  haloObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle('is-live', entry.isIntersecting)
      }
    },
    { rootMargin: '10% 0px' } // encender justo antes de entrar, no al aparecer
  )
  surfaces.forEach((el) => haloObserver.observe(el))
  drawOnScroll(surfaces)
  followPointer()
}

/**
 * Vuelve a decorar las superficies que se hayan recreado. Lo necesita el cambio
 * de idioma: refreshProjects() reescribe el innerHTML de .projects__track, y con
 * él se van la clase .neon y el halo de las seis cards — que se quedarían SIN
 * borde y sin aviso ninguno.
 *
 * Solo toca lo que aún no está decorado, así que es idempotente: llamarlo de más
 * no duplica halos, ni triggers, ni el marco perimetral.
 */
export function refreshNeon() {
  const nuevas = decorate()
  if (shouldReduceMotion() || !nuevas.length) return

  nuevas.forEach((el) => haloObserver?.observe(el))
  drawOnScroll(nuevas)
}

/**
 * Marca y prepara las superficies todavía sin decorar. Devuelve solo esas.
 *
 * La clase se pone SIEMPRE, también en reduced-motion: es de ella de quien
 * cuelga el borde dorado fijo del media query de neon.css. Si saliéramos antes
 * de ponerla, reduced-motion se quedaría sin bordes en vez de con bordes
 * quietos, que es lo contrario de lo que se pretende.
 */
function decorate() {
  const surfaces = [...document.querySelectorAll(SURFACES)].filter(
    (el) => !el.classList.contains('neon')
  )
  surfaces.forEach((el) => el.classList.add('neon'))
  if (!shouldReduceMotion()) surfaces.forEach(mountHalo)
  return surfaces
}

/**
 * Capa de floración de la superficie. Es un elemento y no un pseudo porque
 * ::before y ::after ya están ocupados por el filete y el núcleo especular, y
 * un `filter` sobre ellos difuminaría también el núcleo.
 *
 * Va POSICIONADO EN ABSOLUTO, así que sale del flujo: no altera el `gap` del
 * flex de .contact-form ni el grid de las cards. Y `aria-hidden` porque es
 * atrezo — un lector de pantalla no tiene nada que hacer aquí.
 */
function mountHalo(surface) {
  const halo = document.createElement('i')
  halo.className = 'neon__halo'
  halo.setAttribute('aria-hidden', 'true')
  surface.prepend(halo)
}

/**
 * Marco perimetral de la ventana. Su ángulo no gira en bucle: lo escribe el
 * scroll del documento, así que la luz recorre el perímetro al bajar y se para
 * cuando el scroll se para. Tres vueltas completas de arriba abajo de la página.
 */
function mountFrame() {
  const frame = document.createElement('div')
  frame.className = 'neon-frame'
  frame.setAttribute('aria-hidden', 'true') // atrezo, no contenido
  document.body.appendChild(frame)

  gsap.to(frame, {
    '--neon-angle': '1080deg',
    ease: 'none', // scrub: regla de oro de DESIGN.md §4
    scrollTrigger: {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  })
}

/** El trazo se dibuja de 0 a 1 mientras la superficie sube por el viewport. */
function drawOnScroll(surfaces) {
  surfaces.forEach((el) => {
    // Una superficie `fixed` (el HUD) no sube por ningún sitio: su posición no
    // depende del scroll, así que un ScrollTrigger ahí no mide nada. Nace
    // encendida y punto. Sin este corte el trazo salía a 1 igualmente, pero por
    // casualidad de dónde cae su `top`, no porque nadie lo hubiera decidido.
    if (getComputedStyle(el).position === 'fixed') {
      el.style.setProperty('--neon-progress', '1')
      return
    }
    gsap.fromTo(
      el,
      { '--neon-progress': 0 },
      {
        '--neon-progress': 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          end: 'top 55%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    )
  })
}

/**
 * El resplandor sigue al cursor dentro de la superficie que tiene debajo.
 *
 * Se suscribe al mousemove de cursor.js en vez de añadir otro (§9.8). Como
 * initCursor() sale en táctil y en reduced-motion, aquí tampoco corre nada en
 * esos casos — que es lo correcto: es un efecto de puntero.
 *
 * El rect se cachea y solo se relee al cambiar de superficie: leerlo en cada
 * mousemove forzaría un layout por fotograma justo después de escribir las
 * custom properties. El precio es un desfase de unos píxeles si se scrollea y
 * se mueve el ratón a la vez, invisible en un radial de 18rem.
 */
function followPointer() {
  let current = null
  let rect = null

  ScrollTrigger.addEventListener('refresh', () => {
    rect = current ? current.getBoundingClientRect() : null
  })

  // Apagar es tan importante como encender: sin esto la superficie que se
  // acaba de abandonar se queda con `.is-lit` y el foco congelado donde salió
  // el puntero, y a los pocos movimientos hay media página encendida.
  const release = () => {
    if (!current) return
    current.classList.remove('is-lit')
    current = null
    rect = null
  }

  onPointerMove((e) => {
    const surface = e.target.closest?.(SURFACES)
    if (!surface) {
      release()
      return
    }
    if (surface !== current) {
      release()
      current = surface
      rect = surface.getBoundingClientRect()
      surface.classList.add('is-lit')
    }
    surface.style.setProperty('--neon-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
    surface.style.setProperty('--neon-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
  })
}
