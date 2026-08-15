// Fondos de sección con parallax (tarea 38).
//
// Lee src/data/media.js y monta una capa por cada fondo declarado. Si no hay
// nada declarado, este módulo no toca el DOM: sale en la primera línea.
//
// Reglas heredadas: un solo RAF (el parallax va con ScrollTrigger, que corre
// sobre gsap.ticker) y reduced-motion deja las capas quietas pero VISIBLES —
// son imagen, no movimiento.

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'
import { backdrops } from '../../data/media.js'
import { imageSet } from './image-set.js'

const DEPTH_MAX = 0.35 // por encima de esto el fondo compite con el texto

export function initBackdrops() {
  const entries = Object.entries(backdrops)
  if (!entries.length) return

  const reduced = shouldReduceMotion()

  entries.forEach(([sectionId, config]) => {
    const section = document.getElementById(sectionId)
    if (!section || !config?.layers?.length) return

    const wrap = document.createElement('div')
    wrap.className = 'backdrop'
    wrap.setAttribute('aria-hidden', 'true') // atrezo: no es contenido

    const layers = config.layers.map((layer) => {
      const el = document.createElement('div')
      el.className = 'backdrop__layer'
      const set = `image-set(${imageSet(layer.src, layer.formats)})`

      if (layer.tint) {
        // La textura se usa como MÁSCARA de un relleno plano en vez de como
        // imagen: la forma se conserva y el color pasa a ser exactamente el
        // token, sea cual sea el color con el que se generó el PNG. Así se
        // reaprovecha una textura fuera de paleta sin volver a generarla y sin
        // meter un hex fuera de tokens.css (PLAN.md §9.2).
        el.classList.add('backdrop__layer--tint')
        el.style.backgroundColor = `var(--${layer.tint})`
        el.style.maskImage = set
        el.style.webkitMaskImage = set
      } else {
        el.style.backgroundImage = set
      }
      el.style.opacity = String(layer.opacity ?? 0.4)
      wrap.appendChild(el)
      return { el, depth: Math.min(layer.depth ?? 0.1, DEPTH_MAX) }
    })

    section.classList.add('has-backdrop')
    section.prepend(wrap)

    if (reduced) return

    layers.forEach(({ el, depth }) => {
      gsap.to(el, {
        yPercent: depth * 100,
        ease: 'none', // scrub: regla de oro de DESIGN.md §4
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
    })
  })
}
