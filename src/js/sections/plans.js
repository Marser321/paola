import gsap from 'gsap'
import { shouldReduceMotion } from '../core/lenis.js'

// PLANES — «Tres formas de empezar».
//
// La sección es HTML estático: tres tarjetas escritas en index.html. Este módulo
// hace dos cosas y ninguna es pintar.
//
//   1. El CTA de cada plan PRECUALIFICA el formulario. Al pulsar «Pedir
//      propuesta», el desplegable de contacto se pone en ese plan. El scroll no
//      lo hace este módulo: los enlaces llevan `data-scroll` y de eso se encarga
//      Lenis (core/lenis.js), que es quien tiene que decidir cómo se viaja por
//      la página.
//
//      Por qué importa: un mensaje que llega diciendo «Gestión mensual» ya no
//      necesita la primera respuesta de vuelta preguntando qué quieres.
//
//   2. La entrada de las tarjetas al llegar a la sección, como el resto.

export function initPlans() {
  const section = document.getElementById('planes')
  if (!section) return

  const select = document.getElementById('cf-plan')

  // Listener DELEGADO en la sección: son tres CTAs y no hacen falta tres
  // listeners, igual que en el backstage de projects.js.
  section.addEventListener('click', (event) => {
    const cta = event.target.closest('[data-plan]')
    if (!cta || !select) return

    // Se comprueba que la opción existe en vez de asignarla a ciegas: si alguien
    // renombra un plan en el HTML y no toca el <select>, asignar un valor
    // inexistente dejaría el desplegable en su primera opción SIN AVISAR. Así al
    // menos se queda en lo que hubiera elegido la persona.
    const valor = cta.dataset.plan
    const existe = [...select.options].some((o) => o.value === valor)
    if (existe) select.value = valor
  })

  if (shouldReduceMotion()) return

  gsap.from(section.querySelectorAll('.plan-card'), {
    y: 60,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: { trigger: section, start: 'top 78%', once: true },
  })
}
