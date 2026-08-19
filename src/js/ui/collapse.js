import { ScrollTrigger } from 'gsap/ScrollTrigger'

// CONTRATO DE COLAPSO — un botón que abre y cierra un panel.
//
// Existe porque el sitio tiene dos acordeones —las muestras de cada servicio y
// las preguntas frecuentes— y hasta el 2026-08-16 solo existía el primero, con
// toda su mecánica escrita dentro de sections/services.js. Copiarla habría
// dejado dos comportamientos que se separan a la primera corrección.
//
// Lo que este módulo posee es el COMPORTAMIENTO, no el tamaño:
//   · el estado, que vive en `aria-expanded` del botón y en `.is-open` del panel;
//   · `inert` mientras está recogido, que es lo que lo saca del tabulador y del
//     lector de pantalla sin `display: none` — con `display: none` no habría
//     transición que animar;
//   · la REMEDIDA de ScrollTrigger al terminar de abrirse, que es el detalle que
//     de verdad se olvida al copiar y pegar (ver abajo).
//
// Cómo crece cada panel lo decide su CSS, y a propósito: la tira de servicios
// tiene altura conocida (`--strip-h`) y anima `height`; una respuesta de FAQ no
// la tiene y anima `grid-template-rows`. Forzar la misma estrategia habría sido
// una abstracción con gotera.

/**
 * @param {HTMLElement} button  el control. Recibe aria-expanded y aria-controls.
 * @param {HTMLElement} panel   el contenedor de colapso. Necesita `id`.
 * @param {object}      [opts]
 * @param {() => void}  [opts.onOpen]   se llama ANTES de la primera apertura:
 *                                      es donde se rellena el contenido diferido.
 * @param {(open:boolean) => void} [opts.onToggle] tras cada cambio de estado.
 */
export function initCollapse(button, panel, { onOpen, onToggle } = {}) {
  button.setAttribute('aria-expanded', 'false')
  button.setAttribute('aria-controls', panel.id)
  panel.inert = true

  // ⚠ La remedida va AL TERMINAR la transición, no al empezar: durante la
  // animación la altura sigue siendo la vieja y el refresh mediría contra ella.
  // El temporizador es la red de seguridad para cuando no hay transición que
  // termine —reduced-motion, o un navegador que no interpole la propiedad—; el
  // listener lo cancela cuando sí llega.
  let backstop = 0
  const remedir = () => {
    clearTimeout(backstop)
    backstop = 0
    ScrollTrigger.refresh()
  }

  panel.addEventListener('transitionend', (event) => {
    if (event.target !== panel) return
    if (event.propertyName === 'height' || event.propertyName === 'grid-template-rows') remedir()
  })

  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true'
    if (!open) onOpen?.()
    button.setAttribute('aria-expanded', String(!open))
    panel.classList.toggle('is-open', !open)
    panel.inert = open
    onToggle?.(!open)

    clearTimeout(backstop)
    backstop = setTimeout(remedir, 800)
  })
}
