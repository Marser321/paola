// SECTORES — dónde se ha invertido, y el hueco reservado a cada caso real.
//
// Sustituye a projects.js, que traía seis casos de plantilla (Atelier Nord,
// Flowstack…) con métricas de ejemplo. Lo que hay aquí es la inversión en Meta
// Ads por industria de la auditoría del 17 oct 2026: gasto por cuenta del 1 ene
// 2025 al 17 oct 2026. El orden es el del informe —de mayor a menor— con
// «otras» al final, porque no es una industria: es lo que no se pudo clasificar.
//
// Los TEXTOS (nombre del sector, cómo convierte) viven en i18n/es.js y en.js,
// bajo `sectores.<id>`. Aquí solo hay datos.
//
// `destacado: true` ⇒ sale como ficha en #proyectos. Son los cuatro en los que
// la auditoría sitúa la experiencia más fuerte (joyería, salud, crédito y
// seguros), que además suman el 69 % de la inversión.
//
// CASOS — `caso: null` hasta que haya uno de verdad. Para publicarlo se rellena
// el objeto ENTERO (plantilla y preguntas en CASOS-FICHA.md) y decide
// esCasoPublicable(). Es el mismo contrato que ui/availability.js: un caso a
// medias no se pinta en ningún sitio —ni la tarjeta, ni caso.html, ni la galería
// 3D—, porque un caso a medias es exactamente lo que había: cifras sin respaldo.
//
//   caso: {
//     verificado: true,      // Paola lo cotejó con Ads Manager y el CRM
//     permiso: true,         // el cliente autorizó publicarlo, por escrito
//     titulo: 'Clínica estética en Florida', // sin el nombre si así se pidió
//     marca: 'Clínica estética · Florida',   // lo que lee el chrome del anuncio
//     periodo: 'Mar–ago 2026',
//     reto: '…',
//     queHicimos: ['…', '…'],
//     resultados: [{ valor: '$18', etiqueta: 'CPL' }, { valor: '64', etiqueta: 'Citas al mes' }],
//     creativo: { src: 'caso-salud', alt: '…' }, // public/img/caso-salud.{avif,webp}
//     // Opcionales:
//     inversion: 'US$3-5K/mes',  // SIEMPRE en rango
//     stack: 'Meta Ads · GoHighLevel · API de Conversiones',
//     antesDespues: { antes: 'CPL $41', despues: 'CPL $18' },
//     cta: 'Reservar',           // el botón real del anuncio
//     en: { titulo: '…', reto: '…', queHicimos: ['…'], resultados: [...], alt: '…' },
//   }

export const sectores = [
  { id: 'joyeria', invertido: 218544, destacado: true, caso: null },
  { id: 'salud', invertido: 212518, destacado: true, caso: null },
  { id: 'credito', invertido: 180099, destacado: true, caso: null },
  { id: 'seguros', invertido: 171598, destacado: true, caso: null },
  { id: 'tramites', invertido: 54468, destacado: false, caso: null },
  { id: 'viajes', invertido: 25693, destacado: false, caso: null },
  { id: 'bienes-raices', invertido: 21890, destacado: false, caso: null },
  { id: 'educacion', invertido: 10434, destacado: false, caso: null },
  { id: 'otras', invertido: 241943, destacado: false, caso: null },
]

/** La suma de las filas: la base de cada «% del total». */
export const totalInvertido = sectores.reduce((suma, s) => suma + s.invertido, 0)

/** Los cuatro de las fichas, en el orden del informe. */
export const destacados = sectores.filter((s) => s.destacado)

const hayTexto = (v) => typeof v === 'string' && v.trim().length > 0

/**
 * ¿Se puede enseñar este caso? Todo o nada.
 *
 * Exige lo que la auditoría pide a un caso —reto → qué se hizo → resultado— más
 * lo que lo hace publicable: verificado, con permiso, con su periodo y con un
 * creativo REAL (el informe lo pide expresamente: «usa tus creativos reales como
 * imagen»). Lo opcional (inversión, stack, antes/después, CTA) no bloquea.
 */
export function esCasoPublicable(caso) {
  if (!caso || caso.verificado !== true || caso.permiso !== true) return false
  if (![caso.titulo, caso.reto, caso.periodo].every(hayTexto)) return false
  if (!Array.isArray(caso.queHicimos) || !caso.queHicimos.some(hayTexto)) return false
  if (!Array.isArray(caso.resultados)) return false
  if (!caso.resultados.some((r) => hayTexto(r?.valor) && hayTexto(r?.etiqueta))) return false
  return hayTexto(caso.creativo?.src) && hayTexto(caso.creativo?.alt)
}

/** Los sectores cuyo caso ha pasado el filtro. */
export const conCaso = () => sectores.filter((s) => esCasoPublicable(s.caso))

/**
 * Importe corto para las fichas y las barras: «US$219K». Redondea al millar
 * MÁS CERCANO (no hacia abajo, como el total): aquí se nombra una fila, no se
 * afirma un mínimo. Mismo formato en los dos idiomas — «K» se lee igual.
 */
export const enMiles = (usd) => `US$${Math.round(usd / 1000)}K`

/** Parte del total, en entero: 0,1922 → 19. */
export const porcentaje = (usd) => Math.round((usd / totalInvertido) * 100)
