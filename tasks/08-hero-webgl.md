# Tarea 08 — Hero WebGL: partículas Three.js con shader de repulsión

> ♻ **Archivo reconstruido desde cero** (2026-08-15). El original se perdió sin dejar
> fragmento alguno en los transcripts. Esta versión se ha escrito a partir de `PLAN.md`
> §1 (momento de impacto 1), §7, §9.7 y §9.8, `DESIGN.md` §8, y del fallback
> `.hero.no-webgl` que la tarea 02 ya dejó en `sections.css`. **Es la tarea con mayor
> divergencia posible respecto al original**: el comportamiento cumple el plan, pero los
> números del shader son de esta implementación, no del spec perdido.

## Objetivo
Campo de partículas en el hero que reacciona al ratón con repulsión radial. Primer
momento de impacto del sitio (`PLAN.md` §1).

## Archivos a crear/editar
- **Crear** `src/js/webgl/hero-scene.js`
- **Editar** `src/main.js`

## Spec

### 1. `src/js/webgl/hero-scene.js`

Exporta `initHeroScene()`, que devuelve `{ destroy() }` o `null` si no arranca.

**Guards de arranque** (`PLAN.md` §9.7) — si se cumple cualquiera: añadir `no-webgl` a
`.hero`, eliminar el `<canvas>` y devolver `null`.

| Guard | Motivo |
|---|---|
| `window.innerWidth < 768` | Móvil: fallback CSS (`DESIGN.md` §8) |
| `shouldReduceMotion()` | Accesibilidad (`DESIGN.md` §9) |
| Sin contexto `webgl2` | Navegador sin soporte |

**Escena:**

| Parámetro | Valor |
|---|---|
| Partículas | 6000 `THREE.Points` con `BufferGeometry` |
| Distribución | Aleatoria en 60 × 38 × 20 unidades de mundo |
| Atributos | `aScale` (0,6–2,2) y `aSeed` (0–1, fase propia de cada partícula) |
| Cámara | `PerspectiveCamera(45)`, `z = 42` |
| Renderer | `alpha: true`, `antialias: false`, `pixelRatio` tope 2 |
| Material | `ShaderMaterial` con `AdditiveBlending`, `transparent`, `depthWrite: false` |
| Colores | Uniforms `uColorA/B/C` = violeta / rosa / naranja del gradiente Meta |

**Vertex shader:** deriva orgánica por partícula (`sin/cos` de `uTime` desfasados con
`aSeed`) + **repulsión del ratón**: `force = 1 - smoothstep(0, uRepelRadius, dist)`,
empuje radial de hasta 3,2 unidades. `uRepelRadius = 9`.
`gl_PointSize = aScale * uPixelRatio * (70.0 / -mvPosition.z)`.

**Fragment shader:** punto circular por distancia a `gl_PointCoord` (sin texturas: cero
peticiones de red), color interpolado A→B→C según `aSeed`, y las partículas empujadas
tiran a blanco (`mix(color, white, force*0.5)`). Alpha `0.55 + force*0.45`.

> **Excepción de `PLAN.md` §9.2 documentada aquí:** GLSL no lee custom properties, así que
> los tres hex de `tokens.css` se replican como constantes al principio del módulo, con el
> nombre del token en el comentario. Es la única copia de color permitida fuera de
> `tokens.css` junto con `public/og.html` (tarea 27).

**Ratón:** `mousemove` sobre `window`, convertido a coordenadas del plano z=0 con
`visibleHeight = 2 * tan(fov/2) * cameraZ`. Se interpola con `lerp(0.08)` para que el
claro persiga al puntero con inercia. `mouseleave` del hero manda el foco a (999, 999),
fuera de todo radio de influencia.

**Pausa y bucle:**
- `IntersectionObserver` sobre `.hero`: si no intersecta, el render sale antes de dibujar.
- El render se cuelga de **`gsap.ticker`** (`PLAN.md` §9.8). Ni un `requestAnimationFrame`.
- `resize` recalcula `aspect`, matriz de proyección y tamaño del renderer.

### 2. Editar `src/main.js`
```js
import { initHeroScene } from './js/webgl/hero-scene.js'
...
initHeroScene()   // WebGL (con guards internos: móvil/reduced-motion)
initHero()
```
> **Nota de orden (corregida en la tarea 14).** `PLAN.md` §4.3 lista `initHeroScene()`
> antes de `initHero()`; la tarea 14, que fija la estructura final de `main.js` y es
> archivo original superviviente, lo lista al revés. **Manda la 14.** Da igual en la
> práctica: las dos corren síncronas antes del primer pintado y ninguna depende del DOM
> que toca la otra. Se deja anotado para que nadie lo "arregle" en un sentido u otro.

## Criterios de aceptación
- [ ] En ≥768px sin reduced-motion: el canvas dibuja el campo de partículas y el hero
  **no** tiene la clase `no-webgl`.
- [ ] Al mover el ratón sobre el hero se abre un claro visible que lo sigue con inercia.
- [ ] En <768px: `.hero` tiene `no-webgl`, el `<canvas>` se ha eliminado del DOM y el
  fallback de gradientes es `display: block`.
- [ ] Con reduced-motion: mismo comportamiento que en móvil.
- [ ] Al salir el hero del viewport no se dibuja ni un frame (IntersectionObserver).
- [ ] Sin errores de consola y sin ningún `requestAnimationFrame` propio en el módulo.

## Verificación
```bash
npm run dev
```
En la consola del navegador:
```js
// Desktop: canvas vivo, sin fallback
!!document.getElementById('hero-canvas') && !document.querySelector('.hero').classList.contains('no-webgl')
// → true
```
Luego DevTools → responsive 375px → recargar:
```js
document.querySelector('.hero').classList.contains('no-webgl') && !document.getElementById('hero-canvas')
// → true
```

## ⚠ No hacer
- No cargar texturas ni HDRIs: el punto se dibuja en el fragment shader.
- No añadir postprocesado (`EffectComposer`): la tarea 17 tiene que poder code-splitear
  `three` a un chunk dinámico y el presupuesto no lo admite.
- No mover el hero con scroll aquí: eso es la tarea 22.
- No usar `requestAnimationFrame`: el bucle es `gsap.ticker`.
