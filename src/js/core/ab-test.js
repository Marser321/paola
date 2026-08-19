// Test A/B del subtítulo del hero (CONTENT.md §3.1).
// El h1 "PAOLA" NO entra en el test: la marca es marca.

import gsap from 'gsap'
import { t } from '../../i18n/index.js'


function readAssigned() {
  try {
    const stored = sessionStorage.getItem('paola-variant')
    return stored === 'A' || stored === 'B' ? stored : null
  } catch {
    return null
  }
}

function storeAssigned(variant) {
  try {
    sessionStorage.setItem('paola-variant', variant)
  } catch {
    /* sin storage: la variante vive solo en memoria */
  }
}

// Los textos de las variantes salen del diccionario (CONTENT.md §3.1, t.28).
let current = 'A'
let slot = null

function paint(variant, { animate }) {
  if (!slot) return
  if (!animate) {
    slot.innerHTML = t(`variants.${variant}`)
    return
  }
  gsap
    .timeline()
    .to(slot, { opacity: 0, duration: 0.2, ease: 'power2.in' })
    .call(() => {
      slot.innerHTML = t(`variants.${variant}`)
    })
    .to(slot, { opacity: 1, duration: 0.3, ease: 'power2.out' })
}

export function getVariant() {
  return current
}

export function repaintVariant() {
  paint(current, { animate: false })
}

export function initAbTest() {
  slot = document.querySelector('[data-variant-slot="subtitle"]')
  if (!slot) return

  // Asignación estable dentro de la sesión: recargar no cambia de variante,
  // que es como funciona un test de verdad.
  current = readAssigned() || (Math.random() < 0.5 ? 'A' : 'B')
  storeAssigned(current)

  // Escritura INSTANTÁNEA: initHero() (tarea 07) anima el subtítulo justo después
  // desde el estado del DOM. Animar aquí haría visible el cambio de texto.
  paint(current, { animate: false })

  // ⚠ El conmutador manual de variante VIVÍA EN EL HUD y se fue con él
  // (2026-08-16). No se sustituye por otro botón: el sitio ya no publica en
  // ningún sitio qué variante te ha tocado, así que un control para cambiarla
  // no tendría nada que enseñar. El reparto 50/50 sigue, callado, que es como
  // funciona un test de verdad.
}
