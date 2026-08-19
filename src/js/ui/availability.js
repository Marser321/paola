// Estado de disponibilidad (PROPUESTAS-NIVEL.md §C4).
//
// Pinta «Acepto 2 proyectos para octubre» justo encima del CTA de contacto, que
// es donde se decide, y solo si el dato de `data/availability.js` está completo
// y vigente. Todo el porqué del dato está allí; aquí está la guarda.
//
// El modo de fallo es el silencio. Ante un campo vacío, un mes pasado o una
// revisión caducada, este módulo no escribe nada y el renglón se queda oculto:
// más vale no decir nada que decir una escasez que ya no es cierta.
//
// El nombre del mes NO se guarda escrito: sale de `Intl` a partir del ISO. Así
// el dato es uno solo para los dos idiomas —quien lo edita no tiene que saber
// inglés— y «octubre» / «October» se resuelven solos al cambiar de idioma.

import { availability, CADUCIDAD_DIAS } from '../../data/availability.js'
import { t, getLang } from '../../i18n/index.js'

const DIA_MS = 24 * 60 * 60 * 1000

/**
 * ¿El dato es publicable? Devuelve el objeto normalizado o `null`.
 * Se exporta para poder probarlo sin DOM.
 */
export function vigente(dato = availability, ahora = new Date()) {
  if (!dato?.activo) return null

  const plazas = Number(dato.plazas)
  if (!Number.isInteger(plazas) || plazas < 1) return null

  // `mes` es 'AAAA-MM'. Se compara contra el primer día del mes SIGUIENTE: hasta
  // el 31 de octubre, «para octubre» sigue siendo verdad.
  if (!/^\d{4}-\d{2}$/.test(dato.mes || '')) return null
  const [anio, mes] = dato.mes.split('-').map(Number)
  const finDeMes = new Date(anio, mes, 1) // mes es 1-12; el Date es 0-11 → mes siguiente
  if (ahora >= finDeMes) return null

  // ⚠ A mano, y no con `new Date(dato.revisado)`. Una cadena 'AAAA-MM-DD' la
  // parsea el motor como UTC, mientras que `new Date()` es hora local: al oeste
  // de Greenwich eso mete medio día de más en la resta y la caducidad se cumplía
  // un día antes de tiempo. Con los tres números sueltos, el Date es local igual
  // que el de `mes` y la ventana dura exactamente lo que dice.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dato.revisado || '')) return null
  const [ra, rm, rd] = dato.revisado.split('-').map(Number)
  const revisado = new Date(ra, rm - 1, rd)
  if (Number.isNaN(revisado.getTime())) return null
  // En DÍAS ENTEROS: `revisado` es medianoche y `ahora` es la hora que sea, así
  // que restarlos a pelo daba 45,5 días a mediodía del día 45 y el renglón se
  // apagaba a media jornada. Normalizando los dos a medianoche, la ventana dura
  // lo que dice y no depende de a qué hora se abra la página.
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
  if ((hoy - revisado) / DIA_MS > CADUCIDAD_DIAS) return null

  return { plazas, inicioMes: new Date(anio, mes - 1, 1) }
}

export function initAvailability() {
  const el = document.querySelector('.contact__availability')
  if (!el) return

  const pintar = () => {
    const dato = vigente()
    if (!dato) {
      el.hidden = true
      el.textContent = ''
      return
    }
    const lang = getLang() === 'en' ? 'en-GB' : 'es-ES'
    const nombreMes = new Intl.DateTimeFormat(lang, { month: 'long' }).format(dato.inicioMes)
    const clave = dato.plazas === 1 ? 'contact.availabilityOne' : 'contact.availabilityMany'
    el.textContent = t(clave, { plazas: dato.plazas, mes: nombreMes })
    el.hidden = false
  }

  pintar()
  // El aplicador estático no puede con este renglón: su texto no está en el HTML,
  // se compone de un dato y de `Intl`. Se repinta por su cuenta.
  window.addEventListener('i18n:change', pintar)
}
