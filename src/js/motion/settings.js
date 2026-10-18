import gsap from 'gsap'
import { shouldReduceMotion } from '../core/lenis.js'

export const motion = { fast: 0.2, scene: 0.6, entrance: 0.9, ease: 'power3.out' }
export const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )

// Animate only when entering the viewport: default HTML is always readable.
export function reveal(element, options = {}) {
  if (!element || shouldReduceMotion()) return
  gsap.from(element, {
    y: 32,
    duration: motion.entrance,
    ease: motion.ease,
    ...options,
    scrollTrigger: { trigger: element, start: 'top 92%', once: true },
  })
}

export function enterPanel(element) {
  if (shouldReduceMotion()) return
  gsap.fromTo(
    element,
    { y: 18, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: motion.scene,
      ease: motion.ease,
      overwrite: true,
      clearProps: 'transform,opacity',
    },
  )
}
