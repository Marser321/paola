import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'
import { onPointerMove } from '../core/cursor.js'
import { galleries } from '../../data/media.js'
import { t } from '../../i18n/index.js'

// Galería de muestras por servicio.
//
// Dos superficies para el mismo contenido, y es deliberado:
//
//   · ESCRITORIO — un panel que sigue al cursor. Es atrezo: `aria-hidden`, porque
//     duplica lo que el botón ya expone. Nadie debería depender de él.
//   · TODOS — un <button aria-expanded> que despliega una tira en línea. Es la vía
//     real: funciona con teclado, con lector de pantalla y con el dedo. Reutiliza
//     el patrón que DESIGN.md §13 ya define para el backstage de los anuncios.
//
// El problema que resuelve: los renglones dicen «Funnels & CRO» y quien no es del
// oficio no sabe qué es eso. Si la explicación viviera solo en el hover, seguiría
// sin saberlo la mitad de las visitas.

/**
 * Miniatura: imagen real si está declarada, gradiente dorado si no.
 * Mismo <picture> de tres líneas que projects.js: con `src` en el manifiesto se
 * sirve la muestra real, sin él el gradiente del sistema.
 */
function thumb(item, caption) {
  const visual = item.src
    ? `<picture>
         <source srcset="/img/${item.src}.avif" type="image/avif" />
         <source srcset="/img/${item.src}.webp" type="image/webp" />
         <img src="/img/${item.src}.webp" alt="${caption}"
              width="480" height="600" loading="lazy" decoding="async" />
       </picture>`
    : `<span class="sample__gradient" role="img" aria-label="${caption}"
             style="background: linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})"></span>`
  return `<li class="sample">${visual}<span class="sample__caption mono">${caption}</span></li>`
}

/** Las muestras de un <li class="service">, o null si no hay galería declarada. */
function samplesFor(li) {
  const gallery = galleries[li.dataset.service]
  if (!gallery?.items?.length) return null
  const index = [...li.parentElement.children].indexOf(li)
  const captions = t('services.items')?.[index]?.samples || []
  return gallery.items.map((item, i) => thumb(item, captions[i] || '')).join('')
}

/**
 * Vía accesible: un botón por renglón que despliega la tira en línea.
 * Se monta siempre — también en escritorio, o la galería sería inalcanzable sin
 * ratón — y se rellena en el primer despliegue, no antes: cinco tiras montadas de
 * salida son quince nodos de imagen que nadie ha pedido todavía.
 */
function mountToggles(rows) {
  rows.forEach((li, i) => {
    if (!galleries[li.dataset.service]) return

    const id = `service-samples-${i}`
    const button = document.createElement('button')
    button.className = 'service__toggle mono'
    button.type = 'button'
    button.setAttribute('aria-expanded', 'false')
    button.setAttribute('aria-controls', id)
    button.textContent = t('services.toggle') || '+'

    const strip = document.createElement('ul')
    strip.className = 'service__strip'
    strip.id = id
    strip.hidden = true

    li.append(button, strip)

    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true'
      if (!open && !strip.childElementCount) strip.innerHTML = samplesFor(li) || ''
      button.setAttribute('aria-expanded', String(!open))
      strip.hidden = open
      // La tira cambia la altura de la sección y .services__header es sticky con
      // ScrollTriggers ya medidos: hay que remedir, igual que hace main.js tras
      // el cambio de idioma.
      ScrollTrigger.refresh()
    })
  })
}

/**
 * Vía de escritorio: un solo panel reutilizado por los cinco renglones, que sigue
 * al cursor. Uno por renglón serían cinco paneles compitiendo por el mismo sitio.
 */
function mountHoverPreview(rows) {
  const section = document.querySelector('.services')
  if (!section) return

  const preview = document.createElement('div')
  preview.className = 'services__preview'
  preview.setAttribute('aria-hidden', 'true') // atrezo: el botón es la vía real
  section.appendChild(preview)

  // Mismo patrón que el parallax de hover del retrato en about.js.
  const moveX = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3.out' })
  const moveY = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3.out' })

  let current = null

  rows.forEach((li) => {
    li.addEventListener('mouseenter', () => {
      if (!galleries[li.dataset.service]) return
      current = li
      preview.innerHTML = `<ul class="services__preview-list">${samplesFor(li) || ''}</ul>`
      preview.classList.add('is-visible')
      gsap.fromTo(
        preview.querySelectorAll('.sample'),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.06, overwrite: true }
      )
    })
    li.addEventListener('mouseleave', () => {
      // Al pasar de un renglón al siguiente, el mouseleave del primero llega
      // DESPUÉS del mouseenter del segundo. Sin esta guarda el panel parpadearía
      // en cada salto entre renglones.
      if (current !== li) return
      current = null
      preview.classList.remove('is-visible')
    })
  })

  // Se suscribe al único mousemove del sitio (PLAN.md §9.8), no añade uno propio.
  onPointerMove((e) => {
    if (!current) return
    moveX(e.clientX + 32)
    moveY(e.clientY - 40)
  })
}

/**
 * Cambio de idioma en caliente. Los pies de las muestras se leen del diccionario
 * al RENDERIZAR, así que una tira ya montada se quedaría en el idioma anterior.
 * Se vacía para que se regenere al volver a abrirla, y se retraduce el botón.
 * Mismo papel que refreshProjects() con las cards.
 */
export function refreshServices() {
  document.querySelectorAll('.service__toggle').forEach((button) => {
    button.textContent = t('services.toggle') || '+'
  })
  document.querySelectorAll('.service__strip').forEach((strip) => {
    if (strip.hidden) strip.innerHTML = ''
    else {
      const li = strip.closest('.service')
      strip.innerHTML = samplesFor(li) || ''
    }
  })
}

export function initServices() {
  const list = document.querySelector('.services__list')
  if (!list) return

  const rows = [...list.querySelectorAll('.service')]
  mountToggles(rows) // siempre: es la vía accesible

  // El panel flotante es de puntero fino. En táctil no existe y en reduced-motion
  // tampoco: quedan el botón y la tira, que no dependen de ninguna de las dos.
  const isTouch = window.matchMedia('(hover: none)').matches
  if (!isTouch && !shouldReduceMotion()) mountHoverPreview(rows)

  if (shouldReduceMotion()) return

  // El header es sticky por CSS (tarea 02): aquí solo entran los items.
  gsap.from('.service', {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: {
      trigger: list,
      start: 'top 80%',
      once: true,
    },
  })
}
