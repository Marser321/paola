# Encargo — las 6 etapas del método de trabajo

Todo lo que hay debajo de la línea es **el mensaje que se le pasa al agente**. Está
escrito para que se pueda pegar entero sin editar nada.

Contexto para quien lo encarga, que NO va en el mensaje:

- La sección `#proceso` ya funciona. Hoy pinta un gradiente con el número de la etapa
  en grande, así que esto **no arregla nada roto**: mejora algo que ya está en pie.
- **Generar estas imágenes con IA no desbloquea la publicación.** `npm run check:media`
  sigue bloqueando mientras el material sea generado, y debe seguir haciéndolo. Cambiar
  un marcador por una imagen de IA cambia un placeholder por otro más bonito. Lo que
  levanta el bloqueo es material real, con autorización.
- La dirección de arte sale de `PROMPTS-TARJETAS-V2.md`, **con una corrección**: aquel
  prefijo pedía una luz de contra «violeta a naranja del espectro de Meta». Ese
  gradiente ya no es el acento del sitio — se replegó al informe y el acento pasó a ser
  el oro (`src/styles/tokens.css` §TEMA). El prefijo de aquí abajo lo refleja. Si se
  reutiliza el de V2 tal cual, estas seis desentonarán con el resto.

---

# MENSAJE PARA EL AGENTE — copiar desde aquí

Necesito seis imágenes para la sección «Método de trabajo» de un sitio web ya
construido, y que las dejes integradas. La sección funciona hoy con marcadores de
posición: tu trabajo es sustituirlos.

## Qué tienen que hacer estas seis imágenes

La sección enseña **una etapa cada vez** en un carrusel. La imagen no acompaña al
texto: es lo que hace entender de un vistazo en qué consiste ese paso. Y las seis,
puestas en fila, tienen que contar **un recorrido de diagnóstico a crecimiento** — no
seis fotos de oficina intercambiables.

Restricciones que vienen del diseño, no del gusto:

- **Formato 4:5 vertical.** Genera a `1024 × 1280` como mínimo; el pipeline reencuadra
  y baja a 840 × 1050.
- **Un solo sujeto claro.** Se ven a 416 px de ancho y **el 40 % inferior queda tapado
  por un velo oscuro con el texto encima**. Todo lo que importe va en los dos tercios
  superiores. Una escena con tres cosas no se lee a ese tamaño.
- **Nada de texto en la imagen.** El sitio superpone el número y el nombre de la etapa.
  Si la imagen trae letras, saldrán duplicadas y en un idioma que puede no ser el del
  visitante — el sitio es bilingüe.
- **Sin caras mirando a cámara.** Manos, perfil, torso, acción.

## Prefijo común — va delante de los seis prompts

```text
Premium editorial still for PAOLA, a performance-marketing specialist. Deep near-black #0E0E0E set with matte charcoal #161616 surfaces. One directional warm champagne-gold key light (#D4AF37 family) as the only colour accent; deep clean shadows, controlled highlights, no second colour. Photorealistic materials, crisp commercial lighting, sophisticated and credible rather than futuristic. One clear visual idea, asymmetrical composition, the subject held in the upper two thirds of the frame with calm empty space in the lower third. Vertical 4:5 format. No baked-in film grain.
```

## Sufijo negativo — va detrás de los seis prompts

```text
Negative: text, letters, words, numbers, logos, brand marks, watermarks, captions, readable dashboards, readable app interfaces, UI labels, floating icons, holograms, neon cyberpunk, blue corporate stock-photo lighting, generic smiling office team, face looking directly at camera, clutter, collage, split screen, white background, purple or magenta light, heavy grain, bloom, vignette, HDR, oversaturation, distorted hands, extra fingers.
```

## Los seis prompts

Cada uno se envía como `[PREFIJO] … [NEGATIVO]`.

### 01 · Auditoría — el diagnóstico

Archivo: `proceso-01-auditoria.png`

```text
A forensic examination of existing work before anything is touched. A pair of hands, seen from above and slightly to the side, holds a single matte-black printed sheet under a hard raking gold light that reveals its texture; a magnifier or loupe rests just beside it, unused, catching one bright edge. Other sheets lie stacked and out of focus in the shadowed lower area. The mood is quiet scrutiny, the moment before a diagnosis. Nothing on the sheet is legible.
```

Lo que tiene que leerse: *antes de tocar nada, mirar*.

### 02 · Estrategia — el plan

Archivo: `proceso-02-estrategia.png`

```text
A plan taking shape on a surface, not on a screen. Overhead three-quarter view of a dark desk where several blank matte cards are arranged into a deliberate branching structure, one card lifted slightly by a hand about to place it. Thin gold light rakes across the arrangement and picks out the gaps between cards. Deliberate, unfinished, mid-decision. No writing on any card.
```

Lo que tiene que leerse: *aquí todavía se decide, no se ejecuta*. Papel y no pantalla, a
propósito: es lo que la separa de la 04.

### 03 · Creatividades — la producción

Archivo: `proceso-03-creatividades.png`

```text
The most physical stage: making the ads. A close view of hands working inside a small tabletop shooting set — adjusting a product on a matte charcoal surface under a warm gold key light, with a phone on a low tripod framing it from just outside the composition. Fabric or a soft reflector catches light at the top edge. Craft in progress, warm and tactile, the feeling of a shoot rather than a studio portrait.
```

Lo que tiene que leerse: *aquí se fabrica*. Es la etapa que mejor admite manos dentro.

### 04 · Lanzamiento — publicar

Archivo: `proceso-04-lanzamiento.png`

```text
The instant before something goes live. A single hand poised over a dark control surface, fingers just above it, not yet touching; the surface is lit by one narrow gold band of light running across it. Everything else falls into deep shadow. Held tension, concentration, a threshold about to be crossed. No screens, no interfaces, no readable controls.
```

Lo que tiene que leerse: **tensión, no celebración.** Lo que se celebra viene en la 06,
y si esta imagen ya celebra, las dos se anulan.

### 05 · Optimización — la iteración

Archivo: `proceso-05-optimizacion.png`

```text
Weekly refinement, shown as repetition with one difference. A row of near-identical matte cards or blocks standing on a dark surface, evenly spaced and receding; a hand removes one from the middle of the row while a single card at the front is lit noticeably brighter by the gold key. The gap left behind is visible. Methodical, unglamorous, the discipline of pruning.
```

Lo que tiene que leerse: *se retira lo que no rinde y se refuerza lo que sí*. El hueco
que queda es la mitad del mensaje: sin él es una foto de objetos ordenados.

### 06 · Escala — el crecimiento

Archivo: `proceso-06-escala.png`

```text
The pay-off: the same system, larger. A wide dark space opening up, with warm gold light spilling from a single source and travelling further than in any of the previous images, catching several receding surfaces or planes that step upward and away. Air, depth and distance where the earlier stages were close and contained. Expansive but still restrained and dark, never bright or celebratory.
```

Lo que tiene que leerse: *a esto lleva todo lo anterior*. Es la única de las seis que
puede permitirse amplitud y aire; las cinco anteriores son cerradas a propósito, y ese
contraste es lo que hace que la serie cuente una progresión.

## Cómo integrarlas — esta parte también es tuya

1. **Deja los seis PNG** en `Selección/generated-proceso/`, con exactamente los nombres
   de arriba. Crea la carpeta si no existe.

2. **Ejecuta el pipeline**, que reencuadra a 4:5, baja a 840 × 1050 y escribe los
   `.avif` y `.webp` en `public/img/`:

   ```bash
   .venv/bin/python scripts/media/build-media.py proceso
   ```

   Si no hay entorno virtual todavía:

   ```bash
   python3 -m venv .venv && .venv/bin/pip install Pillow numpy
   ```

3. **Activa cada etapa** en `src/data/media.js`, en `export const process`: quítale
   `pendiente: true` a la etapa cuya foto ya esté en disco. Es el único cambio en
   código, y es borrar una línea por etapa. Puedes activarlas de una en una: las que
   sigan pendientes se siguen pintando con su marcador.

   **No toques `placeholder: true` del bloque `process`.** Marca que el material es
   generado y bloquea la publicación a propósito. Solo se retira con material real y
   autorización.

4. **Comprueba:**

   ```bash
   npm run check:media
   ```

   Tiene que decirte, por cada etapa, o que falta el archivo, o que existe y le sobra
   el `pendiente`. Vigila el presupuesto: **las seis juntas no pueden pasar de 620 KB**
   (`budgets.process`). Si se pasa, baja calidad antes que resolución.

5. **Míralo:** `npm run dev`, y baja hasta «Método de trabajo». Comprueba las tres
   cosas que se rompen sin querer:
   - que el sujeto no queda tapado por el velo del pie, que se come el 40 % inferior;
   - que las seis se ven de la misma familia al pasar de una a otra, no seis estilos;
   - **el tema claro**, con el conmutador del header. El sitio tiene dos y estas
     imágenes se ven en los dos.

## Lo que NO tienes que tocar

- `src/js/sections/process.js` ni `src/styles/process.css`. El carrusel ya funciona y
  detecta solo si hay foto o marcador.
- Los textos de las etapas. Viven en `src/i18n/es.js` y `src/i18n/en.js`, son bilingües
  y no cambian por esto.
- El `alt` de cada etapa en `media.js`: ya está escrito y describe **la etapa**, no la
  foto. Es lo que escucha quien navega con lector de pantalla, y no depende de qué
  imagen acabe entrando.
