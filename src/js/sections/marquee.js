import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'

const DURATION_DESKTOP = 26
const DURATION_MOBILE = 36 // más lento en móvil (DESIGN.md §8)
const MAX_BOOST = 2

export function initMarquee() {
  const marquees = [...document.querySelectorAll('.marquee')]
  if (!marquees.length) return

  // Reduced motion: los marquees se quedan estáticos y legibles (DESIGN.md §9).
  if (shouldReduceMotion()) return

  const duration = window.matchMedia('(max-width: 767px)').matches
    ? DURATION_MOBILE
    : DURATION_DESKTOP

  const loops = marquees.map((marquee) => {
    const track = marquee.querySelector('.marquee__track')
    if (!track) return null
    // El track lleva dos .marquee__inner idénticos: -50% es exactamente una copia,
    // así que el loop es perfectamente continuo.
    const reverse = marquee.classList.contains('marquee--reverse')
    gsap.set(track, { xPercent: reverse ? -50 : 0 })
    return gsap.to(track, {
      xPercent: reverse ? 0 : -50,
      duration,
      ease: 'none',
      repeat: -1,
    })
  }).filter(Boolean)

  const visible=new Set()
  const visibility=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target)
    })
    syncVisibility()
  },{rootMargin:'15% 0px'})
  function syncVisibility(){
    loops.forEach((loop,i)=>loop.paused(!visible.has(marquees[i])||document.hidden))
  }
  marquees.forEach(el=>visibility.observe(el))
  document.addEventListener('visibilitychange',syncVisibility)

  // Velocidad ∝ scroll. La velocidad la da ScrollTrigger (no hay listener de
  // 'scroll' propio, PLAN.md §9.8) y decae sola hasta 1.
  const speed = { value: 1 }

  ScrollTrigger.create({
    onUpdate: (self) => {
      const velocity = Math.abs(self.getVelocity())
      speed.value = gsap.utils.clamp(1, MAX_BOOST, 1 + velocity / 700)
      gsap.to(speed, {
        value: 1,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: true,
      })
    },
  })

  // Un único consumidor del ticker para los dos marquees.
  gsap.ticker.add(() => {
    loops.forEach((loop) => loop.timeScale(speed.value))
  })
}
