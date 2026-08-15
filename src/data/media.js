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
  // ⚠ La primera tanda de retratos generados (ia-paola-*) se DESCARTÓ: no da el
  // parecido ni el tono. Se queda comentada, no borrada, y sus archivos siguen en
  // public/img/ y src-assets/ para poder comparar con la siguiente generación.
  // Sin `about` declarado, «Sobre mí» se queda con su gradiente placeholder y el
  // layout es idéntico (mismo 4:5), así que descomentar no moverá nada.
  //
  // about: {
  //   src: 'ia-paola-retrato-4x5',
  //   alt: 'Retrato placeholder generado por IA de Paola Parra, especialista en Meta Ads, mirando a cámara',
  //   placeholder: true,        // generado por IA, pendiente de foto real
  // },
  // og: {
  //   src: 'ia-paola-og',
  //   alt: 'Retrato placeholder generado por IA de Paola Parra en tres cuartos, situado a la derecha',
  //   placeholder: true,
  // },
  // heroWide: {
  //   src: 'ia-paola-hero-wide',
  //   alt: 'Retrato placeholder generado por IA de Paola Parra mirando fuera de cuadro',
  //   placeholder: true,
  // },
}

/**
 * FONDOS DE SECCIÓN (parallax)
 * Clave = id de la sección en index.html.
 * `depth`: cuánto se mueve la capa respecto al scroll. 0 = quieta,
 *          0.2 = se desplaza un 20% de su alto. Por encima de 0.35 se nota
 *          demasiado y compite con el texto.
 * `opacity`: sobre fondo #0E0E0E. Rara vez debería pasar de 0.6.
 *
 * ⚠ #informe NO lleva fondo, y es deliberado (MEDIA-BRIEF §criterios).
 */
export const backdrops = {
  // ⚠ Las capas `frente` se retiraron en su día por ser NARANJAS: sumadas al
  // violeta de la capa de abajo reproducían el gradiente Meta a pantalla
  // completa y competían con la barra del informe (MEDIA-BRIEF §5.3). Vuelven
  // con `tint: 'gold'`, que las repinta con el token dorado usando la textura
  // como máscara. Misma forma, color de marca, sin regenerar el PNG.
  metricas: {
    placeholder: true,
    layers: [
      { src: 'bg-metricas-fondo', depth: 0.14, opacity: 0.62 },
      { src: 'bg-metricas-frente', depth: 0.24, opacity: 0.3, tint: 'gold' },
    ],
  },
  servicios: {
    placeholder: true,
    layers: [{ src: 'bg-servicios', depth: 0.06, opacity: 0.58 }],
  },
  proceso: {
    placeholder: true,
    layers: [
      { src: 'bg-proceso-fondo', depth: 0.14, opacity: 0.55 },
      { src: 'bg-proceso-frente', depth: 0.22, opacity: 0.26, tint: 'gold' },
    ],
  },
  testimonios: {
    placeholder: true,
    layers: [{ src: 'bg-testimonios', depth: 0.04, opacity: 0.55 }],
  },
  contacto: {
    placeholder: true,
    // Bajó a 0.32 cuando su resplandor naranja competía con el gradiente Meta.
    // Con el oro como acento del sitio ese calor está EN marca, no en contra:
    // vuelve a 0.42.
    layers: [{ src: 'bg-contacto', depth: 0.06, opacity: 0.42 }],
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
  metricas: 250,
  servicios: 180,
  proceso: 250,
  testimonios: 180,
  contacto: 180,
  portraits: 400,
  galleries: 600,   // las 5 galerías juntas: son miniaturas, no visuales grandes
}

export const media = { portraits, backdrops, sequences, galleries, budgets }
