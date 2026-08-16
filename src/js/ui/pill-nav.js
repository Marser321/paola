// Navegación en píldoras. Port a vanilla del componente PillNav de React Bits
// (reactbits.dev), estilos en src/styles/pill-nav.css.
//
// El original es React + react-router-dom. Aquí no hay React y meterlo por un
// menú serían ~45 KB gzip sobre un bundle inicial de 20 — en un sitio que carga
// `three` en diferido precisamente para no engordarlo. GSAP, que es la única
// dependencia real del componente, ya estaba.
//
// Se porta el MECANISMO, no el componente:
//   · la geometría del círculo va LITERAL (es la única parte que no se puede
//     reinventar sin romper el efecto: ver `medir`);
//   · el resto se reescribe contra las convenciones de esta casa — construir el
//     markup por JS sobre el que ya existe, un solo listener delegado, guardas de
//     reduced-motion y de puntero grueso.
//
// PROGRESIVO: si este módulo no corre, el header se queda con los <a> de siempre
// y el menú funciona igual. Por eso lee el DOM existente en vez de imprimirlo.

import gsap from 'gsap'
import { shouldReduceMotion } from '../core/lenis.js'

const punteroFino = () => window.matchMedia('(hover: hover)').matches

/**
 * Geometría del círculo, tal cual el original.
 *
 * El círculo tiene que entrar por las dos esquinas INFERIORES de la píldora y
 * salir por arriba al escalar: de ahí el radio de la circunferencia que pasa por
 * esos dos puntos, `R = (w²/4 + h²) / 2h`. `delta` es cuánto hay que bajarlo para
 * que su borde superior arranque a ras del suelo de la píldora, y el origen de
 * transformación se coloca ahí para que la escala crezca desde ese punto y no
 * desde el centro. Con cualquier otro valor el círculo asoma por los lados antes
 * de tiempo y deja de leerse como un llenado.
 */
function medir(pill, circle) {
  const { width: w, height: h } = pill.getBoundingClientRect()
  if (!w || !h) return null

  const R = ((w * w) / 4 + h * h) / (2 * h)
  const D = Math.ceil(2 * R) + 2
  const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1

  circle.style.width = `${D}px`
  circle.style.height = `${D}px`
  circle.style.bottom = `-${delta}px`

  gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${D - delta}px` })
  return h
}

/** Convierte un <a> del header en píldora, conservando el nodo y sus atributos. */
function envolver(a) {
  if (a.querySelector('.pill__stack')) return
  const texto = a.textContent.trim()
  a.classList.add('pill')
  a.innerHTML = `
    <span class="pill__circle" aria-hidden="true"></span>
    <span class="pill__stack">
      <span class="pill__label">${texto}</span>
      <span class="pill__label--hover" aria-hidden="true">${texto}</span>
    </span>`
}

/**
 * Marca la sección en la que estás. El componente original recibe `activeHref`
 * como prop porque en React lo sabe el router; aquí no hay rutas, hay una
 * one-page, así que la fuente de verdad es qué sección se está viendo.
 *
 * IntersectionObserver y no un ScrollTrigger por enlace: son cinco secciones,
 * no hay que medir nada y no participa en el refresh general — que en este sitio
 * es caro y frágil (el pin horizontal de #proyectos).
 */
function seguirSeccion(enlaces) {
  const porId = new Map()
  for (const a of enlaces) {
    const id = a.getAttribute('href')?.startsWith('#') && a.getAttribute('href').slice(1)
    const seccion = id && document.getElementById(id)
    if (seccion) porId.set(seccion, a)
  }
  if (!porId.size) return

  const visibles = new Set()
  const pintar = () => {
    // La de más arriba de las visibles manda: al entrar una sección nueva, la
    // anterior sigue un rato en pantalla y si no se ordena parpadean las dos.
    const activa = [...visibles].sort((a, b) => a.offsetTop - b.offsetTop)[0]
    for (const [seccion, a] of porId) {
      const on = seccion === activa
      a.classList.toggle('is-active', on)
      const gemelo = document.querySelector(`.pill-nav__panel a[href="${a.getAttribute('href')}"]`)
      gemelo?.classList.toggle('is-active', on)
    }
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visibles.add(e.target)
        else visibles.delete(e.target)
      }
      pintar()
    },
    // La banda central: una sección cuenta cuando ocupa el medio de la pantalla,
    // no cuando asoma por el borde.
    { rootMargin: '-45% 0px -45% 0px' }
  )
  for (const seccion of porId.keys()) io.observe(seccion)
}

/** Desplegable de móvil: hamburguesa que se cruza y panel que baja. */
function montarPanel(nav, enlaces) {
  const boton = document.createElement('button')
  boton.type = 'button'
  boton.className = 'pill-nav__toggle'
  boton.setAttribute('aria-expanded', 'false')
  boton.setAttribute('aria-label', 'Abrir menú')
  boton.setAttribute('data-hover', '')
  boton.innerHTML = '<span class="pill-nav__bar"></span><span class="pill-nav__bar"></span>'

  const panel = document.createElement('div')
  panel.className = 'pill-nav__panel'
  panel.id = 'pill-nav-panel'
  panel.inert = true
  panel.innerHTML = `<ul>${enlaces
    .map((a) => {
      // `data-scroll` se copia o los anclas del panel no pasarían por Lenis y
      // saltarían en seco (core/lenis.js).
      const scroll = a.hasAttribute('data-scroll') ? ' data-scroll' : ''
      return `<li><a href="${a.getAttribute('href')}"${scroll} data-hover>${a.querySelector('.pill__label')?.textContent ?? a.textContent.trim()}</a></li>`
    })
    .join('')}</ul>`

  boton.setAttribute('aria-controls', panel.id)
  nav.append(boton)
  document.querySelector('.site-header').append(panel)

  const barras = boton.querySelectorAll('.pill-nav__bar')
  const dur = shouldReduceMotion() ? 0 : 0.3

  const pintar = (abierto) => {
    boton.setAttribute('aria-expanded', String(abierto))
    boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú')
    panel.inert = !abierto

    gsap.to(barras[0], { rotate: abierto ? 45 : 0, y: abierto ? 2.5 : 0, duration: dur, ease: 'power3.out' })
    gsap.to(barras[1], { rotate: abierto ? -45 : 0, y: abierto ? -2.5 : 0, duration: dur, ease: 'power3.out' })

    if (abierto) {
      gsap.set(panel, { visibility: 'visible' })
      gsap.fromTo(panel, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: dur, ease: 'power3.out' })
    } else {
      gsap.to(panel, {
        opacity: 0,
        y: -8,
        duration: dur * 0.7,
        ease: 'power3.out',
        onComplete: () => gsap.set(panel, { visibility: 'hidden' }),
      })
    }
  }

  const cerrar = () => boton.getAttribute('aria-expanded') === 'true' && pintar(false)

  boton.addEventListener('click', () => pintar(boton.getAttribute('aria-expanded') !== 'true'))
  panel.addEventListener('click', (e) => e.target.closest('a') && cerrar())
  document.addEventListener('keydown', (e) => e.key === 'Escape' && cerrar())
  // Al ensanchar la ventana el panel se queda abierto e invisible detrás del menú
  // de escritorio, con sus enlaces todavía tabulables. Se recoge.
  window.matchMedia('(min-width: 768px)').addEventListener('change', cerrar)
}

export function initPillNav() {
  const nav = document.querySelector('.site-nav')
  if (!nav || nav.classList.contains('is-pill')) return

  const enlaces = [...nav.querySelectorAll(':scope > a')]
  if (!enlaces.length) return

  // El markup se rehace ANTES de que lleguen los conmutadores de idioma y de
  // tema, que se cuelgan de .site-nav: así entran como hermanos de la lista y no
  // dentro de ella (ver main.js).
  const lista = document.createElement('ul')
  lista.className = 'pill-nav__list'
  for (const a of enlaces) {
    envolver(a)
    const li = document.createElement('li')
    li.append(a)
    lista.append(li)
  }
  nav.prepend(lista)
  nav.classList.add('is-pill')

  montarPanel(nav, enlaces)
  seguirSeccion(enlaces)

  // Con reduced-motion no hay relevo: el CSS ya esconde el círculo y el rótulo de
  // hover, y lo que queda es el cambio de color, que es información y no adorno.
  // Es la única puerta que se cierra aquí para siempre, porque es una preferencia
  // del sistema y no una circunstancia del momento.
  //
  // ⚠ El puntero NO se comprueba aquí. Se hacía, y era el mismo fallo que tenían
  // los guards de WebGL: leer una capacidad UNA vez al arrancar y no volver a
  // mirar. Un portátil táctil, una tablet a la que le enchufan un ratón o un
  // navegador que emula móvil y luego deja de hacerlo se quedaban sin efecto para
  // siempre, porque los listeners no llegaban a engancharse. Ahora se enganchan
  // siempre —son dos, delegados— y quien decide es `mover`, en el momento.
  if (shouldReduceMotion()) return

  // --- Relevo de rótulos, uno por píldora -----------------------------------
  const timelines = new Map()

  const construir = (soloEste = null) => {
    for (const a of soloEste ? [soloEste] : enlaces) {
      const circle = a.querySelector('.pill__circle')
      const label = a.querySelector('.pill__label')
      const hover = a.querySelector('.pill__label--hover')
      // `medir` devuelve null si la píldora no ocupa nada, que es lo que pasa
      // mientras la lista está en `display: none` por debajo de 768px.
      const h = medir(a, circle)
      if (h == null) continue

      timelines.get(a)?.kill()
      gsap.set(label, { y: 0 })
      gsap.set(hover, { y: Math.ceil(h + 100), opacity: 0 })

      const tl = gsap.timeline({ paused: true })
      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: 'power3.out', overwrite: 'auto' }, 0)
        .to(label, { y: -(h + 8), duration: 2, ease: 'power3.out', overwrite: 'auto' }, 0)
        .to(hover, { y: 0, opacity: 1, duration: 2, ease: 'power3.out', overwrite: 'auto' }, 0)
      timelines.set(a, tl)
    }
  }

  construir()

  // Tres motivos para volver a medir, y los tres son reales aquí:
  //   · el ancho de la ventana cambia el de las píldoras;
  //   · las fuentes entran con `font-display: swap`, así que el primer cálculo
  //     puede salir con la métrica de la fuente de sistema;
  //   · el sitio cambia de idioma EN CALIENTE, y «Proyectos» y «Projects» no
  //     miden lo mismo. Sin esto, el círculo se queda con el tamaño del idioma
  //     con el que se montó.
  // ⚠ Los tres van envueltos y NO se pasa `construir` directamente como oyente:
  // lleva un parámetro opcional, y `addEventListener` le colaría el Event —y
  // `fonts.ready` el FontFaceSet— como si fuera la píldora a medir.
  window.addEventListener('resize', () => construir())
  // Diferido a la siguiente vuelta del bucle, y con `setTimeout` y no con
  // `requestAnimationFrame`: quien reescribe los rótulos es el oyente de
  // `i18n:change` de main.js, que se registra DESPUÉS que este y por tanto corre
  // después — medir aquí mismo daría el ancho del idioma viejo. Y rAF no sirve
  // como diferidor porque no corre con la pestaña en segundo plano: cambiar de
  // idioma sin mirar dejaba los círculos con la medida anterior hasta el
  // siguiente `resize`.
  window.addEventListener('i18n:change', () => setTimeout(() => construir(), 0))
  document.fonts?.ready.then(() => construir()).catch(() => {})

  // Un solo par de listeners delegados para todas las píldoras, como el
  // backstage y la galería elástica.
  const activos = new Map()
  const mover = (a, alFinal, duration) => {
    // En táctil manda la pulsación y no hay estado intermedio que enseñar: un
    // `mouseover` sintético de un toque dejaría la píldora llena hasta que se
    // tocara otra cosa.
    if (!punteroFino()) return
    // Si la píldora no tiene línea de tiempo es que se midió mientras estaba
    // oculta —el menú se monta en móvil, donde la lista es `display: none`— y
    // ninguna de las señales de arriba llegó a rehacerla. Se mide ahora, que es
    // el momento en el que con seguridad ya se ve: alguien la está apuntando.
    if (!timelines.has(a)) construir(a)
    const tl = timelines.get(a)
    if (!tl) return
    activos.get(a)?.kill()
    activos.set(a, tl.tweenTo(alFinal ? tl.duration() : 0, { duration, ease: 'power3.out', overwrite: 'auto' }))
  }
  nav.addEventListener('mouseover', (e) => {
    const a = e.target.closest('.pill')
    if (a && !a.contains(e.relatedTarget)) mover(a, true, 0.3)
  })
  nav.addEventListener('mouseout', (e) => {
    const a = e.target.closest('.pill')
    if (a && !a.contains(e.relatedTarget)) mover(a, false, 0.2)
  })
}
