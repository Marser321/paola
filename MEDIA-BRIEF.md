# MEDIA-BRIEF — encargo de contenido e imágenes

> **Empieza por aquí.** Este documento es el encargo completo: qué generar, con qué
> criterios y dónde ponerlo. No necesitas leer el resto del proyecto ni escribir una sola
> línea de código.

---

## 0. Cómo funciona esto en 30 segundos

1. Generas una imagen.
2. La dejas en `public/img/` con el nombre que dice la tabla del §4.
3. La declaras en **`src/data/media.js`** (para fondos, secuencias y retratos) o en
   **`src/data/projects.js`** (para las creatividades de los casos).
4. Ejecutas `npm run check:media` para comprobar que existe, que pesa lo que debe y que no
   falta nada.

**El sitio funciona hoy con cero imágenes.** Lo que no esté declarado, no se renderiza. Así
que puedes entregar de una en una sin romper nada, y en cualquier orden.

---

## 1. ⚠ Dónde vive el texto (esto se equivoca todo el mundo)

Hay **dos** sitios con texto y solo uno se ve en pantalla:

| Archivo | Qué es |
|---|---|
| `CONTENT.md` | Documentación de referencia. **YA NO es lo que se renderiza.** |
| `src/i18n/es.js` y `src/i18n/en.js` | **La fuente real** de todo el texto visible. |

Si escribes copy solo en `CONTENT.md`, **no cambia nada en la web**. El sitio es bilingüe:
todo texto que toques hay que tocarlo en los **dos** diccionarios.

Los datos de los 6 casos (títulos, KPIs, audiencias, tests A/B) viven aparte, en
`src/data/projects.js`.

---

## 2. Dirección de arte

El sitio es **editorial de lujo + terminal de datos**. Fondo casi negro, titulares enormes,
datos en monoespaciada, y un único acento de color en todo el sitio.

| Elemento | Valor |
|---|---|
| Fondo | `#0E0E0E` |
| Superficies (cards, paneles) | `#161616` |
| Texto | `#F3F2F2` |
| Texto secundario | `#8A8A8A` |
| Líneas | `rgba(243,242,242,.08)` |
| **Acento único** | gradiente `#7B19C8` → `#C559C4` → `#F57327` (violeta → rosa → naranja de Meta) |

Referencias de tono: fotografía editorial de moda con luz dura y fondo oscuro, la estética
de un terminal financiero, y el grano de una película. **Nada de stock corporativo**, nada
de gente sonriendo a cámara con un portátil, nada de azules tecnológicos.

---

## 3. Paola Parra — bloque de identidad

Copia este bloque **palabra por palabra en cada prompt de retrato**. Es lo único que da
consistencia de cara entre generaciones.

```
Paola Parra: mujer colombiana de 30 años, piel morena clara, pelo castaño oscuro
ondulado a la altura del hombro con raya al lado, cejas definidas, ojos marrones
oscuros, nariz recta, sonrisa contenida. Complexión media. Estilo profesional
contemporáneo: prendas lisas en negro, gris marengo o crudo, sin estampados, sin
logos, joyería mínima. Expresión serena y segura, nunca efusiva.
```

**Flujo obligatorio para que la cara no cambie entre fotos:**

1. Genera **primero** el retrato maestro (`ia-paola-retrato-4x5`).
2. Úsalo como **imagen de referencia** para todas las demás tomas.
3. Repite el bloque de identidad íntegro en cada prompt, aunque uses referencia.

**Iluminación común a todos los retratos:** luz principal dura entrando desde un lateral,
fondo oscuro `#0E0E0E` que se funde con la web, sin fondo blanco, sin recorte de estudio.
Se permite un leve rebote de color del acento (violeta o naranja) en el borde del pelo o
del hombro — **un reflejo, no un filtro**.

---

## 4. Qué generar

Formatos: **AVIF + WebP** con el mismo nombre base. Sin extensión al declarar en el
manifiesto (el código elige). Comandos de conversión en `BRIEFING.md` §8.

### 4.1 Retratos

| id / nombre de archivo | Dimensiones | Peso máx. | Para qué |
|---|---|---|---|
| `ia-paola-retrato-4x5` | 1000×1250 | 250 KB | Retrato principal de "Sobre mí". **El único que mira a cámara.** |
| `ia-paola-og` | 1200×630 | 150 KB | Imagen social. Ella descentrada a la derecha, aire a la izquierda para el texto. |
| `ia-paola-hero-wide` | 2400×1350 | 300 KB | *Opcional.* Tres cuartos, mirando fuera de cuadro. |

> **Prompt base:** `[BLOQUE DE IDENTIDAD] · retrato editorial de medio cuerpo, luz dura
> lateral, fondo negro #0E0E0E, mirando directamente a cámara, expresión serena, grano
> fotográfico fino, 85mm, profundidad de campo media. Sin texto.`

### 4.2 Fondos de sección

Atmósfera, no ilustración. Van **detrás de texto**: contraste bajo y sin detalle en el
centro. Todos 2400×1600, WebP/AVIF.

| Sección | Capas | Peso total | Idea |
|---|---|---|---|
| `metricas` | 2 | 250 KB | Retícula de datos muy tenue, como un gráfico apagado |
| `servicios` | 1 | 180 KB | Textura de humo o niebla oscura muy sutil |
| `proceso` | 2 | 250 KB | Líneas de luz verticales, como una larga exposición |
| `testimonios` | 1 | 180 KB | Degradado atmosférico con grano, casi vacío |
| `contacto` | 1 | 180 KB | Un resplandor cálido muy bajo por un borde |

> **`#informe` NO lleva fondo.** Es deliberado: ver §5.

> **Prompt base:** `textura atmosférica abstracta, fondo negro #0E0E0E, [IDEA], muy bajo
> contraste, sin objetos reconocibles, sin caras, sin texto, centro despejado para poner
> texto encima, grano fotográfico sutil.`

### 4.3 Secuencias de scrollytelling

Frames numerados desde 1 con 4 dígitos: `public/img/seq/<nombre>/0001.avif`.
Además, **un frame fijo aparte** (`-still`), que es lo que se ve en móvil, con
reduced-motion y mientras carga la secuencia.

| Secuencia | Frames | Tamaño | Peso total | Movimiento |
|---|---|---|---|---|
| `seq/hero` | 48 | 1920×1080 | 1,8 MB | Cámara acercándose muy despacio a una textura oscura. Va **detrás** de las partículas WebGL |
| `seq/proyectos` | 36 | 1920×1080 | 1,2 MB | Desplazamiento lateral lento, acompaña la galería horizontal |
| `seq/sobre-mi` | 24 | 1200×1500 | 700 KB | Micro-movimiento del retrato: respiración, un mechón, cambio mínimo de luz |

Y sus frames fijos: `seq/hero-still` (**≤120 KB — es el elemento LCP del sitio, optimízalo
a muerte**), `seq/proyectos-still`, `seq/sobre-mi-still`.

> **Regla dura: una sola toma continua.** Nada de cortes ni cambios de plano. El visitante
> puede scrollear hacia atrás y un corte se lee como un fallo. El frame 48 debe poder
> seguir al 47 y al 1 sin que salte.

### 4.4 Creatividades de los 6 casos

Mockups del anuncio de cada caso, en el formato que indica su campo `adFormat`. 1600×1000,
máx. 200 KB cada una. Se declaran en `src/data/projects.js` con `image` e `imageAlt`.

| Caso | id | Formato |
|---|---|---|
| Atelier Nord | `atelier-nord` | Reels 9:16 |
| Flowstack | `flowstack` | Estático 4:5 |
| Masterclass Pro | `masterclass-pro` | Vídeo 1:1 |
| Casa Verde | `casa-verde` | Carrusel 1:1 |
| Zenfit | `zenfit` | Reels 9:16 |
| Glow Skin | `glow-skin` | Reels 9:16 |

> **Sin texto dentro de la imagen.** El chrome del anuncio (`PAOLA® · Patrocinado`, el
> badge de formato, el botón de CTA) ya lo pinta la web en HTML por encima. Si además lo
> metes en la imagen, sale duplicado.

---

## 5. Criterios de coherencia — lo que evita que quede un collage

1. **Nada de texto dentro de las imágenes.** El sitio es ES/EN: un texto quemado en un
   fondo no se puede traducir.
2. **Todo nace oscuro.** Se compone sobre `#0E0E0E` con la luz entrando de un lado. Nada de
   fondos claros que luego haya que apagar con un overlay: se nota siempre.
3. **El gradiente Meta es acento, nunca protagonista.** Como mucho un reflejo o una luz de
   borde. Una imagen entera violeta-naranja compite con la barra de probabilidad del
   informe, que es **la única aplicación del gradiente en todo el concepto**.
4. **Las secuencias, de una sola toma.** Ver §4.3.
5. **El grano lo pone el CSS.** El sitio ya aplica grano global al 5%. Genera las imágenes
   limpias o el grano se duplica y ensucia.
6. **Los fondos son atmósfera.** Tienen que poder llevar texto encima: bajo contraste, sin
   detalle en el centro, sin caras.
7. **Solo el retrato 4:5 mira a cámara.** El resto, tres cuartos o de perfil, para no
   competir con los titulares.
8. **`#informe` se queda sin imagen.** Es el clímax del sitio y su fuerza es la estética de
   terminal sobre negro. No le pongas fondo aunque parezca vacío: está vacío a propósito.

---

## 6. Cómo declarar lo que entregas

Todo en **`src/data/media.js`**, que tiene ejemplos comentados de cada tipo. Resumen:

```js
// Retrato
portraits.about = { src: 'ia-paola-retrato-4x5', alt: '…', placeholder: true }

// Fondo de sección
backdrops.metricas = {
  placeholder: true,
  layers: [{ src: 'bg-metricas-fondo', depth: 0.08, opacity: 0.45 }],
}

// Secuencia
sequences.hero = {
  placeholder: true,
  dir: 'seq/hero', frames: 48, ext: 'avif', still: 'seq/hero-still',
  start: 'top top', end: 'bottom top',
}
```

Y las creatividades, en `src/data/projects.js`, dentro del caso que toque:

```js
image: 'atelier-nord',
imageAlt: 'Creatividad de la campaña de Atelier Nord: …',
```

---

## 7. Guardas — leer antes de dar nada por terminado

Este sitio afirma cosas sobre sí mismo que tienen que ser verdad. Dos en concreto te
afectan:

**a) Los retratos son de una persona real.** Paola Parra existe. Estas imágenes son
**placeholders temporales** hasta que haya fotos y vídeo suyos de verdad. Por eso van con
prefijo `ia-` y con `placeholder: true`. **No se publica el sitio con retratos generados
por IA de ella presentados como fotografías suyas.**

**b) Los datos de los casos son datos de clientes.** Si generas cifras, audiencias o
presupuestos, son **propuestas de ejemplo**, no resultados reales. `BRIEFING.md` exige
permiso escrito del cliente para publicar cada backstage. Marca todo lo que inventes con
`_status: 'ia-propuesto'`.

**El mecanismo:** `npm run check:media` lista todo lo que sigue marcado como pendiente. El
checklist de lanzamiento (`tasks/26`) no se cierra mientras esa lista no esté vacía.

Es coherente con lo que el sitio dice de sí mismo: su argumento entero es *"sin humo"*, y
un portfolio que presenta KPIs inventados y fotos generadas como si fueran reales es
exactamente humo.

---

## 8. Comprobación final

```bash
npm run check:media   # existencia, pesos y lista de pendientes
npm run build         # tiene que seguir limpio
npm run preview       # revisión visual
```

Tres cosas que **no** deben cambiar por muchas imágenes que añadas:

- **El JS inicial sigue en ~70 KB gzip.** Ninguna imagen entra en el bundle.
- **Cero peticiones a terceros.** Todo se sirve desde `public/img/`. Si algo carga desde un
  CDN externo, la frase del informe *"nada de esto ha salido de tu navegador"* deja de ser
  cierta y hay que quitarlo (ver `PLAN.md` §11.9).
- **Sin saltos de layout.** Todas las superficies tienen su proporción reservada; si ves
  que algo se mueve al cargar una imagen, es un bug: repórtalo.
