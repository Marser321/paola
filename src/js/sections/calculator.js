import { getLang, t } from '../../i18n/index.js'

// CALCULADORA DE ESCALA — «Echa la cuenta antes de invertir».
//
// Tres controles y cuatro resultados. Aritmética, nada más:
//
//   retorno        = inversión × ROAS
//   diferencia     = retorno − inversión
//   ventas         = retorno ÷ ticket medio
//   coste máx/venta = inversión ÷ ventas  ( = ticket ÷ ROAS )
//
// ⚠ POR QUÉ ESTO Y NO UNA PREVISIÓN. Aquí estuvo el informe de sesión, que
// estimaba una «probabilidad de conversión» de la visita con una heurística
// inventada. Se retiró porque no se entendía y porque una cifra inventada, por
// muy bien etiquetada que esté, es una cifra inventada. Lo que queda es lo único
// que se puede afirmar sin mentir: una multiplicación con los números de quien
// mira, hecha en su navegador. Cualquier cosa que se añada aquí tiene que
// cumplir ese mismo listón.
//
// Sin dependencias y sin RAF: son tres `input`, unos cuantos nodos de texto y
// una barra partida por un porcentaje. El navegador ya sabe interpolar eso.

const LEE = {
  spend: (v) => Math.round(v),
  roas: (v) => Math.round(v * 10) / 10,
  ticket: (v) => Math.round(v),
}

/** Locale de formato. El sitio es bilingüe y 21.000 / 21,000 no es un detalle. */
const locale = () => (getLang() === 'en' ? 'en-US' : 'es-ES')

// ⚠ `useGrouping: 'always'`. Por defecto, es-ES NO agrupa los números de cuatro
// cifras (regla «min2» de CLDR), así que la inversión salía «$5000» justo al
// lado de un retorno «$21.000». Dos formatos distintos en la misma fila se leen
// como un fallo, y aquí el punto entero es que las cifras se lean rápido.
const dinero = (n) =>
  `$${new Intl.NumberFormat(locale(), { maximumFractionDigits: 0, useGrouping: 'always' }).format(Math.round(n))}`

const entero = (n) =>
  new Intl.NumberFormat(locale(), { useGrouping: 'always' }).format(Math.round(n))

const multiplo = (n) =>
  `${new Intl.NumberFormat(locale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n)}x`

export function initCalculator() {
  const section = document.getElementById('calculadora')
  if (!section) return

  const inputs = {
    spend: section.querySelector('#calc-spend'),
    roas: section.querySelector('#calc-roas'),
    ticket: section.querySelector('#calc-ticket'),
  }
  if (!inputs.spend || !inputs.roas || !inputs.ticket) return

  const out = {}
  section.querySelectorAll('[data-calc]').forEach((el) => {
    out[el.dataset.calc] = el
  })

  // Las barras de «a escala». Son las MISMAS cifras de arriba puestas a
  // proporción: nada que dibujar que no se haya calculado ya.
  const viz = section.querySelector('.calc__viz')
  const barras = {}
  section.querySelectorAll('[data-viz]').forEach((el) => {
    barras[el.dataset.viz] = el
  })

  // El barrido de la barra: UNA vez, al entrar en pantalla. Es el mismo criterio
  // que el resto del sitio (`once: true` en todos los ScrollTrigger) y el motivo
  // de que aquí haya un observador en un módulo que presume de no tener ninguno:
  // el brillo iba en bucle infinito, y un destello que no para es un reclamo, no
  // una revelación. `IntersectionObserver` porque GSAP aquí sería traer 44 KB
  // para encender una clase.
  if (viz && 'IntersectionObserver' in window) {
    const ojo = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return
          viz.classList.add('is-in')
          ojo.disconnect()
        })
      },
      { threshold: 0.6 }
    )
    ojo.observe(viz)
  }

  // Escritura con caché, como el resto del sitio: un `input` de tipo range
  // dispara decenas de eventos por segundo al arrastrar, y la mayoría no cambian
  // el string formateado (arrastrar 100 dólares no mueve «$5.000» hasta pasar de
  // los 500 de `step`).
  const cache = {}
  const write = (key, value) => {
    if (!out[key] || cache[key] === value) return
    cache[key] = value
    out[key].textContent = value
  }

  // Mismo criterio para la barra: se escribe solo si el valor cambia.
  const pintado = {}
  const estilo = (el, prop, valor, clave) => {
    if (!el || pintado[clave] === valor) return
    pintado[clave] = valor
    el.style.setProperty(prop, valor)
  }

  // Región de anuncio ÚNICA para lector de pantalla. Los `output` de arriba ya
  // se anuncian solos al mover su control; lo que no se anuncia es el RESULTADO,
  // que está en otra parte de la sección. Se resume en una frase en vez de leer
  // cuatro filas: `aria-live` en cada celda serían cuatro interrupciones por
  // cada píxel arrastrado.
  //
  // ⚠ La frase empieza por la INVERSIÓN y el MÚLTIPLO, y eso es a propósito: es
  // lo que dibuja la barra de «a escala», que va `aria-hidden` porque no aporta
  // ninguna cifra nueva. Para que esa afirmación sea cierta, el punto de partida
  // tiene que estar en alguna parte del texto — y no lo estaba: vivía solo en el
  // <output> de su control, que se anuncia suelto y en otro momento. Aquí va el
  // recorrido entero en una frase, que es justo lo que la barra enseña de un
  // vistazo.
  const live = document.createElement('p')
  live.className = 'sr-only'
  live.setAttribute('aria-live', 'polite')
  section.appendChild(live)

  let anuncio = 0

  function pintar() {
    const spend = LEE.spend(Number(inputs.spend.value))
    const roas = LEE.roas(Number(inputs.roas.value))
    const ticket = LEE.ticket(Number(inputs.ticket.value))

    const revenue = spend * roas
    const profit = revenue - spend
    const sales = ticket > 0 ? revenue / ticket : 0
    const cpa = sales > 0 ? spend / sales : 0

    write('spend', dinero(spend))
    write('roas', multiplo(roas))
    write('ticket', dinero(ticket))

    write('revenue', dinero(revenue))
    write('profit', `+${dinero(profit)}`)
    write('sales', entero(sales))
    write('cpa', dinero(cpa))

    // A ESCALA. La barra entera es el retorno, y se parte donde acaba lo
    // invertido: ese corte es `inversión ÷ retorno`, que es exactamente 1/ROAS.
    //
    // El MISMO número sirve para tres cosas, y no es casualidad: es dónde
    // termina la parte invertida, dónde empieza la que suma, y cada cuánto cae
    // una marca de la pista — porque cada marca es una vez lo invertido. Con
    // 4,2x se cuentan cuatro marcas y un resto.
    const corte = `${(roas > 0 ? 100 / roas : 100).toFixed(2)}%`
    estilo(barras.spend, 'width', corte, 'corte-w')
    estilo(barras.profit, 'left', corte, 'corte-l')
    estilo(barras.pista, '--pitch', corte, 'pitch')

    // Los importes van en la leyenda, no dentro de la barra: con un ROAS alto la
    // parte invertida es demasiado estrecha para meter un número dentro. El
    // múltiplo NO se escribe aquí: es el mismo «4,2x» del <output> del control de
    // ROAS, y en la barra se cuenta en las marcas.
    //
    // ⚠ AQUÍ HUBO UN DESTELLO al arrastrar, con un comentario que lo justificaba
    // diciendo que «un control que no produce ninguna respuesta se lee como
    // roto». Era un placebo: la inversión y el ticket no mueven la barra porque
    // no PUEDEN moverla —el corte es una proporción y solo el ROAS la cambia— y
    // en vez de decirlo, fingía actividad. Fuera. La inversión ahora cambia dos
    // números de la leyenda, que es una respuesta de verdad; y el ticket cambia
    // las ventas y el coste por venta, que están en el <dl> a un palmo. Si algún
    // día parece que un control no hace nada, se arregla enseñando lo que hace,
    // no encendiendo una luz.
    write('vizSpend', dinero(spend))
    write('vizProfit', `+${dinero(profit)}`)

    // Se anuncia al SOLTAR, no mientras se arrastra.
    clearTimeout(anuncio)
    anuncio = setTimeout(() => {
      live.textContent = t('calc.announce', {
        spend: dinero(spend),
        roas: multiplo(roas),
        revenue: dinero(revenue),
        sales: entero(sales),
        cpa: dinero(cpa),
      })
    }, 700)
  }

  Object.values(inputs).forEach((input) => input.addEventListener('input', pintar))

  // El idioma cambia el formato de los números, no los números.
  window.addEventListener('i18n:change', () => {
    Object.keys(cache).forEach((k) => delete cache[k])
    pintar()
  })

  pintar()
}
