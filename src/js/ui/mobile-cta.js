// Barra de acción fija en móvil (PROPUESTAS-NIVEL.md §C3).
//
// POR QUÉ EXISTE. El documento son ~16.000px y el único CTA vive al final. En
// escritorio da igual —el menú en píldoras lleva «Contacto» siempre a la vista—
// pero por debajo de 768px ese menú está plegado detrás de un botón. Quien se
// convence leyendo «Planes» o la calculadora no tiene dónde pulsar sin seguir
// bajando media página, y eso se paga en conversiones, no en estética.
//
// LO QUE NO HACE, y es deliberado. El panel de sesión retirado el 2026-08-16
// vivía anclado justo aquí abajo y se fue, entre otras cosas, por competir con
// el pulgar. Así que esta barra es UNA sola cosa: un enlace, opaco, sin contador,
// sin cerrar, sin segundo botón. Y se aparta sola en #contacto, donde el CTA de
// verdad ya ocupa la pantalla: dos llamadas a la misma acción a la vez es peor
// que ninguna.
//
// Presupuesto: cero listeners de scroll (PLAN.md §9.8). La visibilidad la
// deciden dos ScrollTrigger sin scrub, que solo se disparan al cruzar el borde.

import { ScrollTrigger } from 'gsap/ScrollTrigger'

const MOVIL = '(max-width: 767px)'

export function initMobileCta() {
  const bar = document.querySelector('.mobile-cta')
  if (!bar) return

  // matchMedia() de ScrollTrigger: crea los triggers al entrar en el rango y los
  // destruye al salir. Sin esto, rotar el móvil o abrir DevTools dejaría triggers
  // vivos midiendo una barra que el CSS ya no pinta.
  ScrollTrigger.matchMedia({
    [MOVIL]: () => {
      const mostrar = () => bar.classList.add('is-visible')
      const ocultar = () => bar.classList.remove('is-visible')

      // Aparece cuando el hero termina de salir. Antes de eso la promesa todavía
      // no se ha leído: pedir el contacto ahí es pedirlo a un desconocido.
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'bottom top',
        onEnter: mostrar,
        onLeaveBack: ocultar,
      })

      // Y se aparta en cuanto asoma la sección de contacto.
      ScrollTrigger.create({
        trigger: '#contacto',
        start: 'top 90%',
        onEnter: ocultar,
        onLeaveBack: mostrar,
      })
    },
  })
}
