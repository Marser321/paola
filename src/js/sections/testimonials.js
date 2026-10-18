import gsap from 'gsap'
import { shouldReduceMotion } from '../core/lenis.js'
import { testimonios, esTestimonioPublicable } from '../../data/testimonios.js'

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

/**
 * Pinta los testimonios publicables y decide si la sección existe.
 *
 * #testimonios nace `hidden` en index.html. Con al menos un testimonio con
 * permiso se destapa; sin ninguno —hoy— se queda oculta y el resto del sitio la
 * trata como si no estuviera (fx/seams.js, fx/parallax.js y backdrops.js se
 * saltan las secciones ocultas). Va en el arranque, justo después de
 * renderProjects(), para que esa decisión esté tomada antes de que nadie mida.
 */
export function renderTestimonials() {
  const section = document.getElementById('testimonios')
  const stack = section?.querySelector('.testimonials__stack')
  if (!section || !stack) return

  const items = testimonios.filter(esTestimonioPublicable)
  section.hidden = items.length === 0
  if (!items.length) return

  stack.innerHTML = items
    .map((item) => {
      // «María L. — Dueña · Clínica estética» o, sin nombre, «Dueña · Clínica estética».
      const firma = [item.autor, [item.rol, item.sector].filter(Boolean).join(' · ')]
        .filter(Boolean)
        .join(' — ')
      return `
        <blockquote class="testimonial">
          <p class="testimonial__quote">«${esc(item.cita)}»</p>
          <footer class="testimonial__author mono">${esc(firma)} · ${esc(item.fuente)}</footer>
        </blockquote>`
    })
    .join('')
}

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
