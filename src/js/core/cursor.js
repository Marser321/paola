import gsap from 'gsap'
import { shouldReduceMotion } from './lenis.js'

// Suscriptores al ÚNICO mousemove del sitio (PLAN.md §9.8: un solo RAF, y por el
// mismo motivo un solo listener global de puntero). Quien necesite la posición
// del ratón se apunta aquí en vez de añadir su propio listener.
//
// El array es de módulo y el handler lo lee en vivo, así que da igual si la
// suscripción llega antes o después de initCursor(). Y como initCursor() sale
// en touch y en reduced-motion, los suscriptores tampoco corren ahí — que es
// exactamente lo que quieren: son efectos de puntero.
const pointerSubscribers = []

export function onPointerMove(fn) {
  pointerSubscribers.push(fn)
}

export function initCursor() {
  const isTouch = window.matchMedia('(hover: none)').matches
  if (isTouch || shouldReduceMotion()) return

  // Elementos (creados por JS para mantener el HTML limpio)
  const dot = document.createElement('div')
  dot.className = 'cursor-dot'
  dot.setAttribute('aria-hidden', 'true')
  const ring = document.createElement('div')
  ring.className = 'cursor-ring'
  ring.setAttribute('aria-hidden', 'true')
  ring.innerHTML = '<span class="cursor-ring__label"></span>'
  document.body.append(dot, ring)

  const label = ring.querySelector('.cursor-ring__label')

  // GSAP es el ÚNICO dueño del transform de estos dos elementos: al escribir
  // `transform` limpia las propiedades independientes (translate/rotate/scale),
  // así que el centrado y el escalado de hover se hacen aquí, no en CSS.
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 })

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' })
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' })
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' })
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' })
  // `scale` es un alias de CSSPlugin y quickTo() no lo soporta (no renderiza nada):
  // el hover es esporádico, así que va con un tween normal.
  const ringScale = (value) =>
    gsap.to(ring, { scale: value, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })

  window.addEventListener('mousemove', (e) => {
    dotX(e.clientX)
    dotY(e.clientY)
    ringX(e.clientX)
    ringY(e.clientY)
    for (const fn of pointerSubscribers) fn(e)
  })

  // Estados hover — delegación de eventos (un solo listener para todo el sitio).
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-hover]')
    if (!target) return
    ring.classList.add('is-hover')
    if (target.dataset.hover === 'audience') {
      ring.classList.add('is-audience')
      label.textContent = target.dataset.cursorLabel || ''
      ringScale(1) // la píldora crece por padding, nunca por escala
    } else {
      ringScale(1.6)
    }
  })
  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-hover]')
    if (!target) return
    ring.classList.remove('is-hover', 'is-audience')
    label.textContent = ''
    ringScale(1)
  })

  // Ocultar cursor nativo solo cuando el custom está activo
  document.documentElement.classList.add('has-custom-cursor')
}
