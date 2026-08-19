// Scramble de labels mono (tarea 21).
// Un solo RAF en todo el sitio: se usa gsap.ticker, nunca requestAnimationFrame
// propio (PLAN.md §9.8). Era el último sitio donde quedaba uno suelto.

import gsap from 'gsap'
import { shouldReduceMotion } from '../core/lenis.js'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%$&/*'
const SPEED = 2.2 // caracteres revelados por tick

function scrambleElement(el) {
  const original = el.dataset.original ?? el.textContent
  const total = original.length
  let revealed = 0

  const frame = () => {
    revealed += SPEED
    const cut = Math.floor(revealed)

    if (cut >= total) {
      el.textContent = original
      gsap.ticker.remove(frame)
      return
    }

    let out = original.slice(0, cut)
    for (let i = cut; i < total; i++) {
      // Los espacios se respetan: si no, la palabra "salta" de ancho.
      out += original[i] === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]
    }
    el.textContent = out
  }

  gsap.ticker.add(frame)
}

export function initScramble() {
  if (shouldReduceMotion()) return

  // OJO: se apunta a .section-label__name, NO a .section-label. El contenedor es
  // el que lleva el filete y el margen; scramblearlo por textContent se llevaría
  // por delante el <span> de dentro. (Hasta el 2026-08-16 había DOS hijos, el
  // rótulo de etapa y el nombre; el de etapa se fue con el concepto de campaña.)
  const targets = document.querySelectorAll(
    '.hero__meta span, .metric__label, .section-label__name, .projects__hint'
  )

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target
        observer.unobserve(el)
        el.dataset.original = el.textContent
        scrambleElement(el)
      })
    },
    { threshold: 0.6 }
  )

  targets.forEach((el) => observer.observe(el))
}
