# Tarea 23 — Pipeline de contenido real

> ♻ **Archivo parcialmente reconstruido** (2026-08-15). El bloque "Añadir al BRIEFING.md:
> los datos de anuncio de cada caso", su aviso de NDA y el ⚠ No hacer son **literales**
> del transcript. El resto se ha reescrito.

## Objetivo
Dejar preparado el camino para que el contenido real entre **sin tocar código**: un
briefing que la clienta rellena, un sitio para los originales y soporte de imagen en las
cards que convive con los gradientes placeholder.

## Archivos a crear/editar
- **Crear** `BRIEFING.md` (raíz)
- **Crear** `src-assets/` con su README, y excluirla en `.gitignore`
- **Editar** `src/js/sections/projects.js` (visual condicional)
- **Editar** `src/styles/sections.css` (`.project-card__picture`)

## Spec

### 1. `BRIEFING.md`
Cuestionario para rellenar con la clienta, con una tabla por bloque y **diciendo dónde
acaba cada dato** en el sitio. Cubre: identidad, métricas con sus series, los 6 casos
básicos, los datos de anuncio y backstage (§4), Sobre mí, testimonios, datos legales y el
flujo de imágenes.

### 2. Soporte de imagen en las cards — la migración es de DATOS

`renderProjects()` decide el visual según los datos:

```js
const visual = p.image
  ? `<picture class="project-card__picture">
       <source srcset="/img/${p.image}.avif" type="image/avif" />
       <source srcset="/img/${p.image}.webp" type="image/webp" />
       <img src="/img/${p.image}.webp" alt="${p.imageAlt || ''}"
            width="1200" height="750" loading="lazy" decoding="async" />
     </picture>`
  : `<div class="project-card__gradient" style="…"></div>`
```

Con `image` en `projects.js` se sirve la creatividad real; sin él, el gradiente del
sistema. **Añadir un caso real no requiere tocar ninguna plantilla.**

Tres decisiones que importan:

- **`width`/`height` explícitos.** El pin horizontal mide la galería antes de que carguen
  las imágenes; sin dimensiones habría salto de layout y el scrub quedaría descuadrado.
- **`loading="lazy"`.** Seis creatividades a 200 KB no pueden entrar en la carga inicial.
- **`imageAlt` obligatorio en la práctica.** El `alt` describe la creatividad; el chrome
  de anuncio es `aria-hidden` (t.34), así que el `alt` es la única lectura del visual.

### 3. `src-assets/`
Los **originales** viven ahí y **no entran en el build**: Vite solo publica `public/`.
Es deliberado: pesan mucho y suelen traer EXIF (geolocalización incluida) que no debe
salir. Excluida en `.gitignore` salvo su README.

### 4. Conversión de imágenes
Documentada en `BRIEFING.md` §8 con los comandos de `cwebp` y `avifenc`. **No se añade
ninguna dependencia al proyecto**: el stack está bloqueado (`PLAN.md` §3) y la conversión
es un paso manual previo, no parte del build.

## Añadir al `BRIEFING.md`: los datos de anuncio de cada caso

El backstage (tarea 34) necesita datos que no estaban en el briefing original. Por cada
uno de los 6 casos hay que pedir:

- **Formato** de la creatividad ganadora (Reels 9:16, estático 4:5, carrusel, vídeo…)
- **Audiencia** en una línea, como se describiría en Ads Manager
- **Audiencia corta** para el cursor: **máximo 24 caracteres**
- **Presupuesto en RANGO** (`12-18K€/mes`), nunca la cifra exacta
- **Objetivo** de campaña
- **CTA** que llevaba el anuncio
- **El test A/B**: las dos hipótesis, cuál ganó y con qué resultado
- **Antes → después** del KPI principal

> ⚠ **Aviso de NDA — incluirlo literalmente en el briefing.** Presupuestos, audiencias y
> resultados son datos de cliente. Antes de publicarlos hay que tener **permiso escrito**,
> y por defecto se publican como rangos y sin identificar cuentas. Si un cliente no da
> permiso, ese caso se publica sin backstage — no se inventa.
>
> Esta es la parte del portfolio que más lo diferencia y también la que más cuidado
> requiere: enseñar cómo se trabaja, no los datos privados de quien confió en ti.

✅ Incluido literalmente en `BRIEFING.md`, con una columna **"¿Permiso escrito?"** por
caso en la tabla del §4.

## Criterios de aceptación
- [x] `BRIEFING.md` existe y cubre los 9 bloques, con el aviso de NDA literal.
- [x] `src-assets/` existe, tiene README y está fuera del build y del control de versiones.
- [x] Una card con `image` sirve `<picture>` con AVIF + WebP; sin `image`, el gradiente.
- [x] El build sigue limpio y la galería no cambia (ningún caso tiene `image` todavía).
- [ ] Migración real de los 6 casos. **Bloqueada**: no hay contenido de la clienta.
- [ ] Retrato real en Sobre mí. **Bloqueada** por lo mismo.

## Verificación
```bash
npm run build   # sin errores; la galería sigue con gradientes
```
Para probar el camino de imagen sin contenido real, basta añadir `image` e `imageAlt` a un
caso de `projects.js` y poner dos archivos en `public/img/`.

## ⚠ No hacer
- No subir originales a `public/` (solo optimizadas; `src-assets/` queda fuera del build).
- No usar imágenes de bancos (Unsplash etc.) para los casos: capturas reales o mockups propios.
- No borrar los datos placeholder de `projects.js` hasta tener los reales: se
  reemplazan proyecto a proyecto, nunca dejar el array vacío.
- **No publicar presupuestos exactos ni audiencias identificables sin permiso escrito.**
- No dejar `audienceShort` por encima de 24 caracteres: se corta en el cursor.
