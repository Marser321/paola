// Panel de sesión. Consumidor del bus del tracker: no calcula nada, solo pinta.
// PLAN.md §11.1 — describe la campaña, nunca a la persona.

import { on, snapshot, getState, setHud, isHudEnabled, stageName } from '../core/tracker.js'
import { t } from '../../i18n/index.js'
import { shouldReduceMotion } from '../core/lenis.js'

const mmDesktop = window.matchMedia('(min-width: 1024px)')
const mmMobile = window.matchMedia('(max-width: 767px)')

function mmss(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function initHud() {
  const footerToggle = document.getElementById('hud-toggle')
  let root = null
  let out = null          // referencias a los nodos de valor
  let cache = {}          // último string escrito por clave — evita tocar el DOM en balde
  let built = false

  // --- Construcción diferida --------------------------------------------------
  // Se construye en el PRIMER SCROLL, no en el arranque: initHud() corre antes del
  // preloader y no puede competir con él (PLAN.md §11.8). El disparador es el propio
  // tick del tracker, así que no hace falta ningún listener de scroll.
  function build() {
    if (built) return
    built = true

    root = document.createElement('aside')
    root.className = 'hud'
    root.setAttribute('aria-label', t('hud.aria'))

    const reduced = shouldReduceMotion()

    root.innerHTML = `
      <p class="hud__title mono">${t('hud.title')}</p>
      <dl class="hud__rows mono" aria-hidden="true">
        <div class="hud__row"><dt>${t('hud.elapsed')}</dt><dd data-hud="elapsed">00:00</dd></div>
        <div class="hud__row"><dt>${t('hud.depth')}</dt><dd data-hud="depth">0%</dd></div>
        <div class="hud__depth"><span data-hud="bar"></span></div>
        <div class="hud__row"><dt>${t('hud.stage')}</dt><dd data-hud="stage">Alcance</dd></div>
        <div class="hud__row"><dt>${t('hud.signals')}</dt><dd data-hud="signals">1</dd></div>
        <div class="hud__row"><dt>${t('hud.variant')}</dt><dd><span data-hud="variant">A</span>
          <button type="button" class="hud__link" data-hud-action="variant">${t('hud.switch')}</button></dd></div>
        ${reduced ? `<div class="hud__row"><dt>${t('hud.last')}</dt><dd data-hud="last">—</dd></div>` : ''}
      </dl>
      <button type="button" class="hud__off mono" data-hud-action="off" aria-pressed="true">${t('hud.off')}</button>
    `

    // Al final del body → último en el orden de tabulación (DESIGN.md §10).
    document.body.appendChild(root)

    out = {
      elapsed: root.querySelector('[data-hud="elapsed"]'),
      depth: root.querySelector('[data-hud="depth"]'),
      bar: root.querySelector('[data-hud="bar"]'),
      stage: root.querySelector('[data-hud="stage"]'),
      signals: root.querySelector('[data-hud="signals"]'),
      variant: root.querySelector('[data-hud="variant"]'),
      last: root.querySelector('[data-hud="last"]'),
    }

    root.querySelector('[data-hud-action="off"]').addEventListener('click', () => {
      setHud(false)
    })

    // Siembra con el estado ACTUAL. Sin esto, un HUD construido a mitad de página
    // (o reactivado desde el footer) muestra los valores por defecto del markup
    // hasta que llegue el siguiente evento del bus — y "Alcance" en la sección de
    // contacto se lee como panel roto.
    seed()

    if (!reduced) {
      requestAnimationFrame(() => root.classList.add('is-in'))
    } else {
      root.classList.add('is-in')
    }
  }

  function seed() {
    const s = getState()
    write('elapsed', mmss(s.elapsed))
    write('depth', `${Math.round(s.depth * 100)}%`)
    write('stage', stageName(s.stage) || '—')
    write('signals', String(s.signals.length))
    write('variant', s.variant)
    if (out?.bar) out.bar.style.transform = `scaleX(${s.depth.toFixed(3)})`
    if (s.converted) root?.classList.add('is-converted')
  }

  function destroy() {
    root?.remove()
    root = null
    out = null
    cache = {}
    built = false
  }

  // Escritura con caché: si el string no ha cambiado, no se toca el DOM.
  function write(key, value) {
    if (!out?.[key]) return
    if (cache[key] === value) return
    cache[key] = value
    out[key].textContent = value
  }

  // --- Visibilidad por breakpoint ---------------------------------------------
  // <768px el HUD está oculto por defecto (DESIGN.md §10): ahí compite con la barra
  // del navegador y el pulgar.
  function shouldShow() {
    return isHudEnabled() && !mmMobile.matches
  }

  function syncFooterToggle() {
    if (!footerToggle) return
    const off = !isHudEnabled()
    const hiddenByViewport = mmMobile.matches && isHudEnabled()
    footerToggle.hidden = !(off || hiddenByViewport)
    footerToggle.textContent = off ? t('hud.disabled') : t('hud.reactivate')
  }

  footerToggle?.addEventListener('click', () => {
    if (!isHudEnabled()) setHud(true)
    else build() // caso móvil: existe pero está oculto por viewport
    syncFooterToggle()
  })

  // --- Suscripciones al bus ----------------------------------------------------
  let tickCount = 0

  // El payload se llama `tickData`, NO `t`: `t` es la función de traducción
  // importada arriba y un parámetro con ese nombre la ensombrecería dentro del
  // callback. Es el tipo de fallo que no da error, solo comportamiento raro.
  on('tick', (tickData) => {
    if (!shouldShow()) return
    if (tickData.depth > 0) build()
    if (!built) return

    // Con reduced-motion el temporizador baja a 1 Hz; profundidad y etapa siguen
    // a 4 Hz porque son datos, no movimiento (DESIGN.md §10).
    tickCount += 1
    const slowClock = shouldReduceMotion() && tickCount % 4 !== 0
    if (!slowClock) write('elapsed', mmss(tickData.elapsed))

    const pct = Math.round(tickData.depth * 100)
    write('depth', `${pct}%`)
    if (out?.bar) out.bar.style.transform = `scaleX(${tickData.depth.toFixed(3)})`

    write('signals', String(tickData.signalCount))
  })

  on('stage', ({ to }) => {
    write('stage', stageName(to) || '—')
  })

  on('variant', ({ variant }) => {
    write('variant', variant)
  })

  on('signal', ({ name }) => {
    if (shouldReduceMotion()) write('last', name)
  })

  // Única celebración permitida en el HUD (DESIGN.md §10).
  on('conversion', () => {
    root?.classList.add('is-converted')
  })

  on('hud', ({ enabled }) => {
    if (enabled) {
      const s = snapshot()
      if (s.depth > 0) build()
    } else {
      destroy()
    }
    syncFooterToggle()
  })

  mmMobile.addEventListener('change', () => {
    if (!shouldShow()) destroy()
    syncFooterToggle()
  })

  // Cambio de idioma: el HUD se reconstruye entero. Es DOM generado por JS, así
  // que no lo alcanza el aplicador estático (t.28).
  window.addEventListener('i18n:change', () => {
    if (!built) { syncFooterToggle(); return }
    destroy()
    if (shouldShow()) build()
    syncFooterToggle()
  })

  syncFooterToggle()
}
