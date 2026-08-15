# Tarea 19 — Matriz de testing (cross-browser × viewports × estados)

> **Fase A · Ejecutar tras la tarea 16 (y re-ejecutar tras 20-22, 24-25, 28-29).**
> No modifica código salvo que un fallo real lo exija.

## Objetivo
QA sistemático y repetible: matriz de pruebas manual + quirks conocidos de iOS +
protocolo de capturas de referencia.

## Archivos a crear/editar
- **Crear** `tasks/QA-LOG.md` (registro de resultados)
- Solo se toca código si un check falla (registrar en `tasks/BLOCKERS.md`)

## Spec

### 1. Matriz principal (ejecutar completa)

Navegadores × viewports:

| | 1920×1080 | 1440×900 | 1024×768 | 834×1112 | 390×844 | 360×640 |
|---|---|---|---|---|---|---|
| **Chrome** | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| **Firefox** | ☐ | ☐ | — | — | ☐ | — |
| **Safari** | ☐ | ☐ | ☐ | ☐ | ☐ (real) | — |

En cada celda verificar (checklist rápido):
1. Preloader completa y desaparece
2. Hero: partículas (o fallback según viewport) + entrada de letras
3. Marquees en loop sin saltos
4. Contadores cuentan una vez
5. Proyectos: pin horizontal (≥1024) o columna (<1024) + tilt en hover (desktop)
6. Línea de proceso con scrub
7. Sticky de testimonios apila correctamente
8. CTA magnético (desktop) + reloj corriendo
9. Sin overflow horizontal
10. Consola limpia
11. **HUD aparece tras el primer scroll y muestra los 5 datos correctos**
12. **La etapa del HUD coincide con la sección en pantalla**
13. **Los toasts salen ≤1 cada 4 s, duran ~1,5 s y cesan tras `Conversion`**
14. **`#informe` compila al entrar y sus datos cuadran con lo que se hizo**
15. **Click en el CTA → `Conversion` y el informe se actualiza en vivo**

### 2. Estados especiales (en Chrome 1440×900)

| Estado | Cómo activarlo | Esperado |
|---|---|---|
| Reduced motion | DevTools → Rendering → emulate `prefers-reduced-motion` | Todo estático y completo. HUD sin fade, con fila `Última señal`; sin toasts; informe sin typing pero con datos en vivo |
| Táctil | Device toolbar → iPhone SE | Sin cursor custom, sin tilt, sin magnetismo, sin HUD, sin toasts. El informe funciona igual |
| Fuentes CDN caídas | Network → bloquear `fontshare.com` y `fonts.googleapis.com` | Texto legible con fuentes de sistema (fallback sans-serif) |
| Sin WebGL | DevTools → no soportado / flag `--disable-webgl` | `.hero.no-webgl` con gradientes CSS |
| Cache frío | Network → Disable cache + hard reload | Preloader limpio, sin FOUC de secciones |
| JS lento (3G) | Network → Slow 3G | Preloader espera; nada roto al cargar tarde |
| **HUD desactivado** | Click en `Desactivar panel` + recargar | Sin HUD, sin toasts, informe congelado con su nota, `paola-session` borrado de sessionStorage |
| **Storage bloqueado** | Safari privado, o `localStorage` denegado por permisos | **Cero excepciones en consola**; todo funciona en memoria; el HUD aparece igual |
| **Retargeting** | Cambiar de pestaña >20 s y volver | `document.title` cambia y se restaura **exacto**; señal `Retargeting` **una sola vez** |
| **Retargeting corto** | Cambiar de pestaña <20 s y volver | El título **no** cambia y no se emite nada |
| **Variantes A y B** | Forzar ambas desde el HUD | Las dos legibles sin desbordes; el informe refleja `cambiada manualmente` |
| **Sesión larga** | 5 min con scroll continuo | Cap de 12 señales respetado; el array de señales no crece sin límite; sin fuga de memoria |
| **Red** | Panel Network abierto durante toda la sesión | **Cero peticiones originadas por el tracker.** Solo documento, JS/CSS y las 2 hojas de fuentes |
| **Lector de pantalla** | VoiceOver + Safari, recorrido completo | Sin anuncios repetidos de números; el informe se lee como lista de definición y se anuncia **una vez** |

### 3. Quirks iOS conocidos (probar en dispositivo real si es posible)

| Quirk | Síntoma | Estado / solución |
|---|---|---|
| `100vh` vs barra Safari | Hero más alto que la pantalla | ✅ Ya cubierto: usamos `100svh` (tarea 02) |
| Pin + smooth scroll | Jitter en la sección de proyectos | NO activar `ScrollTrigger.normalizeScroll()` por defecto. Solo si el jitter se confirma en dispositivo real: añadir `normalizeScroll(true)` tras `gsap.registerPlugin` en `lenis.js` y re-testear desktop |
| `backdrop-filter` | Pill de sector en cards puede no difuminar | Aceptable: tiene fondo `rgba(14,14,14,.55)` de base; verificar legibilidad |
| Aceleración GPU excesiva | Calentamiento/saltos | Verificar que WebGL se pausa fuera de viewport (tarea 08); si persiste, reducir `COUNT` a 1500 en móvil ≥768px |
| Zoom con doble tap | Layout se amplía | `touch-action: manipulation` en `body` si se detecta (añadir a `base.css`) |

### 4. Protocolo de capturas de referencia

Tras aprobar la matriz por primera vez:
1. Capturar pantalla completa de cada sección a 1440×900:
   `ref-hero.png`, `ref-marquee.png`, `ref-metricas.png`, `ref-proyectos.png`,
   `ref-backstage.png`, `ref-servicios.png`, `ref-proceso.png`, `ref-sobre-mi.png`,
   `ref-testimonios.png`, `ref-informe.png`, `ref-contacto.png`, `ref-footer.png`
   (DevTools → Cmd+Shift+P → "Capture screenshot"; guardar en `tasks/refs/`)
   Las capturas de `proyectos`, `informe` y `contacto` deben incluir el HUD en pantalla.
2. Tras CUALQUIER tarea posterior que toque estilos o animación: repetir capturas
   y comparar visualmente 1:1. Diferencias intencionadas → actualizar referencia.
   No intencionadas → bug.

### 5. `tasks/QA-LOG.md` (literal — plantilla inicial)
```markdown
# QA-LOG — Registro de pruebas

## <fecha> — v1 + fase E (tareas 00-16, 31-36) — <ejecutor>
- Matriz navegadores×viewports: X/XX celdas OK
- Estados especiales: X/14 OK
- Quirks iOS: <notas>
- **Panel de red durante sesión completa: ☐ vacío de peticiones del tracker**
- **Datos del informe cuadran con la sesión real: ☐**
- Incidencias: <ninguna | lista con enlace a BLOCKERS.md>
- Capturas de referencia: actualizadas ☐
```

## Criterios de aceptación
- [ ] Matriz completa registrada en `QA-LOG.md`.
- [ ] Cero incidencias abiertas o todas documentadas en `BLOCKERS.md` con workaround.
- [ ] `tasks/refs/` contiene las 12 capturas de referencia.
- [ ] **La fila "Red" está marcada.** Si el tracker genera una sola petición, el concepto
  entero es falso y la tarea no se cierra hasta arreglarlo.

## Verificación
Esta tarea ES la verificación. Se considera hecha con el QA-LOG completo.

## ⚠ No hacer
- No "arreglar" diferencias cosméticas subjetivas: solo bugs reales contra spec.
- No añadir frameworks de testing (Playwright/Cypress) en v1: QA manual documentado.
- No activar `normalizeScroll` preventivamente (ver tabla de quirks).
