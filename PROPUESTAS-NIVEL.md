# PROPUESTAS-NIVEL.md — qué queda para subir el sitio de nivel

> Escrito el 2026-08-16, después de la pulida que retiró el concepto «la campaña eres
> tú», reconstruyó el método de trabajo y añadió el bloque de venta.
>
> El encargo era: **detectar qué otras secciones, botones, tarjetas o textos pueden
> subir el nivel del sitio.** Esto es esa lista, ordenada por lo que más mueve la aguja
> con menos riesgo. Cada propuesta dice qué aporta, dónde va, qué patrón YA EXISTENTE
> reutiliza y qué haría falta producir.
>
> Regla que atraviesa toda la lista: **este sitio gana por ser concreto, no por tener
> más cosas.** Todo lo que se añada tiene que aportar una prueba, quitar una duda o
> facilitar el siguiente paso. Lo que solo decore, sobra — acabamos de quitar 1.200
> líneas de exactamente eso.

---

## Bloque A — Lo que falta para que el sitio pueda publicarse

No son mejoras: son huecos. Van antes que todo lo demás.

### A1. Contenido real (el bloqueante de verdad)

Hoy los seis casos, los cuatro KPIs, los tres testimonios y el CV son **placeholders
profesionales**. Están tan bien escritos que se leen como reales, y ese es justamente el
riesgo: se puede publicar sin darse cuenta.

- Qué hace falta: `BRIEFING.md` es el formulario, campo a campo, y ya está montado.
- ⚠ **Backstage y testimonios necesitan permiso escrito del cliente** (`BRIEFING.md` §4
  y §6). Sin permiso, ese caso se publica sin backstage — no se inventa.
- Coste: cero de código. Se editan `src/data/projects.js` y los diccionarios.

### A2. Las 15 muestras de servicio y las 6 fotos de proceso siguen siendo IA

`npm run check:media` lo dice en cada ejecución y **no debe publicarse mientras lo diga**.
La galería elástica de servicios es de las mejores piezas del sitio y hoy enseña material
generado.

### A3. Dominio, OG y enlaces sociales

`og:url`, `og:image` y el JSON-LD apuntan a `paola-ads.com`, que es provisional; los tres
enlaces sociales del pie son `href="#"`. Un enlace que no lleva a ninguna parte en el pie
de una web de servicios es de las pocas cosas que se leen como descuido a la primera.

---

## Bloque B — Secciones nuevas que faltan (por orden de impacto)

### B1. «Cómo es trabajar conmigo» — la semana tipo · ⭐ la que más falta

**Qué aporta:** el sitio explica el método (`#proceso`) y los formatos (`#planes`), pero
no **la experiencia**: cuándo escribes, quién responde, qué llega el lunes, qué pasa si
algo se rompe un viernes. Es la duda que queda justo antes de escribir, y ninguna sección
la toca.

**Dónde:** entre `#planes` y `#calculadora`.

**Forma:** cinco renglones tipo agenda —`LUN` `MIÉ` `VIE` `MENSUAL` `SIEMPRE`— con lo que
ocurre en cada uno. Reutiliza el patrón de renglón + acordeón de `#servicios`
(`ui/collapse.js` ya es compartido).

**Coste:** medio. Copy nuevo + una hoja pequeña. Cero assets.

### B2. Un caso de estudio de verdad, en profundidad

`caso.html` ya existe y funciona (una plantilla + query string), pero se alimenta de los
mismos datos que la tarjeta. Un solo caso contado largo —el problema, lo que se probó, lo
que **no** funcionó y por qué— vale más que los seis en versión corta.

**Dónde:** `src/data/projects.js` §`caseStudy` ya tiene el hueco: `challenge`, `approach`,
`outcome`, `quote`. Está montado y sin usar a fondo.

**Coste:** bajo en código, alto en escritura. Es una tarde de la clienta.

### B3. «Lo que no hago» / criterios de encaje

**Qué aporta:** credibilidad, que es la moneda del sitio. Una lista corta y honesta —no
gestiono cuentas por debajo de X, no trabajo con sectores Y, no hago SEO— filtra los
malos encajes y hace creíble todo lo demás. La FAQ ya apunta a esto en dos respuestas;
esto lo dice de frente.

**Dónde:** dentro de `#faq`, como bloque final, o pegado a `#planes`.

**Coste:** bajo. Solo copy.

### B4. Newsletter / «una lección por semana»

**Qué aporta:** captura al 95% que no está listo para contratar hoy. Es el único
mecanismo de la lista que trabaja cuando la visita no convierte.

**⚠ Con una condición:** el sitio presume, con razón, de no hacer **una sola petición a
un servidor ajeno** (`legal/cookies.html` lo afirma por escrito). Un formulario de
Mailchimp o similar rompe esa frase. O se usa el mismo Netlify Forms que el contacto, o
hay que corregir el texto legal. **Las dos cosas no pueden ser verdad a la vez.**

**Coste:** bajo si va por Netlify Forms.

---

## Bloque C — Tarjetas y componentes

### C1. Logos de clientes (marquee de confianza)

El sitio ya tiene dos marquesinas y el mecanismo (`sections/marquee.js`). Una tercera con
seis logotipos reales, justo debajo del hero, da prueba social **antes** de pedir nada.
Necesita permiso de marca — y sin logos reales, no se pone: seis rectángulos grises son
peores que nada.

### C2. La tarjeta de proyecto puede decir el **antes → después**

Los datos ya existen (`beforeAfter` en `projects.js`) y hoy solo se ven dentro del
backstage, que hay que abrir. `ROAS 2.1x → 5.8x` en la propia tarjeta es la cifra más
persuasiva del sitio escondida detrás de un clic.

**Coste: mínimo.** Es una línea en la plantilla de `sections/projects.js`.

### C3. Una barra de acción fija en móvil

Debajo de 768px, el CTA de contacto queda a un scroll de 16.000px. Una barra inferior
discreta con «Escríbeme» que aparezca pasado el hero es el cambio con mejor relación
esfuerzo/conversión de toda la lista.

**⚠ Cuidado:** el HUD vivía anclado abajo a la derecha y se retiró en parte por competir
con el pulgar. Esta barra tiene que ser **una sola cosa**, opaca y con su zona de
pulsación de 44px.

### C4. Estado de disponibilidad

`Acepto 2 proyectos para octubre` en el header o junto al CTA. Escasez real, verificable
y editable en un dato. Si deja de ser cierto, hay que quitarlo — una escasez falsa se
detecta a la primera y se lleva por delante todo lo demás.

---

## Bloque D — Texto y detalle fino

### D1. Los microtextos del formulario no están traducidos

`Nombre`, `Email`, `Cuéntame el proyecto`, `Enviar mensaje` y el nuevo `Qué te interesa`
están en español en el HTML y **no pasan por el diccionario**: en inglés, el formulario
entero se queda en español. Es el hueco de i18n más visible que queda.

### D2. El `<h1>` del hero es un nombre, no una promesa

`PAOLA PARRA` es hermoso tipográficamente y **es lo que menos vende de la página**: quien
llega desde LinkedIn no busca un nombre, busca saber si le resuelves el problema. La
promesa está en el subtítulo, en cuerpo pequeño.

No propongo tocar el hero —es la firma visual del sitio y funciona—, pero sí probarlo: el
test A/B del subtítulo ya existe y hoy no lo mide nadie (ver D3).

### D3. El test A/B del hero ya no mide nada

Al retirar el informe, el reparto 50/50 del subtítulo se quedó sin lector. O se conecta a
una analítica de verdad (con su aviso legal correspondiente) o se elige la mejor variante
y se borra el módulo. **Lo que no puede quedarse es un test que nadie lee.**

### D4. Alt de las creatividades

Los seis `imageAlt` describen la imagen genérica. Cuando lleguen las creatividades reales
tienen que describir **esa** pieza: es lo único que lee un buscador de la parte más
visual del sitio.

---

## Bloque E — Rendimiento y riesgo técnico

### E1. `three` pesa 725 KB (185 gzip)

Se carga en diferido y no entra en el arranque, así que el presupuesto se cumple. Pero es
**el 80% del JS del sitio** y alimenta dos piezas decorativas: las partículas del hero y
la galería 3D. Merece una medición honesta en móvil de gama media antes de publicar; si
la galería 3D no aporta lo que cuesta, quitarla libera más que cualquier otra
optimización posible.

### E2. La galería 3D no tiene equivalente accesible

Es `aria-hidden` y decorativa, lo cual es correcto. Pero ocupa una pantalla entera de
scroll en la sección más importante del sitio, y quien navega con lector de pantalla o
con reduced-motion salta directamente de la cabecera a las tarjetas. No es un fallo de
conformidad; es una asimetría que conviene decidir a conciencia.

### E3. Deep-linking con `#seccion` y scroll suave — ✅ ARREGLADO el 2026-08-16

Entrar directamente a `sitio.com/#proceso` dejaba a Lenis con su posición interna a cero
mientras el documento estaba a 7.600px: el pin horizontal de `#proyectos` se quedaba
enganchado tapando la pantalla —se veía como una página en negro— hasta que alguien hacía
scroll a mano. Lo disparaba **cualquier enlace compartido a una sección**.

Arreglado en `src/js/core/lenis.js`: el arranque es siempre el mismo (restauración de
scroll desactivada + vuelta a arriba) y, si había ancla, se salta a ella cuando el sitio
ya está montado y medido, escuchando el `app:ready` del preloader. Comprobado con
`#proyectos`, que es el caso peor por llevar el pin.

---

## Lo que NO recomiendo añadir

Por si vuelve la tentación:

- **Un chat / widget flotante.** Rompe la promesa de cero peticiones a terceros y compite
  con el único CTA.
- **Un banner de cookies.** No hay cookies. Pedir permiso para algo que no ocurre es,
  además de molesto, falso — y ya está explicado así en `legal/cookies.html`.
- **Contadores animados en más sitios.** Ya están en `#metricas` y en la calculadora.
  Un tercero los convierte en un tic.
- **Más gradientes de color.** El sistema es un oro sobre negro. El gradiente Meta
  (violeta → naranja) se quedó sin usuarios al retirar el informe y **se borró de
  `tokens.css`**: si vuelve a aparecer, el sitio pierde su identidad de golpe.
