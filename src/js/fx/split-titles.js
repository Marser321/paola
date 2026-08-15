// Split de H2 por palabras con máscara (tarea 21).

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'

// Envuelve cada palabra en .word-mask > .word, conservando los <span> internos
// (por ejemplo el .accent-text de "escalan", que debe seguir con su gradiente).
function splitByWords(title) {
  if (title.dataset.split) return []
  const words = []

  const walk = (node, target) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        child.textContent.split(/(\s+)/).forEach((chunk) => {
          if (!chunk.trim()) {
            target.appendChild(document.createTextNode(chunk))
            return
          }
          const mask = document.createElement('span')
          mask.className = 'word-mask'
          const word = document.createElement('span')
          word.className = 'word'
          word.textContent = chunk
          mask.appendChild(word)
          target.appendChild(mask)
          words.push(word)
        })
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        // Se clona el envoltorio (p. ej. <span class="accent-text">) y se
        // reparte su contenido en palabras dentro de él.
        const clone = child.cloneNode(false)
        target.appendChild(clone)
        walk(child, clone)
      }
    })
  }

  const frag = document.createDocumentFragment()
  walk(title, frag)
  title.textContent = ''
  title.appendChild(frag)
  title.dataset.split = 'true'
  return words
}

export function initSplitTitles() {
  if (shouldReduceMotion()) return

  // El h1 del hero queda fuera (tiene su animación por caracteres, tarea 07) y
  // el H2 del informe también: "La campaña eres tú" es el remate del sitio y
  // tiene que leerse limpio, no montado por palabras.
  const titles = document.querySelectorAll('main section:not(#informe) h2.section-title')

  titles.forEach((title) => {
    const words = splitByWords(title)
    if (!words.length) return

    gsap.from(words, {
      yPercent: 110,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.07,
      scrollTrigger: { trigger: title, start: 'top 85%', once: true },
    })
  })
}
