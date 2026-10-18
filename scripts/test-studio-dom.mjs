import assert from 'node:assert/strict'
import fs from 'node:fs'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
// Optional DOM test runtime, installed outside the application. No browser or GPU.
// node scripts/test-studio-dom.mjs /absolute/path/to/jsdom/lib/api.js
if (!process.argv[2])
  throw new Error(
    'Pass the path to a temporary jsdom installation; see output/visual-audit/EXPERIENCIA-V3.md',
  )
const { JSDOM } = await import(pathToFileURL(resolve(process.argv[2])))
const root = fileURLToPath(new URL('../', import.meta.url))
const dom = new JSDOM(fs.readFileSync(root + 'dist/index.html', 'utf8'), {
  url: 'http://localhost',
  pretendToBeVisual: true,
})
const { window } = dom
for (const key of [
  'window',
  'Node',
  'document',
  'HTMLElement',
  'Element',
  'SVGElement',
  'CustomEvent',
  'getComputedStyle',
  'localStorage',
])
  globalThis[key] =
    key === 'window'
      ? window
      : typeof window[key] === 'function' && key === 'getComputedStyle'
        ? window[key].bind(window)
        : window[key]
Object.defineProperty(globalThis, 'navigator', {
  value: window.navigator,
  configurable: true,
})
globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window)
globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window)
globalThis.innerHeight = 1000
globalThis.innerWidth = 1440
let reduce = true
let compact = false
const mediaListeners = []
window.matchMedia = globalThis.matchMedia = (query) => ({
  get matches() {
    return query.includes('prefers-reduced-motion')
      ? reduce
      : query.includes('max-width: 599px')
        ? compact
        : false
  },
  media: query,
  addListener() {},
  removeListener() {},
  addEventListener(type, fn) {
    mediaListeners.push({ query, fn })
  },
  removeEventListener() {},
})
const observers = []
globalThis.IntersectionObserver = class {
  constructor(fn, opts) {
    this.fn = fn
    this.opts = opts
    observers.push(this)
  }
  observe(el) {
    this.el = el
  }
  disconnect() {}
}
globalThis.ResizeObserver = class {
  observe() {}
  disconnect() {}
}
window.scrollTo = () => {}
window.SVGElement.prototype.getTotalLength = () => 400
window.SVGElement.prototype.getPointAtLength = (n) => ({
  x: 65 + (350 * n) / 400,
  y: 90,
})
const imp = (p) => import(pathToFileURL(root + p))
const { createServiceDemo } = await imp('src/js/sections/service-demos.js')
const { setLang } = await imp('src/i18n/index.js')
const { applyStaticTranslations } = await imp('src/i18n/apply-dom.js')
const ids = [
  'meta-ads',
  'crm-ghl',
  'medicion',
  'landings',
  'ia-video',
  'auditoria',
]
const nodes = ids.map(() => {
  const el = document.createElement('div')
  document.body.append(el)
  return el
})
const controls = nodes.map((el, i) => createServiceDemo(el, i, ids[i]))
controls.forEach((c) => c.setVisible(true))
const click = (i, selector) => {
  const el = nodes[i].querySelector(selector)
  assert.ok(el, selector)
  el.click()
  return el
}
// Each service has one unique, descriptive, locally-backed photograph.
const photoSources = nodes.map((el) => {
  const photos = el.querySelectorAll('img')
  assert.equal(photos.length, 1)
  assert.ok(photos[0].alt.length > 20)
  assert.ok(fs.existsSync(root + 'public' + photos[0].getAttribute('src')))
  return photos[0].getAttribute('src')
})
assert.equal(new Set(photoSources).size, 6)
// Every meaningful state selects its own asset without replacing the picture.
function photoState(i) {
  const image = nodes[i].querySelector('img')
  const src = image.getAttribute('src')
  assert.equal(
    image.parentElement.querySelector('source').getAttribute('srcset'),
    src.replace('.webp', '.avif'),
  )
  assert.ok(fs.existsSync(root + 'public' + src))
  assert.ok(image.alt.length > 20)
  return src
}
for (const i of [0, 4, 5]) {
  const states = [0, 1, 2].map((step) => {
    click(i, `[data-choice="${step}"]`)
    return photoState(i)
  })
  assert.equal(new Set(states).size, 3, `unique state images for ${ids[i]}`)
  click(i, '[data-choice="0"]')
}
const crmStates = [photoState(1)]
for (let step = 0; step < 2; step++) {
  click(1, '[data-next]')
  crmStates.push(photoState(1))
}
assert.equal(new Set(crmStates).size, 3)
click(1, '[data-next]')
const signalStates = [photoState(2)]
click(2, '[data-event="appointment"]')
signalStates.push(photoState(2))
click(2, '[data-send-event]')
signalStates.push(photoState(2))
assert.equal(new Set(signalStates).size, 3)
click(2, '[data-event="inquiry"]')
const landingStates = [photoState(3)]
click(3, '[data-device="mobile"]')
landingStates.push(photoState(3))
click(3, '[data-reserve]')
landingStates.push(photoState(3))
assert.equal(new Set(landingStates).size, 3)
click(3, '[data-back]')
click(3, '[data-device="desktop"]')
for (const step of [2, 0, 1, 2, 1]) click(0, `[data-choice="${step}"]`)
const selectedPhoto = photoState(0)
const selectedAlt = nodes[0].querySelector('img').alt
setLang('en')
controls.forEach((c) => c.refresh())
assert.equal(photoState(0), selectedPhoto)
assert.notEqual(nodes[0].querySelector('img').alt, selectedAlt)
setLang('es')
controls.forEach((c) => c.refresh())
click(0, '[data-choice="0"]')
const sameNodes = nodes.map((el) => [...el.querySelectorAll('*')])
click(0, '[data-choice="2"]')
assert.equal(nodes[0].dataset.step, '2')
click(1, '[data-next]')
click(1, '[data-next]')
assert.equal(nodes[1].dataset.step, '2')
assert.equal(nodes[1].querySelectorAll('.demo-contact').length, 1)
click(2, '[data-event="appointment"]')
click(2, '[data-send-event]')
assert.match(
  nodes[2].querySelector('.demo-event-status').textContent,
  /Cita.*Meta/,
)
click(3, '[data-device="mobile"]')
click(3, '[data-reserve]')
assert.equal(nodes[3].querySelector('.demo-landing__offer').hidden, true)
assert.equal(document.activeElement, nodes[3].querySelector('[data-back]'))
click(4, '[data-choice="2"]')
assert.equal(nodes[4].querySelector('[data-film-frame="2"]').hidden, false)
click(5, '[data-choice="1"]')
assert.match(nodes[5].querySelector('[data-evidence]').textContent, /distintas/)
setLang('en')
applyStaticTranslations()
controls.forEach((c) => c.refresh())
assert.equal(nodes[1].dataset.step, '2')
assert.equal(nodes[3].dataset.device, 'mobile')
assert.equal(nodes[3].querySelector('.demo-landing__offer').hidden, true)
assert.equal(nodes[4].dataset.step, '2')
assert.match(
  nodes[2].querySelector('.demo-event-status').textContent,
  /Appointment.*Meta/,
)
assert.match(nodes[5].querySelector('[data-evidence]').textContent, /different/)
nodes.forEach((el, i) =>
  assert.deepEqual(
    [...el.querySelectorAll('*')],
    sameNodes[i],
    `persistent DOM ${ids[i]}`,
  ),
)
click(3, '[data-back]')
assert.equal(document.activeElement, nodes[3].querySelector('[data-reserve]'))
const keyTarget = nodes[0].querySelector('.demo-tabs [data-choice="2"]')
keyTarget.dispatchEvent(
  new window.KeyboardEvent('keydown', {
    key: 'ArrowRight',
    bubbles: true,
    cancelable: true,
  }),
)
assert.equal(nodes[0].dataset.step, '0')
assert.equal(
  document.activeElement,
  nodes[0].querySelector('.demo-tabs [data-choice="0"]'),
)
for (let j = 0; j < 20; j++) click(1, '[data-next]')
assert.equal(nodes[1].dataset.step, '1')
// Real timed playback: pause, resume, end, and offscreen pause.
reduce = false
controls[4].setVisible(true)
click(4, '[data-replay]')
const gsap = (await imp('node_modules/gsap/index.js')).default
// Select the actual tween via the global timeline (the state object is not a DOM node).
let video = gsap.globalTimeline.getChildren().find((t) => t.vars.playhead === 3)
assert.ok(video)
video.totalTime(2.5)
assert.equal(nodes[4].dataset.step, '1')
click(4, '[data-play]')
assert.equal(video.paused(), true)
click(4, '[data-play]')
video = gsap.globalTimeline
  .getChildren()
  .filter((t) => t.vars.playhead === 3)
  .at(-1)
controls[4].setVisible(false)
assert.equal(video.paused(), true)
controls[4].setVisible(true)
assert.equal(video.paused(), false)
video.progress(1)
assert.equal(nodes[4].dataset.step, '2')
assert.equal(
  nodes[4].querySelector('[data-play]').getAttribute('aria-pressed'),
  'false',
)
// Compact CRM keeps its contact in the viewport instead of translating it away.
compact = true
mediaListeners
  .filter((x) => x.query.includes('max-width: 599px'))
  .forEach((x) => x.fn())
assert.equal(
  gsap.getProperty(nodes[1].querySelector('.demo-crm__traveler'), 'xPercent'),
  0,
)
compact = false
mediaListeners
  .filter((x) => x.query.includes('max-width: 599px'))
  .forEach((x) => x.fn())
assert.equal(
  gsap.getProperty(nodes[1].querySelector('.demo-crm__traveler'), 'xPercent'),
  0,
)
nodes.forEach((el) =>
  el
    .querySelectorAll('[data-copy]')
    .forEach((node) => assert.notEqual(node.textContent, node.dataset.copy)),
)
assert.equal(nodes[0].querySelectorAll('.demo-faux-line').length, 0)
assert.ok(
  [...nodes[1].querySelectorAll('.demo-crm__slot')].every(
    (el) => el.textContent.trim().length > 10,
  ),
)
// The process tour is an actual timed six-stage loop with explicit pause controls.
const { initProcess, refreshProcess } = await imp('src/js/sections/process.js')
initProcess()
const processLayout = document.querySelector('.process-system')
const processObserver = observers.find((o) => o.el === processLayout)
const tourTimer = () =>
  gsap.globalTimeline
    .getChildren()
    .find((t) => t.vars.value === 1 && t.vars.duration === 8)
const activeStep = () =>
  document.querySelector('.step[data-estado="activa"] button').id
assert.equal(tourTimer().paused(), true)
processObserver.fn([{ isIntersecting: true }])
assert.equal(tourTimer().paused(), false)
for (let i = 1; i <= 6; i++) {
  tourTimer().progress(1)
  assert.equal(activeStep(), `process-choice-${i % 6}`)
}
assert.equal(
  document.querySelectorAll('.process__card:not([hidden])').length,
  1,
)
const processMap = processLayout.querySelector('.process-map')
processMap.dispatchEvent(new window.Event('pointerenter'))
assert.equal(tourTimer().paused(), true)
processMap.dispatchEvent(new window.Event('pointerleave'))
assert.equal(tourTimer().paused(), false)
document.querySelector('#process-choice-3').click()
assert.equal(activeStep(), 'process-choice-3')
assert.equal(tourTimer().paused(), true)
assert.equal(
  document.querySelector('[data-tour-toggle]').getAttribute('aria-pressed'),
  'false',
)
document.querySelector('[data-tour-toggle]').click()
assert.equal(tourTimer().paused(), false)
processObserver.fn([{ isIntersecting: false }])
assert.equal(tourTimer().paused(), true)
processObserver.fn([{ isIntersecting: true }])
assert.equal(tourTimer().paused(), false)
document.querySelector('#process-choice-2').focus()
assert.equal(tourTimer().paused(), true)
document.querySelector('[data-tour-toggle]').focus()
assert.equal(tourTimer().paused(), false)
setLang('es')
applyStaticTranslations()
refreshProcess()
assert.equal(activeStep(), 'process-choice-3')
assert.match(
  document.querySelector('[data-core-stage]').textContent,
  /Lanzamiento/,
)
const beforeTime = tourTimer().time()
refreshProcess()
assert.equal(tourTimer().time(), beforeTime)
reduce = true
mediaListeners
  .filter((x) => x.query.includes('prefers-reduced-motion'))
  .forEach((x) => x.fn())
assert.equal(tourTimer().paused(), true)
assert.equal(document.querySelector('[data-tour-toggle]').disabled, true)
document.querySelector('[data-tour-next]').click()
assert.equal(activeStep(), 'process-choice-4')
assert.equal(
  document.querySelectorAll('.process__card:not([hidden])').length,
  1,
)
reduce = false
// Metrics controller works without loading or requiring a GPU.
const { initMetricsExperience } = await imp(
  'src/js/sections/metrics-experience.js',
)
initMetricsExperience()
const list = document.querySelector('.data-sculpture .sector-bars')
list.children[8].querySelector('button').click()
assert.equal(list.querySelectorAll('[aria-pressed="true"]').length, 1)
assert.match(document.querySelector('[data-amount]').textContent, /241,943/)
list.children[8].querySelector('button').dispatchEvent(
  new window.KeyboardEvent('keydown', {
    key: 'Home',
    bubbles: true,
    cancelable: true,
  }),
)
assert.equal(
  list.children[0].querySelector('button').getAttribute('aria-pressed'),
  'true',
)
setLang('es')
assert.match(document.querySelector('[data-industry]').textContent, /Joyería/)
const { sectores, totalInvertido } = await imp('src/data/sectores.js')
const { perfil } = await imp('src/data/perfil.js')
const { metricsLayout } = await imp('src/js/webgl/metrics-layout.js')
const layout = metricsLayout(sectores)
assert.equal(totalInvertido, perfil.cifras.invertido)
assert.equal(layout.bars.length, 9)
assert.equal(layout.ceiling, 250000)
layout.bars.forEach((b, i) => {
  assert.equal(b.width, 0.62)
  assert.equal(b.depth, 0.62)
  assert.ok(
    Math.abs(
      b.height / layout.bars[0].height -
        sectores[i].invertido / sectores[0].invertido,
    ) < 1e-12,
  )
})
assert.equal(layout.ticks[0], 0)
assert.equal(layout.ticks.at(-1), layout.ceiling)
const { es } = await imp('src/i18n/es.js'),
  { en } = await imp('src/i18n/en.js')
assert.deepEqual(Object.keys(es.studio), Object.keys(en.studio))
for (const dict of [es, en]) {
  assert.equal(dict.studio.titles.length, 6)
  assert.ok(dict.studio.deliverables.every((x) => x.length === 3))
}
// A GPU failure leaves all nine HTML rows usable.
const canvasGetContext = window.HTMLCanvasElement.prototype.getContext
window.HTMLCanvasElement.prototype.getContext = () => null
const originalError = console.error
const expectedErrors = []
console.error = (...args) => expectedErrors.push(args.join(' '))
try {
  await observers
    .find((o) => o.opts?.rootMargin === '400px')
    .fn([{ isIntersecting: true }])
} finally {
  console.error = originalError
  window.HTMLCanvasElement.prototype.getContext = canvasGetContext
}
assert.ok(expectedErrors.every((message) => /WebGL|context/i.test(message)))
assert.equal(document.querySelector('.data-sculpture__visual').hidden, true)
assert.equal(list.querySelectorAll('button').length, 9)
console.log(
  'PASS: 6 persistent demos, CRM wrap/rapid input, event transport, reservation focus, language/state retention, keyboard navigation, playback/pause/offscreen/resume, sector selection/keyboard, exact amounts, nine proportional bars bilingual copy, compact CRM, filled demo states, process six-stage loop/pause/manual/reduced-motion.',
)
gsap.globalTimeline.clear()
gsap.ticker.sleep()
window.close()
process.exit(0)
