// Informe de sesión — el clímax del concepto (PLAN.md §1, CONTENT.md §14).
// Consumidor del bus: no calcula nada, solo hidrata.

import gsap from 'gsap'
import { on, snapshot, isHudEnabled } from '../core/tracker.js'
import { shouldReduceMotion } from '../core/lenis.js'
import { projects } from '../../data/projects.js'
import { t } from '../../i18n/index.js'

function mmss(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function titleOf(slug) {
  return projects.find((p) => p.id === slug)?.title || slug
}

export function initReport() {
  const section = document.getElementById('informe')
  if (!section) return

  const panel = section.querySelector('.report__panel')
  const out = {}
  section.querySelectorAll('[data-report]').forEach((el) => {
    out[el.dataset.report] = el
  })

  const cache = {}
  let visible = false
  let compiled = false
  let frozen = !isHudEnabled()

  // Región de anuncio ÚNICA. Se dispara una sola vez, al terminar de compilar.
  const live = document.createElement('p')
  live.className = 'sr-only'
  live.setAttribute('aria-live', 'polite')
  section.appendChild(live)

  function write(key, value) {
    const el = out[key]
    if (!el || cache[key] === value) return
    cache[key] = value
    el.textContent = value
  }

  function hydrate() {
    if (frozen) return
    const s = snapshot()

    write('elapsed', mmss(s.elapsed))
    write('depth', `${s.depth}%`)
    write('signals', String(s.signals))
    write('stage', s.stage)
    write('cases', `${s.casesSeen} / ${s.casesTotal}`)
    write('topcase', s.topCase ? `${titleOf(s.topCase.slug)} (${mmss(s.topCase.dwell)})` : '—')
    write('variant', s.variant + (s.variantForced ? t('report.forced') : ''))
    write('score', `${s.score}%`)

    if (out.scorebar) out.scorebar.style.transform = `scaleX(${(s.score / 100).toFixed(3)})`
    if (s.converted) write('status', t('report.status.converted'))
  }

  // --- Compilación -------------------------------------------------------------
  function compile() {
    if (compiled) return
    compiled = true

    if (shouldReduceMotion()) {
      write('status', t('report.status.done'))
      hydrate()
      live.textContent = t('report.announce')
      return
    }

    const text = t('report.status.compiling')
    const cursor = { i: 0 }

    gsap
      .timeline()
      // Typing SOLO de la línea de estado, con el ticker de GSAP (nunca setInterval,
      // nunca un carácter por timer). El contenido no se teclea: sería ilegible
      // con lector de pantalla y costoso.
      .to(cursor, {
        i: text.length,
        duration: 0.6,
        ease: 'none',
        onUpdate: () => {
          if (out.status) out.status.textContent = text.slice(0, Math.round(cursor.i))
        },
      })
      .from(section.querySelectorAll('.report__row'), {
        opacity: 0,
        y: 12,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.06,
        onStart: hydrate,
      }, '-=0.2')
      .call(() => {
        write('status', t('report.status.done'))
        live.textContent = t('report.announce')
      })
  }

  // --- Gate por visibilidad ------------------------------------------------------
  // Fuera de pantalla el informe no hace absolutamente nada.
  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting
      if (visible) compile()
    },
    { threshold: 0.25 }
  )
  io.observe(panel || section)

  on('tick', () => {
    if (!visible || !compiled) return
    hydrate()
  })

  // La conversión actualiza el informe en vivo, PERO no vuelve a anunciar:
  // un segundo aviso de lector de pantalla aquí sería ruido.
  on('conversion', () => {
    if (!frozen) {
      hydrate()
      write('status', t('report.status.converted'))
    }
  })

  on('hud', ({ enabled }) => {
    frozen = !enabled
    if (frozen) {
      write('status', t('report.status.off'))
      let note = section.querySelector('.report__off')
      if (!note) {
        note = document.createElement('p')
        note.className = 'report__off mono'
        note.textContent = t('report.offNote')
        panel?.appendChild(note)
      }
    } else {
      section.querySelector('.report__off')?.remove()
      hydrate()
    }
  })

  window.addEventListener('i18n:change', () => {
    cache.status = null // el estado se reescribe en el idioma nuevo
    if (compiled) write('status', frozen ? t('report.status.off') : t('report.status.done'))
    Object.keys(cache).forEach((k) => delete cache[k])
    hydrate()
  })

  // --- Fórmula -------------------------------------------------------------------
  const formulaBtn = section.querySelector('.report__formula-btn')
  const formula = section.querySelector('.report__formula')
  formulaBtn?.addEventListener('click', () => {
    const open = formulaBtn.getAttribute('aria-expanded') === 'true'
    formulaBtn.setAttribute('aria-expanded', String(!open))
    formulaBtn.textContent = open ? t('report.formulaShow') : t('report.formulaHide')
    if (formula) formula.hidden = open
  })
}
