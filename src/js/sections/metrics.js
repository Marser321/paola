import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReduceMotion } from '../core/lenis.js'
import { getLang } from '../../i18n/index.js'

// MÉTRICAS — el contador y su gráfica.
//
// La gráfica NO es un adorno al lado del número: el número dice dónde se está y
// la curva dice cómo se llegó. Por eso ocupa alto de verdad (antes eran 24px de
// línea gris de 1px, el color del texto deshabilitado) y va en el dorado de la
// marca, como todo lo demás que afirma algo en este sitio.
//
// SIN LIBRERÍAS DE GRÁFICOS. Son seis puntos: una polilínea, el área bajo ella y
// un punto por lectura. Meter una dependencia de charting aquí costaría más KB
// que todo el JS de secciones junto.

function format(el, value) {
  const decimals = Number(el.dataset.decimals || 0)
  const prefix = el.dataset.prefix || ''
  const suffix = el.dataset.suffix || ''
  return `${prefix}${value.toFixed(decimals)}${suffix}`
}

// Ids únicos: cada sparkline lleva sus propios degradados y su propio recorte,
// y dos <defs> con el mismo id en el documento se pisan.
let uid = 0

// Aire interior. Arriba, porque el trazo tiene grosor y el punto final tiene
// radio. A los lados, lo mismo para el primer y el último punto.
//
// ⚠ ABAJO NO HAY AIRE, y es deliberado: el borde inferior de la caja ES el cero.
// Ahí cierra el área, ahí llegan los pies y ahí va el suelo punteado. Cualquier
// margen por debajo convertiría el suelo en una línea que no significa nada.
const PAD_X = 5
const PAD_TOP = 7

const f = (n) => n.toFixed(2)

function leerPuntos(el) {
  return (el.dataset.spark || '')
    .split(',')
    .map(Number)
    .filter((n) => !Number.isNaN(n))
}

/**
 * Lleva la serie a coordenadas del viewBox (que es el tamaño real en px).
 *
 * ⚠ LA BASE ES EL CERO, no el mínimo de la serie. Antes esto normalizaba entre
 * mínimo y máximo, y eso hacía dos daños a la vez:
 *
 *   · Todas las curvas salían iguales. Con `88,91,93,95,97,98` estirado a la
 *     caja, un +11% se dibujaba con la MISMA pendiente triunfal que el +567% de
 *     `0.3 … 2.0`. Cuatro gráficas distintas contando exactamente lo mismo:
 *     «sube». Que es justo lo que no hace falta dibujar.
 *   · El relleno mentía. El área se cierra abajo, así que se lee como «la
 *     cantidad»; con base en el mínimo codificaba «lo que sobresale del
 *     mínimo». Un área sobre un eje recortado exagera siempre, y cuanto más
 *     estrecho es el recorrido, más exagera.
 *
 * Con base cero la altura vuelve a ser el nivel y la pendiente vuelve a ser el
 * crecimiento. La retención sale casi plana, que es lo que es.
 *
 * `Math.min(0, ...)` y no `0` a secas: si algún día una serie trae negativos, la
 * base baja hasta ellos en vez de dibujarlos fuera de la caja.
 */
function coordenadas(valores, w, h) {
  const techo = Math.max(...valores)
  const base = Math.min(0, ...valores)
  const span = techo - base || 1
  const x0 = PAD_X
  const x1 = Math.max(x0 + 1, w - PAD_X)
  const y0 = PAD_TOP
  const y1 = h // el cero
  return valores.map((v, i) => ({
    x: x0 + (i / (valores.length - 1)) * (x1 - x0),
    y: y1 - ((v - base) / span) * (y1 - y0),
  }))
}

/**
 * Polilínea: un segmento recto entre lectura y lectura.
 *
 * ⚠ AQUÍ HUBO UNA CURVA (Catmull-Rom → Bézier, tensión 0.7) y se fue el
 * 2026-08-19. Quedaba mejor y era una afirmación falsa: con seis muestras, cada
 * tramo curvo dice cómo se movió el dato ENTRE dos lecturas, y entre dos
 * lecturas no se midió nada. El comentario que la acompañaba presumía de «no
 * inventar bajadas que el dato no tiene» mientras inventaba el recorrido entero.
 *
 * El segmento recto también interpola, pero interpola lo mínimo y se lee como lo
 * que es: dos puntos unidos. Los vértices van marcados (`.spark__node`) para que
 * se vea dónde hay medida y dónde hay línea. Si algún día la serie trae decenas
 * de lecturas, la curva vuelve a tener sentido — con seis, no.
 */
function trazo(p) {
  return p.map((q, i) => `${i === 0 ? 'M' : 'L'}${f(q.x)},${f(q.y)}`).join(' ')
}

/**
 * Monta el <svg> de una métrica y devuelve un mando para animarlo y remedirlo.
 *
 * ⚠ El viewBox se calcula con el TAMAÑO MEDIDO del contenedor, no con una caja
 * fija estirada por `preserveAspectRatio="none"`. Con el estiramiento —que es lo
 * que había— la misma serie salía con una pendiente distinta en cada ancho de
 * columna, y la pendiente es justo lo que lee el ojo: el dato se contaba de otra
 * manera en móvil que en escritorio. Además, en una caja estirada un `<circle>`
 * se pinta como elipse, así que el punto final no era posible.
 */
function crearSparkline(el) {
  const valores = leerPuntos(el)
  if (valores.length < 2) return null

  const id = `spark-${++uid}`
  el.innerHTML =
    `<svg class="spark" preserveAspectRatio="xMidYMid meet">` +
      `<defs>` +
        `<linearGradient id="${id}-line" x1="0" y1="0" x2="1" y2="0">` +
          `<stop class="spark__stop--deep" offset="0"/>` +
          `<stop class="spark__stop--gold" offset="0.55"/>` +
          `<stop class="spark__stop--soft" offset="1"/>` +
        `</linearGradient>` +
        // ⚠ `userSpaceOnUse`. Por defecto el degradado se mide contra la caja
        // del propio relleno, y con base cero ese relleno pasa a ocupar casi
        // toda la tarjeta: el desvanecido se estiraba con él y las cuatro
        // gráficas se convertían en un bloque de oro macizo. Anclado a la caja,
        // la caída es la misma en las cuatro y el relleno sigue siendo un velo.
        `<linearGradient id="${id}-area" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="0">` +
          `<stop class="spark__stop--area-top" offset="0"/>` +
          `<stop class="spark__stop--area-bottom" offset="1"/>` +
        `</linearGradient>` +
        // El barrido de entrada. Un rect que crece de 0 al ancho: recorta a la
        // vez el área, la floración y el trazo, así que los tres entran
        // perfectamente sincronizados. Con `strokeDashoffset` solo se podía
        // animar el trazo, y el relleno tenía que aparecer por su cuenta.
        `<clipPath id="${id}-clip"><rect x="0" y="0" width="0" height="0"/></clipPath>` +
      `</defs>` +
      `<line class="spark__base"/>` +
      `<g clip-path="url(#${id}-clip)">` +
        `<path class="spark__area" fill="url(#${id}-area)"/>` +
        `<path class="spark__glow" stroke="url(#${id}-line)"/>` +
        `<path class="spark__line" stroke="url(#${id}-line)"/>` +
        // Dónde hay medida. Van dentro del recorte para entrar con el barrido.
        `<g class="spark__nodes"></g>` +
      `</g>` +
      // Fuera del recorte: el halo late hacia afuera y el recorte lo cortaría
      // por la derecha justo cuando termina de entrar.
      `<circle class="spark__halo" r="3.5"/>` +
      `<circle class="spark__dot" r="3"/>` +
    `</svg>`

  const svg = el.querySelector('svg')
  const nodos = {
    svg,
    base: svg.querySelector('.spark__base'),
    area: svg.querySelector('.spark__area'),
    gradArea: svg.querySelector(`#${id}-area`),
    glow: svg.querySelector('.spark__glow'),
    line: svg.querySelector('.spark__line'),
    nodes: svg.querySelector('.spark__nodes'),
    halo: svg.querySelector('.spark__halo'),
    dot: svg.querySelector('.spark__dot'),
    clip: svg.querySelector('clipPath rect'),
  }

  let ancho = 0

  function medir() {
    const w = Math.round(el.clientWidth)
    const h = Math.round(el.clientHeight)
    if (!w || !h) return false

    const p = coordenadas(valores, w, h)
    const d = trazo(p)
    const ultimo = p[p.length - 1]

    svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
    nodos.gradArea.setAttribute('y2', String(h))
    nodos.base.setAttribute('x1', '0')
    nodos.base.setAttribute('x2', String(w))
    nodos.base.setAttribute('y1', String(h - 0.5))
    nodos.base.setAttribute('y2', String(h - 0.5))
    nodos.line.setAttribute('d', d)
    nodos.glow.setAttribute('d', d)
    nodos.area.setAttribute('d', `${d} L${f(ultimo.x)},${h} L${f(p[0].x)},${h} Z`)
    ;[nodos.dot, nodos.halo].forEach((c) => {
      c.setAttribute('cx', f(ultimo.x))
      c.setAttribute('cy', f(ultimo.y))
    })
    // Un punto por lectura. El último no: ese lleva su propio marcador con halo,
    // fuera del recorte.
    //
    // ⚠ AQUÍ HUBO UNA REJILLA de pies verticales, uno por lectura, del cero a la
    // curva. Se fue el 2026-08-19 por el mismo motivo que la curva: afirmaba una
    // periodicidad que NO está declarada en ninguna parte. El comentario decía
    // «convierte el trazo en una serie de PERIODOS» — ¿qué periodo? ¿meses,
    // trimestres, campañas? El dato no lo dice, el rótulo no lo dice y
    // BRIEFING.md todavía no lo pregunta. Una rejilla es el gesto visual de
    // rigor, y ponerla sin eje detrás es precisión falsa: hace que la gráfica
    // parezca más seria de lo que el dato permite.
    //
    // Vuelve el día que la serie declare su periodo (un `data-spark-period` en
    // el HTML, rotulado junto al recorrido y con su entrada en los dos
    // diccionarios). No antes: no se dibuja un eje que nadie ha decidido.
    nodos.nodes.innerHTML = p
      .slice(0, -1)
      .map((q) => `<circle class="spark__node" cx="${f(q.x)}" cy="${f(q.y)}" r="2"/>`)
      .join('')

    nodos.clip.setAttribute('height', String(h))
    ancho = w
    return true
  }

  return {
    el,
    nodos,
    valores,
    medir,
    ancho: () => ancho,
  }
}

/**
 * El recorrido de la serie, bajo la gráfica: «2,1 → 4,2».
 *
 * POR QUÉ. Con base cero la pendiente ya no miente, pero sigue siendo una
 * pendiente: dice que sube y no dice desde dónde. El número grande de arriba es
 * el final del recorrido —y por eso el segundo número del rótulo siempre coincide
 * con él, que es lo que ata la gráfica a su KPI—; lo que faltaba era el principio.
 *
 * Sin unidades a propósito: las pone el número grande. Repetir «x», «%» o «+»
 * aquí obligaría a inventar un formato por métrica, y con el sufijo «+» de
 * «120+ campañas» saldría un «20+ → 120+» que significa otra cosa.
 *
 * Los decimales salen del propio dato, no de `data-decimals`: el titular de ad
 * spend redondea a «+$2M» y la serie va en décimas de millón.
 */
function pintarRango(nodo, valores) {
  const decimales = valores.some((v) => !Number.isInteger(v)) ? 1 : 0
  const nf = new Intl.NumberFormat(getLang() === 'en' ? 'en-US' : 'es-ES', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  })
  // Solo números y una flecha: nada que escapar.
  nodo.innerHTML = `${nf.format(valores[0])}<i>→</i>${nf.format(valores[valores.length - 1])}`
}

export function initMetrics() {
  const values = document.querySelectorAll('.metric__value[data-count]')
  if (!values.length) return

  const reduced = shouldReduceMotion()

  // El idioma no cambia los datos, cambia el separador decimal: «2,1» y «2.1».
  const rangos = []

  values.forEach((el) => {
    const target = Number(el.dataset.count)
    const metric = el.closest('.metric')
    const sparkEl = metric?.querySelector('.metric__spark')
    const spark = sparkEl ? crearSparkline(sparkEl) : null
    let entrado = false

    if (spark) {
      spark.medir()

      // El rótulo va DEBAJO de la gráfica y no dentro del <svg>: dentro habría
      // que esquivar la curva a cada ancho. Y no es decorativo —es el único
      // sitio de la página donde aparece el punto de partida—, así que no lleva
      // `aria-hidden`: se anuncia.
      const rango = document.createElement('p')
      rango.className = 'metric__range'
      pintarRango(rango, spark.valores)
      sparkEl.insertAdjacentElement('afterend', rango)
      rangos.push([rango, spark.valores])

      // Remedida al cambiar el ancho de columna (rotación, redimensionado, o el
      // salto de cuatro columnas a dos). Se reconstruye la geometría sobre los
      // MISMOS nodos para no perder el estado de la animación.
      // ⚠ Si el barrido está a medias, se deja correr: GSAP es dueño del `width`
      // del recorte durante esos dos segundos y escribirlo aquí lo pelearía.
      const ro = new ResizeObserver(() => {
        if (!spark.medir()) return
        if (entrado) spark.nodos.clip.setAttribute('width', String(spark.ancho()))
      })
      ro.observe(sparkEl)
    }

    if (reduced) {
      el.textContent = format(el, target)
      if (spark) {
        // Sin movimiento: la gráfica se entrega dibujada y entera.
        spark.nodos.clip.setAttribute('width', String(spark.ancho()))
        gsap.set(spark.nodos.dot, { opacity: 1 })
        spark.nodos.svg.classList.add('is-in')
        entrado = true
      }
      return
    }

    if (spark) gsap.set(spark.nodos.dot, { opacity: 0 })

    const state = { value: 0 }
    const tl = gsap.timeline({
      scrollTrigger: { trigger: metric || el, start: 'top 85%', once: true },
    })

    // back.out overshoot: el número se pasa y se asienta. 1.1 es deliberadamente
    // contenido — por encima de ~1.4 se lee como rebote de juguete, no como dato.
    tl.to(state, {
      value: target,
      duration: 2,
      ease: 'back.out(1.1)',
      onUpdate: () => {
        el.textContent = format(el, state.value)
      },
      onComplete: () => {
        el.textContent = format(el, target) // cierre exacto, sin residuo del easing
      },
    })

    if (spark) {
      // El barrido va con el contador: el mismo gesto contado dos veces, con
      // números y con forma.
      tl.to(
        spark.nodos.clip,
        {
          attr: { width: () => spark.ancho() },
          duration: 2,
          ease: 'power2.out',
          onComplete: () => {
            entrado = true
            // Ancho final exacto: si la columna cambió durante el barrido, el
            // valor con el que arrancó el tween se ha quedado corto.
            spark.nodos.clip.setAttribute('width', String(spark.ancho()))
          },
        },
        0
      )
      // El punto aterriza cuando la curva llega a él, no antes. El halo empieza
      // a latir después, con la clase: su animación es de CSS.
      tl.fromTo(
        spark.nodos.dot,
        { opacity: 0, scale: 0.2, transformOrigin: '50% 50%' },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(2)',
          onComplete: () => spark.nodos.svg.classList.add('is-in'),
        },
        1.55
      )
    }
  })

  if (rangos.length) {
    window.addEventListener('i18n:change', () => {
      rangos.forEach(([nodo, valores]) => pintarRango(nodo, valores))
    })
  }

  // Reveal suave de las tarjetas de métrica
  if (!reduced) {
    gsap.from('.metric', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.metrics__grid',
        start: 'top 80%',
        once: true,
      },
    })
  }
}
