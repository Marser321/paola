# Tarea 15 — Responsive + Accesibilidad (auditoría y ajustes finos)

## Objetivo
Pulir el comportamiento en tablet/móvil y cerrar los puntos de accesibilidad.
Gran parte ya está cubierta por guards en cada módulo; esta tarea añade los
ajustes CSS restantes y audita el conjunto.

## Archivos a crear/editar
- **Editar** `src/styles/sections.css` (añadir bloque responsive al final)

## Spec

### 1. Añadir AL FINAL de `src/styles/sections.css`
```css
/* ============================================================
   RESPONSIVE GLOBAL (tarea 15) — breakpoints de DESIGN.md §8
   ============================================================ */

/* --- Tablet (<1024px) --- */
@media (max-width: 1023px) {
  .metrics__grid { grid-template-columns: repeat(2, 1fr); }
  .metric:nth-child(2n) { border-right: 0; }
  .metric { padding-bottom: 2rem; border-bottom: 1px solid var(--line); }
  .metric:nth-child(3), .metric:nth-child(4) { border-bottom: 0; }

  .service { grid-template-columns: 3rem 1fr; grid-template-rows: auto auto auto; }
  .service__desc { grid-column: 2; }
  .service__tags { grid-column: 2; }

  .step { grid-template-columns: 3.5rem 1fr; }
  .step__desc { grid-column: 2; }

  .about__grid { grid-template-columns: 1fr; }
  .about__media { position: relative; top: 0; max-width: 420px; }

  .services__header { position: relative; top: 0; }
}

/* --- Móvil (<768px) --- */
@media (max-width: 767px) {
  .site-nav { gap: 1rem; }
  .site-nav a:not(.site-nav__cta) { display: none; } /* nav esencial: logo + contacto */
  .hero__meta { flex-direction: column; gap: 0.75rem; }
  .hero__scroll { display: none; }
  .marquee__inner { font-size: clamp(2rem, 9vw, 3rem); gap: 1.5rem; padding-right: 1.5rem; }
  .testimonial:nth-child(2) { top: 21vh; }
  .testimonial:nth-child(3) { top: 22vh; }
  .footer__bottom { flex-direction: column; align-items: flex-start; gap: 1rem; }
}

/* --- Seguridad anti-overflow global --- */
.hero, .marquee, .projects, .contact { overflow-x: clip; }
```

> El responsive del HUD, los toasts y el informe **no va aquí**: vive en `tracker.css`
> (tareas 32, 33 y 35), junto al resto de su UI. Esta tarea los **audita**, no los
> reescribe.

### 2. Auditoría de accesibilidad (verificar, y corregir solo si falla)

| Punto | Estado esperado | Dónde se cubrió |
|---|---|---|
| `lang="es"` | OK desde markup | tarea 02 |
| Canvas decorativo `aria-hidden` | OK | tarea 02 |
| h1 con `aria-label` + chars `aria-hidden` | OK | tareas 02/07 |
| Marquees `aria-hidden` (contenido duplicado) | OK | tarea 02 |
| `:focus-visible` visible | OK | tarea 01 |
| Reduced-motion en TODOS los módulos | Verificar cada `init*` usa `shouldReduceMotion()` | tareas 04–14 |
| Contraste `--muted` (#8A8A8A) sobre #0E0E0E | **Medido: 5.59:1** (no 5.9:1 como dice `DESIGN.md` §10 y repetía esta tabla). Cumple AA para texto normal (≥4.5:1) igualmente. Cifra corregida en la auditoría del 2026-08-15 | DESIGN.md |
| Contraste `--text` (#F3F2F2) sobre #0E0E0E | Medido: 17.28:1 | DESIGN.md |
| Navegación por teclado: nav, CTA mailto, back-to-top, links footer | Tab natural del navegador | — |
| Cards de proyecto NO son `<a>` vacíos: contienen texto real | OK (son `<article>` con contenido) | tarea 11 |

### 2.1 Auditoría específica de la UI del concepto

| Punto | Estado esperado | Dónde se cubrió |
|---|---|---|
| HUD `<aside aria-label>` y valores volátiles `aria-hidden` | OK — nunca anuncia números a 4 Hz | tarea 32 |
| Toasts `aria-hidden`, no live region | OK — decisión deliberada, documentada | tarea 33 |
| Informe = superficie accesible canónica: `<dl>` + **un solo** anuncio `polite` | OK | tarea 35 |
| Chrome de anuncio (`Patrocinado`, badge, CTA) `aria-hidden` | OK — es atrezo | tarea 34 |
| Audiencia legible fuera del cursor (en el backstage) | OK — el cursor nunca es el único portador | tareas 34/05 |
| Botones con `aria-expanded`: `Ver backstage`, `ver fórmula` | OK, y su texto también alterna | tareas 34/35 |
| Botón de apagado del HUD: `<button aria-pressed>` con texto, no icono | OK | tarea 32 |
| Contraste `--fs-hud` (11px `--muted` sobre `--bg`) | **5.59:1 medido** — cumple AA | DESIGN.md §10 |
| Legibilidad del rail sobre las creatividades del pin | Corregido en ejecución: el HUD lleva velo `color-mix(--bg 85%)` + blur. Sin él, `--muted` sobre el gradiente naranja no cumplía | tarea 32 |
| Barra de profundidad no es portadora única de información | OK — el % está en texto al lado | tarea 32 |

### 3. Checklist de viewports a probar manualmente
- [ ] 1920×1080 — todo centrado, contenedor max 1440px; HUD en rail
- [ ] 1440×900 — pin de proyectos fluido; HUD en rail
- [ ] **1024×768 — frontera del HUD:** último viewport con rail y con pin
- [ ] **1023×768 — el HUD debe ser YA la línea única bajo el header**, no un rail a medias
- [ ] 834×1112 (iPad vertical) — columnas de tablet, sin pin, HUD en línea
- [ ] **768×1024 — frontera inferior del HUD:** aún visible en línea
- [ ] **767×1024 — HUD oculto** y enlace del footer visible
- [ ] 390×844 (iPhone 14) — nav esencial, hero sin WebGL (fallback visible), métricas 2×2,
  sin HUD y **sin toasts**
- [ ] 360×640 — sin overflow horizontal en ninguna sección; labels de etapa en dos líneas

## Criterios de aceptación
- [ ] Ningún viewport 320→1920px genera scroll horizontal.
- [ ] En móvil el hero muestra el fallback de gradientes (`.hero.no-webgl`).
- [ ] Todos los módulos JS de animación tienen guard de reduced-motion o táctil.
- [ ] Tab recorre: logo → 5 nav links → botones `Ver backstage` (×6) → CTA contacto →
  email → social → [reactivar panel, si visible] → back-to-top → **`Desactivar panel`
  (último)**, con foco visible en todo momento.
- [ ] El HUD **nunca tapa** el header ni el banner de consentimiento (tarea 24): en
  tablet va bajo el header, nunca abajo.
- [ ] Las 4 fronteras de breakpoint del HUD (1023/1024 y 767/768) no dejan estados
  intermedios rotos.
- [ ] Lighthouse Accessibility ≥ 95. **PENDIENTE** — no ejecutado en la sesión del
  2026-08-15 (sin Lighthouse disponible en el entorno). El resto de la auditoría se
  verificó a mano y pasa; este punto queda abierto para la tarea 16/19.

## Verificación
```bash
npm run dev
# 1) DevTools → responsive: recorrer los 6 viewports del checklist
# 2) Tab navigation completa
# 3) Lighthouse → categoría Accessibility
```

## ⚠ No hacer
- No añadir menú hamburguesa en v1 (nav esencial: logo + Contacto).
- No crear variantes móviles de las animaciones: los guards ya las desactivan.
- No tocar lógica JS salvo que un punto de la auditoría falle de verdad.
- **No "arreglar" que el HUD no exista en móvil ni que los toasts no aparezcan**: es la
  spec (`DESIGN.md` §10, `PLAN.md` §11.3), no un bug.
- **No convertir los toasts en live region** para subir la nota de Lighthouse. La
  decisión está razonada en la tarea 33 y el informe cubre la accesibilidad del concepto.
- No mover el responsive del HUD desde `tracker.css` a `sections.css`.
