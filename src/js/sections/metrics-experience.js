import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { sectores, totalInvertido } from '../../data/sectores.js'
import { t } from '../../i18n/index.js'
import { shouldReduceMotion } from '../core/lenis.js'
import { metricsLayout } from '../webgl/metrics-layout.js'
import { escape as esc } from '../motion/settings.js'

export function initMetricsExperience() {
  const section = document.querySelector('.sector-chart')
  if (!section) return
  const list = section.querySelector('.sector-bars')
  const rows = [...list.children]
  const shell = document.createElement('div')
  shell.className = 'data-sculpture'
  shell.innerHTML =
    '<div class="data-sculpture__visual" hidden><div class="data-sculpture__heading"><span class="mono" data-total-label></span><strong data-total></strong></div><div class="data-sculpture__canvas"></div><div class="data-sculpture__scale mono"></div><div class="data-sculpture__selection" aria-live="polite"><span data-industry></span><strong data-amount></strong><span class="mono" data-share></span></div><div class="data-sculpture__tools"><p data-hint></p><button type="button" data-replay-chart></button></div></div>'
  list.before(shell)
  shell.append(list)
  let active = 0,
    renderer,
    visible = false,
    failed = false,
    entered = false
  const intro = document.createElement('div')
  intro.className = 'data-sculpture__intro'
  intro.innerHTML = '<h2></h2><p></p>'
  section.prepend(intro)
  rows.forEach((row, i) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'sector-bar__select'
    button.append(...row.childNodes)
    row.append(button)
    button.addEventListener('click', () => select(i))
  })
  const formatter = () =>
    new Intl.NumberFormat(t('htmlLang'), {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      currencyDisplay: 'code',
    })
  function select(index) {
    active = index
    rows.forEach((row, i) => {
      row.classList.toggle('is-selected', i === index)
      row
        .querySelector('button')
        .setAttribute('aria-pressed', String(i === index))
    })
    shell.querySelector('[data-industry]').textContent = t(
      `sectores.${sectores[index].id}.nombre`,
    )
    shell.querySelector('[data-amount]').textContent = formatter().format(
      sectores[index].invertido,
    )
    const pct = new Intl.NumberFormat(t('htmlLang'), {
      style: 'percent',
      maximumFractionDigits: 1,
    }).format(sectores[index].invertido / totalInvertido)
    shell.querySelector('[data-share]').textContent =
      `${pct} ${t('studio.metrics.share')}`
    renderer?.select(index)
  }
  function translate() {
    intro.querySelector('h2').textContent = t('studio.metrics.title')
    intro.querySelector('p').textContent = t('studio.metrics.intro')
    shell.querySelector('[data-total-label]').textContent = t(
      'studio.metrics.total',
    )
    shell.querySelector('[data-total]').textContent =
      formatter().format(totalInvertido)
    shell.querySelector('[data-hint]').textContent = t('studio.metrics.hint')
    shell.querySelector('[data-replay-chart]').textContent =
      `↻ ${t('studio.metrics.replay')}`
    shell
      .querySelector('.data-sculpture__canvas')
      .setAttribute('aria-label', t('studio.metrics.chart'))
    shell.querySelector('.data-sculpture__scale').innerHTML =
      `<span>${esc(t('studio.metrics.scale'))}</span><span>${metricsLayout(
        sectores,
      )
        .ticks.map((v) => (v ? v / 1000 + 'K' : '0'))
        .join(' / ')}</span>`
    list.setAttribute('aria-label', t('studio.metrics.select'))
    select(active)
  }
  translate()
  window.addEventListener('i18n:change', translate)
  shell
    .querySelector('[data-replay-chart]')
    .addEventListener('click', () => renderer?.replay())
  list.addEventListener('keydown', (e) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    const i =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? rows.length - 1
          : (active + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) %
            rows.length
    select(i)
    rows[i].querySelector('button').focus({ preventScroll: true })
  })
  const fallback = () => {
    failed = true
    shell.classList.remove('is-ready')
    shell.querySelector('.data-sculpture__visual').hidden = true
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting
      renderer?.setVisible(visible)
      if (visible && renderer && !entered) {
        entered = true
        renderer.replay()
      }
    },
    { threshold: 0.12 },
  )
  observer.observe(section)
  const lazy = new IntersectionObserver(
    async (entries) => {
      if (!entries[0].isIntersecting) return
      lazy.disconnect()
      try {
        const { createMetricsSculpture } =
          await import('../webgl/metrics-sculpture.js')
        renderer = createMetricsSculpture(
          shell.querySelector('.data-sculpture__canvas'),
          {
            data: sectores,
            onSelect: select,
            onFailure: fallback,
            reduced: shouldReduceMotion,
          },
        )
        if (failed) return
        shell.querySelector('.data-sculpture__visual').hidden = false
        shell.classList.add('is-ready')
        renderer.select(active)
        renderer.setVisible(visible)
        requestAnimationFrame(() => ScrollTrigger.refresh())
        if (visible) {
          entered = true
          renderer.replay()
        }
      } catch {
        renderer?.dispose()
        fallback()
      }
    },
    { rootMargin: '400px' },
  )
  lazy.observe(section)
}
