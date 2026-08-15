# Tarea 37 — Frecuencia y fatiga creativa (OPCIONAL · requiere opt-in)

> **Esta tarea es opcional y es la única del concepto que cruza una línea.** Léela entera
> antes de decidir si se hace. Si hay dudas, **no se hace**: el sitio funciona perfectamente
> sin ella y el concepto no la necesita.

## Objetivo
En Meta Ads, un creativo se **quema con la frecuencia**: cuantas más veces lo ve la misma
persona, peor rinde. Es un concepto real, cotidiano para quien compra medios, y el sitio
puede reconocerlo: en visitas repetidas, el HUD muestra `Frecuencia 3 · creativo fatigado`
y sirve una variante distinta del hero.

Es un detalle exquisito para quien vuelve — y un jurado que revisa un sitio dos veces lo ve.

## Por qué requiere opt-in explícito

Todo lo demás del tracker es medición **dentro de una sesión**: nada persiste, nada
reconoce a nadie. Esta mecánica es distinta: **reconocer que alguien ha estado antes es
exactamente la función de una cookie de medición**, aunque el dato no salga del navegador.

Marco legal (`tarea 24`): el art. 5(3) ePrivacy / 22.2 LSSI cubre *almacenar o acceder a
información en el terminal*. Una preferencia fijada por el usuario está exenta; un contador
de visitas que perfila comportamiento entre sesiones, no está claro que lo esté.

Y hay una razón más fuerte que la legal: el sitio afirma en `#informe` que **no conserva
nada entre visitas**. Si esta tarea se implementa sin decirlo, esa frase deja de ser cierta
y el proyecto pierde lo único que lo sostiene.

**Por tanto: opt-in explícito, o no se hace.** No hay tercera opción.

## Archivos a crear/editar
- **Editar** `src/js/core/tracker.js` (contador de frecuencia tras opt-in)
- **Editar** `src/js/ui/hud.js` (fila de frecuencia + control de opt-in)
- **Editar** `src/js/core/ab-test.js` (variante por frecuencia)
- **Editar** `CONTENT.md` §12 y §14, `legal/cookies.html`, `legal/privacidad.html`

## Spec

### 1. Opt-in en el HUD
Fila nueva con un `<button aria-pressed>`:

- Estado apagado (por defecto): `Memoria de frecuencia` — `Activar`
- Al pulsar, confirmación en el propio HUD:
  `Guardaré en tu navegador cuántas veces has entrado. Nada sale de aquí. Se borra a los 30 días.`
  con `Activar` / `Cancelar`.
- Estado encendido: `Frecuencia` — `3` y un `Borrar` que elimina el registro al instante.

### 2. Almacenamiento
```js
// SOLO si hay opt-in. Clave: paola-freq
{ count: 3, first: 1770000000000, expires: 1772592000000 }  // caducidad 30 días
```
Al leer, si `Date.now() > expires` → borrar y empezar de cero. Sin ids, sin timestamps por
visita, sin nada más que un contador y una caducidad.

### 3. Fatiga
- `count >= 3` → el HUD muestra `Frecuencia 3 · creativo fatigado`.
- `count >= 3` → `ab-test.js` sirve la variante **contraria** a la de la visita anterior
  (guardar solo la última letra servida, no un historial).
- El informe añade una fila: `Frecuencia` → `3ª visita`.

### 4. Copy legal obligatorio
- `CONTENT.md` §14: la nota del informe pasa a decir, **solo si el opt-in está activo**:
  `Has activado la memoria de frecuencia: en este navegador queda guardado cuántas veces
  has entrado, y nada más. Se borra a los 30 días o cuando pulses Borrar.`
- `legal/cookies.html`: fila nueva en la tabla — `paola-freq` · `Contar visitas repetidas
  (solo si lo activas)` · `¿Se envía a alguien? No`.
- `legal/privacidad.html`: la cláusula de "no se conservan entre visitas" pasa a
  "no se conservan entre visitas salvo que actives expresamente la memoria de frecuencia".

## Criterios de aceptación
- [ ] **Sin opt-in no se escribe absolutamente nada** en `localStorage` bajo `paola-freq`.
  Verificarlo en Application → Local Storage tras 5 visitas.
- [ ] El opt-in explica qué se guarda, dónde y cuánto dura, **antes** de guardarlo.
- [ ] `Borrar` elimina el registro al instante y devuelve el HUD a su estado normal.
- [ ] El registro caduca a los 30 días (probar adelantando `expires` a mano).
- [ ] Con el opt-in activo, la 3ª visita muestra `creativo fatigado` y sirve la variante
  contraria.
- [ ] **La declaración de privacidad del informe cambia** cuando el opt-in está activo, y
  vuelve a la original al desactivarlo. Sin excepciones: si el texto no cambia, la tarea
  está mal hecha.
- [ ] Desactivar el panel entero (`setHud(false)`) borra también `paola-freq`.
- [ ] Los tres documentos legales quedan actualizados.

## Verificación
```bash
npm run dev
# 1) 5 visitas sin activar nada → Local Storage vacío de paola-freq
# 2) Activar → leer el texto de confirmación → aceptar
# 3) Recargar 3 veces → HUD: "Frecuencia 3 · creativo fatigado", variante contraria
# 4) Bajar al informe → la nota de privacidad refleja el opt-in
# 5) Pulsar "Borrar" → todo vuelve al estado inicial y la nota original regresa
```

## ⚠ No hacer
- **No implementar esto sin opt-in.** Ni "por defecto activado", ni "es solo local", ni
  "no es un dato personal". La respuesta es no.
- No guardar un historial de visitas, timestamps por sesión ni nada que permita reconstruir
  un patrón. Un contador y una caducidad, nada más.
- No usar el opt-in como excusa para añadir después otras cosas persistentes.
- No dejar la nota del informe sin actualizar: sería convertir la frase que sostiene el
  proyecto en mentira.
- Si al implementarla la mecánica se siente incómoda en pruebas con personas reales,
  **borrarla**. El sitio no la necesita.
