import gsap from 'gsap'
import { shouldReduceMotion } from '../core/lenis.js'

function splitTitle() {
  const title = document.querySelector('.hero__title')
  if (!title || title.dataset.split) return
  const text = title.textContent
  title.textContent = ''
  // aria-label="Paola" ya existe en el HTML (tarea 02) → accesibilidad OK
  ;[...text].forEach((char) => {
    const span = document.createElement('span')
    span.className = 'char'
    span.textContent = char
    span.setAttribute('aria-hidden', 'true')
    title.appendChild(span)
  })
  title.dataset.split = 'true'
}

function enter() {
  const chars = document.querySelectorAll('.hero__title .char')
  const label = document.querySelector('.hero__label')
  const subtitle = document.querySelector('.hero__subtitle')
  const meta = document.querySelector('.hero__meta')
  const scroll = document.querySelector('.hero__scroll')

  if (shouldReduceMotion()) {
    // Sin movimiento: nada que revelar, el HTML ya es visible por defecto.
    return
  }

  gsap.timeline()
    .from(label, { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' })
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
  // initPreloader() corre ANTES que initHero() y en reduced-motion despacha
  // 'app:ready' de forma síncrona: si el preloader ya no está, el evento ya pasó.
  if (!document.getElementById('preloader')) {
    enter()
    return
  }
  window.addEventListener('app:ready', enter, { once: true })
}
