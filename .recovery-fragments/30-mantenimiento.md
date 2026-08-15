### EDIT
--- old ---
| Dependencia | Riesgo típico al actualizar | Qué mirar |
|---|---|---|
| `vite` | Cambios de config/build | `npm run build` verde |
| `gsap` | API de ScrollTrigger | pin de proyectos, scrubs |
| `lenis` | Integración con ScrollTrigger | suavidad + anchors |
| `three` | Breaking en majors (r155+: colores, addons) | partículas del hero + distorsión cards |
--- new ---
| Dependencia | Riesgo típico al actualizar | Qué mirar |
|---|---|---|
| `vite` | Cambios de config/build | `npm run build` verde |
| `gsap` | API de ScrollTrigger **y de `gsap.ticker`** | pin de proyectos, scrubs, **y el tick del tracker: HUD, toasts, reloj e informe dependen de él** |
| `lenis` | Integración con ScrollTrigger | suavidad + anchors |
| `three` | Breaking en majors (r155+: colores, addons) | partículas del hero + distorsión cards |

### 2.1 Revisión trimestral del concepto (además de las dependencias)

El tracker es la parte del sitio que puede envejecer mal en silencio. Cada trimestre:

- [ ] **¿La declaración de privacidad del informe sigue siendo literalmente cierta?**
      Abrir el sitio en producción, DevTools → Network, recorrerlo entero sin aceptar
      cookies: cero peticiones a terceros. Si alguien añadió un script, un embed o
      devolvió las fuentes al CDN, **el copy hay que cambiarlo o el script hay que
      quitarlo**. No hay tercera opción.
- [ ] **¿La heurística del informe sigue siendo defendible?** Recorrer el sitio como
      lo haría un cliente y comprobar que el número que sale tiene sentido.
- [ ] **¿HUD, toasts e informe siguen funcionando** tras el update de gsap? El tick es
      lo primero que se rompe si cambia la API del ticker.
- [ ] **¿El opt-out sigue apagándolo todo** y purgando el storage?
- [ ] **¿Los datos de los casos siguen teniendo permiso del cliente?** Si una relación
      terminó mal, retirar su backstage.