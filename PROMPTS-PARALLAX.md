# Encargo — capas de parallax con alfa

Contexto para quien encarga, que **no** va en el mensaje al agente:

- El sistema ya funciona. El hero tiene hoy dos capas de resplandor (radiales por
  tokens, sin archivo) moviéndose a distinta velocidad. Esto **añade profundidad, no
  arregla nada roto**.
- **Una capa mal hecha se nota más que la ausencia de capa.** El riesgo real no es que
  la imagen sea fea: es que tenga un borde recto, un fondo casi negro en vez de
  transparente, o un halo gris alrededor del sujeto. Sobre un fondo `#0E0E0E` los tres
  fallos se ven como un parche pegado.
- **Con alfa el peso se dispara.** El presupuesto de todas las capas juntas son 700 KB
  (`budgets.parallax`) y la figura del hero, ella sola, ya gasta 320 KB de los suyos.
  Dos o tres capas bien hechas valen más que seis apretadas.
- Añadir una capa **no requiere tocar código**: se declara en
  `src/data/media.js` §CAPAS DE PARALLAX.

---

# MENSAJE PARA EL AGENTE — copiar desde aquí

Necesito capas de imagen **con transparencia real** para un efecto de parallax
multicapa, y que las dejes integradas. El sistema ya está montado: cada capa se
declara y se mueve sola a la velocidad que le toque.

## Qué es una capa aquí

Un plano que se desplaza con el scroll a distinta velocidad que los demás, dentro de
una sección. No es un fondo: es un **elemento suelto flotando en el aire** de la
escena. Humo, polvo en suspensión, una veladura, una forma que entra por un borde.

## Lo que NO puede pasar, y es lo que falla siempre

1. **Fondo transparente de verdad.** Canal alfa real, no un rectángulo con negro
   horneado. Estas capas se ven unas sobre otras, sobre un fondo `#0E0E0E`, y sobre
   las partículas WebGL del hero, que también son transparentes. Cualquier fondo opaco
   se ve como un parche recortado.
2. **Sin bordes rectos.** La capa tiene que morir en transparencia por los cuatro
   lados. Un borde recto delata el rectángulo y rompe la ilusión al instante.
3. **Sin halo.** Nada de aura gris o blanca alrededor del sujeto — es el residuo típico
   de recortar sobre fondo claro. Genera sobre fondo oscuro desde el principio.
4. **Sin texto, sin logos, sin caras.** El sitio superpone su propio texto, y es
   bilingüe.

## Dirección de arte

```text
Atmospheric overlay element for a premium editorial website with a near-black #0E0E0E background. Single isolated element on a fully transparent background, PNG with real alpha. Warm champagne-gold light (#D4AF37 family) as the only colour; no second hue. The element dissolves softly into full transparency on all four edges — no straight edges, no rectangular boundary, no visible cutout line, no grey or white halo. Photographic and physical rather than illustrated or vector. Subtle and restrained: this sits behind and in front of other content and must never compete with it.
```

Negativo:

```text
Negative: opaque background, black background, white background, checkerboard, rectangular frame, hard edges, cutout outline, grey halo, white fringe, text, letters, logos, watermarks, faces, people, UI, icons, blue or purple light, neon, heavy grain, oversaturation.
```

## Las capas a generar

Empieza por estas tres. Son las que más rinden y las que menos riesgo tienen.

### `hero-capa-polvo` — plano delantero del hero

```text
[PREFIJO] Fine airborne dust and micro-particles suspended in a warm gold shaft of light, drifting diagonally across the frame. Very sparse and delicate, mostly empty space, individual specks catching the light. Dissolves completely into transparency toward every edge. [NEGATIVO]
```

Va delante de la figura y por detrás del texto (`plane: 'front'`). Tiene que ser **muy
tenue**: pasa por encima de una persona y si pesa, la ensucia.

### `hero-capa-bruma` — plano trasero del hero

```text
[PREFIJO] A soft slow-moving veil of warm haze, like light catching mist in a dark room. Broad, formless, extremely low contrast, no defined shape or silhouette. Fades to nothing at all four edges. [NEGATIVO]
```

Va detrás de todo (`plane: 'back'`), como profundidad atmosférica.

### `hero-capa-destello` — acento de luz

```text
[PREFIJO] A single soft anamorphic light bloom in warm gold, an elongated horizontal flare with a gentle falloff, positioned off-centre. Nothing else in the frame. Complete transparency everywhere else. [NEGATIVO]
```

Va en `plane: 'mid'`, a la altura de la figura, para que la luz parezca de la escena.

## Formato

- **PNG con alfa**, `2000 × 1400` o más. Se reencuadra y se baja después.
- Composición **apaisada**: la capa cubre el ancho de la sección.
- Lo importante, en el **centro vertical**: la capa se desplaza al hacer scroll y sus
  extremos se salen de cuadro a propósito.

## Cómo integrarlas — esta parte también es tuya

1. Deja los PNG en `public/img/` convertidos a **`.avif` y `.webp`, los dos con alfa**.
   Si usas `cwebp`/`avifenc`, no aplanes el canal alfa.

2. Declara cada capa en `src/data/media.js`, dentro de `parallax.hero.layers`. La
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

3. Comprueba:

   ```bash
   npm run check:media
   ```

   Te dirá si falta un formato y si te has pasado de los **700 KB** que suman todas las
   capas. Si te pasas, quita una capa antes que bajar la calidad de todas.

4. Míralo con `npm run dev`. Las cuatro cosas que se rompen sin querer:
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
