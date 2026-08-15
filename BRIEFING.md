# BRIEFING — contenido real

> Documento para rellenar **con la clienta**. Cada apartado dice exactamente dónde acaba
> ese dato en el sitio, para poder migrarlo sin adivinar nada.
>
> Mientras esté sin rellenar, el sitio funciona con los placeholders de `CONTENT.md`. Se
> sustituye **caso a caso y campo a campo**, nunca de golpe.

---

## ⚠ Aviso de NDA — léelo antes de rellenar la sección 4

**Presupuestos, audiencias y resultados son datos de cliente.** Antes de publicarlos hay
que tener **permiso escrito**, y por defecto se publican como **rangos** y **sin
identificar cuentas**. Si un cliente no da permiso, ese caso se publica **sin backstage**
— no se inventa.

Esta es la parte del portfolio que más lo diferencia y también la que más cuidado
requiere: enseñar **cómo se trabaja**, no los datos privados de quien confió en ti.

---

## 1. Identidad

| Campo | Valor | Dónde va |
|---|---|---|
| Nombre público | | `index.html` (logo, h1), `CONTENT.md` §0 |
| Email de contacto | | CTA y enlace de contacto |
| LinkedIn / Instagram / X | | Footer |
| Dominio definitivo | | tarea 26 (y `robots.txt`, `sitemap.xml`, JSON-LD, OG) |
| Años de experiencia | | "Sobre mí" |

## 2. Métricas del hero y de la sección Resultados

Cuatro KPIs. De cada uno hace falta **el valor final** y **su serie histórica** de 6
puntos (la sparkline). El último punto de la serie tiene que coincidir con el valor.

| # | KPI | Valor | Serie de 6 puntos | Etiqueta |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |

> Van a `index.html` como `data-count`, `data-spark`, `data-prefix`, `data-suffix`.

## 3. Los 6 casos — datos básicos

Por cada caso: título, sector, año, tags, dos KPIs con su etiqueta y una descripción de
una o dos líneas.

| # | Título | Sector | Año | Tags | KPI 1 | KPI 2 | Descripción |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |

## 4. Los 6 casos — datos de anuncio y backstage

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

| Caso | Formato | Audiencia | Audiencia corta (≤24) | Presupuesto (rango) | Objetivo | CTA | Test A | Test B | Ganadora | Resultado | Antes → Después | ¿Permiso escrito? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | | | | | ☐ |
| 2 | | | | | | | | | | | | ☐ |
| 3 | | | | | | | | | | | | ☐ |
| 4 | | | | | | | | | | | | ☐ |
| 5 | | | | | | | | | | | | ☐ |
| 6 | | | | | | | | | | | | ☐ |

## 5. Sobre mí

- Retrato en **4:5** (ver §8 para el formato de entrega).
- Dos párrafos de biografía.
- CV en cuatro hitos (año — puesto/hito).

## 6. Testimonios

Tres, y **con permiso**: cita, nombre, cargo y empresa. Si no hay permiso para el nombre
real, se publica el cargo y el sector ("CMO · e-commerce de moda") — nunca un nombre
inventado.

| # | Cita | Nombre | Cargo · Empresa | ¿Permiso? |
|---|---|---|---|---|
| 1 | | | | ☐ |
| 2 | | | | ☐ |
| 3 | | | | ☐ |

## 7. Legal (tarea 24)

Titular, NIF/CIF, domicilio fiscal, email de contacto legal y, si hay formulario, el
encargado de tratamiento. Sin esto no se puede publicar el aviso legal ni la política de
privacidad.

## 8. Imágenes — cómo entregarlas

> **Si quien produce las imágenes es un agente generador, su documento es
> [`MEDIA-BRIEF.md`](MEDIA-BRIEF.md)**: allí están la dirección de arte, la lista completa
> de assets con sus prompts, los presupuestos de peso y los criterios de coherencia. Esta
> sección es el resumen para una entrega humana.

### Qué hace falta

| Uso | Proporción | Tamaño mínimo | Cuántas |
|---|---|---|---|
| Creatividades de caso | 16:10 | 1600×1000 | 6 |
| Retrato "Sobre mí" | 4:5 | 1000×1250 | 1 |
| OG image (redes) | 1.91:1 | 1200×630 | 1 (la genera la tarea 27) |

### Flujo

1. Los **originales** se dejan en `src-assets/` (fuera del build, no se publican).
2. Se exportan a `public/img/` en **AVIF y WebP** con el mismo nombre base:
   `atelier-nord.avif` + `atelier-nord.webp`.
3. En `src/data/projects.js`, al caso se le añaden dos campos:
   ```js
   image: 'atelier-nord',        // sin extensión
   imageAlt: 'Creatividad de la campaña de Atelier Nord: …',
   ```
   Con `image` presente, la card sirve la imagen; sin él, sigue el gradiente. **No hay
   que tocar ninguna plantilla.**

### Conversión (sin instalar nada en el proyecto)

Si tienes `cwebp` y `avifenc` (`brew install webp libavif`):

```bash
cwebp -q 82 -resize 1600 0 src-assets/atelier-nord.jpg -o public/img/atelier-nord.webp
avifenc --min 24 --max 32 src-assets/atelier-nord.jpg public/img/atelier-nord.avif
```

Si no, vale cualquier conversor online que respete las proporciones. **No se añaden
dependencias al proyecto por esto**: el stack está bloqueado (`PLAN.md` §3).

### Peso objetivo

Máximo **200 KB por imagen** en WebP. Seis creatividades a 200 KB son 1,2 MB que se cargan
en diferido (`loading="lazy"`), pero conviene no pasarse: el budget de LCP es 2,5 s
(tarea 17 §6).

## 9. Al terminar la migración — comprobaciones

- [ ] Ningún `audienceShort` pasa de 24 caracteres (se corta en el cursor).
- [ ] Ningún presupuesto es una cifra exacta: los 6 son rangos.
- [ ] Todos los casos con backstage tienen permiso escrito.
- [ ] Toda imagen tiene `imageAlt` descriptivo (no "imagen1").
- [ ] El último punto de cada `data-spark` coincide con su `data-count`.
- [ ] **La declaración de privacidad del informe sigue siendo literalmente cierta.**
      Si se ha añadido cualquier script de terceros, hay que corregir el copy o quitarlo
      (`PLAN.md` §11, tarea 17 §5). Las fuentes ya son self-hosted desde la tarea 17.
