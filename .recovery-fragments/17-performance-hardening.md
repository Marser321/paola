### READ lines 95-169 of 169
```

### 4. Añadir AL FINAL de `src/styles/sections.css`
```css
/* ===== RENDER DIFERIDO DE SECCIONES LARGAS (tarea 17) ===== */
@media (min-width: 1024px) {
  #servicios, #proceso, #sobre-mi, #testimonios, #contacto {
    content-visibility: auto;
    contain-intrinsic-size: auto 100vh;
  }
}
```
> **Ojo:** `content-visibility` puede interferir con las mediciones de
> ScrollTrigger. Si tras aplicarlo notas saltos en el pin de proyectos o en los
> reveals, ELIMINA este bloque (es una optimización opcional, no estructural) y
> anótalo en `tasks/BLOCKERS.md`.

### 5. (Opcional, documentado) Self-hosting de Clash Display
Solo si se quiere máximo control de fuentes:
1. Descargar `ClashDisplay-Semibold.woff2` y `ClashDisplay-Bold.woff2` de Fontshare
   a `public/fonts/`.
2. Reemplazar el `<link>` de Fontshare en `index.html` por:
```html
<link rel="preload" href="/fonts/ClashDisplay-Semibold.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/ClashDisplay-Bold.woff2" as="font" type="font/woff2" crossorigin />
```
3. Añadir al inicio de `tokens.css`:
```css
@font-face {
  font-family: 'Clash Display';
  src: url('/fonts/ClashDisplay-Semibold.woff2') format('woff2');
  font-weight: 600; font-display: swap;
}
@font-face {
  font-family: 'Clash Display';
  src: url('/fonts/ClashDisplay-Bold.woff2') format('woff2');
  font-weight: 700; font-display: swap;
}
```
Default recomendado v1: **mantener CDN** (ya usa `display=swap`).

### 6. Budgets CWV (fijados — medir en Verificación)
| Métrica | Budget | Herramienta |
|---|---|---|
| JS inicial | < 150KB gzip (sin vendor-three) | salida de `npm run build` |
| LCP | < 2.5s (móvil 4G simulado) | Lighthouse |
| CLS | < 0.05 | Lighthouse |
| TBT | < 200ms | Lighthouse |
| three.js | carga diferida, nunca bloquea `app:ready` | Network (chunk aparte) |

## Criterios de aceptación
- [ ] `npm run build` lista `vendor-gsap`, `vendor-lenis` y un chunk `three-*.js`
  separado que NO se carga en el arranque (verificar en Network con cache limpio).
- [ ] La experiencia visual es IDÉNTICA a la tarea 16 (partículas incluidas una vez
  cargado el chunk).
- [ ] Con red 3G simulada: el hero entra animado aunque three aún esté cargando;
  las partículas aparecen cuando llega el chunk, sin errores.
- [ ] JS inicial < 150KB gzip.
- [ ] Si `content-visibility` causa saltos → bloque eliminado y anotado (válido como
  resultado).

## Verificación
```bash
npm run build && npm run preview
# 1) Network (disable cache): index + vendor-gsap + vendor-lenis cargan primero;
#    three-*.js llega después, en paralelo, sin bloquear
# 2) Lighthouse (móvil, 4G): contrastar con budgets de la tabla
# 3) Scroll completo: sin saltos de layout
```

## ⚠ No hacer
- No hacer `import()` dinámico de gsap/lenis: se usan desde el primer segundo.
- No tocar la lógica de la escena (shaders, guards, pausa): solo el mecanismo de carga.
- No activar el self-hosting de fuentes por defecto: es opcional y documentado.


### EDIT
--- old ---
@media (min-width: 1024px) {
  #servicios, #proceso, #sobre-mi, #testimonios, #contacto {
    content-visibility: auto;
    contain-intrinsic-size: auto 100vh;
  }
}
```
> **Ojo:** `content-visibility` puede interferir con las mediciones de
> ScrollTrigger. Si tras aplicarlo notas saltos en el pin de proyectos o en los
> reveals, ELIMINA este bloque (es una optimización opcional, no estructural) y
> anótalo en `tasks/BLOCKERS.md`.

### 5. (Opcional, documentado) Self-hosting de Clash Display
Solo si se quiere máximo control de fuentes:
--- new ---
@media (min-width: 1024px) {
  #servicios, #proceso, #sobre-mi, #testimonios, #contacto {
    content-visibility: auto;
    contain-intrinsic-size: auto 100vh;
  }
}
```
> **`#informe` NO entra en esta lista, y no puede añadirse.** `content-visibility`
> cambia el momento en que se hace el layout del contenido, lo que desincroniza el
> IntersectionObserver que dispara la compilación del informe (tarea 35) y su gate de
> actualización en vivo. El resultado sería un panel que compila tarde, o que no compila.

> **Ojo:** `content-visibility` puede interferir con las mediciones de
> ScrollTrigger. Si tras aplicarlo notas saltos en el pin de proyectos o en los
> reveals, ELIMINA este bloque (es una optimización opcional, no estructural) y
> anótalo en `tasks/BLOCKERS.md`.

### 5. Self-hosting de fuentes — **OBLIGATORIO antes del lanzamiento**

> Esta sección era opcional en el plan original. **Con el concepto "LA CAMPAÑA ERES TÚ"
> deja de serlo** (`PLAN.md` §11.9).
>
> El sitio afirma en `#informe` que *nada de esto ha salido de tu navegador*. Mientras las
> fuentes se carguen desde `api.fontshare.com` y `fonts.googleapis.com`, cada visita
> expone la IP del visitante a dos terceros — y esa frase deja de ser cierta. Es
> exactamente lo primero que comprueba un jurado o un cliente técnico.
>
> Se puede desarrollar toda la v1 con el CDN, pero **la tarea 26 (deploy) no se cierra
> sin esto**. Alternativa mínima aceptable si por lo que sea no se hace: acotar el copy
> a *"ningún dato de tu visita sale de este navegador"*, que sí es literalmente cierto —
> y dejarlo anotado en `BLOCKERS.md`.

Aplicar el mismo procedimiento a las **tres** familias (Clash Display, Satoshi y
JetBrains Mono), no solo a Clash Display:

### EDIT
--- old ---
Default recomendado v1: **mantener CDN** (ya usa `display=swap`).

### 6. Budgets CWV (fijados — medir en Verificación)
| Métrica | Budget | Herramienta |
|---|---|---|
| JS inicial | < 150KB gzip (sin vendor-three) | salida de `npm run build` |
| LCP | < 2.5s (móvil 4G simulado) | Lighthouse |
| CLS | < 0.05 | Lighthouse |
| TBT | < 200ms | Lighthouse |
| three.js | carga diferida, nunca bloquea `app:ready` | Network (chunk aparte) |
--- new ---
Y **eliminar los cuatro `<link>`** de CDN y sus `preconnect` del `<head>` (tarea 02).

Durante el desarrollo de la v1 se puede seguir con el CDN; **antes del deploy, no**.

### 6. Budgets CWV (fijados — medir en Verificación)

> **Esta tabla es la autoridad del proyecto sobre estas cifras** (`PLAN.md` §10).
> Ninguna otra tarea puede fijar un número distinto. Si encuentras "200KB" en algún
> sitio, es un residuo: corrígelo.

| Métrica | Budget | Herramienta |
|---|---|---|
| JS inicial | < 150KB gzip (sin vendor-three) | salida de `npm run build` |
| — del cual, JS del concepto (tracker + HUD + toasts + informe + A/B + CSS) | **≤ 15KB gzip** | salida de `npm run build` |
| LCP | < 2.5s (móvil 4G simulado) | Lighthouse |
| CLS | < 0.05 | Lighthouse |
| TBT | < 200ms | Lighthouse |
| three.js | carga diferida, nunca bloquea `app:ready` | Network (chunk aparte) |
| Peticiones del tracker | **0** | Network |

Estimación de referencia con el concepto incluido: gsap ~28KB + ScrollTrigger ~11KB +
lenis ~3KB + app v1 ~9KB + concepto ~14KB ≈ **65KB gzip**, el 43% del budget. Si la
salida de build se acerca a 150KB, algo se ha colado que no debería estar.

### EDIT
--- old ---
- [ ] JS inicial < 150KB gzip.
- [ ] Si `content-visibility` causa saltos → bloque eliminado y anotado (válido como
  resultado).
--- new ---
- [ ] JS inicial < 150KB gzip, y el código del concepto ≤ 15KB gzip.
- [ ] `#informe` **no** lleva `content-visibility`, y sigue compilando al entrar.
- [ ] Si `content-visibility` causa saltos → bloque eliminado y anotado (válido como
  resultado).
- [ ] Self-hosting de las **tres** familias aplicado, `<link>` de CDN eliminados, y
  Network sin una sola petición a `fontshare.com` ni a `googleapis.com`.
- [ ] Con las fuentes self-hosted, la frase del informe es literalmente cierta:
  **cero peticiones a terceros** en toda la sesión.
- [ ] TBT < 200ms **con el tracker activo** (el tick a 4 Hz no debe aparecer como
  long task en el perfil de Performance).

### EDIT
--- old ---
## ⚠ No hacer
- No hacer `import()` dinámico de gsap/lenis: se usan desde el primer segundo.
- No tocar la lógica de la escena (shaders, guards, pausa): solo el mecanismo de carga.
- No activar el self-hosting de fuentes por defecto: es opcional y documentado.
--- new ---
## ⚠ No hacer
- No hacer `import()` dinámico de gsap/lenis: se usan desde el primer segundo.
- No hacer `import()` dinámico de `tracker.js`: corre en el arranque y pesa 3,5KB.
- No tocar la lógica de la escena (shaders, guards, pausa): solo el mecanismo de carga.
- **No añadir `#informe` a la lista de `content-visibility`.**
- **No dejar el self-hosting sin hacer y lanzar igualmente.** Si se decide no hacerlo,
  hay que cambiar el copy del informe — una de las dos cosas, nunca ninguna.
- No "optimizar" el tick del tracker bajándolo de 4 Hz: el reloj de sesión y los toasts
  dependen de esa frecuencia.