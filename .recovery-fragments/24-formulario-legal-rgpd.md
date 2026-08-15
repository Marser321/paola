### READ lines 140-189 of 308
    <h1>Aviso legal</h1>
    <!-- [A COMPLETAR POR PROFESIONAL LEGAL] Estructura requerida: -->
    <h2>1. Titular del sitio</h2><p>[Nombre/NIF/dirección de contacto]</p>
    <h2>2. Objeto</h2><p>[Servicios de consultoría de paid social]</p>
    <h2>3. Propiedad intelectual</h2><p>[Contenidos y marca]</p>
    <h2>4. Responsabilidad</h2><p>[Limitaciones habituales]</p>
    <h2>5. Legislación aplicable</h2><p>[España, fueros]</p>
  </body>
</html>
```
- `privacidad.html`: secciones RGPD — responsable, finalidad, base jurídica,
  conservación, destinatarios (Netlify como encargado de tratamiento del form),
  derechos (acceso/rectificación/supresión…), contacto.
- `cookies.html`: qué son, tabla de cookies usadas (consentimiento en
  `localStorage` + las de GA4/Meta si se aceptan — ver tarea 25), cómo retirar
  el consentimiento (botón que borra `localStorage['paola-consent']` y recarga).

### 4. Banner de consentimiento — añadir antes de `.grain` en `index.html`
```html
<div id="consent-banner" class="consent" hidden>
  <p class="consent__text mono">Uso cookies de medición (GA4 / Meta Pixel) para
    mejorar esta web. ¿Aceptas?</p>
  <div class="consent__actions">
    <button id="consent-reject" class="mono" data-hover>Rechazar</button>
    <button id="consent-accept" class="consent__accept mono" data-hover>Aceptar</button>
  </div>
  <a href="/legal/cookies.html" class="mono" data-hover>Más info</a>
</div>
```

### 5. `src/js/core/consent.js` (literal)
```js
const KEY = 'paola-consent' // 'accepted' | 'rejected'

export function initConsent() {
  const banner = document.getElementById('consent-banner')
  if (!banner) return

  const stored = localStorage.getItem(KEY)
  if (!stored) banner.hidden = false
  else if (stored === 'accepted') window.dispatchEvent(new CustomEvent('consent:accepted'))

  document.getElementById('consent-accept')?.addEventListener('click', () => {
    localStorage.setItem(KEY, 'accepted')
    banner.hidden = true
    window.dispatchEvent(new CustomEvent('consent:accepted'))
  })
  document.getElementById('consent-reject')?.addEventListener('click', () => {
    localStorage.setItem(KEY, 'rejected')
    banner.hidden = true

### EDIT
--- old ---
- `privacidad.html`: secciones RGPD — responsable, finalidad, base jurídica,
  conservación, destinatarios (Netlify como encargado de tratamiento del form),
  derechos (acceso/rectificación/supresión…), contacto.
- `cookies.html`: qué son, tabla de cookies usadas (consentimiento en
  `localStorage` + las de GA4/Meta si se aceptan — ver tarea 25), cómo retirar
  el consentimiento (botón que borra `localStorage['paola-consent']` y recarga).

### 4. Banner de consentimiento — añadir antes de `.grain` en `index.html`
```html
<div id="consent-banner" class="consent" hidden>
  <p class="consent__text mono">Uso cookies de medición (GA4 / Meta Pixel) para
    mejorar esta web. ¿Aceptas?</p>
  <div class="consent__actions">
    <button id="consent-reject" class="mono" data-hover>Rechazar</button>
    <button id="consent-accept" class="consent__accept mono" data-hover>Aceptar</button>
  </div>
  <a href="/legal/cookies.html" class="mono" data-hover>Más info</a>
</div>
```
--- new ---
- `privacidad.html`: secciones RGPD — responsable, finalidad, base jurídica,
  conservación, destinatarios (Netlify como encargado de tratamiento del form),
  derechos (acceso/rectificación/supresión…), contacto. **Más la cláusula del panel
  de sesión** (`CONTENT.md` §17).
- `cookies.html`: qué son, **la tabla de cuatro filas de `CONTENT.md` §17** (consent,
  sesión local, preferencia del panel, y GA4/Meta), y cómo retirar el consentimiento
  (botón que borra `localStorage['paola-consent']` y recarga).

### 3.1 El marco legal aplicado a este sitio (leer antes de escribir el copy)

Lo que activa el deber de consentimiento en la UE **no es "usar cookies"** ni "recoger
datos": es el **art. 5(3) de la Directiva ePrivacy** (en España, **art. 22.2 LSSI**), que
cubre *almacenar información en el equipo terminal del usuario, o acceder a ella*, por
cualquier medio — cookie, `localStorage`, `sessionStorage`, IndexedDB — salvo lo
estrictamente necesario para prestar un servicio expresamente solicitado. El RGPD se suma
encima **solo si además hay tratamiento de datos personales**.

Aplicado a cada mecánica del sitio:

| Mecánica | ¿Almacena en el terminal? | ¿Sale del navegador? | Veredicto |
|---|---|---|---|
| Estado del tracker en memoria (scroll, dwell, señales) | No | No | **Sin consentimiento.** Fuera del art. 5(3) y fuera del RGPD |
| `paola-session` (sessionStorage, muere al cerrar la pestaña) | Sí, efímero | No | **Sin consentimiento, con transparencia.** Primera parte, sin perfilado, sin medición publicitaria, no transmitido. Se documenta como "almacenamiento técnico local" |
| `paola-hud` (localStorage) | Sí, persistente | No | **Exento**: es una preferencia fijada por el usuario, la misma categoría que `paola-consent`, que esta tarea ya guarda sin pedir permiso |
| `paola-variant` (sessionStorage) | Sí, efímero | No | **Sin consentimiento.** Mantiene estable la variante servida dentro de una sesión |
| `paola-freq` (tarea 37, frecuencia entre visitas) | Sí, persistente, reconoce visitas repetidas | No | **Zona gris → se trata como si requiriera consentimiento.** Opt-in explícito o no se hace |
| GA4 / Meta Pixel | Sí + transmisión a terceros | **Sí** | **Consentimiento previo obligatorio.** Sin cambios |

### 4. Banner de consentimiento — añadir antes de `.grain` en `index.html`

El copy cambia respecto a un banner genérico: en vez de pedir permiso para todo en bloque,
**separa la medición local de la externa**. Deja de ser un trámite y pasa a ser el primer
enunciado del concepto — el visitante entiende la distinción antes incluso de bajar al
informe. Texto literal en `CONTENT.md` §17.

```html
<div id="consent-banner" class="consent" hidden>
  <p class="consent__text mono">Esta página mide tu visita en tu propio navegador y te
    enseña el resultado al final. Eso no sale de aquí y no necesita tu permiso.<br />
    Lo que sí lo necesita: Google Analytics y Meta Pixel, que envían datos fuera.</p>
  <div class="consent__actions">
    <button id="consent-reject" class="mono" data-hover>Rechazar</button>
    <button id="consent-accept" class="consent__accept mono" data-hover>Aceptar</button>
  </div>
  <a href="/legal/cookies.html" class="mono" data-hover>Más información</a>
</div>
```

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

### EDIT
--- old ---
- [ ] Aceptar dispara `consent:accepted`; rechazar no carga nada externo.
- [ ] Las 3 páginas legales existen, son `noindex`, enlazan de vuelta y cargan
  con estilos base en dev y en build.
- [ ] `npm run build` genera las 4 páginas en `dist/`.
--- new ---
- [ ] Aceptar dispara `consent:accepted`; rechazar no carga nada externo.
- [ ] Las 3 páginas legales existen, son `noindex`, enlazan de vuelta y cargan
  con estilos base en dev y en build.
- [ ] `npm run build` genera las 4 páginas en `dist/`.
- [ ] El banner **distingue explícitamente** la medición local de la externa
  (`CONTENT.md` §17). No dice "uso cookies, ¿aceptas?".
- [ ] `cookies.html` contiene la tabla de cuatro filas, con la columna
  "¿Se envía a alguien?" en **No** para las tres primeras.
- [ ] `privacidad.html` incluye la cláusula del panel de sesión y **es literalmente
  cierta**: contrastarla con lo que hace `tracker.js` de verdad.
- [ ] **Rechazar la analítica no apaga el panel de sesión**, y el usuario puede
  entenderlo leyendo el banner y `cookies.html`.
- [ ] El envío correcto del formulario emite `Conversion` (vía `form:success`), y la
  señal cuenta **una sola vez** aunque además se pulse el CTA.
- [ ] Entre 768 y 1023px el banner **no se solapa con el HUD** (que va bajo el header).
- [ ] El HUD no aparece hasta que hay decisión sobre el banner.

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