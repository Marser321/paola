### EDIT
--- old ---
## ⚠ No hacer
- No crear loops `requestAnimationFrame` continuos en las cards: render bajo demanda.
- No distorsionar la pill de sector ni el cuerpo de la card: solo el visual.
--- new ---
## Ajuste obligatorio por la tarea 34

El `canvas` que se hace `prepend` en `.project-card__visual` convive ahora con tres
elementos nuevos dentro de ese mismo contenedor: el badge de formato
(`.ad-chrome__format`, `z-index: 2`), la pill de sector y el panel de backstage
(`.backstage`, `z-index: 3`).

- Dar al canvas un `z-index: 0` explícito para que quede **bajo** todos ellos.
- Verificar que `gradientEl.style.display = 'none'` **no** oculta el badge ni el
  backstage: solo debe afectar a `.project-card__gradient`.
- Con el backstage abierto, el shader debe seguir renderizando solo bajo demanda; si el
  overlay lo tapa entero, pausarlo mientras esté abierto.

## ⚠ No hacer
- No crear loops `requestAnimationFrame` continuos en las cards: render bajo demanda.
- No distorsionar la pill de sector ni el cuerpo de la card: solo el visual.
- No distorsionar el chrome de anuncio ni el backstage: son la lectura del caso, no la
  creatividad.