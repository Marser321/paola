# Tarea 28 — i18n ES/EN

> ♻ **Archivo parcialmente reconstruido** (2026-08-15). Los "Ajustes obligatorios por la
> fase E", la forma de los diccionarios (etapas, HUD, señales, informe, variantes,
> backstage) y el ⚠ No hacer son **literales** del transcript. El motor y el aplicador se
> han reescrito.

## Objetivo
Español e inglés con un conmutador, sin librerías y sin duplicar el HTML.

## Archivos a crear/editar
- **Crear** `src/i18n/index.js` (motor), `src/i18n/es.js`, `src/i18n/en.js`,
  `src/i18n/apply-dom.js`, `src/js/ui/lang-switch.js`
- **Editar** `src/main.js`, `tracker.js`, `hud.js`, `signals.js`, `report.js`,
  `ab-test.js`, `projects.js`, `sections.css`

## Spec

### 1. Motor (`src/i18n/index.js`)
`t(path, vars)` con rutas por puntos e interpolación `{var}`. Si falta una clave en el
idioma activo **cae al español**, que es el canónico; si tampoco está, devuelve la clave
—visible en pantalla a propósito, porque un hueco silencioso no se detecta—.
`setLang()` guarda en `localStorage`, actualiza `<html lang>`, `<title>` y la
meta description, y despacha **`i18n:change`**.

> **No se detecta el idioma del navegador, y es deliberado.** `navigator.language` es
> justo el tipo de dato que `PLAN.md` §11.2 prohíbe leer. Un sitio cuyo argumento es "no
> te perfilo" no puede empezar perfilando el idioma. Por defecto ES; la elección explícita
> del visitante se recuerda, igual que el opt-out del panel.

### 2. Aplicador (`src/i18n/apply-dom.js`)
Traduce el DOM estático **sin sembrar `data-i18n` por el markup**: el HTML se queda limpio
y toda la traducción vive en un archivo que se lee de arriba abajo. Además permite tratar
los casos raros —nodos de texto sueltos junto a elementos, como `Scroll` + la línea, o
`Hora local —` + el reloj— sin ensuciar la plantilla.

El label de etapa se **compone**: `${stageWord} ${número} · ${nombre de etapa}`, con el
número derivado de `data-stage`.

### 3. Qué traduce cada quién

| Superficie | Quién la traduce |
|---|---|
| DOM estático de `index.html` | `apply-dom.js` |
| HUD (se genera por JS) | `hud.js` se **destruye y reconstruye** en `i18n:change` |
| Toasts | `signals.js` resuelve la glosa en cada emisión |
| Informe | etiquetas por `apply-dom`, valores y estados por `report.js` |
| Cards y backstage | `refreshProjects()` las vuelve a renderizar |
| Subtítulo del hero | `repaintVariant()` — lo posee el test A/B, no el aplicador |

## Ajustes obligatorios por la fase E

1. **Añadir a los diccionarios**: los 5 nombres de etapa (`CONTENT.md` §5), los labels del
   HUD (§12), las glosas de los toasts (§13), el copy completo del informe (§14) y **las
   dos variantes A/B del hero** (§3.1) en cada idioma. ✅
2. **Los nombres de señal NO se traducen.** `PageView`, `ViewContent`, `Scroll75`,
   `ContentEngagement`, `Dwell60`, `Retargeting`, `Conversion` son vocabulario literal de
   Ads Manager y esa es precisamente la gracia: son iguales en todos los idiomas porque
   así es como los ve quien trabaja con la herramienta. Solo se traducen las glosas. ✅
   Son las **claves** del objeto `signals`; los valores son las glosas.
3. **Llamar a `tracker.refresh()` tras el cambio de idioma.** `renderProjects()` destruye
   y recrea los nodos `.project-card`, dejando al `IntersectionObserver` del tracker
   observando elementos que ya no están en el DOM. Sin este `refresh()`, el dwell por
   creatividad deja de contar en silencio. ✅ **Verificado end-to-end**: tras cambiar de
   idioma, el informe siguió contando `2 / 6` creatividades vistas.
4. **`document.title`.** El retargeting del tracker captura el título **vigente** en el
   momento del blur, no una constante, precisamente para que funcione tras cambiar de
   idioma. ✅ Se convirtió `RETARGET_TITLE` en `t('retargetTitle')`, resuelto en el
   momento de usarlo, y `STAGE_NAMES` en la función `stageName()` por lo mismo: como
   constantes de módulo, cambiar de idioma no las habría actualizado.
5. **El título de retargeting** (`← Esto es retargeting · PAOLA`) sí se traduce. ✅

## Dos fallos encontrados al reconectar los módulos

1. **Interpolación muerta en el HUD.** La fila extra de reduced-motion estaba dentro de
   una cadena con **comillas simples**, así que `${t('hud.last')}` se habría pintado
   literal en pantalla en vez de traducirse.
2. **Sombra sobre `t`.** El callback del tick era `on('tick', (t) => …)` y ese parámetro
   **ensombrecía la función de traducción** importada en el módulo. No daba error: dentro
   de ese callback, `t` dejaba de ser el traductor. Renombrado a `tickData`.

## Criterios de aceptación
- [x] El conmutador cambia todo el sitio sin recargar: nav, hero, etapas, métricas,
  servicios, proceso, sobre mí, testimonios, informe, contacto y footer.
- [x] `<html lang>` pasa de `es-ES` a `en`.
- [x] Las cards se recrean traducidas (`Sponsored`, `View backstage`, backstage entero).
- [x] El subtítulo del hero cambia de idioma **manteniendo su variante A/B** y su
  `.accent-text`.
- [x] Los nombres de señal siguen en inglés en los dos idiomas; solo cambia la glosa.
- [x] El dwell por creatividad sigue contando tras el cambio (`tracker.refresh()`).
- [x] La elección se recuerda entre recargas (`localStorage`).
- [x] Sin librerías nuevas.
- [ ] Revisión de las traducciones por un hablante nativo. **Pendiente**: el inglés lo he
  escrito yo y conviene que lo repase alguien, sobre todo el copy del informe, que es la
  pieza de tono más delicada del sitio.

## Verificación
```bash
npm run build && npm run preview
```
```js
document.querySelector('.lang-switch').click()
document.documentElement.lang            // → 'en'
localStorage.getItem('paola-lang')       // → 'en'
```
Luego bajar al informe y comprobar que "Creatives seen" sigue contando.

## ⚠ No hacer
- No usar librerías i18n (i18next etc.): el motor de arriba cubre el caso.
- No traducir "PAOLA", nombres de clientes ni tags técnicos ya ingleses.
- **No traducir los nombres de señal.** `Scroll75` no es `Desplazamiento75`.
- No olvidar `tracker.refresh()`: el fallo es silencioso y solo se nota en el informe.
- No detectar el idioma con `navigator.language` (ver arriba).
- No llamar `t` a ninguna variable local en un módulo que importe el traductor.
