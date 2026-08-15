# BLOCKERS.md — bloqueos y decisiones de retirada

Registro de lo que se intentó, no funcionó y se retiró, con la medición que lo justifica.
Protocolo: `PLAN.md` §9.10 y `tasks/README.md`.

---

## B-01 · `content-visibility` retirado de las secciones largas (tarea 17 §4)

**Fecha:** 2026-08-15 · **Estado:** cerrado (retirado, no se reintenta sin rediseño)

**Qué se intentó.** El bloque que la tarea 17 §4 propone:

```css
@media (min-width: 1024px) {
  #servicios, #proceso, #sobre-mi, #testimonios, #contacto {
    content-visibility: auto;
    contain-intrinsic-size: auto 100vh;
  }
}
```

**Qué pasó.** Medido en el build de preview:

| Con el bloque | Sin el bloque |
|---|---|
| Altura del documento: **13545 → 12632 px** durante el scroll (913 px de deriva) | Altura estable: **12632 px** de principio a fin |
| Pin de proyectos: `getBoundingClientRect().top` = **-50 y -2200** (la sección se va con el scroll: el pin no sujeta) | Pin correcto: **0 y 0** |
| Track horizontal: atascado en **-2475** | Scrub correcto: **-50 → -2200** |

La causa es la esperada: `contain-intrinsic-size` estima la altura de cada sección en
`100vh` y, según se van renderizando de verdad, esas estimaciones se sustituyen por los
valores reales. El documento cambia de tamaño bajo los pies de ScrollTrigger, que ya había
medido los offsets del pin. Además, 913 px de deriva de layout se comen el budget de CLS
(<0.05) por sí solos.

**Decisión.** Retirado. La propia tarea 17 §4 lo autoriza explícitamente ("es una
optimización opcional, no estructural"). El sitio no lo necesita: el JS inicial son 62,55
kB gzip y el resto del contenido es texto y gradientes CSS.

**Si alguien quiere reintentarlo** tendría que resolver antes la interacción con
ScrollTrigger — por ejemplo fijando `contain-intrinsic-size` a la altura real medida de
cada sección en vez de a `100vh`, y disparando `ScrollTrigger.refresh()` al estabilizarse.
No es trabajo de esta fase.

---

## B-02 · Distorsión WebGL de las cards desactivada (tarea 20)

**Fecha:** 2026-08-15 · **Estado:** abierto — código escrito y en el repo, **llamada
comentada** en `main.js`

**Qué se intentó.** `src/js/webgl/card-distortion.js`: un canvas WebGL por creatividad
(6 en total) con un shader de ondulación que sigue al puntero, con render bajo demanda,
`z-index: 0` bajo el chrome de la t.34, y pausa con el backstage abierto.

**Qué pasó.** Con los 6 canvas activos —**7 contextos WebGL contando el del hero**— la
página **entera pasa a pintarse en negro** en el navegador del entorno. El DOM sigue
intacto y es interactuable (`elementFromPoint` devuelve los elementos correctos, el
layout mide bien, cero errores de consola): lo que falla es el pintado.

Secuencia reproducida dos veces:

| Paso | Resultado |
|---|---|
| Carga con el hero solo (1 contexto) | ✅ pinta bien |
| Scroll a la galería → se crean los 6 canvas | ❌ toda la página en negro |
| Rebuild con `initCardDistortion()` comentado | ✅ pinta bien |

> **Aviso metodológico.** El primer intento de descartar la causa fue **inválido**: quité
> los `<canvas>` del DOM y la página seguía negra, así que di por hecho que no era la
> tarea 20. Error — eliminar el elemento **no libera el contexto WebGL** si no se llama a
> `renderer.dispose()`. La prueba buena es la de la tabla: rebuild con la llamada
> comentada.

**Decisión.** Desactivada por defecto. El código se queda en el repo para poder
retomarlo, con la llamada comentada en `main.js`.

**No está claro que sea solo del entorno.** Puede que un Chrome de escritorio con GPU real
lo aguante, pero 7 contextos WebGL en una página es estar en el filo, y Safari (sobre todo
iOS) es bastante más estricto con el límite y con la pérdida de contexto. Antes de
activarlo hay que probarlo en navegadores reales — **es material de la tarea 19**.

**Si se quiere de verdad**, la vía correcta no es subir el número de contextos sino
bajarlo: **un único renderer WebGL** que dibuje las seis creatividades (seis planos en una
escena, o render a textura por card), en vez de seis renderers independientes.

**Y una pregunta de diseño antes que de técnica:** `PLAN.md` §1 fija cuatro momentos de
impacto a propósito y avisa de que saturar es justo lo que hace que un sitio se lea como
plantilla. La galería ya tiene pin horizontal, tilt 3D, chrome de anuncio, backstage y
cursor-píldora. Puede que la distorsión sobre eso no sume.

---

## Pendientes que NO son bloqueos, pero que no se pudieron verificar aquí

Estos puntos no fallan: simplemente el entorno de esta sesión no permite medirlos.
Dueño asignado: **tarea 19** (matriz de testing).

- **Lighthouse** (Performance ≥90, Accessibility ≥95): no hay Lighthouse en el entorno.
- **60fps en hero y galería**: requiere DevTools → Performance.
- **Firefox y Safari**: solo se ha probado en el navegador basado en Chromium del entorno.
- **Reduced-motion end-to-end**: el guard está auditado por código en los 17 módulos de
  animación, pero no se ha ejecutado una pasada completa con la emulación activa.
