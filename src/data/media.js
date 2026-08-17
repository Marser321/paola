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
  // Deben coincidir con el asset real o hay salto de layout. Las genera
  // scripts/media/build-media.py §build_figura: si cambia el encuadre ahí,
  // cambian aquí. (2026-08-16: 695→660 al rehacer el recorte; el ancho anterior
  // estiraba la figura ~5% respecto a sus proporciones reales.)
  width: 660,
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
 * ⚠ #proyectos tampoco, y ahora con más motivo: además del track horizontal
 *   lleva la galería 3D en WebGL (src/js/webgl/projects-gallery.js). Una capa
 *   de foto encima sería la tercera imagen compitiendo en la misma sección.
 */
// ⚠ SOBRE EL PAR [oscuro, claro]. Los dos números NO tienen el mismo margen.
//
// En OSCURO la foto ACLARA el fondo, así que compite con el texto. Medido
// componiendo cada archivo sobre --bg y exigiendo 4,5:1 al texto --muted contra
// el 1% de píxeles más claros de la banda, el techo por sección es:
//   metricas 0,28 · servicios 0,18 · proceso 0,15 · testimonios 0,18 · contacto 0,13
// Varios de los valores de abajo ya están por encima. No se suben: el fondo que
// faltaba en móvil era superficie, no opacidad, y eso se arregló en media.css
// (§MÓVIL: EL PLATO DEJA DE ESCALARSE AL ANCHO).
//
// En CLARO la foto OSCURECE el papel, así que empuja el contraste del texto hacia
// arriba en vez de hacia abajo: ahí no hay techo de legibilidad y el límite es de
// gusto — que no se enturbie el crema. Por eso el tema claro sí sube, del 0,72 del
// valor oscuro al 0,85.
export const backdrops = {
  // Los monitores con las gráficas. Es la única foto del set que enseña
  // literalmente aquello de lo que habla la sección.
  metricas: {
    side: 'right',
    layers: [{ src: 'bg-metricas', depth: 0.12, opacity: [0.34, 0.29] }],
  },
  // La cabecera de servicios va en sticky arriba a la izquierda: el hueco tiene
  // que caer a la izquierda y Paola entra por la derecha.
  servicios: {
    side: 'right',
    layers: [{ src: 'bg-servicios', depth: 0.08, opacity: [0.42, 0.36] }],
  },
  // El pasillo. Un método es un recorrido, y es la única foto con dirección de
  // marcha.
  proceso: {
    side: 'right',
    layers: [{ src: 'bg-proceso', depth: 0.14, opacity: [0.42, 0.36] }],
  },
  // El sillón: registro conversado, que es el de un testimonio.
  testimonios: {
    side: 'right',
    layers: [{ src: 'bg-testimonios', depth: 0.06, opacity: [0.26, 0.22] }],
  },
  // La ventana. La sección que cierra el sitio mira afuera. Va la más baja de
  // las cinco: el CTA de contacto es tipografía enorme y centrada, y no admite
  // competencia detrás.
  contacto: {
    side: 'left',
    layers: [{ src: 'bg-contacto', depth: 0.06, opacity: [0.22, 0.19] }],
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
      { src: 'sample-meta-ads-1', gradient: ['#8A6A1F', '#D4AF37'] },
      { src: 'sample-meta-ads-2', gradient: ['#6E5514', '#C9A227'] },
      { src: 'sample-meta-ads-3', gradient: ['#D4AF37', '#F2DFA6'] },
    ],
  },
  'paid-social': {
    placeholder: true,
    items: [
      { src: 'sample-paid-social-1', gradient: ['#6E5514', '#D4AF37'] },
      { src: 'sample-paid-social-2', gradient: ['#8A6A1F', '#F2DFA6'] },
      { src: 'sample-paid-social-3', gradient: ['#A8905A', '#D4AF37'] },
    ],
  },
  'funnels-cro': {
    placeholder: true,
    items: [
      { src: 'sample-funnels-cro-1', gradient: ['#D4AF37', '#8A6A1F'] },
      { src: 'sample-funnels-cro-2', gradient: ['#F2DFA6', '#A8905A'] },
      { src: 'sample-funnels-cro-3', gradient: ['#8A6A1F', '#C9A227'] },
    ],
  },
  ugc: {
    placeholder: true,
    items: [
      { src: 'sample-ugc-1', gradient: ['#C9A227', '#F2DFA6'] },
      { src: 'sample-ugc-2', gradient: ['#8A6A1F', '#D4AF37'] },
      { src: 'sample-ugc-3', gradient: ['#A8905A', '#EBD48A'] },
    ],
  },
  auditorias: {
    placeholder: true,
    items: [
      { src: 'sample-auditorias-1', gradient: ['#6E5514', '#A8905A'] },
      { src: 'sample-auditorias-2', gradient: ['#D4AF37', '#6E5514'] },
      { src: 'sample-auditorias-3', gradient: ['#F2DFA6', '#8A6A1F'] },
    ],
  },
}

/**
 * PRESUPUESTO DE PESO POR SECCIÓN (KB) — lo comprueba `npm run check:media`.
 * Acordado sección a sección: el hero tiene manga ancha porque es el escaparate;
 * el resto va ajustado para no reventar el LCP.
 */
/**
 * ETAPAS DEL MÉTODO DE TRABAJO (#proceso)
 *
 * >>> SEIS IMÁGENES PENDIENTES. Es lo que hay que generar. <<<
 *
 * Mientras no existan, cada etapa se pinta con su gradiente y su número: la
 * sección funciona entera desde el primer día y las fotos entran de una en una
 * sin tocar una línea de código. Mismo trato que las galerías de servicio.
 *
 * QUÉ TIENEN QUE CONTAR. El carrusel enseña UNA etapa cada vez, así que la
 * imagen no acompaña al texto: es la que hace entender de un vistazo en qué
 * consiste ese paso. Criterios para las seis:
 *   · Formato 4:5 vertical — es el hueco de la tarjeta.
 *   · Un solo sujeto claro. Se ven a 420px de ancho y con el 40% de la tarjeta
 *     tapada por el velo del pie: una escena con tres cosas no se lee.
 *   · Progresión legible entre ellas. Puestas en fila tienen que contar un
 *     recorrido, de diagnóstico a crecimiento, no seis fotos de oficina.
 *   · Luz cálida y paleta corta, al hilo del resto del sitio (MEDIA-BRIEF.md).
 *     Nada de azules corporativos ni de gráficas de stock.
 *
 * `alt` NO es opcional y no describe la foto: describe la ETAPA. Es lo que
 * escucha quien navega con lector de pantalla en lugar de la imagen.
 */
export const process = {
  placeholder: true,
  items: [
    {
      // 01 · Auditoría — el diagnóstico. Antes de tocar nada, mirar.
      src: 'proceso-01-auditoria',
      gradient: ['#4A3A10', '#8A6A1F'],
      alt: 'Revisión de una cuenta publicitaria existente en busca de fugas de presupuesto',
    },
    {
      // 02 · Estrategia — el plan sobre la mesa. Papel, no pantalla: aquí
      // todavía se decide, no se ejecuta.
      src: 'proceso-02-estrategia',
      gradient: ['#6E5514', '#A8905A'],
      alt: 'Planificación de la estructura de campañas y el reparto de presupuesto por fase del embudo',
    },
    {
      // 03 · Creatividades — la producción. Es la etapa más física de las seis y
      // la que mejor admite una foto con manos dentro.
      src: 'proceso-03-creatividades',
      gradient: ['#8A6A1F', '#D4AF37'],
      alt: 'Producción de anuncios: grabación y montaje de piezas UGC, estáticas y de vídeo',
    },
    {
      // 04 · Lanzamiento — el momento de publicar. Tensión, no celebración: lo
      // que se celebra viene en la 06.
      src: 'proceso-04-lanzamiento',
      gradient: ['#A8905A', '#EBD48A'],
      alt: 'Puesta en marcha de las campañas con el seguimiento técnico ya configurado',
    },
    {
      // 05 · Optimización — la iteración semanal. Repetición y ajuste fino.
      src: 'proceso-05-optimizacion',
      gradient: ['#C9A227', '#F2DFA6'],
      alt: 'Iteración semanal sobre las campañas: se retiran las que no rinden y se refuerzan las que sí',
    },
    {
      // 06 · Escala — el crecimiento. La única de las seis que puede permitirse
      // amplitud y aire: es a donde lleva todo lo anterior.
      src: 'proceso-06-escala',
      gradient: ['#D4AF37', '#FFF4A5'],
      alt: 'Crecimiento sostenido de la inversión hacia más canales y más mercados manteniendo la rentabilidad',
    },
  ],
}

/**
 * CAPAS DE PARALLAX — profundidad multicapa por sección
 *
 * >>> AQUÍ SE AÑADEN LAS CAPAS NUEVAS. Es declarar, no programar. <<<
 *
 * Qué es y qué NO es. Los `backdrops` de arriba ya mueven UNA foto por sección:
 * eso es el decorado. Esto es otra cosa — varias capas a distinta velocidad
 * dentro de la misma sección, que es lo que produce sensación de profundidad
 * real. Se usan a la vez sin pisarse: el backdrop es el plato del fondo y estas
 * son los planos que van delante y detrás de él.
 *
 * Clave = id de la sección en index.html. Sin capas declaradas, la sección se
 * queda exactamente como está: este módulo no toca el DOM si no hay nada que
 * poner.
 *
 * CADA CAPA es una de estas dos cosas:
 *
 *   · IMAGEN — `src` sin extensión, igual que en todo este archivo. Tiene que
 *     llevar ALFA REAL (PNG/WebP con transparencia), no un rectángulo con fondo
 *     horneado: se ven unas sobre otras y sobre las partículas del hero, que son
 *     transparentes. Un fondo opaco se vería como un parche recortado. Ver
 *     PROMPTS-PARALLAX.md para el encargo.
 *
 *   · RESPLANDOR — `glow`, un radial atmosférico definido por tokens. No pesa
 *     nada, gira con el tema solo y sirve para dar profundidad sin esperar a
 *     ninguna imagen. Es lo que hay hoy en el hero.
 *
 * `depth`  · cuánto viaja con el scroll, de 0 (quieta) a 1. Tope duro en 0.5.
 *            MISMO SIGNO que en los backdrops: positivo = baja al bajar, o sea
 *            se queda atrás. Cuanto más lejos está algo, más pequeño se ve su
 *            desplazamiento, así que las capas del fondo llevan MENOS depth que
 *            las de delante. (El componente de Osmo del que sale esto lo hace al
 *            revés porque su efecto es una apertura de telón, no profundidad.)
 * `plane`  · 'back' detrás de todo · 'mid' entre el fondo y la figura ·
 *            'front' por delante de la figura, por debajo del texto.
 */
export const parallax = {
  hero: {
    layers: [
      // Las dos de hoy son resplandores, no fotos: dan profundidad desde el
      // primer día y no bloquean nada. Las imágenes con alfa entran al lado
      // cuando existan, sin tocar código.
      {
        id: 'bruma-lejana',
        glow: { x: '18%', y: '26%', size: '58% 46%', token: '--glow-warm' },
        depth: 0.06,
        plane: 'back',
      },
      {
        id: 'bruma-cercana',
        glow: { x: '82%', y: '74%', size: '46% 38%', token: '--glow-warm-soft' },
        depth: 0.22,
        plane: 'front',
      },

      // ↓ PLANTILLA. Descomenta, deja el archivo en public/img/ y ya está.
      //   Cuantas más capas, más profundidad — el tope práctico son cuatro o
      //   cinco: por encima se notan más los bordes que el efecto.
      // {
      //   id: 'polvo-frontal',
      //   src: 'hero-capa-polvo',
      //   alt: '',              // decorativa → alt vacío, no ausente
      //   depth: 0.34,
      //   plane: 'front',
      //   opacity: [0.5, 0.32], // [oscuro, claro]; opcional, por defecto 1
      // },
    ],
  },

  // ↓ Cualquier sección de index.html admite lo mismo. Ejemplo listo para usar:
  // servicios: { layers: [{ id: 'humo', src: 'servicios-capa-humo', alt: '', depth: 0.12, plane: 'back' }] },
}

export const budgets = {
  // Todas las capas de parallax juntas. Van con alfa, y la alfa no comprime
  // gratis: es el mismo motivo por el que la figura del hero tiene 320 KB para
  // ella sola. Si se aprieta, primero baja resolución y luego número de capas.
  parallax: 700,
  // Las seis etapas juntas. Van a 4:5 y ~840×1050, que es el doble del hueco
  // real (420px) para que aguanten pantallas de densidad 2. Se cargan en
  // diferido salvo la primera, así que no tocan la entrada.
  process: 620,
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
  // Las 5 galerías juntas (15 muestras). Eran 600 KB cuando se servían a 480×600
  // como miniaturas en una rejilla de tres columnas. Subió a 800 el 2026-08-16 al
  // convertir la tira en GALERÍA ELÁSTICA: la muestra abierta pasa de ~380 px a
  // ~780 px de ancho, y a 480 px de origen se veía mascada. Ahora van a 1000×1250.
  //
  // Se puede permitir porque no tocan la carga inicial: van `loading="lazy"` y la
  // tira ni siquiera se rellena hasta que alguien pulsa «Ver muestras».
  galleries: 800,
}

export const media = { portraits, figure, backdrops, sequences, galleries, budgets }
