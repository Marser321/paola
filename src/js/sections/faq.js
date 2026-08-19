import gsap from 'gsap'
import { shouldReduceMotion } from '../core/lenis.js'
import { initCollapse } from '../ui/collapse.js'

// PREGUNTAS FRECUENTES — «Antes de escribirme».
//
// PROGRESIVO, como el menú y el carrusel del proceso: en el HTML son seis
// preguntas con su respuesta, escritas y visibles. Si este módulo no corre, se
// leen todas seguidas y no falta nada — que es también lo que ve un buscador,
// porque el texto está en el markup y no en un diccionario.
//
// Lo que hace el módulo es CONVERTIR ese <h3> en el botón que abre y cierra su
// respuesta. El encabezado no se sustituye por un <button>: el <button> se mete
// DENTRO del <h3>. Así el nivel de encabezado sobrevive —quien navega por
// encabezados sigue encontrando las seis preguntas— y el control es un botón de
// verdad para el teclado. Es el patrón que recomienda la APG para acordeones.
//
// El comportamiento (estado, `inert`, remedida de ScrollTrigger) lo lleva el
// contrato compartido con la galería de servicios: ui/collapse.js.

export function initFaq() {
  const list = document.querySelector('.faq__list')
  if (!list) return

  const items = [...list.querySelectorAll('.faq__item')]

  items.forEach((item, i) => {
    const heading = item.querySelector('.faq__q')
    const answer = item.querySelector('.faq__a')
    if (!heading || !answer) return

    answer.id = `faq-a-${i}`

    // El texto del <h3> pasa a ser el rótulo del botón. `textContent` y no
    // `innerHTML`: aquí solo hay texto, y así no se cuela markup por descuido.
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'faq__question'
    button.setAttribute('data-hover', '')
    button.innerHTML = `<span class="faq__question-text"></span><span class="faq__sign" aria-hidden="true"></span>`
    button.querySelector('.faq__question-text').textContent = heading.textContent.trim()

    heading.textContent = ''
    heading.append(button)

    initCollapse(button, answer, {
      onToggle: (open) => item.classList.toggle('is-open', open),
    })
  })

  if (shouldReduceMotion()) return

  gsap.from(items, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: { trigger: list, start: 'top 82%', once: true },
  })
}
