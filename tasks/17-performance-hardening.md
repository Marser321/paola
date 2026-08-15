# Tarea 17 — Endurecimiento de performance

> ♻ **Archivo parcialmente reconstruido** (2026-08-15). Las secciones 4, 5 y 6, los
> criterios y el ⚠ No hacer proceden **literales** del transcript (incluidas sus dos
> ediciones posteriores). Las secciones 1–3 (code-splitting) se han reescrito a partir de
> lo que los criterios supervivientes exigen: chunks `vendor-gsap`, `vendor-lenis` y un
> `three-*.js` que no se carga en el arranque.

## Objetivo
Sacar `three` del bundle inicial, separar vendors, y dejar el sitio dentro de los budgets
de Core Web Vitals. **Esta tarea es la autoridad del proyecto sobre esas cifras.**

## Archivos a crear/editar
- **Editar** `vite.config.js` (manualChunks + umbral de aviso)
- **Editar** `src/js/webgl/hero-scene.js` (`import()` dinámico de `three`)
- **Editar** `src/styles/sections.css` (§4)
- **Editar** `index.html` y `src/styles/tokens.css` (§5, self-hosting)

## Spec

### 1. `three` con `import()` dinámico

`initHeroScene()` pasa a ser `async`. El `import('three')` va **después de los guards**:
en móvil o con reduced-motion el chunk **no se descarga nunca**.

```js
export async function initHeroScene() {
  // …guards de PLAN.md §9.7 (móvil, reduced-motion, sin webgl2)…
  const THREE = await import('three')
  const COLOR_A = new THREE.Color(HEX_A)   // los colores se instancian aquí
  // …resto de la escena…
}
```

Los tres hex del gradiente pasan a constantes de string a nivel de módulo (`HEX_A/B/C`) y
solo se convierten en `THREE.Color` dentro de la función, cuando THREE ya existe.

`main.js` llama `initHeroScene()` **sin `await`**: es fire-and-forget, y por eso el hero
puede animar su entrada mientras el chunk viaja.

### 2. Vendors separados en `vite.config.js`
```js
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (!id.includes('node_modules')) return
        if (id.includes('gsap')) return 'vendor-gsap'
        if (id.includes('lenis')) return 'vendor-lenis'
      },
    },
  },
}
```
`three` **no se lista**: sale solo en su propio chunk por ser un `import()` dinámico.
Listarlo aquí lo forzaría de vuelta al grafo estático.

### 3. Umbral de aviso de tamaño
```js
chunkSizeWarningLimit: 800,
```
El único chunk que pasa de 500 kB es `three`, y es deliberado: se carga en diferido y
nunca entra en el arranque. Sin subir el umbral, cada build avisaría de algo ya resuelto
por diseño. El budget que manda es el del **JS inicial**, no el de un chunk perezoso.

### 4. Render diferido de secciones largas — **PROBADO Y RETIRADO**

> El bloque `content-visibility: auto` + `contain-intrinsic-size: auto 100vh` sobre
> `#servicios`, `#proceso`, `#sobre-mi`, `#testimonios` y `#contacto` se aplicó, se midió
> y **se retiró** el 2026-08-15. Rompía el pin de la galería y movía la altura del
> documento 913 px durante el scroll. Medición completa en
> [`BLOCKERS.md`](BLOCKERS.md) §B-01. La retirada está autorizada por esta misma sección.

> **`#informe` NO entra en esta lista, y no puede añadirse.** `content-visibility`
> cambia el momento en que se hace el layout del contenido, lo que desincroniza el
> IntersectionObserver que dispara la compilación del informe (tarea 35) y su gate de
> actualización en vivo. El resultado sería un panel que compila tarde, o que no compila.

### 5. Self-hosting de fuentes — **OBLIGATORIO antes del lanzamiento**

> Esta sección era opcional en el plan original. **Con el concepto "LA CAMPAÑA ERES TÚ"
> deja de serlo** (`PLAN.md` §11.9).
>
> El sitio afirma en `#informe` que *nada de esto ha salido de tu navegador*. Mientras las
> fuentes se carguen desde `api.fontshare.com` y `fonts.googleapis.com`, cada visita
> expone la IP del visitante a dos terceros — y esa frase deja de ser cierta. Es
> exactamente lo primero que comprueba un jurado o un cliente técnico.

**Aplicado el 2026-08-15 a las tres familias.** Procedimiento seguido:

1. Descargar las hojas de ambos CDN y extraer las URLs `.woff2` de cada `@font-face`.
   Ojo: las de Fontshare son **protocolo-relativas** (`//cdn.fontshare.com/…`).
2. Guardar los archivos en `public/fonts/` con nombres legibles.
3. Declarar los `@font-face` **al principio de `tokens.css`** (es la única fuente de
   verdad tipográfica) con `font-display: swap`.
4. **Eliminar los cuatro `<link>` de CDN y sus `preconnect`** del `<head>` (tarea 02),
   y añadir `preload` de los tres archivos críticos: Clash Display Bold (el h1 del hero,
   que es el elemento LCP), Satoshi Regular y JetBrains Mono latin.

**Los 7 archivos resultantes (160 KB en total):**

| Archivo | Familia / peso |
|---|---|
| `ClashDisplay-Semibold.woff2` | Clash Display 600 |
| `ClashDisplay-Bold.woff2` | Clash Display 700 |
| `Satoshi-Regular.woff2` | Satoshi 400 |
| `Satoshi-Medium.woff2` | Satoshi 500 |
| `Satoshi-Bold.woff2` | Satoshi 700 |
| `JetBrainsMono-latin.woff2` | JetBrains Mono **400 500** |
| `JetBrainsMono-latin-ext.woff2` | JetBrains Mono **400 500** |

> **JetBrains Mono se sirve como fuente variable.** Los archivos que Google entrega para
> el peso 400 y para el 500 son **byte a byte idénticos** (mismo MD5). Se guarda uno por
> subconjunto y se declara `font-weight: 400 500`. Bajar los cuatro habría metido 43 KB
> de duplicado exacto.

> **Rutas.** Los `@font-face` y los `preload` usan rutas **absolutas** (`/fonts/…`), no
> relativas: en CSS una ruta relativa se resolvería desde `dist/assets/`, y mezclar
> absoluta en el CSS con relativa en el `preload` provocaría una doble descarga. Implica
> que el sitio se despliega en la **raíz del dominio**, que es justo lo que hace la tarea 26.

> **Licencias:** Clash Display y Satoshi son de Indian Type Foundry bajo su licencia
> gratuita, que permite self-hosting; JetBrains Mono es SIL OFL 1.1. Las tres permiten
> alojarlas en el propio dominio.

### 6. Budgets CWV (fijados — medir en Verificación)

> **Esta tabla es la autoridad del proyecto sobre estas cifras** (`PLAN.md` §10).
> Ninguna otra tarea puede fijar un número distinto. Si encuentras "200KB" en algún
> sitio, es un residuo: corrígelo.

| Métrica | Budget | Herramienta | **Medido 2026-08-15** |
|---|---|---|---|
| JS inicial | < 150KB gzip (sin vendor-three) | salida de `npm run build` | ✅ **62,55 KB** (index 12,40 + gsap 44,38 + lenis 5,77) |
| — del cual, JS del concepto (tracker + HUD + toasts + informe + A/B + CSS) | **≤ 15KB gzip** | salida de `npm run build` | ✅ **≤ 12,7 KB** (cota superior: `tracker.css` 3,17 KB gzip + 9,55 KB del JS del concepto **sin minificar**; el chunk minificado con los 20 módulos entero son 12,40 KB) |
| LCP | < 2.5s (móvil 4G simulado) | Lighthouse | ☐ no medido (sin Lighthouse en el entorno) → tarea 19 |
| CLS | < 0.05 | Lighthouse | ☐ no medido; la deriva de 913 px que lo habría reventado se eliminó (§4) |
| TBT | < 200ms | Lighthouse | ☐ no medido → tarea 19 |
| three.js | carga diferida, nunca bloquea `app:ready` | Network (chunk aparte) | ✅ chunk propio de 184,79 KB gzip, empieza a los 212 ms, en paralelo |
| Peticiones del tracker | **0** | Network | ✅ 0 |
| **Peticiones a terceros** | **0** (§5) | Network | ✅ **0** — sesión completa sin una sola petición fuera del origen |
| **Peso de medios por sección** | Ver `budgets` en `src/data/media.js` (t.38) | `npm run check:media` | ✅ 0 declarado todavía |
| — de ese peso, en la ruta crítica | **solo `hero-still`, ≤120 KB** (es el LCP) | `npm run check:media` | — |

Estimación de referencia con el concepto incluido: gsap ~28KB + ScrollTrigger ~11KB +
lenis ~3KB + app v1 ~9KB + concepto ~14KB ≈ **65KB gzip**, el 43% del budget. Si la
salida de build se acerca a 150KB, algo se ha colado que no debería estar.

*(Medición real: 62,55 KB. La estimación del plan se quedó a 2,5 KB.)*

## Criterios de aceptación
- [x] `npm run build` lista `vendor-gsap`, `vendor-lenis` y un chunk `three-*.js`
  separado que NO se carga en el arranque (verificar en Network con cache limpio).
- [x] La experiencia visual es IDÉNTICA a la tarea 16 (partículas incluidas una vez
  cargado el chunk).
- [ ] Con red 3G simulada: el hero entra animado aunque three aún esté cargando;
  las partículas aparecen cuando llega el chunk, sin errores. *(No simulado: el
  mecanismo es correcto — `initHeroScene()` no se espera con `await` — pero no se ha
  probado con throttling → tarea 19.)*
- [x] JS inicial < 150KB gzip, y el código del concepto ≤ 15KB gzip.
- [x] `#informe` **no** lleva `content-visibility`, y sigue compilando al entrar.
- [x] Si `content-visibility` causa saltos → bloque eliminado y anotado (válido como
  resultado). **Es lo que ha pasado: ver `BLOCKERS.md` §B-01.**
- [x] Self-hosting de las **tres** familias aplicado, `<link>` de CDN eliminados, y
  Network sin una sola petición a `fontshare.com` ni a `googleapis.com`.
- [x] Con las fuentes self-hosted, la frase del informe es literalmente cierta:
  **cero peticiones a terceros** en toda la sesión.
- [ ] TBT < 200ms **con el tracker activo** (el tick a 4 Hz no debe aparecer como
  long task en el perfil de Performance). *(No medido → tarea 19.)*

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
- No hacer `import()` dinámico de `tracker.js`: corre en el arranque y pesa 3,5KB.
- No tocar la lógica de la escena (shaders, guards, pausa): solo el mecanismo de carga.
- **No añadir `#informe` a la lista de `content-visibility`.**
- **No dejar el self-hosting sin hacer y lanzar igualmente.** Si se decide no hacerlo,
  hay que cambiar el copy del informe — una de las dos cosas, nunca ninguna.
- No "optimizar" el tick del tracker bajándolo de 4 Hz: el reloj de sesión y los toasts
  dependen de esa frecuencia.
- No volver a meter `content-visibility` sin leer antes `BLOCKERS.md` §B-01.
- No meter imágenes en el bundle: van en `public/img/` y se cargan en diferido (t.38).
