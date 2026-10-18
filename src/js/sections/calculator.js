import { formatLocale, t } from '../../i18n/index.js'

// CALCULADORA DE CAPTACIÓN — «Haz la cuenta antes de invertir».
//
// Cuatro controles y cinco resultados. Aritmética, nada más: el embudo que
// entienden los negocios que venden por cita y por llamada.
//
//   leads             = inversión ÷ costo por lead
//   citas             = leads × % que agenda
//   clientes          = citas × % de citas que se vuelven clientes
//   costo por cita    = inversión ÷ citas
//   costo por cliente = inversión ÷ clientes
//
// Hasta el 2026-10-17 esto era la calculadora de ROAS (inversión × ROAS × ticket
// = ventas). Sirve para e-commerce y no para seguros, crédito, salud o bienes
// raíces, que no cobran en el carrito: cobran después de una cita.
//
// ⚠ POR QUÉ ESTO Y NO UNA PREVISIÓN. Aquí estuvo el informe de sesión, que
// estimaba una «probabilidad de conversión» de la visita con una heurística
// inventada. Se retiró porque no se entendía y porque una cifra inventada, por
// muy bien etiquetada que esté, es una cifra inventada. Lo que queda es lo único
// que se puede afirmar sin mentir: una división con los números de quien mira,
// hecha en su navegador. Cualquier cosa que se añada aquí tiene que cumplir ese
// mismo listón.
//
// LA PALANCA cumple ese listón. Es la misma cuenta con el agendamiento diez
// puntos más arriba: no promete que un CRM los consiga —eso sí sería inventar—,
// dice cuánto vale cada punto con los números de quien mira. Y es justo el
// trabajo que no se ve en el anuncio: el seguimiento que hace que un lead
// conteste y agende.
//
// Sin dependencias y sin RAF: son cuatro `input`, unos cuantos nodos de texto y
// dos anchos en porcentaje. El navegador ya sabe interpolar eso.

// Los controles van en enteros: dólares y puntos porcentuales.
const LEE = (v) => Math.round(Number(v))

// Formato con el locale del sitio (es-US / en-US): «$3,000» y «30%» en los dos
// idiomas, que es como se leen en EE. UU.
// ⚠ `useGrouping: 'always'`: por defecto algunos locales no agrupan los números
// de cuatro cifras («$3000» junto a un «$12,000»). Dos formatos en el mismo panel
// se leen como un fallo, y aquí el punto entero es que las cifras se lean rápido.
const nf = (opciones) => new Intl.NumberFormat(formatLocale(), opciones)
const dinero = (n) => `$${nf({ maximumFractionDigits: 0, useGrouping: 'always' }).format(Math.round(n))}`
const entero = (n) => nf({ maximumFractionDigits: 0, useGrouping: 'always' }).format(Math.round(n))
const puntos = (p) => nf({ style: 'percent', maximumFractionDigits: 0 }).format(p / 100)

/**
 * La cuenta entera, en un solo sitio. Los recuentos se redondean en CADA paso
 * (no hay medio lead ni un tercio de cita), y los costos se calculan sobre esos
 * mismos recuentos: así «$3,000 ÷ 36 citas» da el costo por cita que se lee al
 * lado, y no el de 36,4 citas que nadie ve.
 */
function cuenta(spend, cpl, agenda, cierre) {
  const leads = cpl > 0 ? Math.floor(spend / cpl) : 0
  const citas = Math.round((leads * agenda) / 100)
  const clientes = Math.round((citas * cierre) / 100)
  return {
    leads,
    citas,
    clientes,
    costoCita: citas > 0 ? spend / citas : null,
    costoCliente: clientes > 0 ? spend / clientes : null,
  }
}

export function initCalculator() {
  const section = document.getElementById('calculadora')
  if (!section) return

  const inputs = {
    spend: section.querySelector('#calc-spend'),
    cpl: section.querySelector('#calc-cpl'),
    agenda: section.querySelector('#calc-agenda'),
    cierre: section.querySelector('#calc-cierre'),
  }
  if (Object.values(inputs).some((el) => !el)) return

  const out = {}
  section.querySelectorAll('[data-calc]').forEach((el) => {
    out[el.dataset.calc] = el
  })

  // El embudo a escala. Son las MISMAS cifras del <dl> puestas a proporción:
  // nada que dibujar que no se haya calculado ya.
  const viz = section.querySelector('.calc__viz')
  const barras = {}
  section.querySelectorAll('[data-viz]').forEach((el) => {
    barras[el.dataset.viz] = el
  })

  // El barrido de la barra: UNA vez, al entrar en pantalla. Es el mismo criterio
  // que el resto del sitio (`once: true` en todos los ScrollTrigger) y el motivo
  // de que aquí haya un observador en un módulo que presume de no tener ninguno:
  // un destello que no para es un reclamo, no una revelación.
  // `IntersectionObserver` porque GSAP aquí sería traer 44 KB para una clase.
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
  // el string formateado.
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
  // cinco filas: `aria-live` en cada celda serían cinco interrupciones por cada
  // píxel arrastrado. La frase recorre el embudo entero, que es justo lo que la
  // barra (aria-hidden) enseña de un vistazo.
  const live = document.createElement('p')
  live.className = 'sr-only'
  live.setAttribute('aria-live', 'polite')
  section.appendChild(live)

  let anuncio = 0

  function pintar() {
    const spend = LEE(inputs.spend.value)
    const cpl = LEE(inputs.cpl.value)
    const agenda = LEE(inputs.agenda.value)
    const cierre = LEE(inputs.cierre.value)
    const r = cuenta(spend, cpl, agenda, cierre)

    // Sin citas o sin clientes no hay costo que dividir: un guion, no un «$∞».
    const costo = (n) => (n == null ? '—' : dinero(n))

    write('spend', dinero(spend))
    write('cpl', dinero(cpl))
    write('agenda', puntos(agenda))
    write('cierre', puntos(cierre))

    write('clientes', entero(r.clientes))
    write('leads', entero(r.leads))
    write('citas', entero(r.citas))
    write('costoCita', costo(r.costoCita))
    write('costoCliente', costo(r.costoCliente))

    // EL EMBUDO. La pista son los leads (el 100 %); los dos rellenos salen del
    // mismo origen y miden lo que agenda y lo que se vuelve cliente. Las marcas
    // de la pista, cada 10 % de los leads, están en el CSS: no dependen de nada.
    const parte = (n) => `${(r.leads > 0 ? (n / r.leads) * 100 : 0).toFixed(2)}%`
    estilo(barras.citas, 'width', parte(r.citas), 'citas')
    estilo(barras.clientes, 'width', parte(r.clientes), 'clientes')
    write('vizLeads', entero(r.leads))
    write('vizCitas', entero(r.citas))
    write('vizClientes', entero(r.clientes))

    // LA PALANCA: mismos leads, diez puntos más de agendamiento. Si con eso no
    // llega ni un cliente más, la línea calla: un «0 clientes más» no le dice
    // nada útil a nadie.
    if (out.lever) {
      const mas = cuenta(spend, cpl, Math.min(100, agenda + 10), cierre)
      const extra = mas.clientes - r.clientes
      out.lever.hidden = extra < 1
      if (extra >= 1) {
        const vars = { leads: entero(r.leads), agenda: puntos(Math.min(100, agenda + 10)), extra: entero(extra) }
        write('lever', t(extra === 1 ? 'calc.leverOne' : 'calc.leverMany', vars))
      }
    }

    // Se anuncia al SOLTAR, no mientras se arrastra.
    clearTimeout(anuncio)
    anuncio = setTimeout(() => {
      live.textContent = t('calc.announce', {
        spend: dinero(spend),
        cpl: dinero(cpl),
        leads: entero(r.leads),
        citas: entero(r.citas),
        clientes: entero(r.clientes),
        costoCita: costo(r.costoCita),
        costoCliente: costo(r.costoCliente),
      })
    }, 700)
  }

  Object.values(inputs).forEach((input) => input.addEventListener('input', pintar))

  // El idioma cambia el formato de los números y la frase de la palanca, no los números.
  window.addEventListener('i18n:change', () => {
    Object.keys(cache).forEach((k) => delete cache[k])
    pintar()
  })

  pintar()
}
