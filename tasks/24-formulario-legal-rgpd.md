# Tarea 24 — Formulario, páginas legales y RGPD

> ♻ **Archivo parcialmente reconstruido** (2026-08-15). Son **literales** del transcript:
> el esqueleto del aviso legal, la descripción de `privacidad.html` y `cookies.html`, todo
> el §3.1 (marco legal), el banner con su copy, el §4.1 (convivencia con el panel), los
> criterios ampliados y el ⚠ No hacer. El formulario y las páginas completas se han escrito.

## Objetivo
Formulario de contacto real, banner de consentimiento y las tres páginas legales, sin
romper la afirmación central del sitio.

## Archivos a crear/editar
- **Crear** `legal/aviso-legal.html`, `legal/privacidad.html`, `legal/cookies.html`
- **Crear** `src/js/core/consent.js`, `src/js/core/contact-form.js`,
  `src/js/pages/legal.js`, `src/styles/legal.css`
- **Editar** `index.html` (formulario, banner, enlaces del footer), `vite.config.js`,
  `src/main.js`, `src/styles/sections.css`

## Spec

### 1. Formulario (Netlify Forms)
`name="contacto"`, `data-netlify="true"`, input oculto `form-name` y honeypot
`bot-field`. Campos: nombre, email, mensaje y **casilla obligatoria** de aceptación de la
política de privacidad (es la base jurídica del tratamiento, art. 6.1.a RGPD).

El envío va por `fetch` a `/`. **Hasta el deploy (t.26) siempre falla en local**, y eso
está contemplado: el JS muestra el email como salida en vez de dejar al visitante
colgado. El honeypot relleno finge éxito y no envía nada.

### 2. Las tres páginas legales
Con **datos de ejemplo marcados**: cada hueco va en `<mark>[PENDIENTE: …]</mark>`, en
naranja, y cada página abre con un aviso de borrador imposible de pasar por alto. Una
página legal a medias que parezca definitiva es peor que no tenerla.

> ⚠ **Estos textos NO los ha revisado un profesional del derecho.** Son una plantilla
> estructurada para que quien la revise no parta de cero. El sitio no puede publicarse así.

### 3.1 El marco legal aplicado a este sitio (leer antes de escribir el copy)

Lo que activa el deber de consentimiento en la UE **no es "usar cookies"** ni "recoger
datos": es el **art. 5(3) de la Directiva ePrivacy** (en España, **art. 22.2 LSSI**), que
cubre *almacenar información en el equipo terminal del usuario, o acceder a ella*, por
cualquier medio — cookie, `localStorage`, `sessionStorage`, IndexedDB — salvo lo
estrictamente necesario para prestar un servicio expresamente solicitado. El RGPD se suma
encima **solo si además hay tratamiento de datos personales**.

| Mecánica | ¿Almacena en el terminal? | ¿Sale del navegador? | Veredicto |
|---|---|---|---|
| Estado del tracker en memoria (scroll, dwell, señales) | No | No | **Sin consentimiento.** Fuera del art. 5(3) y fuera del RGPD |
| `paola-session` (sessionStorage, muere al cerrar la pestaña) | Sí, efímero | No | **Sin consentimiento, con transparencia.** Primera parte, sin perfilado, sin medición publicitaria, no transmitido |
| `paola-hud` (localStorage) | Sí, persistente | No | **Exento**: es una preferencia fijada por el usuario, la misma categoría que `paola-consent` |
| `paola-variant` (sessionStorage) | Sí, efímero | No | **Sin consentimiento.** Mantiene estable la variante servida dentro de una sesión |
| `paola-lang` (localStorage, tarea 28) | Sí, persistente | No | **Exento**: preferencia explícita del usuario |
| `paola-freq` (tarea 37) | Sí, persistente, reconoce visitas repetidas | No | **Zona gris → se trata como si requiriera consentimiento.** Opt-in explícito o no se hace |
| GA4 / Meta Pixel | Sí + transmisión a terceros | **Sí** | **Consentimiento previo obligatorio** |

### 4. Banner de consentimiento

El copy cambia respecto a un banner genérico: en vez de pedir permiso para todo en bloque,
**separa la medición local de la externa**. Deja de ser un trámite y pasa a ser el primer
enunciado del concepto — el visitante entiende la distinción antes incluso de bajar al
informe. Texto literal en `CONTENT.md` §17.

### 4.1 Convivencia con el panel de sesión

- **Orden de aparición:** el banner sale primero. El HUD no aparece hasta que hay decisión
  **y** primer scroll. Nunca dos overlays peleando por la atención a la vez.
- **Colisión física:** el banner es `position: fixed; bottom` con `z-index: var(--z-cursor)`
  (300); el HUD usa `--z-hud` (90) y, en tablet, va **bajo el header, nunca abajo**
  (`DESIGN.md` §10). Verificar en 768–1023px que no se solapan.
- **`form:success` → `Conversion`:** el envío correcto del formulario debe emitir la señal
  de conversión igual que el CTA (tarea 14). El dedupe del tracker garantiza que solo
  cuente una vez aunque ocurran las dos cosas.
- **Rechazar analítica NO apaga el panel de sesión**, y así debe explicarse: son cosas
  distintas y el sitio lo sostiene abiertamente. El panel se apaga desde el propio panel.

## Criterios de aceptación
- [x] Aceptar dispara `consent:accepted`; rechazar no carga nada externo.
- [x] Las 3 páginas legales existen, son `noindex`, enlazan de vuelta y cargan
  con estilos base en dev y en build.
- [x] `npm run build` genera las **6** páginas en `dist/` (index, caso y las 3 legales…
  más `og.html`, que es plantilla suelta).
- [x] El banner **distingue explícitamente** la medición local de la externa
  (`CONTENT.md` §17). No dice "uso cookies, ¿aceptas?".
- [x] `cookies.html` contiene la tabla, con la columna "¿Se envía a alguien?" en **No**
  para todas las locales. Se ampliaron a **cinco** filas locales: la tabla de
  `CONTENT.md` §17 es anterior a `paola-variant` y a `paola-lang` (t.28), y una tabla
  incompleta aquí sería justo el tipo de imprecisión que el resto del sitio no se permite.
- [x] `privacidad.html` incluye la cláusula del panel de sesión y **es literalmente
  cierta**: contrastada con lo que hace `tracker.js` de verdad.
- [x] **Rechazar la analítica no apaga el panel de sesión** (verificado: `paola-hud`
  intacto tras rechazar), y el usuario puede entenderlo leyendo el banner y `cookies.html`.
- [x] El envío correcto del formulario emite `Conversion` (vía `form:success`), y la
  señal cuenta **una sola vez** aunque además se pulse el CTA. Verificado: tras
  `form:success` **y** click en el CTA, el informe pasó a `Objetivo cumplido` con una
  sola conversión registrada.
- [◐] Entre 768 y 1023px el banner **no se solapa con el HUD**. Verificado por geometría
  CSS (banner `bottom`, HUD `top: 4.5rem` con `bottom: auto`: extremos opuestos), pero
  **no con ambos pintados a la vez** — en el iframe de prueba el HUD no llega a
  construirse porque el rAF está congelado. Pendiente de confirmación visual → tarea 19.
- [x] El HUD no aparece hasta que hay decisión sobre el banner (el HUD se construye en el
  primer tick con profundidad > 0, y el banner sale antes de cualquier scroll).

## Verificación
```bash
npm run build && npm run preview
```
```js
localStorage.removeItem('paola-consent'); location.reload()  // vuelve a salir el banner
```
El envío del formulario **fallará en local**: es lo esperado hasta el deploy.

## ⚠ No hacer
- **No pedir consentimiento para el panel de sesión.** No lo requiere (ver §3.1), y
  pedirlo daría a entender que sí envía datos — justo lo contrario del mensaje.
- **No apagar el tracker al rechazar la analítica.** Son cosas distintas; mezclarlas
  destruye la distinción que sostiene el concepto.
- No escribir en `privacidad.html` afirmaciones que el código no cumpla. Si se añade
  cualquier script de terceros, ese texto deja de ser cierto (ver también `PLAN.md` §11.9
  sobre las fuentes por CDN).
- No mover el banner ni el HUD de su z-index: `--z-hud` (90) y `--z-cursor` (300) están
  elegidos para que nunca compitan.
- **No publicar con los textos legales tal cual.** Son un borrador con huecos marcados.
