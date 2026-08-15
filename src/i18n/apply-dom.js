// Aplica el diccionario al DOM estático de index.html.
//
// Se hace desde aquí y no con atributos `data-i18n` sembrados por el markup: el
// HTML se queda limpio y toda la traducción vive en un archivo que se puede leer
// de arriba abajo. También permite tratar los casos raros (nodos de texto sueltos
// junto a elementos) sin ensuciar la plantilla.

import { t } from './index.js'

const STAGE_NUMBER = { alcance: '01', interes: '02', consideracion: '03', intencion: '04', conversion: '05' }
// Nombre de sección por id, para el segundo trozo del label de etapa.
const SECTION_LABEL = {
  metricas: 'results', proyectos: 'cases', servicios: 'services', proceso: 'process',
  'sobre-mi': 'about', testimonios: 'testimonials', informe: 'report', contacto: 'contact',
}

const set = (sel, value, root = document) => {
  const el = root.querySelector(sel)
  if (el && value !== undefined) el.textContent = value
}
const setHTML = (sel, value, root = document) => {
  const el = root.querySelector(sel)
  if (el && value !== undefined) el.innerHTML = value
}
const setEach = (sel, values, root = document) => {
  if (!Array.isArray(values)) return
  root.querySelectorAll(sel).forEach((el, i) => {
    if (values[i] !== undefined) el.textContent = values[i]
  })
}

export function applyStaticTranslations() {
  // --- Preloader (puede haber desaparecido ya: los helpers toleran null) ---
  set('.preloader__label', t('preloader.label'))
  set('.preloader__status', t('preloader.status'))

  // --- Nav ---
  const nav = ['projects', 'services', 'process', 'about', 'contact']
  document.querySelectorAll('.site-nav a').forEach((a, i) => {
    if (nav[i]) a.textContent = t(`nav.${nav[i]}`)
  })

  // --- Hero ---
  set('.hero__label', t('hero.label'))
  setEach('.hero__meta span', t('hero.meta'))
  // El texto "Scroll" convive con el <span> de la línea: se toca solo el nodo de texto.
  const scroll = document.querySelector('.hero__scroll')
  if (scroll && scroll.firstChild?.nodeType === Node.TEXT_NODE) {
    scroll.firstChild.textContent = t('hero.scroll')
  }

  // --- Labels de etapa: "Etapa 02 · Interés" + nombre de sección ---
  document.querySelectorAll('main section[data-stage]').forEach((section) => {
    const stage = section.dataset.stage
    const stageEl = section.querySelector('.section-label__stage')
    const nameEl = section.querySelector('.section-label__name')
    if (stageEl) {
      stageEl.textContent = `${t('stageWord')} ${STAGE_NUMBER[stage]} · ${t(`stages.${stage}`)}`
    }
    const key = SECTION_LABEL[section.id]
    if (nameEl && key) nameEl.textContent = t(`labels.${key}`)
  })

  // --- Métricas ---
  setEach('.metric__label', t('metrics'))

  // --- Proyectos (el track lo repinta renderProjects) ---
  setHTML('#proyectos h2.section-title', t('projects.title'))
  set('.projects__hint', t('projects.hint'))

  // --- Servicios ---
  set('#servicios h2.section-title', t('services.title'))
  const services = t('services.items')
  document.querySelectorAll('.service').forEach((li, i) => {
    const item = services[i]
    if (!item) return
    set('.service__title', item.title, li)
    setHTML('.service__title', item.title, li)
    set('.service__desc', item.desc, li)
    set('.service__tags', item.tags, li)
  })

  // --- Proceso ---
  set('#proceso h2.section-title', t('process.title'))
  const steps = t('process.steps')
  document.querySelectorAll('.step').forEach((li, i) => {
    const step = steps[i]
    if (!step) return
    set('.step__title', step.title, li)
    set('.step__desc', step.desc, li)
  })

  // --- Sobre mí ---
  set('#sobre-mi h2.section-title', t('about.title'))
  const img = document.querySelector('.about__img')
  if (img) img.setAttribute('aria-label', t('about.imgAlt'))
  set('.about__img-label', t('about.imgLabel'))
  const texts = document.querySelectorAll('.about__text')
  if (texts[0]) texts[0].textContent = t('about.p1')
  if (texts[1]) texts[1].textContent = t('about.p2')
  setEach('.about__cv li', t('about.cv'))

  // --- Testimonios ---
  const quotes = t('testimonials')
  document.querySelectorAll('.testimonial').forEach((card, i) => {
    const item = quotes[i]
    if (!item) return
    set('.testimonial__quote', item.quote, card)
    set('.testimonial__author', item.author, card)
  })

  // --- Informe (los VALORES los escribe report.js; aquí solo las etiquetas) ---
  setHTML('#informe h2.section-title', t('report.title'))
  set('.report__intro', t('report.intro'))
  set('.report__title', t('report.panelTitle'))
  const rowKeys = ['elapsed', 'depth', 'signals', 'stage', 'cases', 'topcase', 'variant']
  document.querySelectorAll('.report__row dt').forEach((dt, i) => {
    if (rowKeys[i]) dt.textContent = t(`report.rows.${rowKeys[i]}`)
  })
  const scoreHead = document.querySelector('.report__score-head')
  if (scoreHead && scoreHead.firstChild?.nodeType === Node.TEXT_NODE) {
    scoreHead.firstChild.textContent = `${t('report.scoreLabel')} `
  }
  set('.report__score-tag', t('report.scoreTag'))
  const formulaBtn = document.querySelector('.report__formula-btn')
  if (formulaBtn) {
    const open = formulaBtn.getAttribute('aria-expanded') === 'true'
    formulaBtn.textContent = open ? t('report.formulaHide') : t('report.formulaShow')
  }
  set('.report__formula', t('report.formula'))
  const note1 = document.querySelector('#report-note')
  if (note1) note1.innerHTML = `<strong>${t('report.note1strong')}</strong>${t('report.note1')}`
  const notes = document.querySelectorAll('.report__note')
  if (notes[1]) notes[1].textContent = t('report.note2')

  // --- Contacto ---
  set('.contact__pre', t('contact.pre'))
  set('.contact__cta-text', t('contact.cta'))
  // "Hora local — <span id="local-time">": solo el nodo de texto.
  const time = document.querySelector('.contact__time')
  if (time && time.firstChild?.nodeType === Node.TEXT_NODE) {
    time.firstChild.textContent = `${t('contact.time')} `
  }

  // --- Footer ---
  const rights = document.querySelector('.footer__bottom > span')
  if (rights) rights.textContent = t('footer.rights')
  set('#back-to-top', t('footer.top'))
  const marquee = t('footer.marquee')
  document.querySelectorAll('.footer__marquee .marquee__inner').forEach((inner) => {
    const spans = inner.querySelectorAll('span')
    if (spans[0]) spans[0].textContent = marquee[0]
    if (spans[1]) spans[1].textContent = marquee[1]
  })
}
