import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const shouldReduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

export function initLenis() {
  if (shouldReduceMotion()) {
    // Sin smooth scroll: ScrollTrigger funciona con el scroll nativo.
    return null
  }

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

  return lenis
}

export function getLenis() {
  return lenis
}
