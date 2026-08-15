# Tarea 27 — Branding: wordmark, set de favicons y og-image

> ♻ **Archivo reconstruido desde cero** (2026-08-15): el original se perdió sin dejar
> fragmento alguno. Escrito a partir de la entrada de `tasks/README.md` ("Wordmark,
> favicon set, og-image", depende de 16, activa OG en 26), de `PLAN.md` §4.2 —que ya
> preveía `public/og.html` como plantilla y como excepción documentada de colores— y de
> `CONTENT.md` §19.

## Objetivo
Cerrar los activos de marca: el wordmark como archivo, el juego completo de iconos, el
manifiesto y la imagen que se ve al compartir el enlace.

## Archivos a crear/editar
- **Crear** `public/og.html` (plantilla) y `public/og.jpg` (1200×630 generada)
- **Crear** `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png`
- **Crear** `public/site.webmanifest`
- **Crear** `public/wordmark.svg`
- **Editar** `index.html` (`apple-touch-icon`, `manifest`, y el bloque OG preparado)

## Spec

### 1. `public/og.html` — la plantilla
Reproduce el diseño de la imagen social en HTML, con las fuentes ya self-hosted (t.17):
label mono, `LA CAMPAÑA / ERES TÚ` con el acento en gradiente, pie con la marca y los
KPIs, y la barra de gradiente al fondo.

> **Excepción documentada de `PLAN.md` §9.2.** Este archivo **hardcodea los colores del
> sistema**. Es una plantilla suelta que se abre y se captura: no entra en el bundle y no
> puede importar `tokens.css`. Está avisado en un comentario dentro del propio archivo.
> Si cambian los tokens, hay que actualizar sus hex a mano.

### 2. `public/og.jpg` — la imagen real
1200×630, JPEG calidad 0,86, **44,7 KB**. Generada rasterizando el mismo diseño sobre un
`<canvas>` en una página del sitio, para que use **las fuentes self-hosted reales** y no
las de sistema.

> **Detalle que se escapó en el primer intento:** el gradiente del acento se creó de
> `x=72` a `x=900`, pero "ERES TÚ" solo mide 630 px, así que la rampa se cortaba en rosa y
> **nunca llegaba al naranja**. Se regeneró midiendo el ancho real del texto
> (`measureText`) y ajustando la rampa a ese ancho.

### 3. Set de iconos
La "P" en gradiente sobre el cuadrado redondeado de `--bg`, coherente con el
`favicon.svg` de la tarea 16:

| Archivo | Tamaño | Uso |
|---|---|---|
| `favicon.svg` | vectorial | pestaña (t.16) |
| `apple-touch-icon.png` | 180×180 | iOS, pantalla de inicio |
| `icon-192.png` | 192×192 | manifiesto |
| `icon-512.png` | 512×512 | manifiesto, splash |

### 4. `public/site.webmanifest`
`name`, `short_name`, `lang: es-ES`, `display: standalone`, `background_color` y
`theme_color` en `#0E0E0E`, y los tres iconos.

### 5. `public/wordmark.svg`
Marca en gradiente para uso **externo**: firmas de email, decks, prensa.

> **No se usa en el sitio, y es deliberado.** La cabecera lleva la marca como **texto** en
> Clash Display, porque así hereda el `mix-blend-mode: difference` del header, es
> seleccionable y la leen los lectores de pantalla. Un SVG ahí sería peor en las dos cosas.

### 6. `index.html`
Se añaden `apple-touch-icon` y `manifest`. **El bloque OG sigue comentado**: `og:image` y
`og:url` exigen URL absoluta y todavía no hay dominio. Queda preparado con `DOMINIO` como
marcador y con `og:image:width/height/alt` y `twitter:image` ya escritos — la tarea 26
solo tiene que sustituir el marcador y descomentar.

## Criterios de aceptación
- [x] Los 10 activos se sirven con 200 y su content-type correcto: `favicon.svg`,
  `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`, `og.jpg`,
  `wordmark.svg`, `og.html`, `robots.txt`, `sitemap.xml`.
- [x] `site.webmanifest` es JSON válido; `wordmark.svg` y `favicon.svg` son XML válido.
- [x] `og.jpg` mide 1200×630 y pesa menos de 100 KB (44,7 KB).
- [x] El gradiente del acento recorre las tres paradas (violeta → rosa → naranja).
- [x] El `<head>` enlaza icono, apple-touch-icon y manifiesto; `theme-color` en `#0E0E0E`.
- [x] `og:image` **sigue desactivado**: no se activa sin dominio real.
- [ ] Previsualización real en LinkedIn / X / WhatsApp. **Bloqueada hasta la tarea 26**:
  hace falta URL pública para que los rastreadores la lean.
- [ ] Wordmark con la tipografía convertida a curvas. **Pendiente**: el SVG actual
  referencia la familia por nombre, con fallback a Helvetica/Arial. Para prensa conviene
  trazarlo en un editor vectorial. Sirve tal cual para uso interno.

## Verificación
```bash
npm run build && npm run preview
```
En la consola del navegador:
```js
for (const u of ['/favicon.svg','/apple-touch-icon.png','/icon-192.png','/icon-512.png',
                 '/site.webmanifest','/og.jpg','/wordmark.svg'])
  fetch(u).then(r => console.log(u, r.status))
// → todos 200
```
Y abrir `/og.html` para comparar la plantilla con `og.jpg`.

## ⚠ No hacer
- **No activar `og:image` ni `og:url` sin dominio real** (t.16, t.18): peor que no tener
  OG es tener uno que apunta a un dominio equivocado, porque las redes lo cachean.
- No sustituir la marca del header por el SVG: perdería el blend y la accesibilidad.
- No meter `og.html` en el bundle: vive en `public/` como plantilla suelta.
- No regenerar los iconos con otra tipografía: la "P" es Clash Display 700, la misma del
  `favicon.svg`.
- No olvidar que `og.html` hardcodea colores: si cambian los tokens, hay que tocarlo.
