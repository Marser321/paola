# MAINTENANCE.md — mantenimiento trimestral

> Rutina para mantener el sitio vivo sin sustos. Se ejecuta **cada trimestre** y no
> debería llevar más de una hora. Si algo falla, se anota en
> [`tasks/BLOCKERS.md`](tasks/BLOCKERS.md).

---

## 1. Antes de tocar nada

```bash
git switch -c mantenimiento/AAAA-TN
npm ci
npm run build && npm run preview
```

Recorrer el sitio entero y comprobar que **el estado de partida es bueno**. Si ya venía
roto, eso es lo primero que hay que arreglar, no las dependencias.

## 2. Dependencias

```bash
npm outdated
```

| Dependencia | Riesgo típico al actualizar | Qué mirar |
|---|---|---|
| `vite` | Cambios de config/build | `npm run build` verde |
| `gsap` | API de ScrollTrigger **y de `gsap.ticker`** | pin de proyectos, scrubs, **y el tick del tracker: HUD, toasts, reloj e informe dependen de él** |
| `lenis` | Integración con ScrollTrigger | suavidad + anchors |
| `three` | Breaking en majors (r155+: colores, addons) | partículas del hero + distorsión cards |

Se actualiza **de una en una**, con build y repaso visual entre cada una. Subir las cuatro
juntas y descubrir que algo se rompió no dice cuál fue.

> Ojo con `gsap`: es la que más superficie toca en este proyecto. No solo anima — es el
> **único reloj del sitio** (`PLAN.md` §9.8). Si cambia la API de `gsap.ticker`, se caen a
> la vez el tracker, el HUD, la cola de toasts, el reloj del footer y el informe, y puede
> que sin un solo error en consola.

## 2.0 Herramientas de medios (fuera del build)

`scripts/media/` **no** forma parte de `npm run build` y por eso no aparece en
`package.json`. Solo hace falta cuando llegan fotos nuevas:

```bash
python3 -m venv .venv && .venv/bin/pip install Pillow numpy
swiftc -O -o scripts/media/cutout scripts/media/cutout.swift
.venv/bin/python scripts/media/build-media.py
```

El recorte del hero usa **Vision** (framework de macOS), así que ese paso solo
corre en un Mac. Si algún día hay que hacerlo en otro sitio, lo que se necesita es
cualquier herramienta que dé una alfa de sujeto decente; el resto del script es
Pillow puro y da igual dónde se ejecute.

No hay que revisarlo cada trimestre. Se toca cuando cambian las fotos.

## 2.1 Revisión trimestral del concepto (además de las dependencias)

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

## 3. Contenido

- [ ] ¿Los KPIs del hero y de Resultados siguen siendo verdad? Un ROAS de hace dos años
      presentado en presente envejece mal.
- [ ] ¿El año del footer y del CV están al día?
- [ ] ¿Los casos siguen siendo los seis que mejor representan el trabajo actual?
- [ ] ¿Los testimonios siguen vigentes y con permiso?

## 4. Salud técnica

- [ ] `npm run build` sin errores ni warnings.
- [ ] **JS inicial por debajo de 150 KB gzip** (tarea 17 §6 es la autoridad). Sumar
      `index` + `vendor-gsap` + `vendor-lenis`; `three` no cuenta, va en diferido.
      *Referencia de agosto de 2026: 62,55 KB.*
- [ ] Lighthouse móvil: Perf ≥90, A11y ≥95, LCP <2,5 s, CLS <0,05, TBT <200 ms.
- [ ] Sin errores de consola en Chrome, Firefox y Safari.
- [ ] Pin de la galería y scrubs sin saltos.
- [ ] `npm audit` — mirar solo lo que afecte a producción; este sitio no tiene backend.
- [ ] **`npm run check:media`**: ningún asset roto, nadie por encima de su presupuesto, y
      **nada pendiente marcado como generado por IA**. Si la lista de pendientes no está
      vacía, el sitio está publicando material placeholder — incluidos, posiblemente,
      retratos generados de una persona real (t.38).

## 5. Certificado, dominio y despliegue

- [ ] Dominio renovado y con fecha de caducidad conocida.
- [ ] Certificado TLS vigente (Netlify lo renueva solo, pero conviene mirarlo).
- [ ] `robots.txt` y `sitemap.xml` apuntan al dominio real, no al placeholder.
- [ ] `og:image` y `og:url` activos y con URL absoluta correcta.
- [ ] Compartir el enlace en un chat y comprobar que la previsualización sale bien.

## 6. Accesibilidad

- [ ] Recorrido completo con teclado; el foco se ve siempre y el último elemento
      sigue siendo `Desactivar panel`.
- [ ] Una pasada con `prefers-reduced-motion` activo: todo estático y legible.
- [ ] Un recorrido con lector de pantalla; el informe se anuncia **una sola vez**.

## 7. Al cerrar

- [ ] Actualizar [`tasks/QA-LOG.md`](tasks/QA-LOG.md) con la fecha y los resultados.
- [ ] Anotar en `BLOCKERS.md` lo que quede abierto.
- [ ] Merge y deploy.

---

## Lo que NO hay que hacer en un mantenimiento

- **No "modernizar" el stack.** Está bloqueado a `gsap`, `lenis` y `three` (`PLAN.md` §3).
  Añadir una librería porque sí es cómo este sitio dejaría de cumplir su budget.
- **No subir el número de mecánicas del tracker.** Si algo nuevo no se puede apagar desde
  el propio panel, no entra (`PLAN.md` §11, regla maestra).
- **No reactivar `content-visibility` ni la distorsión de las cards** sin leer antes
  `BLOCKERS.md` §B-01 y §B-02.
- **No tocar los números de los toasts** (1 cada 4 s, 12 por sesión, 1,5 s, 8 px). Son
  spec, no preferencias.
- **No devolver las fuentes al CDN** para "simplificar". Rompería la frase del informe.
- **No dejar pasar un trimestre con material `ia-propuesto` en producción.** Es temporal
  por definición: si sigue ahí, o se sustituye o se retira.
