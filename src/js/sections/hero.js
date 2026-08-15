import gsap from 'gsap'
import { shouldReduceMotion } from '../core/lenis.js'
import { figure } from '../../data/media.js'

function splitTitle() {
  const title = document.querySelector('.hero__title')
  if (!title || title.dataset.split) return

  // El título son DOS líneas (PAOLA / PARRA) y cada una se parte por su cuenta:
  // partir el h1 entero metería el salto de línea entre los caracteres y las dos
  // líneas subirían como un solo bloque. Separadas, entran escalonadas.
  // aria-label="Paola Parra" ya está en el HTML → accesibilidad intacta.
  title.querySelectorAll('.hero__title-line').forEach((line) => {
    const text = line.textContent.trim()
    line.textContent = ''
    ;[...text].forEach((char) => {
      const span = document.createElement('span')
      span.className = 'char'
      span.textContent = char
      span.setAttribute('aria-hidden', 'true')
      line.appendChild(span)
    })
  })
  title.dataset.split = 'true'
}

/**
 * Monta la figura recortada del hero desde el manifiesto (src/data/media.js).
 *
 * El `<img>` solo se crea si hay sitio para él: por debajo de 1200px el CSS la
 * oculta, y crear el nodo igualmente descargaría 26 KB de AVIF para nada. Se
 * comprueba una vez, al arrancar; si alguien ensancha la ventana después, la
 * figura no aparece hasta la siguiente carga, que es un precio razonable por no
 * meter otro listener de resize.
 */
function mountFigure() {
  const holder = document.querySelector('[data-figure]')
  if (!holder || !figure?.src || holder.firstChild) return
  if (!window.matchMedia('(min-width: 1200px)').matches) return

  holder.innerHTML =
    `<picture>
       <source srcset="/img/${figure.src}.avif" type="image/avif" />
       <source srcset="/img/${figure.src}.webp" type="image/webp" />
       <img src="/img/${figure.src}.webp" alt="" width="${figure.width}"
            height="${figure.height}" decoding="async" fetchpriority="high" />
     </picture>`
}

function enter() {
  const chars = document.querySelectorAll('.hero__title .char')
  const label = document.querySelector('.hero__label')
  const subtitle = document.querySelector('.hero__subtitle')
  const meta = document.querySelector('.hero__meta')
  const scroll = document.querySelector('.hero__scroll')
  const fig = document.querySelector('.hero__figure')

  if (shouldReduceMotion()) {
    // Sin movimiento: nada que revelar, el HTML ya es visible por defecto.
    return
  }

  gsap.timeline()
    .from(label, { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' })
    // La figura entra ANTES que el nombre y desde más lejos: es el fondo de la
    // escena, y si entrara después parecería un recorte pegado encima.
    .from(fig, { opacity: 0, xPercent: 6, scale: 1.04, duration: 1.6, ease: 'power3.out' }, 0)
    .from(chars, {
      yPercent: 110,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.04,
    }, '-=0.5')
    .from([subtitle, meta], {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.1,
    }, '-=0.8')
    .from(scroll, { opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
}

export function initHero() {
  splitTitle()
  mountFigure()
  // initPreloader() corre ANTES que initHero() y en reduced-motion despacha
  // 'app:ready' de forma síncrona: si el preloader ya no está, el evento ya pasó.
  if (!document.getElementById('preloader')) {
    enter()
    return
  }
  window.addEventListener('app:ready', enter, { once: true })
}
