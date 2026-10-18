import gsap from 'gsap'
import { shouldReduceMotion } from '../core/lenis.js'

export function initSeams() {
  document.querySelectorAll('main section[data-seam]:not([hidden])').forEach((section) => {
    const line = document.createElement('span')
    line.className = 'seam'
    line.setAttribute('aria-hidden', 'true')
    line.innerHTML = '<i></i>'
    section.prepend(line)
    if (shouldReduceMotion()) return
    gsap.fromTo(
      line.querySelector('i'),
      { xPercent: -100, opacity: 0 },
      {
        xPercent: 560,
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 90%', once: true },
      },
    )
  })
}
