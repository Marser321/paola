// Fondos de sección con parallax (tarea 38, remodelado 2026-08-15).
//
// Lee src/data/media.js y monta una capa por cada fondo declarado. Si no hay
// nada declarado, este módulo no toca el DOM: sale en la primera línea.
//
// Cada fondo es ahora un «plato» fotográfico anclado a un borde, con la alfa
// horneada en el archivo (ver el cabecero de media.js). Este módulo ya no monta
// capas teñidas por máscara: esa vía existía para reciclar texturas fuera de
// paleta y no queda ninguna.
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

    // El plato se ancla a un borde y ocupa poco más de media sección: la otra
    // mitad es la columna de lectura. La foto ya trae la alfa muriendo hacia ese
    // lado, así que el anclaje y el desvanecido apuntan al mismo sitio.
    wrap.dataset.side = config.side === 'left' ? 'left' : 'right'

    const layers = config.layers.map((layer) => {
      const el = document.createElement('div')
      el.className = 'backdrop__layer'
      el.style.backgroundImage = `image-set(${imageSet(layer.src, layer.formats)})`

      // `opacity` puede venir como número o como [oscuro, claro]. Se publican las
      // dos como custom properties y es el CSS quien elige según el tema: así el
      // cambio de tema no tiene que volver a pasar por JS.
      const [dark, light] = Array.isArray(layer.opacity)
        ? layer.opacity
        : [layer.opacity ?? 0.4, (layer.opacity ?? 0.4) * 0.72]
      el.style.setProperty('--layer-opacity-dark', String(dark))
      el.style.setProperty('--layer-opacity-light', String(light))

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
