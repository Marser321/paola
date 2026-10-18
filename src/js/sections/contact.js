import gsap from 'gsap'
import { shouldReduceMotion } from '../core/lenis.js'
import { getLenis } from '../core/lenis.js'
import { formatLocale } from '../../i18n/index.js'
import { perfil } from '../../data/perfil.js'

export function initContact() {
  // --- Reloj local ---
  // Se cuelga del ticker de GSAP, NUNCA de un setInterval: PLAN.md §9.8 fija un
  // único RAF para todo el sitio y ese es el que ya mueve Lenis y ScrollTrigger.
  // (Hasta el 2026-08-16 se colgaba del tick del tracker, que era un consumidor
  // más de ese mismo ticker; al retirarse el tracker, el reloj se engancha
  // directamente donde estaba la fuente.)
  //
  // El ticker corre a la tasa de refresco, así que se escribe como mucho una vez
  // por segundo — y aun así solo cuando el string cambia.
  //
  // ⚠ Es la hora de PAOLA, no la del visitante. Hasta el 2026-10-17 el reloj no
  // llevaba zona horaria y enseñaba la del navegador que lo miraba —que no le
  // dice nada a nadie— con el formato de España. Sin `zonaHoraria` en
  // src/data/perfil.js la línea sigue `hidden` (index.html) y aquí no se arranca.
  const timeEl = document.getElementById('local-time')
  const { zonaHoraria } = perfil.contacto
  if (timeEl && zonaHoraria) {
    timeEl.closest('.contact__time').hidden = false
    let last = ''
    const paint = () => {
      const now = new Date().toLocaleTimeString(formatLocale(), {
        timeZone: zonaHoraria,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      if (now === last) return
      last = now
      timeEl.textContent = now
    }
    paint()
    gsap.ticker.add(paint)
  }

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
