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
  // ⚠ Ojo con `textContent` a secas. Con la navegación en píldoras cada enlace
  // lleva DOS rótulos dentro —el de reposo y el que entra al pasar el puntero,
  // ver ui/pill-nav.js— y escribir sobre el <a> se llevaría por delante esa
  // estructura al cambiar de idioma. En el primer pase todavía no existe, porque
  // applyStaticTranslations() corre antes que initPillNav(); en los siguientes,
  // sí. Se escribe en los rótulos si están, y en el enlace si no.
  const nav = ['projects', 'services', 'process', 'about', 'contact']
  document.querySelectorAll('.site-nav a').forEach((a, i) => {
    if (!nav[i]) return
    const texto = t(`nav.${nav[i]}`)
    const labels = a.querySelectorAll('.pill__label, .pill__label--hover')
    if (labels.length) labels.forEach((el) => { el.textContent = texto })
    else a.textContent = texto
  })
  // El desplegable de móvil es una copia de los mismos enlaces: se retraduce por
  // href, que es lo único estable entre las dos listas.
  document.querySelectorAll('.pill-nav__panel a').forEach((a) => {
    const i = nav.findIndex((_, n) => document.querySelectorAll('.site-nav .pill')[n]?.getAttribute('href') === a.getAttribute('href'))
    if (i >= 0) a.textContent = t(`nav.${nav[i]}`)
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

    // Nombre accesible de la sección. #metricas, #testimonios y #contacto son las
    // tres que NO llevan encabezado —su rótulo visible es el `.section-label`, que
    // es un <p>—, así que sin esto un <section> se anuncia sin nombre y no cuenta
    // como región navegable. Se pone aquí y no como atributo en el HTML por lo
    // mismo que el resto del archivo: el texto traducido vive en un solo sitio y
    // se rehace solo al cambiar de idioma.
    if (key) section.setAttribute('aria-label', t(`labels.${key}`))
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
  // Por ÍNDICE y no buscando dentro de cada <li>: al montarse el carrusel, la
  // descripción de cada etapa se muda del renglón a su tarjeta (ver
  // sections/process.js), así que título y descripción dejan de compartir padre.
  // Los dos siguen en orden de documento, que es lo único que hace falta.
  // También se retraduce la píldora «01 · Auditoría» del pie de la tarjeta, que
  // es texto compuesto y no un nodo mudado.
  const steps = t('process.steps')
  document.querySelectorAll('.step__title').forEach((el, i) => {
    if (steps[i]) el.textContent = steps[i].title
  })
  document.querySelectorAll('.step__desc').forEach((el, i) => {
    if (steps[i]) el.textContent = steps[i].desc
  })
  document.querySelectorAll('.process__card-tag').forEach((el, i) => {
    if (steps[i]) el.textContent = `${String(i + 1).padStart(2, '0')} · ${steps[i].title}`
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
