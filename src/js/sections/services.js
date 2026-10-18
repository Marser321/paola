import gsap from 'gsap'
import { t } from '../../i18n/index.js'
import { shouldReduceMotion, getLenis } from '../core/lenis.js'
import { enterPanel } from '../motion/settings.js'
import { createServiceDemo } from './service-demos.js'

let rows = [],
  scenes = [],
  stage,
  active = 0
let desktop = false,
  navigationTarget = null
const demos = new WeakMap()
function show(index) {
  if (navigationTarget !== null && index !== navigationTarget) return
  active = index
  rows.forEach((row, i) => row.classList.toggle('is-active', i === index))
  scenes.forEach((scene, i) => {
    const wasHidden = scene.hidden
    scene.hidden = desktop && i !== index
    const bounds = scene.getBoundingClientRect()
    demos
      .get(scene)
      ?.setVisible(
        !scene.hidden && bounds.bottom > 0 && bounds.top < innerHeight,
      )
    if (desktop && i === index && wasHidden) enterPanel(scene)
  })
  stage
    ?.querySelectorAll('[data-service-jump]')
    .forEach((b, i) => b.setAttribute('aria-pressed', String(i === index)))
}
export function refreshServices() {
  const intro = document.querySelector('.services__intro')
  if (intro) intro.textContent = t('serviceVisuals.intro')
  rows.forEach((row, i) => {
    let list = row.querySelector('.service__deliverables')
    if (!list) {
      list = document.createElement('ul')
      list.className = 'service__deliverables'
      for (let j = 0; j < 3; j++) list.append(document.createElement('li'))
      row.querySelector('.service__copy').append(list)
    }
    ;[...list.children].forEach(
      (li, j) => (li.textContent = t('studio.deliverables')[i][j]),
    )
    let hint = row.querySelector('.service__hint')
    if (!hint) {
      hint = document.createElement('p')
      hint.className = 'service__hint'
      row.querySelector('.service__copy').append(hint)
    }
    hint.textContent = t('studio.hints')[i]
    demos.get(scenes[i])?.refresh()
  })
  stage
    ?.querySelector('.service-stage__nav')
    ?.setAttribute('aria-label', t('experience.servicesNav'))
  stage
    ?.querySelectorAll('[data-service-jump]')
    .forEach((b, i) =>
      b.setAttribute('aria-label', t('services.items')[i].title),
    )
  show(active)
}
export function initServices() {
  const header = document.querySelector('.services__header')
  if (!header) return
  rows = [...document.querySelectorAll('.service')]
  const intro = document.createElement('p')
  intro.className = 'services__intro'
  header.append(intro)
  const shell = document.createElement('div')
  shell.className = 'services__experience'
  const list = document.querySelector('.services__list')
  list.before(shell)
  shell.append(list)
  stage = document.createElement('div')
  stage.className = 'service-stage'
  stage.innerHTML = `<div class="service-stage__sticky"><div class="service-stage__scenes"></div><div class="service-stage__nav" role="group">${rows.map((_, i) => `<button type="button" data-service-jump="${i}"><span class="mono">0${i + 1}</span></button>`).join('')}</div></div>`
  shell.append(stage)
  scenes = rows.map((row, i) => {
    row.id = `service-${row.dataset.service}`
    row.querySelector('.service__fallback')?.remove()
    const copy = document.createElement('div')
    copy.className = 'service__copy'
    copy.append(...row.children)
    const scene = document.createElement('div')
    scene.className = `service-scene service-scene--${row.dataset.service}`
    scene.dataset.serviceIndex = i
    scene.id = `service-scene-${i}`
    row.append(copy, scene)
    return scene
  })
  scenes.forEach((scene, i) =>
    demos.set(scene, createServiceDemo(scene, i, rows[i].dataset.service)),
  )
  refreshServices()
  shell.addEventListener('click', (event) => {
    const jump = event.target.closest('[data-service-jump]')
    if (jump) {
      const i = Number(jump.dataset.serviceJump)
      navigationTarget = i
      const finish = () => {
        navigationTarget = null
        show(i)
      }
      const lenis = getLenis()
      if (lenis)
        lenis.scrollTo(rows[i], {
          offset: -(window.innerHeight - rows[i].offsetHeight) / 2,
          duration: 0.8,
          onComplete: finish,
        })
      else {
        rows[i].scrollIntoView({
          behavior: shouldReduceMotion() ? 'instant' : 'smooth',
          block: 'center',
        })
        setTimeout(finish, shouldReduceMotion() ? 0 : 800)
      }
      show(i)
      return
    }
  })
  gsap.matchMedia().add('(min-width: 1024px) and (min-height: 700px)', () => {
    desktop = true
    scenes.forEach((scene) =>
      stage.querySelector('.service-stage__scenes').append(scene),
    )
    const triggers = rows.map((row, i) =>
      gsap.to(
        {},
        {
          scrollTrigger: {
            trigger: row,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => show(i),
            onEnterBack: () => show(i),
          },
        },
      ),
    )
    show(active)
    return () => {
      triggers.forEach((tween) => tween.scrollTrigger?.kill())
      desktop = false
      scenes.forEach((scene, i) => rows[i].append(scene))
      show(active)
    }
  })
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        demos
          .get(entry.target)
          ?.setVisible(entry.isIntersecting && !entry.target.hidden)
      }),
    { threshold: 0.3 },
  )
  scenes.forEach((scene) => observer.observe(scene))
  document.addEventListener('visibilitychange', () => {
    scenes.forEach((scene) => {
      const bounds = scene.getBoundingClientRect()
      const visible =
        !document.hidden &&
        !scene.hidden &&
        bounds.bottom > 0 &&
        bounds.top < innerHeight
      demos.get(scene)?.setVisible(visible)
    })
  })
}
