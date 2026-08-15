import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'

function format(el, value) {
  const decimals = Number(el.dataset.decimals || 0)
  const prefix = el.dataset.prefix || ''
  const suffix = el.dataset.suffix || ''
  return `${prefix}${value.toFixed(decimals)}${suffix}`
}

// Inyecta el <svg> de la sparkline y devuelve su <path> (o null).
// Sin librerías: es una polilínea normalizada al alto del contenedor.
function buildSparkline(el) {
  const points = (el.dataset.spark || '')
    .split(',')
    .map(Number)
    .filter((n) => !Number.isNaN(n))
  if (points.length < 2) return null

  const W = 100
  const H = 24
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1

  const d = points
    .map((value, i) => {
      const x = (i / (points.length - 1)) * W
      const y = H - 1 - ((value - min) / span) * (H - 2)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')

  // preserveAspectRatio="none" estira en X; non-scaling-stroke mantiene el trazo en 1px.
  el.innerHTML =
    `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" width="100%" height="${H}" fill="none">` +
    `<path d="${d}" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/>` +
    `</svg>`

  return el.querySelector('path')
}

export function initMetrics() {
  const values = document.querySelectorAll('.metric__value[data-count]')
  if (!values.length) return

  const reduced = shouldReduceMotion()

  values.forEach((el) => {
    const target = Number(el.dataset.count)
    const metric = el.closest('.metric')
    const sparkEl = metric?.querySelector('.metric__spark')
    const path = sparkEl ? buildSparkline(sparkEl) : null

    if (reduced) {
      el.textContent = format(el, target)
      return // la sparkline queda dibujada y estática
    }

    // Trazo oculto hasta que entre en viewport
    let length = 0
    if (path) {
      length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
    }

    const state = { value: 0 }
    const tl = gsap.timeline({
      scrollTrigger: { trigger: metric || el, start: 'top 85%', once: true },
    })

    // back.out overshoot: el número se pasa y se asienta. 1.1 es deliberadamente
    // contenido — por encima de ~1.4 se lee como rebote de juguete, no como dato.
    tl.to(state, {
      value: target,
      duration: 2,
      ease: 'back.out(1.1)',
      onUpdate: () => {
        el.textContent = format(el, state.value)
      },
      onComplete: () => {
        el.textContent = format(el, target) // cierre exacto, sin residuo del easing
      },
    })

    if (path) {
      tl.to(path, { strokeDashoffset: 0, duration: 2, ease: 'power2.out' }, 0)
    }
  })

  // Reveal suave de las tarjetas de métrica
  if (!reduced) {
    gsap.from('.metric', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.metrics__grid',
        start: 'top 80%',
        once: true,
      },
    })
  }
}
