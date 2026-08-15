import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'

export function initProcess() {
  const timeline = document.querySelector('.process__timeline')
  const line = document.querySelector('.process__line')
  if (!timeline || !line) return

  if (shouldReduceMotion()) {
    // La línea es información (marca el recorrido): se pinta entera, sin dibujarse.
    gsap.set(line, { scaleY: 1 })
    return
  }

  // Línea dibujada con scrub: ease 'none' es obligatorio en todo lo scrubbeado
  // (DESIGN.md §4, regla de oro).
  gsap.to(line, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: timeline,
      start: 'top 75%',
      end: 'bottom 75%',
      scrub: true,
    },
  })

  gsap.from('.step', {
    y: 40,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: timeline,
      start: 'top 78%',
      once: true,
    },
  })
}
