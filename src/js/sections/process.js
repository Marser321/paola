import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'
import { process as etapas } from '../../data/media.js'

// Método de trabajo como CARRUSEL. Port del FeatureCarousel de 21st.dev; los
// estilos y el razonamiento de lo que no se conserva están en
// src/styles/process.css.
//
// El original es React + Framer Motion. Aquí se porta la composición y la
// mecánica —una rueda de fichas que gira a un lado y una baraja de tarjetas al
// otro, sincronizadas por un único índice—, con los eases de GSAP que ya usa el
// resto del sitio en lugar de las muelles de Framer.
//
// PROGRESIVO, como el menú: el HTML sigue siendo la <ol> de seis <li> de siempre.
// Si este módulo no corre, el proceso se lee como la lista que era. Y los <li> no
// se recrean, se MUEVEN, así que i18n sigue escribiendo en los mismos nodos sin
// enterarse de que ahora viven dentro de un carrusel.

const INTERVALO = 4000 // el original va a 3s; con seis etapas y texto que leer, corto
const ITEM_H = 64      // px — tiene que coincidir con --ficha-h en process.css

/** Envuelve un valor en un rango: la rueda es circular, tras la 06 viene la 01. */
const envolver = (min, max, v) => {
  const rango = max - min
  return ((((v - min) % rango) + rango) % rango) + min
}

/**
 * Visual de la etapa: foto si el manifiesto la tiene, marcador si no.
 *
 * `pendiente: true` MANDA sobre `src`. Las seis rutas están escritas ya en el
 * manifiesto —hacen falta para saber qué archivo generar y con qué nombre—, pero
 * hasta que existan pedirlas dejaría seis imágenes rotas. Entregar una foto es
 * quitarle su `pendiente`; no hay que tocar nada más.
 */
function visual(item, i) {
  if (item?.src && !item.pendiente) {
    return `<picture>
        <source srcset="/img/${item.src}.avif" type="image/avif" />
        <source srcset="/img/${item.src}.webp" type="image/webp" />
        <img src="/img/${item.src}.webp" alt="${item.alt || ''}"
             width="840" height="1050" loading="lazy" decoding="async" />
      </picture>`
  }
  const [a, b] = item?.gradient || ['#8A6A1F', '#D4AF37']
  // `role="img"` con su `aria-label`: el marcador no es decorativo, ocupa el sitio
  // de la única imagen que describe la etapa.
  return `<div class="process__card-gradient" role="img" aria-label="${item?.alt || ''}"
        style="background: linear-gradient(150deg, ${a}, ${b})">
        <span class="process__card-ghost" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
      </div>`
}

export function initProcess() {
  const timeline = document.querySelector('.process__timeline')
  const lista = document.querySelector('.process__steps')
  if (!timeline || !lista) return

  const pasos = [...lista.querySelectorAll('.step')]
  if (pasos.length < 2) return

  const reducido = shouldReduceMotion()
  const total = pasos.length

  // --- Reconstrucción del DOM ------------------------------------------------
  const carrusel = document.createElement('div')
  carrusel.className = 'process__carousel'

  const panel = document.createElement('div')
  panel.className = 'process__stages'
  // La rueda es la <ol> ORIGINAL, reetiquetada: los <li> tienen que seguir
  // colgando de una lista o dejan de ser válidos, y reutilizarla evita crear un
  // contenedor nuevo solo para volver a meterlos en uno.
  lista.className = 'process__rueda process__steps'
  panel.append(lista)

  const deck = document.createElement('div')
  deck.className = 'process__deck'
  const stack = document.createElement('div')
  stack.className = 'process__stack'
  deck.append(stack)

  const tarjetas = pasos.map((li, i) => {
    const numero = li.querySelector('.step__number')
    const encabezado = li.querySelector('.step__title')
    const desc = li.querySelector('.step__desc')
    const titulo = encabezado?.textContent?.trim() || ''

    // La ficha es un <button>: es el control que cambia de etapa y tiene que
    // serlo de verdad para el teclado.
    const chip = document.createElement('button')
    chip.type = 'button'
    chip.className = 'step__chip'
    chip.setAttribute('data-hover', '')

    // ⚠ El título deja de ser <h3>. Dentro de un <button> solo cabe contenido en
    // línea, así que un encabezado ahí no es válido. Se conserva la CLASE, que es
    // por donde entra la traducción, y el nivel se pierde sin coste: eran seis
    // encabezados para seis renglones de una lista, y en un carrusel que enseña
    // uno cada vez anunciarlos todos confundiría más que ayudar. La sección
    // conserva su <h2>.
    const rotulo = document.createElement('span')
    rotulo.className = 'step__title'
    rotulo.textContent = titulo
    encabezado?.remove()

    if (numero) chip.append(numero)
    chip.append(rotulo)
    li.append(chip)

    const card = document.createElement('div')
    card.className = 'process__card'
    card.innerHTML = `${visual(etapas?.items?.[i], i)}
      <div class="process__card-body">
        <span class="process__card-tag mono">${String(i + 1).padStart(2, '0')} · ${titulo}</span>
      </div>`
    // La descripción se MUEVE, no se copia: sigue siendo el mismo nodo que
    // escribe i18n, así que no hay dos textos que mantener en paralelo.
    if (desc) card.querySelector('.process__card-body').append(desc)

    stack.append(card)
    return card
  })

  carrusel.append(panel, deck)
  timeline.replaceWith(carrusel)

  // --- Avance automático ----------------------------------------------------
  // Se declara ANTES que los manejadores de las fichas: una ficha pulsada tiene
  // que poder pausarlo, y con reduced-motion el reloj no existe pero `pausar`
  // sigue teniendo que ser invocable.
  let reloj = null
  let aLaVista = false
  let interaccion = false

  const parar = () => { clearInterval(reloj); reloj = null }
  const arrancar = () => {
    if (reducido || reloj || !aLaVista || interaccion || document.hidden) return
    reloj = setInterval(() => { paso += 1; pintar() }, INTERVALO)
  }
  const pausar = () => { interaccion = true; parar() }
  const reanudar = () => { interaccion = false; arrancar() }

  // --- Estado ---------------------------------------------------------------
  let paso = 0
  const indice = () => ((paso % total) + total) % total

  const pintar = () => {
    const actual = indice()
    const dur = reducido ? 0 : 0.7

    pasos.forEach((li, i) => {
      const d = envolver(-total / 2, total / 2, i - actual)
      li.dataset.estado = d === 0 ? 'activa' : 'lado'
      li.querySelector('.step__chip')?.setAttribute('aria-current', d === 0 ? 'step' : 'false')
      gsap.to(li, {
        y: d * ITEM_H,
        // Se apagan por distancia y no de golpe: es lo que da la sensación de rueda.
        opacity: Math.max(0, 1 - Math.abs(d) * 0.28),
        duration: dur,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    })

    tarjetas.forEach((card, i) => {
      const d = envolver(-total / 2, total / 2, i - actual)
      const activa = d === 0
      const alLado = Math.abs(d) === 1
      card.dataset.estado = activa ? 'activa' : 'lado'
      // Lo que no está en el centro no es contenido: fuera del tabulador y del
      // lector de pantalla, o el carrusel anuncia seis etapas a la vez.
      card.inert = !activa
      gsap.to(card, {
        x: activa ? 0 : d < 0 ? -100 : 100,
        rotate: activa ? 0 : d < 0 ? -3 : 3,
        scale: activa ? 1 : alLado ? 0.85 : 0.7,
        opacity: activa ? 1 : alLado ? 0.4 : 0,
        zIndex: activa ? 20 : alLado ? 10 : 0,
        duration: dur,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    })
  }

  pasos.forEach((li, i) => {
    li.querySelector('.step__chip').addEventListener('click', () => {
      // Se avanza SIEMPRE hacia delante, como el original: la rueda gira en un
      // solo sentido y así el salto a mano coincide con lo que hace el automático.
      const salto = (i - indice() + total) % total
      if (salto) { paso += salto; pintar() }
      pausar() // quien elige manda: el automático no le pisa la elección
    })
  })

  pintar()

  // ⚠ El automático se para en cuatro casos y ninguno es opcional:
  //   · reduced-motion — WCAG 2.2.2 exige poder detener lo que se mueve solo, y
  //     un carrusel automático es el ejemplo de manual;
  //   · puntero encima o foco dentro — nadie lee algo que se va;
  //   · sección fuera de pantalla — no hay a quién enseñárselo;
  //   · pestaña oculta — si no, el temporizador acumula saltos a ciegas y al
  //     volver la rueda pega un salto de varias etapas.
  carrusel.addEventListener('mouseenter', pausar)
  carrusel.addEventListener('mouseleave', reanudar)
  carrusel.addEventListener('focusin', pausar)
  carrusel.addEventListener('focusout', (e) => {
    if (!carrusel.contains(e.relatedTarget)) reanudar()
  })
  document.addEventListener('visibilitychange', () => (document.hidden ? parar() : arrancar()))

  new IntersectionObserver(
    ([e]) => {
      aLaVista = e.isIntersecting
      if (aLaVista) arrancar()
      else parar()
    },
    { threshold: 0.35 }
  ).observe(carrusel)

  if (reducido) return

  // Entrada de la sección. Sustituye al dibujado de la línea vertical, que era de
  // la lista y ya no existe.
  gsap.from(carrusel, {
    y: 40,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: carrusel, start: 'top 82%', once: true },
  })
}
