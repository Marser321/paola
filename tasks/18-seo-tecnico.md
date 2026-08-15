# Tarea 18 — SEO técnico: JSON-LD, robots.txt, sitemap.xml

> ♻ **Archivo reconstruido desde cero** (2026-08-15): el original se perdió sin dejar
> fragmento alguno. Escrito a partir de la entrada de `tasks/README.md`
> ("JSON-LD, robots.txt, sitemap.xml", depende de 16) y de `CONTENT.md`.

## Objetivo
Que el sitio sea legible por buscadores y por los previsualizadores sociales, sin afirmar
nada que no sea cierto.

## Archivos a crear/editar
- **Editar** `index.html` (bloque `application/ld+json` en el `<head>`)
- **Crear** `public/robots.txt`
- **Crear** `public/sitemap.xml`

## Spec

### 1. JSON-LD
Un `@graph` con tres nodos enlazados por `@id`:

| Nodo | Para qué |
|---|---|
| `Person` | La profesional: nombre, `jobTitle`, email y `knowsAbout` |
| `ProfessionalService` | El servicio, con `provider` apuntando a la `Person` |
| `WebSite` | El sitio, con `publisher` apuntando a la `Person` |

**Regla dura: solo se declara lo que el sitio afirma de verdad.** Nada de
`AggregateRating`, `Review` ni cifras de resultados en el structured data. Los
testimonios de `CONTENT.md` son placeholders sin persona verificable detrás, y marcarlos
como `Review` sería inventar reseñas — además de ser justo lo que Google penaliza. Si
algún día hay testimonios reales y verificables, entonces se valora.

> Coherencia con el concepto: un sitio cuyo argumento entero es "medir sin humo" no puede
> llevar structured data inflado. Es el mismo criterio de `PLAN.md` §11.5 aplicado al SEO.

### 2. `public/robots.txt`
Permitir todo y apuntar al sitemap.

### 3. `public/sitemap.xml`
Sitio one-page: una sola URL. `caso.html` lo añadirá la tarea 29 cuando existan los casos
de estudio.

### 4. El dominio

Los tres archivos usan `https://paola-ads.com/`, que es **provisional** y viene del email
placeholder de `CONTENT.md`. Está marcado con comentario en los tres sitios.
**La tarea 26 tiene que sustituirlo por el dominio real** — en `robots.txt`,
`sitemap.xml`, los `@id`/`url` del JSON-LD y los `og:url`/`og:image` que siguen
comentados desde la tarea 16.

## Criterios de aceptación
- [x] El JSON-LD parsea como JSON válido y no declara ratings ni reviews.
- [x] `robots.txt` y `sitemap.xml` se sirven desde la raíz en el build
      (`/robots.txt`, `/sitemap.xml` → 200).
- [x] El sitemap es XML válido.
- [x] Los tres archivos marcan el dominio como provisional.
- [ ] Rich Results Test de Google sin errores. **No ejecutado**: requiere el sitio
      publicado en un dominio accesible → se cierra en la tarea 26.

## Verificación
```bash
npm run build && npm run preview
curl -s localhost:4173/robots.txt
curl -s localhost:4173/sitemap.xml
```
Y en la consola del navegador:
```js
JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)
// → objeto con @graph de 3 nodos, sin excepción
```

## ⚠ No hacer
- **No inventar structured data**: sin `AggregateRating`, sin `Review`, sin métricas de
  resultados. Los testimonios de la v1 son placeholders.
- No poner el dominio real hasta tenerlo: peor que un placeholder marcado es un dominio
  equivocado indexado.
- No añadir `caso.html` al sitemap hasta que exista (tarea 29).
- No bloquear nada en `robots.txt`: no hay áreas privadas en este sitio.
