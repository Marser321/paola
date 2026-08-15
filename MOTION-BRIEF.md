# MOTION-BRIEF — animación de las imágenes

Compañero de `MEDIA-BRIEF.md`. Aquel dice **qué imagen** hace falta; este dice
**qué se mueve dentro de ella**.

Estado a 2026-08-15: el sitio tiene las siete imágenes fijas montadas y ninguna
secuencia animada. Este documento es el encargo de esas secuencias. Cada bloque
trae el prompt literal para pasárselo a un generador de vídeo a partir de imagen
(Runway, Kling, Luma, Sora — el que sea), y las condiciones técnicas para que lo
que salga se pueda montar sin tocar el código del sitio.

---

## 0. Reglas que valen para todas

Antes que los prompts, porque son las que hacen que las siete piezas parezcan del
mismo sitio y no siete encargos sueltos.

1. **La cámara casi no se mueve.** Nada de órbitas, dollies ni zooms dramáticos.
   El listón es un *cinemagraph*: la foto sigue siendo la foto y solo respira. Si
   alguien se da cuenta de que hay un vídeo, se ha pasado.
2. **Sin corte y en bucle.** El último frame tiene que enganchar con el primero.
   Se pide siempre "seamless loop" y se comprueba a ojo, que ningún generador lo
   garantiza.
3. **Duración 3-5 s a 24 fps.** Es la ventana en la que el scroll pasa por una
   sección. Más largo, nadie lo ve entero; más corto, se nota el bucle.
4. **La luz no cambia de color.** El grado del sitio es ámbar y negro. Cualquier
   deriva a azul, verde o malva rompe la paleta — y el malva especialmente: se
   sacó a mano de estas mismas fotos (`kill_violet` en
   `scripts/media/build-media.py`) y no puede volver por la puerta de atrás.
5. **La cara no se genera.** Parpadeos y micro-gestos son donde estos modelos
   destrozan el parecido. Donde Paola mira a cámara, se pide expresamente que la
   cara quede quieta y se anime todo lo demás.
6. **Negative prompt común**, a pegar en las siete:
   > morphing face, distorted hands, extra fingers, warping jewelry, changing
   > outfit, text, watermark, camera shake, fast motion, zoom, color shift,
   > purple or blue light, oversaturated, plastic skin

---

## 1. HERO — la figura recortada  ★ prioridad

**Origen:** `Selección/ChatGPT Image 15 ago 2026, 18_47_04 (6).png`
**Montado hoy como:** `public/img/paola-figura.{avif,webp}` (recorte con alfa
real, `media.js › figure`)

Es la que más rinde: está en el primer pantallazo y ya está aislada del fondo, así
que lo que se anime no arrastra escenario.

> Cinemagraph of a woman in a black blazer and gold satin top standing and
> looking at the camera, isolated on a transparent background. Only these move:
> her hair sways very slightly as if from a soft air current, the satin top
> catches a slow travelling highlight, and her chest rises and falls with calm
> breathing. Her face, eyes and mouth stay completely still. Locked-off camera,
> no zoom, no parallax. Warm amber key light from the right, unchanged
> throughout. 4 seconds, seamless loop, 24 fps.

**Entrega:** 48 frames PNG con **alfa**, 1180 px de alto, en `public/img/seq/hero/0001.png`…
Si el generador no da alfa, entregar sobre verde plano y volver a pasar por
`scripts/media/cutout.swift`, que es lo mismo que se hizo con la fija.
**Presupuesto:** 1800 KB la secuencia entera (`budgets['seq/hero']`).

---

## 2. SOBRE MÍ — el retrato 4:5

**Origen:** `Selección/ChatGPT Image 15 ago 2026, 18_45_32 (7).png`
**Montado hoy como:** `public/img/paola-retrato-4x5.{avif,webp}`

Aquí el riesgo es máximo porque es un primer plano: cualquier deformación de la
cara se ve entera. El movimiento va en el pelo y en la luz, nunca en los rasgos.

> Cinemagraph portrait of a woman resting her cheek on her hand, looking at the
> camera. Only the amber rim light on the right side breathes gently brighter and
> softer, and a few strands of hair drift as if from a very light breeze. Face,
> eyes, mouth, hand and jewelry remain perfectly still — no blinking. Locked-off
> camera. Dark neutral background, warm amber light on the right, cool neutral
> fill on the left. 4 seconds, seamless loop, 24 fps.

**Entrega:** 36 frames, 1000×1250.
**Nota:** si el parpadeo sale bien de verdad, uno solo cada ~3 s da mucha vida.
Pero se pide aparte y se compara: es la diferencia entre un retrato vivo y un
retrato roto.

---

## 3-7. FONDOS DE SECCIÓN

Los cinco son banda ancha 16:7 u 16:8, van al 22-42 % de opacidad y detrás del
texto. **Eso cambia el listón: aquí el movimiento tiene que ser casi
subliminal**, porque compite con la lectura. Un fondo animado que se nota es un
fondo que estorba. Si hay dudas, menos.

### 3. `bg-metricas` — Resultados
Origen: `Nueva carpeta/…19_02_01 (4).png` · escritorio con monitores de gráficas.

> Cinemagraph of a woman at a dark wooden desk with two monitors showing
> analytics dashboards. The only motion: the charts on the screens update with
> subtle rising bars and a slow line crawl, and the candle flames on the right
> shelf flicker. The woman stays completely still. Locked-off camera, warm amber
> practical lights, dark background. 5 seconds, seamless loop, 24 fps.

Que los datos de pantalla suban es el único guiño literal que se permite el
sitio, y encaja con la sección. Que no se lea ninguna cifra concreta.

### 4. `bg-servicios` — Lo que hago
Origen: `Nueva carpeta/…19_02_00 (1).png` · escribiendo en la tablet.

> Cinemagraph of a woman writing on a tablet with a stylus at a dark desk. Only
> her writing hand moves, in a slow small continuous stroke; the plant leaves
> behind her drift a few millimetres. Head and face stay still. Locked-off
> camera, warm amber shelf lighting. 5 seconds, seamless loop, 24 fps.

### 5. `bg-proceso` — Método de trabajo
Origen: `Nueva carpeta/…19_02_01 (6).png` · pasillo.

La única del set con dirección de marcha, y la sección va de un recorrido: es
donde más sentido tiene animar.

> Cinemagraph of a woman walking slowly toward the camera down a dark luxury
> corridor with vertical warm light strips. She takes one unhurried step; her
> blazer and hair move with it. The corridor lights glow steadily. Very slight
> forward drift of the camera, almost imperceptible. 5 seconds, seamless loop,
> 24 fps.

Es la única a la que se le permite un empuje de cámara, y aun así mínimo.

### 6. `bg-testimonios` — Prueba social
Origen: `Nueva carpeta/…19_02_01 (5).png` · sillón con taza.

Va al 26 % y encima llevará las tarjetas: prácticamente solo se ve el ambiente.

> Cinemagraph of a woman sitting in a leather armchair holding a dark mug. Only
> the steam from the mug rises softly and the plant leaves on the right sway
> slightly. She stays completely still. Locked-off camera, warm dim interior.
> 4 seconds, seamless loop, 24 fps.

### 7. `bg-contacto` — Contacto
Origen: `Nueva carpeta/…19_02_02 (9).png` · ventana con skyline.

> Cinemagraph of a woman sitting by a floor-to-ceiling window reading a tablet,
> city skyline behind her. Only the city moves: distant window lights twinkle
> faintly and clouds drift very slowly. Her figure and the interior stay still.
> Locked-off camera, cool daylight outside, warm lamp inside. 5 seconds, seamless
> loop, 24 fps.

Ojo con la luz fría del exterior: es la única foto del set con azul, y en el
grado se le bajó (`warm_grade`). El vídeo tiene que salir ya con ese grado o
volver a pasarse por el script.

---

## Cómo se monta lo que salga

El sitio **ya sabe reproducir secuencias**: `src/js/sections/sequence.js` pinta
frames en un canvas 2D atado al scroll, y está esperando declaraciones en
`media.js › sequences`, que hoy están comentadas. No hay que escribir código.

1. Dejar los frames en `public/img/seq/<nombre>/0001.avif`… numerados desde 1 con
   cuatro dígitos.
2. Exportar además un `still`: el frame fijo que se ve **en móvil y con
   reduced-motion**, y que es el que cuenta para el LCP. Optimizarlo a fondo.
3. Descomentar y ajustar el bloque en `media.js › sequences`.
4. `npm run check:media` — comprueba que el número de frames coincide con lo
   declarado y que nadie se pasa de presupuesto.

Dos cosas que NO se negocian:

- **`prefers-reduced-motion` manda.** Con movimiento reducido no se reproduce
  nada: se queda el `still`. Ya está resuelto en `sequence.js`, pero si se anima
  algo por CSS por su cuenta, hay que respetarlo igual.
- **En móvil no se descargan secuencias.** El presupuesto de la ruta crítica es
  el que es. También está resuelto, y no se sube.
