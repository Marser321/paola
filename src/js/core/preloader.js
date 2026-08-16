import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from './lenis.js'

// El logo se escribe solo mientras corre el contador.
//
// CÓMO, Y POR QUÉ NO ES stroke-dasharray. La firma está TRAZADA A CONTORNO: cada
// letra es el perímetro de su trazo, no su eje. Un dashoffset sobre esos paths
// dibujaría el BORDE de las letras —un contorno hueco recorriéndose— en vez del
// trazo. Lo que se hace es lo que se usa de verdad para caligrafía: una máscara
// que barre cada pieza en el sentido de la escritura y la va descubriendo.
//
// El despiece en siete piezas lo hace scripts/media/logo-partes.py y sale ya con
// un <g id> por pieza. El orden de ORQUESTA es el orden en que se escribiría a
// mano: el monograma presenta, la firma va de izquierda a derecha, el filete
// subraya y los caps cierran.

// pieza, inicio (s), duración (s). Se solapan a propósito: una firma no se
// escribe por trozos separados, y sin solape se lee como siete animaciones.
//
// La última pieza acaba en 1.85 s, que es justo cuando el contador llega al 100%
// (su tween dura 1.8). Cuadrarlo importa: con los caps terminando más tarde, el
// contador se quedaba clavado en «100%» mirando cómo el logo seguía escribiéndose.
const ORQUESTA = [
  ['monograma', 0.0, 0.5],
  ['paola-p', 0.22, 0.55],
  ['paola-resto', 0.6, 0.4],
  ['parra-p', 0.82, 0.5],
  ['parra-resto', 1.15, 0.38],
  ['filete', 1.35, 0.3],
  ['caps', 1.5, 0.35],
]

/**
 * Prepara el SVG: envuelve cada pieza en su máscara de barrido y devuelve los
 * rectángulos que hay que animar.
 *
 * Las máscaras se construyen aquí y no en el archivo porque su geometría sale de
 * `getBBox()`, que sólo existe una vez el SVG está en el DOM y medido.
 */
function prepararMascaras(svg) {
  const defs = svg.querySelector('defs')
  const rects = new Map()

  for (const [id] of ORQUESTA) {
    const grupo = svg.querySelector(`#${id}`)
    if (!grupo) continue

    const caja = grupo.getBBox()
    if (!caja.width || !caja.height) continue

    // Un pelo de margen: el barrido tiene que empezar FUERA del trazo y acabar
    // fuera, o el primer y el último píxel de cada pieza se quedan sin revelar.
    const margen = caja.height * 0.15
    const x = caja.x - margen
    const y = caja.y - margen
    const alto = caja.height + margen * 2
    const ancho = caja.width + margen * 2

    const ns = 'http://www.w3.org/2000/svg'
    const mask = document.createElementNS(ns, 'mask')
    mask.id = `barrido-${id}`
    // userSpaceOnUse: la región de máscara por defecto es relativa a la caja del
    // objeto y recorta el rectángulo justo donde no interesa.
    mask.setAttribute('maskUnits', 'userSpaceOnUse')
    mask.setAttribute('x', x)
    mask.setAttribute('y', y)
    mask.setAttribute('width', ancho)
    mask.setAttribute('height', alto)

    const rect = document.createElementNS(ns, 'rect')
    rect.setAttribute('x', x)
    rect.setAttribute('y', y)
    rect.setAttribute('height', alto)
    rect.setAttribute('width', 0)
    rect.setAttribute('fill', '#fff')
    mask.appendChild(rect)
    defs.appendChild(mask)

    grupo.setAttribute('mask', `url(#barrido-${id})`)
    rects.set(id, { rect, ancho })
  }
  return rects
}

export async function initPreloader() {
  const preloader = document.getElementById('preloader')
  if (!preloader) return

  const counter = preloader.querySelector('.preloader__counter')
  const barFill = preloader.querySelector('.preloader__bar-fill')
  const status = preloader.querySelector('.preloader__status')
  const hueco = preloader.querySelector('.preloader__logo')

  const finish = () => {
    preloader.remove()
    window.dispatchEvent(new CustomEvent('app:ready'))
    ScrollTrigger.refresh()
  }

  if (shouldReduceMotion()) {
    finish()
    return
  }

  // El SVG entra con import() DINÁMICO, no estático: son 37 KB de datos de path
  // (17 KB gzip) y en estático doblaban el bundle inicial —de 19 a 38 KB gzip—
  // para algo puramente decorativo. Vite le da su propio chunk y lo precarga en
  // paralelo, así que no hay ida y vuelta extra que esperar.
  //
  // El logo se pinta ENTERO de salida. Si la preparación de máscaras fallara —un
  // id que ya no existe tras regenerar el SVG, un getBBox a cero, el chunk que no
  // llega— lo que queda es el logo quieto y completo, o el preloader de siempre.
  // Nunca una animación a medias.
  let rects = new Map()
  if (hueco) {
    try {
      const { default: logoSvg } = await import('../../assets/logo-paola-parra.svg?raw')
      hueco.innerHTML = logoSvg
      const svg = hueco.querySelector('svg')
      if (svg) rects = prepararMascaras(svg)
    } catch {
      /* sin logo o sin máscaras: sigue el preloader con contador y barra */
    }
  }

  const progress = { value: 0 }

  const tl = gsap.timeline()

  tl.to(progress, {
    value: 100,
    duration: 1.8,
    ease: 'power2.inOut',
    onUpdate: () => {
      counter.textContent = `${Math.round(progress.value)}%`
      barFill.style.transform = `scaleX(${progress.value / 100})`
    },
  }, 0)

  // El barrido corre EN PARALELO al contador (posición absoluta en la línea de
  // tiempo), no después: encadenarlos doblaría la espera antes de entrar al
  // sitio, y un preloader largo es un preloader que se cierra.
  for (const [id, inicio, duracion] of ORQUESTA) {
    const entrada = rects.get(id)
    if (!entrada) continue
    tl.to(
      entrada.rect,
      {
        attr: { width: entrada.ancho },
        duration: duracion,
        // Sin rebote y sin arranque perezoso: una plumilla no acelera al final.
        ease: 'power1.inOut',
      },
      inicio
    )
  }

  tl
    // Al 100%, la campaña pasa a entregar (CONTENT.md §1)
    .call(() => {
      if (status) status.textContent = 'Entregando impresión'
    })
    // Cortina: el preloader sube y revela la página
    .to(preloader, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
    })
    .add(finish)
}
