import gsap from 'gsap'
import { shouldReduceMotion } from '../core/lenis.js'
import { figure } from '../../data/media.js'
import { t } from '../../i18n/index.js'
import { onPointerMove } from '../core/cursor.js'

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
 * ⚠ Aquí había un `matchMedia('(min-width: 1200px)')` que abortaba el montaje en
 * pantallas estrechas. Se ha quitado por dos motivos:
 *   1. La figura ya no es escenografía de escritorio, es el sujeto del hero, y
 *      existe en todos los anchos (ver .hero__figure en media.css).
 *   2. Era frágil de verdad: si la página arranca con el viewport aún sin medir
 *      —pestaña en segundo plano, panel de previsualización, restauración de
 *      sesión— `innerWidth` vale 0, la media query da false y la figura NO se
 *      montaba nunca, ni al volver a la pestaña. El hero se quedaba sin ella.
 * El coste es descargar el recorte también en móvil; es el LCP de la sección y
 * ahí es donde tiene que estar.
 */
function mountFigure() {
  const holder = document.querySelector('[data-figure]')
  if (!holder || !figure?.src || holder.firstChild) return

  holder.innerHTML = `<picture>
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
  // El movimiento va en la IMAGEN, no en el contenedor: el contenedor lleva su
  // propio translateX(-50%) para centrarse (móvil y ≥1600px) y una tween de
  // transform sobre él lo descentraría de golpe al arrancar. El contenedor solo
  // se funde en opacidad, que no toca el transform.
  const figImg = document.querySelector('.hero__figure img')

  if (shouldReduceMotion()) {
    // Sin movimiento: nada que revelar, el HTML ya es visible por defecto.
    return
  }

  gsap
    .timeline()
    .from(label, { opacity: 0, y: 20, duration: 0.45, ease: 'power3.out' })
    // La figura entra ANTES que el nombre y desde más lejos: es el sujeto de la
    // escena, y el nombre se monta sobre ella, no al revés.
    .from(fig, { opacity: 0, duration: 0.65, ease: 'power3.out' }, 0)
    .from(
      figImg,
      {
        yPercent: 5,
        scale: 1.04,
        transformOrigin: 'bottom center',
        duration: 1.2,
        ease: 'power3.out',
      },
      0,
    )
    .from(
      chars,
      {
        yPercent: 105,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.045,
      },
      '-=0.5',
    )
    .from(
      [subtitle, meta],
      {
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.1,
      },
      '-=0.8',
    )
    .from(scroll, { opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
}

export function initHero() {
  splitTitle()
  mountFigure()
  mountRoute()
  initDepth()
  // initPreloader() corre ANTES que initHero() y en reduced-motion despacha
  // 'app:ready' de forma síncrona: si el preloader ya no está, el evento ya pasó.
  if (!document.getElementById('preloader')) {
    enter()
    return
  }
  window.addEventListener('app:ready', enter, { once: true })
}

function refreshRoute() {
  const route = document.querySelector('.hero-route')
  if (!route) return
  route.querySelector('.hero-route__label').textContent = t('experience.heroRouteLabel')
  route
    .querySelectorAll('.hero-route__name')
    .forEach((el, i) => (el.textContent = t('experience.heroRoute')[i]))
}
function mountRoute() {
  const route = document.createElement('div')
  route.className = 'hero-route'
  route.innerHTML =
    '<p class="hero-route__label mono"></p><ol>' +
    [0, 1, 2]
      .map(
        (i) =>
          `<li><span class="hero-route__point" aria-hidden="true">0${i + 1}</span><span class="hero-route__name"></span></li>`,
      )
      .join('') +
    '</ol>'
  document.querySelector('.hero__meta').before(route)
  refreshRoute()
  window.addEventListener('i18n:change', refreshRoute)
  if (shouldReduceMotion()) return
  const play = () =>
    gsap.fromTo(
      route.querySelectorAll('li'),
      { y: 15, opacity: 0.3 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out' },
    )
  if (!document.getElementById('preloader')) play()
  else window.addEventListener('app:ready', play, { once: true })
}
function initDepth() {
  if (shouldReduceMotion()) return
  gsap.matchMedia().add('(min-width:1024px) and (hover:hover)', () => {
    const hero = document.querySelector('.hero'),
      picture = hero.querySelector('.hero__figure picture')
    const setX = gsap.quickTo(picture, 'x', { duration: 0.9, ease: 'power3.out' }),
      setY = gsap.quickTo(picture, 'y', { duration: 0.9, ease: 'power3.out' })
    let enabled = true
    onPointerMove((event) => {
      if (!enabled || window.scrollY > hero.offsetHeight) return
      const r = hero.getBoundingClientRect()
      setX((event.clientX / window.innerWidth - 0.5) * 20)
      setY(((event.clientY - r.top) / r.height - 0.5) * 20)
    })
    gsap.fromTo(
      hero.querySelector('.hero__figure img'),
      { y: 0 },
      {
        y: 28,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
      },
    )
    return () => {
      enabled = false
      gsap.set(picture, { clearProps: 'transform' })
    }
  })
}
