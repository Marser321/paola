import gsap from 'gsap'
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

  // Contact remains fixed: no entrance transform and no cursor magnet.
}
