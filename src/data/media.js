// ============================================================
// MANIFIESTO DE MEDIOS — la única fuente de verdad de qué imágenes existen.
//
// >>> ESTE ES EL ARCHIVO QUE EDITA EL AGENTE QUE GENERA LAS IMÁGENES. <<<
// Instrucciones completas, prompts y criterios: ../../MEDIA-BRIEF.md
//
// Cómo funciona: el sitio lee este archivo. Lo que no esté declarado aquí,
// simplemente no se renderiza. Por eso el sitio funciona hoy con cero imágenes
// y seguirá funcionando con todas: se pueden ir entregando de una en una.
//
// NUNCA hay que tocar código para añadir una imagen. Solo:
//   1. dejar el archivo en public/img/…
//   2. declararlo aquí
// ============================================================

/**
 * RETRATOS
 * `src` va SIN extensión: el código sirve .avif y cae a .webp.
 * `alt` es obligatorio y descriptivo — el chrome de anuncio es aria-hidden,
 * así que el alt es la única lectura del visual para un lector de pantalla.
 */
export const portraits = {
  // La primera tanda (ia-paola-*) se descartó y sus archivos se borraron. Esta es
  // la segunda: sale de `Selección/` y la procesa scripts/media/build-media.py.
  //
  // El retrato es el primer plano de las dos luces. Se le quitó el violeta en el
  // procesado (kill_violet), así que la única luz de color que queda es el ámbar
  // de la derecha — que ya era el oro del sitio.
  about: {
    src: 'paola-retrato-4x5',
    alt: 'Retrato de Paola Parra, especialista en Meta Ads, apoyando la mano en la mejilla y mirando a cámara',
  },
}

/**
 * FIGURA DEL HERO
 * Recorte con ALFA REAL (Vision, ver scripts/media/cutout.swift), no un PNG con
 * fondo negro: convive con las partículas WebGL, que son transparentes, y con
 * los dos temas. Cualquier fondo horneado se vería como un parche.
 *
 * Sin `figure` declarada el hero se queda exactamente como estaba: tipografía
 * más partículas. No hay reserva de layout que deshacer.
 */
export const figure = {
  src: 'paola-figura',
  // `alt` VACÍO y a propósito: la figura es escenografía. Quien lee con lector de
  // pantalla ya recibe el h1 «Paola Parra» justo al lado y el retrato descrito en
  // «Sobre mí»; describir aquí otra vez a la misma persona es ruido, no acceso.
  // Por eso el contenedor va además con aria-hidden.
  alt: '',
  width: 695,
  height: 1180,
}

/**
 * FONDOS DE SECCIÓN — «platos» fotográficos con parallax
 * Clave = id de la sección en index.html.
 *
 * ⚠ CAMBIO DE MODELO (2026-08-15). Antes esto eran texturas abstractas a sangre
 * con `mix-blend-mode: screen` y una capa teñida por máscara. Se retiró entero.
 * El problema no era la opacidad ni el tinte: era que cada sección enseñaba un
 * RECTÁNGULO de imagen cortado a hacha justo en la costura con la sección
 * siguiente, y cinco texturas generadas por separado no se parecían entre sí.
 * Resultado: fondos que se sentían ajenos, incoherentes y sucios.
 *
 * El modelo nuevo:
 *   · una sola foto por sección, todas del mismo reportaje;
 *   · el mismo grado de color horneado en las cinco (build-media.py, warm_grade);
 *   · la ALFA horneada en el archivo, muriendo por arriba, por abajo y hacia el
 *     lado donde va el texto. Sin bordes que cortar y sin blend-mode que ajustar,
 *     y el mismo archivo sirve para el tema oscuro y para el claro.
 *
 * `side`  · borde al que se ANCLA la foto. El contenido de la sección va al otro.
 * `depth` · desplazamiento por scroll. 0 = quieta. Tope duro en 0.35.
 * `opacity` · [oscuro, claro]. En claro la foto es un plato oscuro sobre crema y
 *             necesita menos peso para no convertirse en un borrón.
 *
 * ⚠ #informe NO lleva fondo, y es deliberado (MEDIA-BRIEF §criterios).
 * ⚠ #proyectos tampoco: la galería horizontal ya es la imagen de esa sección.
 */
export const backdrops = {
  // Los monitores con las gráficas. Es la única foto del set que enseña
  // literalmente aquello de lo que habla la sección.
  metricas: {
    side: 'right',
    layers: [{ src: 'bg-metricas', depth: 0.12, opacity: [0.34, 0.24] }],
  },
  // La cabecera de servicios va en sticky arriba a la izquierda: el hueco tiene
  // que caer a la izquierda y Paola entra por la derecha.
  servicios: {
    side: 'right',
    layers: [{ src: 'bg-servicios', depth: 0.08, opacity: [0.42, 0.3] }],
  },
  // El pasillo. Un método es un recorrido, y es la única foto con dirección de
  // marcha.
  proceso: {
    side: 'right',
    layers: [{ src: 'bg-proceso', depth: 0.14, opacity: [0.42, 0.3] }],
  },
  // El sillón: registro conversado, que es el de un testimonio.
  testimonios: {
    side: 'right',
    layers: [{ src: 'bg-testimonios', depth: 0.06, opacity: [0.26, 0.18] }],
  },
  // La ventana. La sección que cierra el sitio mira afuera. Va la más baja de
  // las cinco: el CTA de contacto es tipografía enorme y centrada, y no admite
  // competencia detrás.
  contacto: {
    side: 'left',
    layers: [{ src: 'bg-contacto', depth: 0.06, opacity: [0.22, 0.16] }],
  },
  //
  // `formats` es opcional y por defecto es ['avif', 'webp']. Si solo entregas uno,
  // DECLÁRALO — image-set() elige por tipo soportado, no cae al otro si falta:
  //   { src: 'bg-x', formats: ['webp'], depth: 0.1 }
}

/**
 * SECUENCIAS DE FRAMES (scrollytelling en canvas 2D)
 * Los frames van en public/img/<dir>/0001.<ext> … numerados desde 1 con 4 dígitos.
 *
 * `still` es el frame fijo que se pinta INMEDIATAMENTE mientras carga la
 * secuencia — y el único que se ve en móvil y con reduced-motion. Es el que
 * cuenta para el LCP, así que es el que hay que optimizar a muerte.
 *
 * `trigger/start/end` son opcionales: solo si hay que salirse del comportamiento
 * por defecto (la sección entera, de su entrada a su salida).
 */
export const sequences = {
  // hero: {
  //   placeholder: true,
  //   dir: 'seq/hero', frames: 48, ext: 'avif',
  //   still: 'seq/hero-still',
  //   start: 'top top', end: 'bottom top',
  // },
  // proyectos: {
  //   placeholder: true,
  //   dir: 'seq/proyectos', frames: 36, ext: 'avif',
  //   still: 'seq/proyectos-still',
  //   // La galería está PINNEADA: el recorrido del scroll es más largo que la
  //   // sección. 'bottom bottom' cubre el pin entero sin duplicar su cálculo.
  //   start: 'top top', end: 'bottom bottom',
  // },
}

/**
 * GALERÍAS DE SERVICIO
 * Muestras de trabajo que se despliegan al pasar por cada renglón de #servicios.
 * La clave es el `data-service` del <li> en index.html.
 *
 * `src: null` ⇒ se pinta el gradiente dorado de `gradient`, exactamente igual que
 * hace projects.js cuando un caso todavía no tiene creatividad. Cuando llegue la
 * imagen real basta con rellenar `src` (sin extensión): NO hay que tocar código.
 *
 * ⚠ Los textos NO viven aquí. El pie de cada muestra —que hace también de `alt`—
 * está en `services.items[i].samples` de i18n/es.js y i18n/en.js, porque es texto
 * visible y el sitio es bilingüe. Aquí solo vive el medio.
 */
export const galleries = {
  'meta-ads': {
    placeholder: true,
    items: [
      { src: null, gradient: ['#8A6A1F', '#D4AF37'] },
      { src: null, gradient: ['#6E5514', '#C9A227'] },
      { src: null, gradient: ['#D4AF37', '#F2DFA6'] },
    ],
  },
  'paid-social': {
    placeholder: true,
    items: [
      { src: null, gradient: ['#6E5514', '#D4AF37'] },
      { src: null, gradient: ['#8A6A1F', '#F2DFA6'] },
      { src: null, gradient: ['#A8905A', '#D4AF37'] },
    ],
  },
  'funnels-cro': {
    placeholder: true,
    items: [
      { src: null, gradient: ['#D4AF37', '#8A6A1F'] },
      { src: null, gradient: ['#F2DFA6', '#A8905A'] },
      { src: null, gradient: ['#8A6A1F', '#C9A227'] },
    ],
  },
  ugc: {
    placeholder: true,
    items: [
      { src: null, gradient: ['#C9A227', '#F2DFA6'] },
      { src: null, gradient: ['#8A6A1F', '#D4AF37'] },
      { src: null, gradient: ['#A8905A', '#EBD48A'] },
    ],
  },
  auditorias: {
    placeholder: true,
    items: [
      { src: null, gradient: ['#6E5514', '#A8905A'] },
      { src: null, gradient: ['#D4AF37', '#6E5514'] },
      { src: null, gradient: ['#F2DFA6', '#8A6A1F'] },
    ],
  },
}

/**
 * PRESUPUESTO DE PESO POR SECCIÓN (KB) — lo comprueba `npm run check:media`.
 * Acordado sección a sección: el hero tiene manga ancha porque es el escaparate;
 * el resto va ajustado para no reventar el LCP.
 */
export const budgets = {
  'seq/hero': 1800,
  'seq/hero-still': 120,      // ← en la ruta crítica: es el LCP
  'seq/proyectos': 1200,
  'seq/proyectos-still': 120,
  'seq/sobre-mi': 700,
  'seq/sobre-mi-still': 100,
  metricas: 260,
  servicios: 220,
  proceso: 260,
  testimonios: 220,
  contacto: 220,
  portraits: 400,
  figure: 320,      // recorte del hero: alfa real, y la alfa no comprime gratis
  galleries: 600,   // las 5 galerías juntas: son miniaturas, no visuales grandes
}

export const media = { portraits, figure, backdrops, sequences, galleries, budgets }
