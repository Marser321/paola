# Encargo — capas de parallax con alfa

Contexto para quien encarga, que **no** va en el mensaje al agente:

- El sistema ya funciona. El hero tiene hoy dos capas de resplandor (radiales por
  tokens, sin archivo) moviéndose a distinta velocidad. Esto **añade profundidad, no
  arregla nada roto**.
- **Una capa mal hecha se nota más que la ausencia de capa.** El riesgo real no es que
  la imagen sea fea: es que tenga un borde recto o un fondo que no sea negro puro.
  Sobre `#0E0E0E` los dos fallos se ven como un parche pegado.
- **El flujo no es el que parece.** No se piden imágenes con transparencia: se piden
  sobre negro puro y el alfa lo saca el pipeline de la luminancia. El §«NO PIDAS FONDO
  TRANSPARENTE» de abajo lo explica, y es lo que decide si esto sale bien.
- **Con alfa el peso se dispara.** El presupuesto de todas las capas juntas son 700 KB
  (`budgets.parallax`) y la figura del hero, ella sola, ya gasta 320 KB de los suyos.
  Dos o tres capas bien hechas valen más que seis apretadas.
- Añadir una capa **no requiere tocar código**: se declara en
  `src/data/media.js` §CAPAS DE PARALLAX.

---

# MENSAJE PARA EL AGENTE — copiar desde aquí

Necesito capas de imagen para un efecto de parallax multicapa, y que las dejes
integradas. El sistema ya está montado: cada capa se declara y se mueve sola a la
velocidad que le toque. Lee entero el apartado sobre el fondo negro antes de generar
nada — el flujo no es el que esperarías.

## Qué es una capa aquí

Un plano que se desplaza con el scroll a distinta velocidad que los demás, dentro de
una sección. No es un fondo: es un **elemento suelto flotando en el aire** de la
escena. Humo, polvo en suspensión, una veladura, una forma que entra por un borde.

## ⚠ NO PIDAS FONDO TRANSPARENTE. Genera sobre NEGRO PURO.

Es lo contrario de lo que parece, y es lo que decide si esto sale bien.

Casi ningún generador de imágenes devuelve canal alfa de verdad: DALL·E, Midjourney y
la mayoría escupen PNG opaco. Pedirles «transparent background» suele dar un **fondo a
cuadros dibujado**, que es peor que el negro porque hay que borrarlo a mano.

Estas capas concretas tienen una salida limpia porque son **luz sobre negro** — polvo,
bruma, un destello: todo lo que importa es más claro que el fondo. Así que se generan
sobre **negro puro** y el alfa se calcula de la luminancia. En un recorte de sujeto eso
dejaría el halo gris de siempre; aquí no puede haberlo, porque no hay borde que
decidir: la transición a transparente es la misma que la del elemento a negro, que es
continua.

Lo hace `scripts/media/build-media.py parallax`, y de paso deshace la
premultiplicación contra el negro — sin eso las capas salen lavadas sobre el papel
crema del tema claro. Comprobado: alfa 0–255 y el oro recuperado en `#D4AF37`.

**Esto solo vale para elementos aditivos** (luz, humo iluminado, partículas). Un sujeto
opaco recortado necesita alfa de verdad, que es otro problema — ver `build_figura()`.

## Lo que NO puede pasar

1. **Fondo negro puro y uniforme.** Ni degradado de fondo, ni viñeta, ni «casi negro»:
   lo que no sea el elemento tiene que ser `#000000`, porque es lo que se convierte en
   transparente.
2. **Sin bordes rectos.** El elemento tiene que morir en negro por los cuatro lados. Si
   toca un borde del encuadre, ahí quedará un canto recto y se verá el rectángulo.
3. **Un solo elemento.** Nada de composiciones: la capa es una cosa flotando.
4. **Sin texto, sin logos, sin caras.** El sitio superpone su propio texto, y es
   bilingüe.

## Dirección de arte — prefijo común

```text
Atmospheric light element photographed against a pure solid black #000000 background, nothing else in frame. Warm champagne-gold light (#D4AF37 family) as the only colour; no second hue, no colour cast in the background. The element floats freely and falls off smoothly into pure black on all four sides, never touching or crossing the edge of the frame. Photographic and physical rather than illustrated or vector, like a real lighting effect captured in a dark studio. Subtle and restrained. Wide landscape framing, the element centred vertically.
```

## Sufijo negativo común

```text
Negative: transparent background, checkerboard, alpha channel, white background, grey background, background gradient, vignette, coloured backdrop, rectangular frame, hard edges, element touching frame edge, visible border, text, letters, logos, watermarks, faces, people, hands, UI, icons, blue light, purple light, magenta, neon, cyberpunk, lens dirt, heavy grain, oversaturation, multiple separate elements, collage.
```

## Las capas a generar

Empieza por estas tres: son las que más rinden y las que menos riesgo tienen. Los tres
prompts van **completos y expandidos** —prefijo y negativo ya incorporados—, así que se
copian y se pegan tal cual sin sustituir nada.

### `hero-capa-polvo` — plano delantero (`plane: 'front'`, `depth: 0.34`)

```text
Atmospheric light element photographed against a pure solid black #000000 background, nothing else in frame. Warm champagne-gold light (#D4AF37 family) as the only colour; no second hue, no colour cast in the background. The element floats freely and falls off smoothly into pure black on all four sides, never touching or crossing the edge of the frame. Photographic and physical rather than illustrated or vector, like a real lighting effect captured in a dark studio. Subtle and restrained. Wide landscape framing, the element centred vertically. Fine airborne dust and micro-particles suspended in a diagonal shaft of warm gold light, drifting across the middle of the frame. Very sparse and delicate, mostly empty black space, individual specks catching the light at different depths of focus. Negative: transparent background, checkerboard, alpha channel, white background, grey background, background gradient, vignette, coloured backdrop, rectangular frame, hard edges, element touching frame edge, visible border, text, letters, logos, watermarks, faces, people, hands, UI, icons, blue light, purple light, magenta, neon, cyberpunk, lens dirt, heavy grain, oversaturation, multiple separate elements, collage.
```

Pasa **por delante de la figura**. Tiene que ser muy tenue: va sobre una persona y si
pesa, la ensucia. Baja su `opacity` en el manifiesto antes que regenerarla.

### `hero-capa-bruma` — plano trasero (`plane: 'back'`, `depth: 0.08`)

```text
Atmospheric light element photographed against a pure solid black #000000 background, nothing else in frame. Warm champagne-gold light (#D4AF37 family) as the only colour; no second hue, no colour cast in the background. The element floats freely and falls off smoothly into pure black on all four sides, never touching or crossing the edge of the frame. Photographic and physical rather than illustrated or vector, like a real lighting effect captured in a dark studio. Subtle and restrained. Wide landscape framing, the element centred vertically. A soft broad veil of warm haze, like light catching mist in a dark room. Formless and extremely low in contrast, no defined shape or silhouette, no visible source. It thins out to nothing well before reaching any edge of the frame. Negative: transparent background, checkerboard, alpha channel, white background, grey background, background gradient, vignette, coloured backdrop, rectangular frame, hard edges, element touching frame edge, visible border, text, letters, logos, watermarks, faces, people, hands, UI, icons, blue light, purple light, magenta, neon, cyberpunk, lens dirt, heavy grain, oversaturation, multiple separate elements, collage.
```

Va detrás de todo, como profundidad atmosférica. Es la más segura de las tres: si sale
regular casi no se nota.

### `hero-capa-destello` — acento de luz (`plane: 'mid'`, `depth: 0.18`)

```text
Atmospheric light element photographed against a pure solid black #000000 background, nothing else in frame. Warm champagne-gold light (#D4AF37 family) as the only colour; no second hue, no colour cast in the background. The element floats freely and falls off smoothly into pure black on all four sides, never touching or crossing the edge of the frame. Photographic and physical rather than illustrated or vector, like a real lighting effect captured in a dark studio. Subtle and restrained. Wide landscape framing, the element centred vertically. A single soft anamorphic light bloom: one elongated horizontal flare with a long gentle falloff along its axis, positioned off-centre toward one side of the frame. Nothing else anywhere in the image. Negative: transparent background, checkerboard, alpha channel, white background, grey background, background gradient, vignette, coloured backdrop, rectangular frame, hard edges, element touching frame edge, visible border, text, letters, logos, watermarks, faces, people, hands, UI, icons, blue light, purple light, magenta, neon, cyberpunk, lens dirt, heavy grain, oversaturation, multiple separate elements, collage.
```

Va a la altura de la figura, para que la luz parezca de la escena y no pegada encima.

## Formato de salida del generador

- **PNG**, `2000 × 1400` o más, **apaisado**. No hace falta que tenga alfa: el pipeline
  lo saca. Lo que sí hace falta es que el fondo sea negro puro.
- Lo importante, en el **centro vertical**: la capa se desplaza al hacer scroll y sus
  extremos se salen de cuadro a propósito.
- Si el generador ofrece «fondo transparente», **desactívalo**.

## Cómo integrarlas — esta parte también es tuya

1. Deja los PNG **tal cual salen del generador** (fondo negro, sin alfa) en
   `Selección/generated-parallax/`, con el nombre de cada capa. Crea la carpeta si no
   existe.

2. Ejecuta el pipeline, que saca el alfa de la luminancia, deshace la
   premultiplicación, baja a 2000px de ancho y escribe `.avif` y `.webp` con alfa:

   ```bash
   .venv/bin/python scripts/media/build-media.py parallax
   ```

   Si no hay entorno virtual: `python3 -m venv .venv && .venv/bin/pip install Pillow numpy`

3. Declara cada capa en `src/data/media.js`, dentro de `parallax.hero.layers`. La
   plantilla está ahí comentada. Ejemplo:

   ```js
   {
     id: 'polvo-frontal',
     src: 'hero-capa-polvo',
     alt: '',              // decorativa: vacío, pero PRESENTE
     depth: 0.34,
     plane: 'front',
     opacity: [0.5, 0.32], // [oscuro, claro]
   }
   ```

   `depth` va de 0 a 0.5 y es **cuánto se queda atrás**: cuanto más cerca esté la capa
   del espectador, más alto. Las del fondo van bajas (0.05–0.12), las delanteras altas
   (0.25–0.4). El módulo recorta en 0.5.

   `plane` es `'back'`, `'mid'` o `'front'`. El texto del hero está siempre por encima
   de los tres.

4. Comprueba:

   ```bash
   npm run check:media
   ```

   Te dirá si falta un formato y si te has pasado de los **700 KB** que suman todas las
   capas. Si te pasas, quita una capa antes que bajar la calidad de todas.

5. Míralo con `npm run dev`. Las cuatro cosas que se rompen sin querer:
   - **el borde de la capa**: haz scroll despacio por el hero y comprueba que en ningún
     momento asoma un canto recto;
   - **el tema claro**, con el conmutador del header. Una capa calibrada solo en oscuro
     se ve como una mancha sucia sobre el papel crema — para eso está el par
     `opacity: [oscuro, claro]`;
   - **móvil**, donde el recorrido es la mitad y las capas se cruzan antes;
   - que el **nombre del hero sigue legible** con las capas encima.

## Para otras secciones

El mismo sistema vale para cualquier sección de `index.html`: se añade su id a
`parallax` en el manifiesto. Pero antes de hacerlo, ten en cuenta que las secciones que
no son el hero **ya tienen** una capa de fondo fotográfica con parallax propio
(`backdrops` en el mismo archivo). Añadir capas ahí es apilar un tercer plano sobre dos
que ya se mueven: hazlo de una en una y con `depth` bajo, o la sección se convierte en
un acuario.

## Lo que NO tienes que tocar

- `src/js/fx/parallax.js` ni `src/styles/parallax.css`. El sistema ya funciona; las
  capas son datos.
- El z-index del hero. Está repartido y documentado en `parallax.css`.


---

## Estado a 2026-08-16 — qué capas hay y cuáles faltan

| Sección | Capa | Tipo |
|---|---|---|
| `#hero` | bruma · destello · polvo | imagen con alfa |
| `#proceso` | haz | imagen con alfa |
| `#metricas` · `#sobre-mi` · `#testimonios` · `#contacto` | resplandor | **`glow`** (radial por tokens, cero KB) |
| `#servicios` | — | ninguna |
| `#proyectos` | — | ninguna, y a propósito |

**El humo de `#servicios` se retiró.** No gustaba y no aportaba: iba por debajo del plato
fotográfico y a una velocidad casi idéntica a la suya (0,05 contra 0,08), así que lo
único que se percibía era una neblina sucia. Su PNG sigue en
`Selección/generated-parallax/servicios-capa-humo.png`; los archivos servidos se
borraron. **Antes de recuperarla hay que resolver lo que fallaba, que era la velocidad,
no la imagen.**

**Los cuatro resplandores son un sustituto declarado.** Dan profundidad sin esperar a
ninguna imagen, pero una capa de foto con alfa real es mejor: tiene textura y dirección.
Estas cuatro son las que faltan por encargar, y sustituirlas es cambiar el `glow` por un
`src` en el manifiesto — no se toca código:

| Sección | Qué tiene que contar la capa | `plane` / `depth` |
|---|---|---|
| `#metricas` | Luz de pantalla derramada desde la derecha, del lado de los monitores de la foto | `back` / 0,04 |
| `#sobre-mi` | Aire alrededor del retrato: la única sección sin plato, la más plana del sitio | `back` / 0,06 |
| `#testimonios` | Luz de ventana baja y cálida, del registro conversado de la foto del sillón | `back` / 0,04 |
| `#contacto` | Lo más tenue de las cuatro: el CTA es tipografía enorme y centrada y no admite competencia detrás | `back` / 0,03 |

Las cuatro con **alfa real** y muriendo hacia el lado del texto, como las del hero, y con
las opacidades del manifiesto como techo: están medidas, no elegidas.
