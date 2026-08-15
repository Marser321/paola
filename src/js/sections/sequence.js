// Secuencias de frames scrubeadas por scroll (tarea 38).
//
// Canvas **2D**, no WebGL: no suma contextos y por tanto no reincide en el
// problema que dejó desactivada la tarea 20 (BLOCKERS.md §B-02).
//
// Estrategia de carga, en este orden:
//   1. El frame fijo (`still`) se pinta como fondo CSS y se ve al instante.
//      Es lo que cuenta para el LCP.
//   2. Los frames se descargan en segundo plano, de 6 en 6.
//   3. Cuando hay suficientes, el canvas se revela y toma el relevo.
// Si la descarga falla o el visitante nunca llega a la sección, se queda el
// still y no ha pasado nada.

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'
import { sequences } from '../../data/media.js'
import { imageSet } from './image-set.js'

const CONCURRENCY = 6
const MOBILE = '(max-width: 767px)'

const frameUrl = (entry, i) =>
  `/img/${entry.dir}/${String(i + 1).padStart(4, '0')}.${entry.ext}`

async function loadFrame(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) return null
    return await createImageBitmap(await response.blob())
  } catch {
    return null
  }
}

// Descarga por lotes: 48 peticiones a la vez saturarían la conexión y
// retrasarían todo lo demás de la página.
async function loadFrames(entry, onProgress) {
  const frames = new Array(entry.frames).fill(null)
  let next = 0

  const worker = async () => {
    while (next < entry.frames) {
      const index = next++
      frames[index] = await loadFrame(frameUrl(entry, index))
      onProgress?.(index)
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  return frames
}

function coverDraw(ctx, bitmap, width, height) {
  const scale = Math.max(width / bitmap.width, height / bitmap.height)
  const w = bitmap.width * scale
  const h = bitmap.height * scale
  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(bitmap, (width - w) / 2, (height - h) / 2, w, h)
}

export function initSequences() {
  const entries = Object.entries(sequences)
  if (!entries.length) return

  entries.forEach(([sectionId, entry]) => {
    const section = document.getElementById(sectionId)
    if (!section || !entry?.frames) return

    const wrap = document.createElement('div')
    wrap.className = 'sequence'
    wrap.setAttribute('aria-hidden', 'true')

    if (entry.still) {
      wrap.style.backgroundImage = `image-set(${imageSet(entry.still, entry.stillFormats)})`
    }

    section.classList.add('has-backdrop') // reutiliza el z-index del contenido
    section.prepend(wrap)

    // En móvil y con reduced-motion la secuencia no se descarga siquiera:
    // se queda el frame fijo. Mismo criterio que el WebGL del hero (t.08).
    if (shouldReduceMotion() || window.matchMedia(MOBILE).matches) return

    const canvas = document.createElement('canvas')
    canvas.className = 'sequence__canvas'
    wrap.appendChild(canvas)
    const ctx = canvas.getContext('2d')

    let frames = []
    let current = -1
    let progress = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = wrap.clientWidth * dpr
      canvas.height = wrap.clientHeight * dpr
      draw(true)
    }

    const draw = (force = false) => {
      if (!frames.length) return
      const index = Math.min(frames.length - 1, Math.round(progress * (frames.length - 1)))
      if (index === current && !force) return
      const bitmap = frames[index]
      if (!bitmap) return
      current = index
      coverDraw(ctx, bitmap, canvas.width, canvas.height)
    }

    ScrollTrigger.create({
      trigger: entry.trigger ? document.querySelector(entry.trigger) : section,
      start: entry.start || 'top bottom',
      end: entry.end || 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progress = self.progress
        draw()
      },
    })

    window.addEventListener('resize', resize, { passive: true })

    // La descarga arranca cuando la sección se acerca, no en el arranque:
    // el hero es la excepción porque ya está en pantalla.
    const startLoading = () => {
      loadFrames(entry).then((loaded) => {
        frames = loaded.filter(Boolean)
        if (!frames.length) return // se queda el still, sin ruido
        resize()
        wrap.classList.add('is-ready')
      })
    }

    const io = new IntersectionObserver(
      ([intersecting]) => {
        if (!intersecting.isIntersecting) return
        io.disconnect()
        startLoading()
      },
      { rootMargin: '150% 0px' }
    )
    io.observe(section)
  })
}
