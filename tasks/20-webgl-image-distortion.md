# Tarea 20 — Distorsión WebGL en las creatividades

> ♻ **Archivo reconstruido** (2026-08-15). El "Ajuste obligatorio por la tarea 34" y el
> ⚠ No hacer son **literales** del transcript; el resto se ha reescrito.
>
> ⛔ **ESTADO: implementada pero DESACTIVADA.** Rompe el pintado de la página con los 7
> contextos WebGL que resultan. Ver [`BLOCKERS.md`](BLOCKERS.md) §B-02.

## Objetivo
Que la creatividad de cada card reaccione al puntero con una ondulación, en vez de ser un
gradiente CSS estático.

## Archivos
- **Creado** `src/js/webgl/card-distortion.js`
- **Editado** `src/styles/sections.css` (clase `.project-card__canvas`)
- **Editado** `src/main.js` — la llamada está **comentada**

## Spec

`initCardDistortion()` con los mismos guards que el hero más uno propio:

| Guard | Motivo |
|---|---|
| `shouldReduceMotion()` | Accesibilidad |
| `(hover: none)` | Sin puntero no hay efecto que valga |
| `innerWidth < 1024` | En columna las cards son enormes y no compensa |
| Sin `webgl2` | Navegador sin soporte |

Además **no monta nada hasta que la galería se acerca** (IntersectionObserver con
`rootMargin: 100% 0px`): seis contextos WebGL no pueden competir con el arranque ni con
el hero.

- El plano ocupa el visual entero; el fragment shader **reconstruye el gradiente del
  caso** (leído de los dos hex del inline style que puso la t.11) y desplaza las UV con
  una onda radial centrada en el puntero.
- **Render bajo demanda**: un solo `gsap.ticker.add()` para las seis cards, que solo
  trabaja sobre las que están activas. Al volver al reposo la card se apaga sola.
- Un render estático inmediato al crear el canvas, para que no haya "pop" al sustituir el
  gradiente CSS por el canvas.

## Ajuste obligatorio por la tarea 34

El `canvas` que se hace `prepend` en `.project-card__visual` convive ahora con tres
elementos nuevos dentro de ese mismo contenedor: el badge de formato
(`.ad-chrome__format`, `z-index: 2`), la pill de sector y el panel de backstage
(`.backstage`, `z-index: 3`).

- Dar al canvas un `z-index: 0` explícito para que quede **bajo** todos ellos. ✅
- Verificar que `gradientEl.style.display = 'none'` **no** oculta el badge ni el
  backstage: solo debe afectar a `.project-card__gradient`. ✅ comprobado
- Con el backstage abierto, el shader debe seguir renderizando solo bajo demanda; si el
  overlay lo tapa entero, pausarlo mientras esté abierto. ✅ implementado

## Resultado de la ejecución

Verificado antes de desactivarla: 6 canvas creados, 6 contextos vivos, gradiente CSS
oculto, `z-index` 0 / 2 / 3 correctos, badge visible, canvas a 1116×697 con DPR 2.

Y luego el problema: **con los 6 canvas activos la página entera se pinta en negro**
(DOM intacto, cero errores). Reproducido dos veces y aislado con un rebuild.
Todo el detalle, incluida una prueba fallida que me llevó a una conclusión equivocada al
principio, en [`BLOCKERS.md`](BLOCKERS.md) §B-02.

## Criterios de aceptación
- [x] La ondulación sigue al puntero solo dentro del visual.
- [x] Render bajo demanda: nada se dibuja en reposo.
- [x] El canvas queda bajo el chrome de anuncio y bajo el backstage.
- [x] Los guards evitan montar nada en móvil, táctil o reduced-motion.
- [ ] **La página sigue pintando con las seis cards activas.** ❌ **FALLA** → B-02.
- [ ] Verificación en Chrome/Safari reales con GPU → tarea 19.

## ⚠ No hacer
- No crear loops `requestAnimationFrame` continuos en las cards: render bajo demanda.
- No distorsionar la pill de sector ni el cuerpo de la card: solo el visual.
- No distorsionar el chrome de anuncio ni el backstage: son la lectura del caso, no la
  creatividad.
- **No reactivar la llamada sin leer `BLOCKERS.md` §B-02.** Y si se reactiva, que sea con
  un único renderer compartido, no con seis.
