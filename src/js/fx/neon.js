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
// Las tres son PANELES con radio propio, donde un marco de luz tiene sentido.
// `.service` se probó y se descartó: sus renglones se separan con un filete
// superior, no son cajas, así que el neón les dibujaba un rectángulo completo y
// convertía la lista en cinco tarjetas. Además la sección ya tiene su propia
// interacción fuerte (la galería de muestras) y sumarle un borde animado por
// renglón era justo la sobrecarga que se quería evitar. Para recuperarlo basta
// con añadir `, .service` aquí y darle un `border-radius`.
const SURFACES = '.project-card, .report__panel, .contact-form'

export function initNeon() {
  const surfaces = [...document.querySelectorAll(SURFACES)]
  // La clase se pone SIEMPRE, también en reduced-motion: es de ella de quien
  // cuelga el borde dorado fijo del media query de neon.css. Si saliéramos antes
  // de ponerla, reduced-motion se quedaría sin bordes en vez de con bordes
  // quietos, que es lo contrario de lo que se pretende.
  surfaces.forEach((el) => el.classList.add('neon'))

  // Lo que sí se salta reduced-motion es todo lo que se mueve.
  if (shouldReduceMotion()) return

  mountFrame()
  gateIdleSpin(surfaces)
  drawOnScroll(surfaces)
  followPointer()
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

/**
 * El giro de reposo solo corre en las superficies visibles. Sin este gate
 * habría ~13 conic-gradients animándose a la vez, casi todos fuera de pantalla.
 *
 * IntersectionObserver y no ScrollTrigger: es la herramienta que PLAN.md §9.7 ya
 * prescribe para pausar el WebGL, no toca el ticker y cuesta 1 observer en vez
 * de 13 triggers.
 */
function gateIdleSpin(surfaces) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle('is-live', entry.isIntersecting)
      }
    },
    { rootMargin: '10% 0px' } // encender justo antes de entrar, no al aparecer
  )
  surfaces.forEach((el) => observer.observe(el))
}

/** El trazo se dibuja de 0 a 1 mientras la superficie sube por el viewport. */
function drawOnScroll(surfaces) {
  surfaces.forEach((el) => {
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

  onPointerMove((e) => {
    const surface = e.target.closest?.(SURFACES)
    if (!surface) {
      current = null
      rect = null
      return
    }
    if (surface !== current) {
      current = surface
      rect = surface.getBoundingClientRect()
    }
    surface.style.setProperty('--neon-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
    surface.style.setProperty('--neon-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
  })
}
