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
    // El mismo texto que `about.imgAlt` de i18n/es.js: desde el 2026-10-17 el
    // retrato va escrito en index.html y su alt lo traduce apply-dom.js.
    alt: 'Paola Parra, Paid Media Manager, con la mano apoyada en la mejilla y mirando a la cámara',
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
// faltaba en celular era superficie, no opacidad, y eso se arregló en media.css
// (§MÓVIL: EL PLATO DEJA DE ESCALARSE AL ANCHO).
//
// En CLARO la foto OSCURECE el papel, así que empuja el contraste del texto hacia
// arriba en vez de hacia abajo: ahí no hay techo de legibilidad y el límite es de
// gusto — que no se enturbie el crema. Por eso el tema claro sí sube, del 0,72 del
// valor oscuro al 0,85.
// Photographs are contained visuals, not backgrounds underneath reading surfaces.
export const backdrops = {
  metricas: {
    side: 'right',
    layers: [{ src: 'bg-metricas', depth: 0, opacity: [0.12, 0.08] }],
  },
  testimonios: {
    side: 'right',
    layers: [{ src: 'bg-testimonios', depth: 0, opacity: [0.16, 0.12] }],
  },
}

/**
 * SECUENCIAS DE FRAMES (scrollytelling en canvas 2D)
 * Los frames van en public/img/<dir>/0001.<ext> … numerados desde 1 con 4 dígitos.
 *
 * `still` es el frame fijo que se pinta INMEDIATAMENTE mientras carga la
 * secuencia — y el único que se ve en celular y con reduced-motion. Es el que
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
// ⚠ VACÍO desde el 2026-10-17. Las quince muestras que había eran ilustraciones
// generadas con IA presentadas como «muestras de este trabajo», y varias
// enseñaban los casos de plantilla (el abrigo de «Atelier Nord», la app de
// «Zenfit»…). Una muestra de trabajo tiene que ser trabajo: capturas reales de
// campañas, pipelines de GoHighLevel, landings, creativos. Sin galería declarada
// para un servicio, su botón «Ver muestras» no se monta (sections/services.js).
//
// Para añadir una, con la clave `data-service` de index.html (meta-ads, crm-ghl,
// medicion, landings, ia-video, auditoria):
//
//   'crm-ghl': {
//     items: [{ src: 'muestra-crm-ghl-1', gradient: ['#8A6A1F', '#D4AF37'] }],
//   },
//
// y su pie (que es también el `alt`) en `services.items[i].samples` de es.js y en.js.
export const galleries = {}

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
// Generated editorial illustrations: never evidence of a client engagement.
// Each demonstration state has its own visual; generated scenes are illustrative.
export const serviceVisuals = {
  'meta-ads': { src: 'servicio-meta-ads-v5', generated: true, illustrative: true },
  'crm-ghl': { src: 'servicio-crm-ghl-v5', generated: true, illustrative: true },
  medicion: { src: 'servicio-medicion-consulta-v6', generated: true, illustrative: true },
  landings: { src: 'servicio-landings-v5', generated: true, illustrative: true },
  'ia-video': { src: 'servicio-ia-video-v5', generated: true, illustrative: true },
  auditoria: { src: 'servicio-auditoria-medicion-v6', generated: true, illustrative: true },
}

// State order matches the demonstration controls. Assets stay separate from UI state.
export const serviceStateVisuals = {
  "meta-ads": [
    "servicio-meta-ads-v5",
    "servicio-meta-ads-pagina-v6",
    "servicio-meta-ads-consulta-v6"
  ],
  "crm-ghl": [
    "servicio-crm-ghl-v5",
    "servicio-crm-ghl-seguimiento-v6",
    "servicio-crm-ghl-cita-v6"
  ],
  "medicion": [
    "servicio-medicion-consulta-v6",
    "servicio-medicion-cita-v6",
    "servicio-medicion-confirmada-v6"
  ],
  "landings": [
    "servicio-landings-v5",
    "servicio-landings-movil-v6",
    "servicio-landings-confirmacion-v6"
  ],
  "ia-video": [
    "servicio-ia-video-v5",
    "servicio-ia-video-mensaje-v6",
    "servicio-ia-video-cierre-v6"
  ],
  "auditoria": [
    "servicio-auditoria-medicion-v6",
    "servicio-auditoria-mensaje-v6",
    "servicio-auditoria-seguimiento-v6"
  ]
}

export const process = {
  illustrative: true,
  items: [
    { ...serviceVisuals.auditoria, serviceIndex: 5, alt: 'Revisión de informes y anotación de prioridades' },
    { ...serviceVisuals['meta-ads'], serviceIndex: 0, alt: 'Planificación de anuncios y enfoques creativos' },
    { ...serviceVisuals['ia-video'], serviceIndex: 4, alt: 'Grabación de una pieza de producto con teléfono' },
    { ...serviceVisuals.landings, serviceIndex: 3, alt: 'Revisión de una página y su formulario en celular y portátil' },
    { ...serviceVisuals.medicion, serviceIndex: 2, alt: 'Comparación de informes para ajustar las campañas' },
    { ...serviceVisuals['crm-ghl'], serviceIndex: 1, alt: 'Organización del seguimiento de consultas y citas' },
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
// Los dos `glow` que había en el hero se RETIRARON al llegar estas capas. Eran
// sustitutos: daban profundidad mientras no hubiera imágenes. `hero-capa-bruma`
// hace su trabajo mejor y con textura de verdad.
//
// ⚠ LAS OPACIDADES ESTÁN MEDIDAS, NO ELEGIDAS. Salieron mucho más bajas de lo
// que parecía razonable a ojo, y por dos motivos distintos:
//
//   · EN EL HERO no hay plato fotográfico, así que el techo es el absoluto: la
//     opacidad más alta con la que el texto --muted (el rótulo y las cifras)
//     mantiene 4,5:1 sobre el 1% de píxeles más claros. Sale 0,14 para la capa de
//     fondo, y las otras dos en proporción. Con los 0,55/0,40/0,35 que se
//     probaron primero, ese contraste caía a 2,0:1.
//
//   · EN LAS DEMÁS el plato fotográfico YA está por encima del techo — está
//     documentado arriba, en el bloque de `backdrops`, y es una decisión que no
//     se toca aquí. Así que el criterio pasa a ser MARGINAL: la capa no puede
//     costar más del 5% del contraste que ya había. Sale 0,27 en servicios y
//     0,24 en proceso.
//
// El segundo número de cada par es el tema claro, al 60% del oscuro. Ahí el oro
// OSCURECE el papel en vez de aclararlo, y medido cuesta ~0%: 2,14 → 2,15.
export const parallax = {
  hero: {
    layers: [
      { id: 'bruma', src: 'hero-capa-bruma', alt: '', depth: 0.015, plane: 'back', opacity: [0.06, 0.03] },
    ],
  },
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
  serviceVisuals: 620, // same six files; reused by process, not a second download
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

export const media = { portraits, figure, backdrops, sequences, galleries, serviceVisuals, budgets }
