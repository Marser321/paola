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

  // OJO con dos cosas (ver "⚠ No hacer"):
  // 1) Se apunta a .section-label__stage / __name, NO a .section-label: ese
  //    contenedor tiene DOS hijos <span> y scramblearlo por textContent los
  //    destruiría, perdiendo la jerarquía de color del label de etapa.
  // 2) La UI del tracker queda excluida: escribe los mismos nodos a 4 Hz.
  const targets = document.querySelectorAll(
    '.hero__meta span, .metric__label, .section-label__stage, .section-label__name, .projects__hint'
  )

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target
        // Cinturón además del selector: nada dentro del HUD, del informe ni de
        // un toast, pase lo que pase con el selector en el futuro.
        if (el.closest('.hud, .report, .signal-toast')) return
        observer.unobserve(el)
        el.dataset.original = el.textContent
        scrambleElement(el)
      })
    },
    { threshold: 0.6 }
  )

  targets.forEach((el) => observer.observe(el))
}
