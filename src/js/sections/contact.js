import gsap from 'gsap'
import { shouldReduceMotion } from '../core/lenis.js'
import { getLenis } from '../core/lenis.js'
import { on, emit } from '../core/tracker.js'

export function initContact() {
  // --- Reloj local ---
  // Se cuelga del tick del tracker (4 Hz) en vez de un setInterval: PLAN.md §9.8
  // fija un único reloj para todo el sitio. Solo escribe cuando el string cambia.
  const timeEl = document.getElementById('local-time')
  if (timeEl) {
    let last = ''
    const paint = () => {
      const now = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      if (now === last) return
      last = now
      timeEl.textContent = now
    }
    paint()
    on('tick', paint)
  }

  // --- Conversión ---
  // El click en el CTA cierra el embudo. Se emite ANTES de que el mailto: se
  // lleve el foco de la pestaña.
  document.querySelector('[data-magnetic]')?.addEventListener('click', () => {
    emit('Conversion', { source: 'cta' })
  })

  // --- Back to top ---
  const backToTop = document.getElementById('back-to-top')
  backToTop?.addEventListener('click', () => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { duration: 1.6 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  // --- Reveal de la sección ---
  if (!shouldReduceMotion()) {
    gsap.from('.contact__pre, .contact__cta, .contact__email, .contact__time', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '#contacto', start: 'top 70%', once: true },
    })
  }

  // --- CTA magnético ---
  const cta = document.querySelector('[data-magnetic]')
  if (
    !cta ||
    shouldReduceMotion() ||
    window.matchMedia('(hover: none)').matches
  ) {
    return
  }

  const STRENGTH = 0.35
  const RADIUS = 120 // px alrededor del elemento

  const xTo = gsap.quickTo(cta, 'x', { duration: 0.4, ease: 'power2.out' })
  const yTo = gsap.quickTo(cta, 'y', { duration: 0.4, ease: 'power2.out' })

  window.addEventListener('mousemove', (e) => {
    const r = cta.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)

    if (dist < RADIUS + Math.max(r.width, r.height) / 2) {
      xTo(dx * STRENGTH)
      yTo(dy * STRENGTH)
    } else {
      xTo(0)
      yTo(0)
    }
  })
}
