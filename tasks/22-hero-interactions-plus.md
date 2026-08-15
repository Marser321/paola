# Tarea 22 — Hero: click burst + cámara ligada al scroll

> ♻ **Archivo reconstruido desde cero** (2026-08-15): el original se perdió sin dejar
> fragmento alguno. Escrito a partir de la entrada de `tasks/README.md`
> ("Click burst + cámara scroll", depende de 08 y 17) y de `PLAN.md` §9.7–9.8.

## Objetivo
Dos añadidos a la escena del hero, ambos dentro de `hero-scene.js` y sin tocar sus
guards ni su mecanismo de pausa.

## Archivos a crear/editar
- **Editar** `src/js/webgl/hero-scene.js`

## Spec

### 1. Click burst
Dos uniforms nuevos: `uBurst` (0→1) y `uBurstOrigin` (punto pulsado, en coordenadas del
plano z=0). En el vertex shader, un **anillo que se expande** desde el origen y se
disuelve:

```glsl
vec2 toBurst = pos.xy - uBurstOrigin;
float dBurst = length(toBurst);
float ring = exp(-pow(dBurst - uBurst * 34.0, 2.0) * 0.02);
float blast = ring * (1.0 - uBurst);
pos.xy += normalize(toBurst + 0.0001) * blast * 7.0;
vPush = max(force, blast);
```

`uBurst` empieza **en 1** (reposo: la onda ya se disolvió) y cada click lanza
`gsap.fromTo(…, {value: 0}, {value: 1, duration: 1.1, ease: 'power2.out', overwrite: true})`.
No hace falta ningún reloj nuevo: el tween ya lo lleva GSAP.

`vPush` toma el máximo entre la repulsión del ratón y la onda, así que las partículas
empujadas por el burst **también brillan**, reutilizando el camino que ya existía.

**El click se ignora** sobre `a`, `button` y `.site-header`: el hero no tiene nada
clicable propio, pero la nav pasa por encima y un burst al pulsar "Contacto" sería ruido.

### 2. Cámara ligada al scroll
```js
gsap.to(camera.position, {
  z: 58, y: 6,
  ease: 'none',
  scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
})
```
La cámara se aleja y sube al abandonar el hero: da profundidad a la salida **sin mover un
píxel del texto**, que sigue siendo DOM normal. `ease: 'none'` porque es scrub
(`DESIGN.md` §4, regla de oro).

### 3. Guards
No se añade ninguno: los dos efectos viven **dentro** de `initHeroScene()`, que ya sale
antes en móvil, con reduced-motion o sin `webgl2`. Si no hay escena, no hay burst ni
cámara. Y el render sigue pausado fuera del viewport por el IntersectionObserver de la
tarea 08.

## Criterios de aceptación
- [x] Un click en el hero lanza la onda; los clicks sobre la nav no.
- [x] La cámara acompaña al scroll con scrub, sin desplazar el texto del hero.
- [x] Sin errores de consola y sin RAF nuevos: todo con tweens de GSAP.
- [x] Con los guards del hero activos (móvil / reduced-motion) no se registra nada.
- [ ] Verificación visual fina de la onda cuadro a cuadro: el panel de este entorno pinta
  de forma intermitente. Se ve el claro de repulsión y el hero renderiza, pero no he
  podido comparar frames del burst → **tarea 19**.

## Verificación
```bash
npm run dev
# 1) Click en el fondo del hero: onda que se expande y se disuelve en ~1s
# 2) Click en un enlace de la nav: sin onda
# 3) Scroll lento saliendo del hero: las partículas se alejan; el texto no se mueve
# 4) Móvil / reduced-motion: nada de esto existe (no hay escena)
```

## ⚠ No hacer
- No añadir un listener de scroll para la cámara: es un ScrollTrigger con scrub.
- No usar `setInterval` ni un RAF propio para la onda: es un tween sobre el uniform.
- No mover el contenido del hero con la cámara: el texto es DOM y debe quedarse quieto.
- No tocar los guards ni la pausa por IntersectionObserver de la tarea 08.
- No subir la fuerza del burst: por encima de ~10 unidades el campo se deshace y tarda en
  recomponerse, y deja de leerse como un pulso.
