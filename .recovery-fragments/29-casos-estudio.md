### EDIT
--- old ---
## ⚠ No hacer
- No crear 6 HTML estáticos a mano: plantilla única + query string.
- No añadir router ni historial pushState: navegación nativa.
--- new ---
## Ajustes obligatorios por la tarea 34

1. **Regla de interacción de la card: el título navega, el botón despliega.** Esta tarea
   envuelve el título en un `<a href="caso.html?id=…">` y la 34 ya añadió el botón
   `Ver backstage`. El resto de la card **no es clicable** — un click en toda la card
   rompería el scrub del pin horizontal. Son dos zonas de click y solo dos.
2. **`caso.html` muestra el backstage completo y desplegado**, sin botón: en la página de
   detalle no hay nada que ocultar. Audiencia, presupuesto, objetivo, formato, el test A/B
   con su ganadora y el antes → después, todo visible de entrada.
3. **`projects.js` ya tiene los campos que necesita** (tarea 03): `adFormat`, `audience`,
   `budget`, `objective`, `cta`, `abTest`, `beforeAfter`. La extensión `caseStudy` de esta
   tarea añade lo demás (narrativa larga, imágenes), no los repite.

## ⚠ No hacer
- No crear 6 HTML estáticos a mano: plantilla única + query string.
- No añadir router ni historial pushState: navegación nativa.
- **No hacer clicable la card entera** para "facilitar" la navegación: rompe el scrub.
- No inicializar el tracker en `caso.html`: el concepto vive en la one-page. Una página
  de detalle con HUD sería ruido, y el informe no tendría sentido ahí.

### EDIT
--- old ---
(Y quitar `data-hover="view"` de la card si se prefiere que el click navegue:
decisión — el cursor "VER" anticipa la página de caso, mantener ambos:
la card entera NO navega, solo el enlace del título, para no romper el scrub
horizontal con taps accidentales.)
--- new ---
**Mantener `data-hover="audience"` en la card.** El cursor sigue mostrando la audiencia
del caso — es información, no una invitación a hacer click. Quien quiere la página de
caso pulsa el título, que es un enlace real y se distingue como tal.

La card entera NO navega: solo el enlace del título, para no romper el scrub horizontal
con taps accidentales. Junto al botón `Ver backstage` de la tarea 34, son las **dos
únicas** zonas interactivas de la card.