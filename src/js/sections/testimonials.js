import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'

export function initTestimonials() {
  const cards = [...document.querySelectorAll('.testimonial')]
  if (!cards.length || shouldReduceMotion()) return

  // El apilado es sticky por CSS (tarea 02). Aquí solo se añade el retroceso de
  // la card que queda debajo: la de arriba gana foco sin que la de abajo desaparezca.
  cards.forEach((card, i) => {
    gsap.from(card, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 88%', once: true },
    })

    // Solo `scale`: `opacity` ya la anima el reveal de arriba y dos tweens
    // disputándose la misma propiedad dejan el resultado al azar del overwrite.
    if (i === cards.length - 1) return
    gsap.to(card, {
      scale: 0.94,
      ease: 'none',
      scrollTrigger: {
        trigger: cards[i + 1],
        start: 'top 60%',
        end: 'top 25%',
        scrub: true,
      },
    })
  })
}
