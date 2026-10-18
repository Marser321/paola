import gsap from 'gsap'
import { t } from '../../i18n/index.js'
import { shouldReduceMotion } from '../core/lenis.js'
import { enterPanel } from '../motion/settings.js'
import { serviceIcon } from '../ui/service-icons.js'

const STAGE_SECONDS = 8
const positions = Array.from({ length: 6 }, (_, i) => {
  const angle = ((i * 60 - 90) * Math.PI) / 180
  return [50 + 39 * Math.cos(angle), 50 + 39 * Math.sin(angle)]
})
const iconIndices = [5, 0, 4, 3, 2, 1]
let steps = [],
  cards = [],
  buttons = [],
  paths = [],
  center,
  map,
  layout,
  toolbar,
  selected = 0
let enabled = false,
  visible = false,
  hovered = false,
  focused = false,
  timer,
  travel,
  progress = { value: 0 },
  orbital = { angle: 0 }
const running = () =>
  enabled &&
  visible &&
  !hovered &&
  !focused &&
  !document.hidden &&
  !shouldReduceMotion()

function updateControls() {
  if (!toolbar) return
  const play = toolbar.querySelector('[data-tour-toggle]')
  play.setAttribute(
    'aria-label',
    t(enabled ? 'processTour.pause' : 'processTour.play'),
  )
  play.setAttribute('aria-pressed', String(enabled))
  play.disabled = shouldReduceMotion()
  play.querySelector('[data-tour-icon]').textContent = enabled ? 'Ⅱ' : '▷'
  play.querySelector('[data-tour-label]').textContent = t(
    enabled ? 'processTour.pause' : 'processTour.play',
  )
  const status = shouldReduceMotion()
    ? 'reduced'
    : !enabled
      ? 'paused'
      : hovered || focused
        ? 'hover'
        : 'auto'
  toolbar.querySelector('[data-tour-status]').textContent = t(
    'processTour.' + status,
  )
  toolbar
    .querySelector('[data-tour-previous]')
    .setAttribute('aria-label', t('processTour.previous'))
  toolbar
    .querySelector('[data-tour-next]')
    .setAttribute('aria-label', t('processTour.next'))
  layout.classList.toggle('is-running', running())
}
function gate() {
  if (running()) timer?.resume()
  else timer?.pause()
  if (visible && !document.hidden) {
    travel?.resume()
  } else travel?.pause()
  updateControls()
}
function startClock() {
  timer?.kill()
  progress.value = 0
  const ring = center.querySelector('.process-core__progress')
  ring.style.strokeDashoffset = '1'
  timer = gsap.to(progress, {
    value: 1,
    duration: STAGE_SECONDS,
    ease: 'none',
    paused: true,
    onUpdate: () => {
      ring.style.strokeDashoffset = String(1 - progress.value)
      toolbar.style.setProperty('--tour-progress', progress.value)
    },
    onComplete: () => select((selected + 1) % steps.length, true),
  })
  toolbar.style.setProperty('--tour-progress', 0)
  gate()
}
function moveOrbit(index, animate) {
  travel?.kill()
  const satellite = map.querySelector('.process-map__satellite')
  const arc = map.querySelector('.process-map__active-arc')
  let target = index * 60
  while (target < orbital.angle) target += 360
  if (target - orbital.angle > 180 && index !== (selected + 1) % 6)
    target -= 360
  const draw = () => {
    const angle = ((orbital.angle - 90) * Math.PI) / 180
    satellite.setAttribute('cx', String(50 + 39 * Math.cos(angle)))
    satellite.setAttribute('cy', String(50 + 39 * Math.sin(angle)))
    arc.style.strokeDashoffset = String(-orbital.angle / 360)
  }
  if (!animate || shouldReduceMotion()) {
    orbital.angle = index * 60
    draw()
    return
  }
  travel = gsap.to(orbital, {
    angle: target,
    duration: 0.8,
    ease: 'power2.inOut',
    onUpdate: draw,
    paused: !visible || document.hidden,
  })
}
function select(index, animate = true) {
  moveOrbit(index, animate)
  selected = index
  steps.forEach((li, i) => {
    li.dataset.estado = i === index ? 'activa' : 'inactiva'
    buttons[i].setAttribute('aria-expanded', String(i === index))
    if (i === index) buttons[i].setAttribute('aria-current', 'step')
    else buttons[i].removeAttribute('aria-current')
    cards[i].hidden = i !== index
    paths[i].classList.toggle('is-active', i === index)
  })
  center.querySelector('.process-map__index').textContent = `0${index + 1}`
  center.querySelector('.process-core__icon').innerHTML = serviceIcon(
    iconIndices[index],
  )
  center.querySelector('[data-core-stage]').textContent =
    t('process.steps')[index].title
  toolbar.querySelector('[data-tour-position]').textContent =
    `0${index + 1} / 06`
  toolbar.querySelector('[data-tour-upnext]').textContent =
    `${t('processTour.nextLabel')}: ${t('process.steps')[(index + 1) % 6].title}`
  if (animate && !shouldReduceMotion()) {
    enterPanel(cards[index])
    gsap.fromTo(
      paths[index],
      { strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        duration: 0.65,
        ease: 'power2.out',
        overwrite: true,
      },
    )
    gsap.fromTo(
      center.querySelector('.process-core__icon'),
      { opacity: 0.3, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.45, overwrite: true },
    )
  }
  startClock()
}
function manual(index) {
  enabled = false
  select(index)
}

export function initProcess() {
  const timeline = document.querySelector('.process__timeline')
  const list = timeline?.querySelector('.process__steps')
  if (!list) return
  steps = [...list.querySelectorAll('.step')]
  enabled = !shouldReduceMotion()
  layout = document.createElement('div')
  layout.className = 'process-system'
  map = document.createElement('div')
  map.className = 'process-map'
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const a = (i * Math.PI) / 30,
      r = i % 5 ? 46 : 45
    return `<line x1="${50 + r * Math.cos(a)}" y1="${50 + r * Math.sin(a)}" x2="${50 + 47 * Math.cos(a)}" y2="${50 + 47 * Math.sin(a)}"/>`
  }).join('')
  map.innerHTML = `<svg class="process-map__connections" viewBox="0 0 100 100" aria-hidden="true"><g class="process-map__ticks">${ticks}</g><circle cx="50" cy="50" r="39" class="process-map__orbit"/><circle cx="50" cy="50" r="39" pathLength="1" class="process-map__active-arc" transform="rotate(-90 50 50)"/>${positions.map(([x, y]) => `<path class="process-map__link" pathLength="1" d="M50 50 Q${x} 50 ${x} ${y}"/>`).join('')}<circle class="process-map__satellite" cx="50" cy="11" r=".85"/></svg><div class="process-map__center" aria-hidden="true"><svg class="process-core__globe" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44"/><g class="process-core__meridians"><ellipse cx="50" cy="50" rx="18" ry="44"/><ellipse cx="50" cy="50" rx="34" ry="44"/><ellipse cx="50" cy="50" rx="44" ry="15"/><ellipse cx="50" cy="50" rx="44" ry="31"/></g><circle class="process-core__progress" cx="50" cy="50" r="48" pathLength="1" transform="rotate(-90 50 50)"/></svg><span class="process-core__icon"></span><span class="process-map__index">01</span><strong data-core-stage></strong><span class="mono" data-core-system></span></div>`
  center = map.querySelector('.process-map__center')
  paths = [...map.querySelectorAll('.process-map__link')]
  const panels = document.createElement('div')
  panels.className = 'process-system__panels'
  cards = steps.map((li, i) => {
    const title = li.querySelector('.step__title'),
      desc = li.querySelector('.step__desc'),
      number = li.querySelector('.step__number')
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'step__chip'
    button.id = `process-choice-${i}`
    button.setAttribute('aria-controls', `process-panel-${i}`)
    const label = document.createElement('span')
    label.className = 'step__title'
    label.textContent = title.textContent
    title.remove()
    const icon = document.createElement('span')
    icon.className = 'step__icon'
    icon.innerHTML = serviceIcon(iconIndices[i])
    const text = document.createElement('span')
    text.className = 'step__label'
    text.append(number, label)
    button.append(icon, text)
    li.append(button)
    li.style.setProperty('--node-x', `${positions[i][0]}%`)
    li.style.setProperty('--node-y', `${positions[i][1]}%`)
    const card = document.createElement('div')
    card.className = 'process__card'
    card.id = `process-panel-${i}`
    card.setAttribute('role', 'region')
    card.setAttribute('aria-labelledby', button.id)
    card.innerHTML = `<div class="process__card-top"><span class="process__card-number" aria-hidden="true">0${i + 1}</span><span class="process__card-tag mono"></span><span class="process__card-icon" aria-hidden="true">${serviceIcon(iconIndices[i])}</span></div><div class="process__card-body"></div><div class="process__pieces">${[0, 1, 2].map((j) => `<span><i aria-hidden="true">0${j + 1}</i><span data-process-piece="${j}"></span></span>`).join('')}</div><div class="process__deliverable"><span class="mono"></span><p></p><span aria-hidden="true">↗</span></div><div class="process__card-route" aria-hidden="true">${steps.map((_, j) => `<i class="${j <= i ? 'is-done' : ''}"></i>`).join('')}</div>`
    card.querySelector('.process__card-body').append(desc)
    panels.append(card)
    buttons.push(button)
    button.addEventListener('click', () => manual(i))
    button.addEventListener('pointerenter', () =>
      paths[i].classList.add('is-preview'),
    )
    button.addEventListener('pointerleave', () =>
      paths[i].classList.remove('is-preview'),
    )
    button.addEventListener('keydown', (event) => {
      const next =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? 5
            : ['ArrowDown', 'ArrowRight'].includes(event.key)
              ? (i + 1) % 6
              : ['ArrowUp', 'ArrowLeft'].includes(event.key)
                ? (i + 5) % 6
                : undefined
      if (next === undefined) return
      event.preventDefault()
      manual(next)
      buttons[next].focus({ preventScroll: true })
    })
    return card
  })
  map.append(list)
  const hint = document.createElement('p')
  hint.className = 'process-system__hint'
  map.append(hint)
  toolbar = document.createElement('div')
  toolbar.className = 'process-tour'
  toolbar.innerHTML =
    '<div class="process-tour__status"><span class="mono" data-tour-status></span><span data-tour-upnext></span></div><div class="process-tour__controls"><button type="button" data-tour-previous>←</button><button type="button" data-tour-toggle><span data-tour-icon aria-hidden="true"></span><span data-tour-label></span></button><button type="button" data-tour-next>→</button><span class="mono" data-tour-position></span></div><span class="process-tour__progress" aria-hidden="true"><i></i></span>'
  layout.append(map, panels, toolbar)
  timeline.replaceWith(layout)
  toolbar.querySelector('[data-tour-toggle]').addEventListener('click', () => {
    enabled = !enabled
    gate()
  })
  toolbar
    .querySelector('[data-tour-previous]')
    .addEventListener('click', () => manual((selected + 5) % 6))
  toolbar
    .querySelector('[data-tour-next]')
    .addEventListener('click', () => manual((selected + 1) % 6))
  const hoveredRegions = new Set()
  ;[map, panels].forEach((el) => {
    el.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'touch') return
      hoveredRegions.add(el)
      hovered = true
      gate()
    })
    el.addEventListener('pointerleave', () => {
      hoveredRegions.delete(el)
      hovered = hoveredRegions.size > 0
      gate()
    })
  })
  layout.addEventListener('focusin', (event) => {
    focused = !!event.target.closest('.step__chip,.process__card')
    gate()
  })
  layout.addEventListener('focusout', () =>
    queueMicrotask(() => {
      focused = !!document.activeElement?.closest(
        '.process-system .step__chip,.process-system .process__card',
      )
      gate()
    }),
  )
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting
      gate()
    },
    { threshold: 0.15 },
  )
  observer.observe(layout)
  document.addEventListener('visibilitychange', gate)
  const media = matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', () => {
    if (media.matches) {
      enabled = false
      travel?.progress(1)
      gsap.killTweensOf(paths)
      paths.forEach((p) => (p.style.strokeDashoffset = '0'))
    }
    gate()
  })
  refreshProcess()
  select(0, false)
}
export function refreshProcess() {
  if (!center) return
  center.querySelector('[data-core-system]').textContent =
    t('experience.system')
  center.querySelector('[data-core-stage]').textContent =
    t('process.steps')[selected].title
  document.querySelector('.process-system__hint').textContent =
    t('processTour.hint')
  cards.forEach((card, i) => {
    card.querySelector('.process__card-tag').textContent =
      t('process.steps')[i].title
    card.querySelector('.process__deliverable .mono').textContent = t(
      'experience.deliverable',
    )
    card.querySelector('.process__deliverable p').textContent = t(
      'experience.deliverables',
    )[i]
    card
      .querySelectorAll('[data-process-piece]')
      .forEach(
        (el) =>
          (el.textContent =
            t('processTour.pieces')[i][+el.dataset.processPiece]),
      )
  })
  toolbar.querySelector('[data-tour-upnext]').textContent =
    `${t('processTour.nextLabel')}: ${t('process.steps')[(selected + 1) % 6].title}`
  updateControls()
}
