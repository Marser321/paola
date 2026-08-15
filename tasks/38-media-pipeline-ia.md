# Tarea 38 — Pipeline de medios para la pasada de contenido con IA

> Tarea **nueva**, no estaba en el plan original de 38 (00→37). Se añade porque entra un
> agente externo a generar el contenido y las imágenes, y el sitio no tenía dónde
> recibirlas: `public/img/` estaba vacío y no existía ninguna capa de fondo por sección.

## Objetivo
Dejar el sitio preparado para que un agente generador de imágenes entregue material sin
tocar código, y que cada asset **se encienda solo al declararse**.

## Principio
**El sitio funciona con cero imágenes y funciona con todas.** Lo que no esté declarado en
`src/data/media.js` no se renderiza. Es la misma propiedad que la tarea 23 dio a las cards
con `p.image`, extendida a fondos, secuencias y retrato.

## Archivos

**Nuevos:** `MEDIA-BRIEF.md` (el encargo) · `src/data/media.js` (manifiesto) ·
`src/js/sections/backdrops.js` · `src/js/sections/sequence.js` ·
`src/js/sections/image-set.js` · `src/styles/media.css` · `scripts/check-media.mjs`

**Editados:** `src/main.js` · `src/js/sections/about.js` (retrato real) · `package.json`

## Spec

### 1. Manifiesto — `src/data/media.js`
Tres colecciones (`portraits`, `backdrops`, `sequences`) más la tabla de `budgets` por
sección. Es **el único archivo que edita el agente**, junto con `projects.js` para las
creatividades. Lleva ejemplos comentados de cada tipo.

### 2. Fondos con parallax — `backdrops.js`
Una capa por entrada, movida con ScrollTrigger (`scrub`, `ease: 'none'`). `depth` se topa
en **0.35**: por encima el fondo compite con el texto. Con reduced-motion las capas se
quedan **quietas pero visibles** — son imagen, no movimiento.

### 3. Secuencias — `sequence.js`
Canvas **2D**, no WebGL: no suma contextos y por tanto no reincide en el problema que dejó
desactivada la tarea 20 (`BLOCKERS.md` §B-02).

Carga en tres tiempos: el `still` se pinta como fondo CSS y se ve al instante → los frames
se descargan de 6 en 6 cuando la sección se acerca → el canvas se revela y toma el relevo.
Si la descarga falla, se queda el `still` y no pasa nada. En **móvil y con reduced-motion
los frames ni se descargan**, mismo criterio que el WebGL del hero (t.08).

### 4. Retrato real — `about.js`
`.about__img` acepta un `<picture>` si hay retrato declarado; si no, se queda el gradiente.
Mismo encuadre 4:5 en ambos casos, así que la llegada de la foto **no mueve el layout**. Al
poner la foto se quitan el `role="img"` y el `aria-label` del contenedor: el nombre
accesible pasa a darlo el `alt`, y dejar los dos lo anunciaría dos veces.

### 5. `npm run check:media`
Script node sin dependencias. Comprueba que existe cada asset declarado **en cada formato
declarado**, que nadie se pasa de su presupuesto, y lista lo que sigue marcado como
generado por IA.

> **Por qué valida formato a formato:** `image-set()` elige por tipo soportado, **no cae al
> siguiente si el archivo falta**. Un `.avif` declarado que no existe deja la capa vacía en
> Chromium sin ningún error visible. Por eso o se entregan los dos formatos, o se declara
> `formats: ['webp']` en la capa.

### 6. Presupuesto por sección
En `budgets` de `media.js` y en `MEDIA-BRIEF.md` §4. Hero con manga ancha (1,8 MB
diferidos) porque es el escaparate; el resto ajustado. El **`hero-still` (≤120 KB) es el
único asset en la ruta crítica**: es el elemento LCP.

`#informe` **no lleva imagen**, y `check:media` avisa si alguien le declara una.

## Criterios de aceptación
- [x] Con `public/img/` vacío el sitio se ve **exactamente igual que antes**: 0 backdrops,
  0 secuencias, retrato en gradiente. Verificado.
- [x] Un fondo declarado se monta, es `aria-hidden`, queda en `z-index: 0` con el contenido
  en `1`, y **hace parallax**: progreso 0.046 → 0.507 → 0.968 con la capa desplazándose
  5 → 53 → 101 px de forma monótona.
- [x] **Cero CLS** al aparecer una imagen: altura de sección y del documento idénticas
  antes y después.
- [x] `npm run check:media` pasa con el manifiesto vacío, y con un asset declarado
  marcado como IA lo reporta como pendiente de material real.
- [x] El JS inicial no se mueve: los módulos nuevos suman ~1,4 KB gzip y ninguna imagen
  entra en el bundle.
- [ ] Secuencia real en el hero con sus partículas WebGL encima. **Pendiente**: no hay
  frames que probar hasta que el agente entregue.
- [ ] El pin de `#proyectos` con su secuencia. **Pendiente** por lo mismo, y es el punto
  a vigilar: ya lo rompió `content-visibility` una vez (`BLOCKERS.md` §B-01).

## Verificación
```bash
npm run check:media && npm run build && npm run preview
```

> **Nota para quien repita estas pruebas en un navegador headless:** si `window.innerHeight`
> devuelve 0, ScrollTrigger calcula `start`/`end` sin sentido (llegué a ver `start: -19142`)
> y **no es un bug del sitio**. Hay que medir dentro de un iframe con dimensiones reales.
> Y si mueves el scroll a mano, llama a `ScrollTrigger.update()`: en vivo lo dispara el
> evento de Lenis, que no se emite con un `scrollTo` programático.

## ⚠ No hacer
- No meter imágenes en `src/`: van en `public/img/` y los originales en `src-assets/`.
- No usar WebGL para las secuencias. Canvas 2D, por §3.
- No poner fondo a `#informe`.
- No subir `depth` por encima de 0.35.
- No declarar un formato que no se ha entregado (ver §5).
- **No publicar con nada marcado como `placeholder` / `ia-propuesto`.**
