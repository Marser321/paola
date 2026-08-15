### READ lines 86-120 of 120
```

### 4. QA final (ejecutar y registrar resultados)
```bash
npm run build
npm run preview
```

| Check | Criterio (PLAN.md §10) | Resultado |
|---|---|---|
| Build | Sin errores ni warnings de Vite | ☐ |
| Consola | Sin errores en Chrome/Firefox/Safari | ☐ |
| Performance hero+proyectos | 60fps estables | ☐ |
| Overflow horizontal | Ninguno 320→1920px | ☐ |
| JS inicial | < 200KB gzip (ver salida de build) | ☐ |
| Reduced-motion | Experiencia completa estática | ☐ |
| Lighthouse Perf/A11y | ≥ 90 / ≥ 95 | ☐ |

### 5. Cierre
- [ ] Marcar todas las tareas como hechas en `tasks/README.md`.
- [ ] Entregar a la persona el checklist de reemplazo (`CONTENT.md` §14).
- [ ] Si hubo bloqueos, revisar que `tasks/BLOCKERS.md` esté resuelto o documentado.

## Criterios de aceptación
- [ ] `npm run build` genera `dist/` sin errores.
- [ ] `npm run preview` sirve el sitio completo y funcional (misma experiencia que dev).
- [ ] Favicon visible en la pestaña.
- [ ] `README.md` raíz existe y es exacto.
- [ ] Tabla QA rellenada.

## ⚠ No hacer
- No activar `og:image`/`og:url` sin dominio real (dejar comentados).
- No añadir analytics ni scripts de terceros en v1.
- No optimizar imágenes: no hay imágenes en v1.


### EDIT
--- old ---
| Overflow horizontal | Ninguno 320→1920px | ☐ |
| JS inicial | < 200KB gzip (ver salida de build) | ☐ |
| Reduced-motion | Experiencia completa estática | ☐ |
| Lighthouse Perf/A11y | ≥ 90 / ≥ 95 | ☐ |

### 5. Cierre
- [ ] Marcar todas las tareas como hechas en `tasks/README.md`.
- [ ] Entregar a la persona el checklist de reemplazo (`CONTENT.md` §14).
- [ ] Si hubo bloqueos, revisar que `tasks/BLOCKERS.md` esté resuelto o documentado.

## Criterios de aceptación
- [ ] `npm run build` genera `dist/` sin errores.
- [ ] `npm run preview` sirve el sitio completo y funcional (misma experiencia que dev).
- [ ] Favicon visible en la pestaña.
- [ ] `README.md` raíz existe y es exacto.
- [ ] Tabla QA rellenada.

## ⚠ No hacer
- No activar `og:image`/`og:url` sin dominio real (dejar comentados).
- No añadir analytics ni scripts de terceros en v1.
- No optimizar imágenes: no hay imágenes en v1.
--- new ---
| Overflow horizontal | Ninguno 320→1920px | ☐ |
| JS inicial | **< 150KB gzip** (autoridad: tarea 17 §6) | ☐ |
| **Peticiones del tracker** | **0 durante una sesión completa** | ☐ |
| **Informe** | Compila al entrar y sus datos cuadran con la sesión | ☐ |
| **Opt-out** | `Desactivar panel` apaga HUD, toasts e informe y purga storage | ☐ |
| Reduced-motion | Experiencia completa estática | ☐ |
| Lighthouse Perf/A11y | ≥ 90 / ≥ 95 | ☐ |

### 5. Cierre
- [ ] Marcar todas las tareas como hechas en `tasks/README.md`.
- [ ] Entregar a la persona el checklist de reemplazo (`CONTENT.md` §19).
- [ ] Si hubo bloqueos, revisar que `tasks/BLOCKERS.md` esté resuelto o documentado.

### 6. Documentar el tracker en el `README.md` raíz

El README debe explicar, en un apartado propio, qué mide el sitio, dónde lo guarda, que
no envía nada, y cómo se apaga. Quien herede este proyecto tiene que entender el concepto
sin leer las 38 tareas.

## Criterios de aceptación
- [ ] `npm run build` genera `dist/` sin errores.
- [ ] `npm run preview` sirve el sitio completo y funcional (misma experiencia que dev).
- [ ] Favicon visible en la pestaña.
- [ ] `README.md` raíz existe, es exacto y **documenta el tracker y su opt-out**.
- [ ] Tabla QA rellenada, incluida la fila de peticiones de red.

## ⚠ No hacer
- No activar `og:image`/`og:url` sin dominio real (dejar comentados).
- No añadir analytics ni scripts de terceros en v1.
- No optimizar imágenes: no hay imágenes en v1.
- No escribir "200KB" en ninguna parte: la cifra es 150KB y la fija la tarea 17.