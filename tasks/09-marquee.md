# Tarea 09 — Marquee con velocidad ligada al scroll

> ♻ **Archivo reconstruido desde cero** (2026-08-15): el original se perdió sin dejar
> fragmentos. Escrito a partir de `PLAN.md` §7 ("Loop infinito, velocidad ∝ scroll"),
> §9.8 (un solo RAF, ningún listener de scroll) y `DESIGN.md` §8 y §9.

## Objetivo
Los dos marquees del sitio (el de la etapa 01 y el inverso del footer) giran en loop
continuo y **aceleran con la velocidad del scroll**, volviendo solos a su ritmo base.

## Archivos a crear/editar
- **Crear** `src/js/sections/marquee.js`
- **Editar** `src/main.js`

## Spec

El markup ya existe (tarea 02): cada `.marquee` contiene un `.marquee__track` con **dos
`.marquee__inner` idénticos**. Por eso `xPercent: -50` desplaza exactamente una copia y el
loop es continuo sin costura.

### `src/js/sections/marquee.js` — `initMarquee()`

| Aspecto | Decisión |
|---|---|
| Loop | `gsap.to(track, { xPercent: ±50, ease: 'none', repeat: -1 })` |
| Duración | 22 s en ≥768px, **34 s en móvil** (`DESIGN.md` §8: marquees más lentos) |
| Dirección | `.marquee--reverse` (footer) arranca en `-50%` y va hacia `0` |
| Reduced motion | `return` temprano: los marquees se quedan **estáticos y legibles** |
| Velocidad de scroll | `ScrollTrigger.create({ onUpdate })` con `self.getVelocity()` |
| Boost | `clamp(1, 5, 1 + velocity / 700)` |
| Decaimiento | `gsap.to(speed, { value: 1, duration: 0.8, overwrite: true })` |
| Aplicación | **Un único** `gsap.ticker.add()` que hace `loop.timeScale(speed.value)` para los dos marquees |

> La velocidad se obtiene de ScrollTrigger, no de un listener de `scroll` propio
> (`PLAN.md` §9.8). El objeto `speed` es un proxy tweeneado: el boost sube de golpe y
> baja suave, que es lo que hace que el efecto se lea como inercia y no como un salto.

### Editar `src/main.js`
```js
import { initMarquee } from './js/sections/marquee.js'
...
initMarquee()
```

## Criterios de aceptación
- [ ] Los dos marquees se mueven en direcciones **opuestas** y en loop sin costura.
- [ ] Al scrollear rápido aceleran de forma perceptible y vuelven al ritmo base al parar.
- [ ] En móvil el ritmo base es visiblemente más lento.
- [ ] Con reduced-motion no se mueven y el texto se lee entero.
- [ ] Cero listeners de `scroll` propios y un solo `gsap.ticker.add()` en el módulo.

## Verificación
```bash
npm run dev
```
En la consola del navegador, medir el desplazamiento en reposo y con scroll:
```js
const t = document.querySelector('.marquee__track')
const x = () => new DOMMatrix(getComputedStyle(t).transform).m41
const a = x(); setTimeout(() => console.log('px/s en reposo:', (x() - a) / 0.7), 700)
```
El desplazamiento por segundo durante un scroll rápido debe ser claramente mayor.

## ⚠ No hacer
- No duplicar los `.marquee__inner` por JS: ya están en el HTML (tarea 02).
- No añadir un `requestAnimationFrame` ni un `setInterval` para el loop.
- No aplicar el gradiente Meta al marquee: su acento es el `✦` en `--accent-pink` y el
  texto en outline, y ya están en `sections.css`.
