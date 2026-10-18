// TESTIMONIOS — vacío, a propósito.
//
// Hasta el 2026-10-17 la web enseñaba tres citas de plantilla firmadas por
// clientes que no existen (Marta G. de «Atelier Nord», Daniel R. de
// «Flowstack», Lucía P. de «Glow Skin»). La auditoría lo dijo sin rodeos: «es
// mejor no tener testimonios que tener testimonios falsos». Con este array
// vacío, #testimonios ni se pinta (sections/testimonials.js).
//
// Para añadir uno —pídelos cortos, por WhatsApp o desde Google Reviews— hacen
// falta TODOS estos campos; si falta uno, ese testimonio no sale:
//
//   {
//     cita: 'Pasamos de no saber de dónde venían los clientes a verlo en el CRM.',
//     autor: 'María L.',            // o, si prefiere no salir: rol + sector
//     rol: 'Dueña',                 // opcional si va `autor`
//     sector: 'Clínica estética · Florida',
//     fuente: 'Google Reviews',     // 'WhatsApp' | 'Google Reviews' | …
//     permiso: true,                // autorizó publicarlo, por escrito
//   }
//
// La cita va LITERAL y no se traduce: en la versión en inglés se lee igual.

export const testimonios = []

const hayTexto = (v) => typeof v === 'string' && v.trim().length > 0

/** Todo o nada, como esCasoPublicable() en src/data/sectores.js. */
export function esTestimonioPublicable(item) {
  if (!item || item.permiso !== true) return false
  if (!hayTexto(item.cita) || !hayTexto(item.fuente)) return false
  return hayTexto(item.autor) || (hayTexto(item.rol) && hayTexto(item.sector))
}
