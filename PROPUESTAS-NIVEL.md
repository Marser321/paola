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
>
> **Repaso del 2026-08-19.** Cerradas **C2** (antes → después en la tarjeta), **C3** (barra
> de acción en móvil) y **D1** (microtextos del formulario en los dos idiomas): las tres
> que se podían hacer enteras sin pedirle nada a la clienta. Lo que sigue abierto está
> abierto por un motivo, y en casi todos los casos el motivo es que **falta un dato o una
> decisión de negocio**, no código — está dicho en cada punto.

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

### C2. La tarjeta de proyecto dice el **antes → después** — ✅ HECHO el 2026-08-19

La cifra más persuasiva del sitio vivía dentro del backstage, o sea detrás de un clic
que la mayoría no da. Ahora se lee en la cara de la tarjeta, bajo los dos KPI y con el
mismo lenguaje: mono, el estado de partida en `--muted` y el de llegada en `--text`.
Sin acento — seis tarjetas con oro encendido lo apagarían en todo el sitio.

El backstage se queda solo con el resultado del test A/B, que sí es material de
trastienda; repetir la misma cifra en los dos sitios la abarataba. La flecha es
decorativa y el nombre accesible lo lleva el `<p>` (`projects.delta` en los dos
diccionarios), para que un lector de pantalla oiga «De ROAS 2.1x a ROAS 5.8x» y no
«flecha derecha».

### C3. Una barra de acción fija en móvil — ✅ HECHO el 2026-08-19

`src/js/ui/mobile-cta.js` + `src/styles/mobile-cta.css`, con el enlace en el HTML
estático (`.mobile-cta`). Por debajo de 768px aparece cuando el hero termina de salir
y se aparta al asomar `#contacto`, donde el CTA de verdad ya ocupa la pantalla.

Se respetó el aviso: es **una sola cosa** —un enlace, sin contador, sin cerrar, sin
segundo botón—, opaca (`--surface`, nada de `backdrop-filter`: detrás pasan seis planos
de parallax) y de 44px de alto útil, con `env(safe-area-inset-bottom)` para no quedar
debajo del indicador de inicio de iOS.

Dos detalles que no son obvios y por eso están comentados en el código: va en el markup
y no la inyecta el JS porque `[data-scroll]` lo cablea `initLenis()` **una sola vez** al
arrancar y porque `npm run check:i18n` solo vigila lo que está escrito en el HTML; y
oculta se pone en `visibility: hidden`, no solo `opacity: 0`, para que no sea una trampa
de tabulación. Cero listeners de scroll: dos `ScrollTrigger` sin scrub dentro de un
`matchMedia`.

### C4. Estado de disponibilidad

`Acepto 2 proyectos para octubre` en el header o junto al CTA. Escasez real, verificable
y editable en un dato. Si deja de ser cierto, hay que quitarlo — una escasez falsa se
detecta a la primera y se lleva por delante todo lo demás.

---

## Bloque D — Texto y detalle fino

### D1. Los microtextos del formulario — ✅ HECHO el 2026-08-19

Los cuatro rótulos, las cuatro opciones del desplegable, el consentimiento, el botón, el
honeypot y los tres mensajes de estado (`Enviando…`, éxito, fallo) pasan ya por
`contact.form` y `contact.status` en los dos diccionarios, y por
`applyStaticTranslations()`.

Lo que **no** se traduce, a propósito: los `value` del `<select>`. Viajan a Netlify y los
lee la clienta, que trabaja en español — y son además la clave con la que
`sections/plans.js` precualifica el formulario desde el CTA de cada plan. Lo que cambia
de idioma es el rótulo visible.

El consentimiento lleva un enlace dentro, así que se reconstruye con `{link}`
conservando su `href`; comprobado que aguanta varios cambios de idioma seguidos.
`.contact-form__label`, `.contact-form__submit` y `.mobile-cta__text` entran en
`npm run check:i18n`, que ahora vigila 18 bloques.

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
