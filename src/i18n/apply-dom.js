// Aplica el diccionario al DOM estático de index.html.
//
// Se hace desde aquí y no con atributos `data-i18n` sembrados por el markup: el
// HTML se queda limpio y toda la traducción vive en un archivo que se puede leer
// de arriba abajo. También permite tratar los casos raros (nodos de texto sueltos
// junto a elementos) sin ensuciar la plantilla.

import { t } from './index.js'

// Nombre de sección por id. Es también el nombre accesible de la región (ver
// abajo), así que toda sección con `.section-label` tiene que estar en el mapa.
const SECTION_LABEL = {
  metricas: 'results', proyectos: 'cases', servicios: 'services', proceso: 'process',
  'sobre-mi': 'about', testimonios: 'testimonials',
  planes: 'plans', calculadora: 'calculator', faq: 'faq', contacto: 'contact',
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
  // ⚠ Por ÍNDICE: el orden tiene que ser el mismo que el de los <a> en el HTML.
  const nav = ['projects', 'services', 'process', 'plans', 'about', 'contact']
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

  // --- Rótulo de sección ---
  // Antes había DOS rótulos por sección: «Etapa 02 · Interés» y el nombre. El de
  // etapa se retiró el 2026-08-16 con el concepto de campaña; queda el nombre.
  document.querySelectorAll('main section[id]').forEach((section) => {
    const nameEl = section.querySelector('.section-label__name')
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

  // --- Planes ---
  setHTML('#planes h2.section-title', t('plans.title'))
  set('.plans__intro', t('plans.intro'))
  const planes = t('plans.items')
  document.querySelectorAll('.plan-card').forEach((card, i) => {
    const item = planes[i]
    if (!item) return
    set('.plan-card__tag', item.tag, card)
    set('.plan-card__title', item.title, card)
    set('.plan-card__who', item.who, card)
    setEach('.plan-card__list li', item.list, card)
    // «Te llevas …»: el <strong> y el resto de la frase van por separado, así que
    // se compone aquí en vez de guardar la etiqueta dentro del texto traducido.
    const take = card.querySelector('.plan-card__take')
    if (take) take.innerHTML = `<strong>${t('plans.takeWord')}</strong>${item.take}`
    set('.plan-card__cta', t('plans.cta'), card)
  })

  // --- Calculadora (los VALORES los escribe calculator.js) ---
  setHTML('#calculadora h2.section-title', t('calc.title'))
  set('.calc__intro', t('calc.intro'))
  const campos = ['spend', 'roas', 'ticket']
  document.querySelectorAll('.calc__label').forEach((el, i) => {
    if (campos[i]) el.textContent = t(`calc.fields.${campos[i]}`)
  })
  const filas = ['revenue', 'profit', 'sales', 'cpa']
  document.querySelectorAll('.calc__row dt').forEach((dt, i) => {
    if (filas[i]) dt.textContent = t(`calc.rows.${filas[i]}`)
  })
  // La leyenda de la barra «a escala». El segundo rótulo REUSA el del <dl>: es
  // el mismo número con el mismo nombre a dos palmos, y llamarlo de dos maneras
  // distintas en el mismo panel es peor que repetirlo.
  // Los importes y el corte los escribe calculator.js, que ya se repinta solo al
  // cambiar de idioma (el formato de los números depende del locale).
  const leyenda = [t('calc.viz.spend'), t('calc.rows.profit')]
  document.querySelectorAll('.calc__viz-label').forEach((el, i) => {
    if (leyenda[i] !== undefined) el.textContent = leyenda[i]
  })
  const calcNote = document.querySelector('.calc__note')
  if (calcNote) calcNote.innerHTML = `<strong>${t('calc.noteStrong')}</strong>${t('calc.note')}`

  // --- Preguntas ---
  // El rótulo de cada pregunta puede estar dentro del <button> que monta
  // sections/faq.js, o directamente en el <h3> si el módulo aún no ha corrido.
  set('#faq h2.section-title', t('faq.title'))
  const preguntas = t('faq.items')
  document.querySelectorAll('.faq__item').forEach((item, i) => {
    const dato = preguntas[i]
    if (!dato) return
    const rotulo = item.querySelector('.faq__question-text') || item.querySelector('.faq__q')
    if (rotulo) rotulo.textContent = dato.q
    set('.faq__a p', dato.a, item)
  })

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
