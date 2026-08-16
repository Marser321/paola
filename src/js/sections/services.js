import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'
import { galleries } from '../../data/media.js'
import { refreshNeon } from '../fx/neon.js'
import { t } from '../../i18n/index.js'

// Galería de muestras por servicio.
//
// UNA sola superficie, y la misma para todo el mundo: un <button aria-expanded>
// por renglón que despliega una tira en línea. Funciona con teclado, con lector
// de pantalla y con el dedo. Reutiliza el patrón que DESIGN.md §13 ya define para
// el backstage de los anuncios.
//
// El problema que resuelve: los renglones dicen «Funnels & CRO» y quien no es del
// oficio no sabe qué es eso. Si la explicación viviera solo en el hover, seguiría
// sin saberlo la mitad de las visitas.
//
// La tira es una GALERÍA ELÁSTICA: pulsar una muestra la expande y encoge a las
// otras dos; volver a pulsarla las devuelve al mismo reparto (estilos en
// sections.css §GALERÍA ELÁSTICA).
//
// ⚠ RETIRADO 2026-08-16: había además un panel flotante de escritorio que seguía
// al cursor (`mountHoverPreview`). Era `aria-hidden` —atrezo que duplicaba lo que
// el botón ya expone— y con la tira convertida en galería interactiva pasó a
// estorbar: aparecía justo al acercar el puntero al renglón y tapaba la galería
// que se quería desplegar. Con él se fueron su CSS y el uso de `onPointerMove`.

/**
 * Miniatura: imagen real si está declarada, gradiente dorado si no.
 * Mismo <picture> de tres líneas que projects.js: con `src` en el manifiesto se
 * sirve la muestra real, sin él el gradiente del sistema.
 *
 * El contenido va dentro de un <button>, no de un <div> con onclick: la muestra
 * es la superficie que abre y cierra la galería elástica, y este módulo entero
 * se construyó alrededor de que la vía real funcione con teclado (ver cabecera).
 *
 * `alt` VACÍO en la imagen y `aria-hidden` en el gradiente a propósito: el pie ya
 * está en el botón, que es quien da el nombre accesible. Repetir la descripción
 * en la imagen la haría sonar dos veces seguidas.
 */
function thumb(item, caption, index) {
  const visual = item.src
    ? `<picture>
         <source srcset="/img/${item.src}.avif" type="image/avif" />
         <source srcset="/img/${item.src}.webp" type="image/webp" />
         <img src="/img/${item.src}.webp" alt=""
              width="1000" height="1250" loading="lazy" decoding="async" />
       </picture>`
    : `<span class="sample__gradient" aria-hidden="true"
             style="background: linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})"></span>`

  const n = String(index + 1).padStart(2, '0')
  return `<li class="sample">
    <button type="button" class="sample__button" aria-expanded="false">
      ${visual}
      <span class="sample__index mono" aria-hidden="true">${n}</span>
      <span class="sample__caption mono">${caption}</span>
    </button>
  </li>`
}

/** Las muestras de un <li class="service">, o null si no hay galería declarada. */
function samplesFor(li) {
  const gallery = galleries[li.dataset.service]
  if (!gallery?.items?.length) return null
  const index = [...li.parentElement.children].indexOf(li)
  const captions = t('services.items')?.[index]?.samples || []
  return gallery.items.map((item, i) => thumb(item, captions[i] || '', i)).join('')
}

// Puntero fino. En táctil no hay hover y la elasticidad va por pulsación.
const punteroFino = () => window.matchMedia('(hover: hover)').matches

/** Abre una muestra y cierra las demás. `null` deja la tira sin ninguna abierta. */
function abrir(strip, sample) {
  for (const el of strip.querySelectorAll('.sample')) {
    const activa = el === sample
    el.classList.toggle('is-open', activa)
    el.querySelector('.sample__button')?.setAttribute('aria-expanded', String(activa))
  }
}

/**
 * Galería elástica, como el componente del que sale: SIEMPRE hay una muestra
 * abierta y el reparto de ancho sigue al puntero.
 *
 * · La tira nace con la primera abierta. Sin eso se veía plana —tres muestras
 *   del mismo ancho— y no se leía como una galería elástica hasta que alguien
 *   acertaba a pulsar. Aparecer ya en 4:1:1 es lo que enseña que se puede jugar
 *   con ella.
 * · En escritorio el ancho sigue al HOVER, que es de donde viene la sensación de
 *   elasticidad: al cruzar la tira, las muestras se expanden y se encogen en
 *   cadena. Con solo el clic el efecto se sentía rígido.
 * · Al salir el puntero de la tira vuelve a la primera, en vez de quedarse
 *   clavada en la última que se rozó de pasada.
 * · En táctil manda la pulsación, y volver a pulsar la abierta la recoge.
 *
 * Todo con listeners DELEGADOS en la tira —`mouseover` y `mouseout` burbujean—,
 * como el backstage de projects.js: son 15 muestras en cinco tiras y no hacen
 * falta 45 listeners.
 */
function initElastic(strip) {
  const primera = () => strip.querySelector('.sample')

  strip.addEventListener('click', (event) => {
    const button = event.target.closest('.sample__button')
    if (!button || !strip.contains(button)) return
    const sample = button.closest('.sample')
    // Con puntero fino el hover ya la abrió: el clic solo puede recogerla. En
    // táctil el clic es la única vía, así que alterna.
    abrir(strip, sample.classList.contains('is-open') ? null : sample)
    // La tira tiene altura fija: abrir NO cambia la altura de la sección, así que
    // aquí no hace falta ScrollTrigger.refresh(). El del botón del renglón sí.
  })

  if (!punteroFino() || shouldReduceMotion()) return

  strip.addEventListener('mouseover', (event) => {
    const sample = event.target.closest?.('.sample')
    if (sample && strip.contains(sample)) abrir(strip, sample)
  })

  strip.addEventListener('mouseout', (event) => {
    // `mouseout` salta también al pasar de una muestra a su vecina. Solo cuenta
    // como salida si el puntero acabó FUERA de la tira; sin esta guarda la
    // galería volvería a la primera en cada salto entre muestras.
    if (strip.contains(event.relatedTarget)) return
    abrir(strip, primera())
  })
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
    initElastic(strip)

    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true'
      if (!open && !strip.childElementCount) {
        strip.innerHTML = samplesFor(li) || ''
        // Las muestras nacen aquí, en el primer despliegue, mucho después de
        // initNeon(). Sin este aviso se quedarían sin borde de foco — mismo caso
        // que el HUD, que se construye en diferido (ui/hud.js).
        refreshNeon()
        // La tira se muestra YA en 4:1:1, no plana: es lo que enseña que la
        // galería es elástica sin tener que descubrirlo pulsando.
        abrir(strip, strip.querySelector('.sample'))
      }
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
      // Muestras recreadas = muestras sin clase .neon ni halo. Sin esto, cambiar
      // de idioma con la tira abierta deja las tarjetas sin borde, en silencio.
      refreshNeon()
      // Y sin ninguna abierta, que es como sale del render.
      abrir(strip, strip.querySelector('.sample'))
    }
  })
}

export function initServices() {
  const list = document.querySelector('.services__list')
  if (!list) return

  const rows = [...list.querySelectorAll('.service')]
  mountToggles(rows) // botón + tira elástica: la misma vía para todo el mundo

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
