// Estado de disponibilidad (PROPUESTAS-NIVEL.md §C4).
//
// UN solo dato, editable a mano, y APAGADO de fábrica. La propuesta lo pedía así
// por un motivo que conviene no perder de vista: «una escasez falsa se detecta a
// la primera y se lleva por delante todo lo demás». Este sitio se sostiene sobre
// decir números verdaderos —«sin humo», `CONTENT.md` §10—, así que un «quedan 2
// plazas» inventado no es un adorno: contradice el argumento entero.
//
// Por eso `activo: false` sale así en el repositorio. Nadie más que la titular
// puede saber cuántos proyectos acepta, y ese dato no se rellena de oficio.
//
// PARA ENCENDERLO hay que dar los cuatro campos:
//
//   activo:   true
//   plazas:   2              ← cuántos proyectos se aceptan de verdad
//   mes:      '2026-10'      ← a qué mes se refiere (ISO, sin día)
//   revisado: '2026-09-15'   ← el día que se comprobó que sigue siendo cierto
//
// Y SE APAGA SOLO en dos casos, sin que nadie tenga que acordarse:
//
//   · cuando `mes` ya pasó — un «para octubre» leído en diciembre es peor que
//     no decir nada;
//   · cuando `revisado` tiene más de CADUCIDAD_DIAS — la escasez es un dato
//     perecedero, y uno sin revisar hace meses ya no es un dato.
//
// La comprobación vive en `js/ui/availability.js`, que ante cualquier hueco o
// cualquier fecha vencida no pinta nada. El modo de fallo es el silencio, nunca
// una cifra vieja.

export const availability = {
  activo: false,
  plazas: null,
  mes: null,
  revisado: null,
}

// Mes y medio. Suficiente para no obligar a tocarlo cada semana, y corto para
// que una plaza que se llenó no siga anunciándose un trimestre entero.
export const CADUCIDAD_DIAS = 45
