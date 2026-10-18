# MAINTENANCE.md — mantenimiento trimestral

> Rutina para mantener el sitio vivo sin sustos. Se ejecuta **cada trimestre** y no
> debería llevar más de una hora. Si algo falla, se anota en
> [`tasks/BLOCKERS.md`](tasks/BLOCKERS.md).

---

## 0. Contenido real: dónde vive cada dato (desde el 2026-10-17)

La auditoría del 17 oct 2026 (`Ajustes_Web_Paola_Parra.pdf`) encontró una web de
plantilla: clientes, testimonios, años y cifras inventados. Desde entonces **cada
dato tiene un solo sitio**, y lo que está vacío no se publica (el mismo contrato que
`src/data/availability.js`: el modo de fallo es el silencio).

| Qué | Dónde se edita | Qué pasa si está vacío |
|---|---|---|
| Cifras (inversión, cuentas, marcas, años, equipo) | `src/data/perfil.js` → `cifras`, y la fila del hero en `src/i18n/es.js` / `en.js` | El build falla si no cuadran (`check:contenido`) |
| Correo, LinkedIn, ciudad, zona horaria | `src/data/perfil.js` → `contacto` | No hay mailto, ni redes en el pie, ni reloj |
| Inversión por industria | `src/data/sectores.js` | — |
| Casos de clientes | `src/data/sectores.js` → `caso` de cada sector (plantilla en [`CASOS-FICHA.md`](CASOS-FICHA.md)) | La ficha de sector se queda como está; ni tarjeta, ni `caso.html`, ni galería 3D |
| Testimonios | `src/data/testimonios.js` (con `permiso: true`) | `#testimonios` no se pinta |
| Muestras de cada servicio | `src/data/media.js` → `galleries` | No sale el botón «Ver muestras» |
| Textos | `src/i18n/es.js` (canónico) + `en.js` + `index.html` | `npm run check:i18n` avisa de la deriva |

Lo que va escrito en el HTML a partir de esos datos (las cuatro cifras, las barras
por industria, el JSON-LD, el correo y las redes) lo genera el plugin `sitio` de
`vite.config.js` al construir. **No se edita a mano en `index.html`.**

Cuando cambien las cifras o la frase del hero, hay que regenerar la imagen para
compartir: `npm run og` (necesita Chrome; ver §5).

### El formulario de contacto

Lo entrega `api/contacto.js`, una función de Vercel que envía un correo con
[Resend](https://resend.com). Necesita tres variables en Vercel → Settings →
Environment Variables:

| Variable | Qué es |
|---|---|
| `RESEND_API_KEY` | La clave de la cuenta de Resend |
| `CONTACT_TO` | Quién recibe los mensajes (varios, separados por comas) |
| `CONTACT_FROM` | Remitente de un dominio **verificado** en Resend: `Web Paola Parra <web@su-dominio.com>` |

Sin ellas la función responde 503 y el formulario enseña su aviso de error. En
`npm run dev` el envío falla siempre, y es normal: Vite no ejecuta `/api`. La función
se prueba con `npm run test:contacto`; el envío real, en un preview de Vercel.

### Dominio propio

Ninguna URL absoluta está escrita a mano: el plugin de `vite.config.js` usa
`VERCEL_PROJECT_PRODUCTION_URL`, que Vercel inyecta en cada build. Para conectar un
dominio:

1. Vercel → Project → Settings → Domains → añadir el dominio y seguir los pasos de DNS.
2. Lanzar un deploy nuevo: canonical, `og:url`, `og:image`, JSON-LD, `robots.txt` y
   `sitemap.xml` salen ya con el dominio nuevo.
3. Verificar el mismo dominio en Resend y cambiar `CONTACT_FROM` a una dirección suya.
4. Compartir el enlace en WhatsApp y LinkedIn y comprobar que sale la imagen.

### Comprobaciones

```bash
npm run check   # check:i18n + check:media + test:contacto
npm run build   # vite build + check:contenido (el candado de honestidad)
```

`check:contenido` revisa `dist/` —lo que se publica— y **hace fallar el build**, también
en Vercel, si reaparece un cliente o una cifra de la plantilla, un enlace a «#», un
dominio o correo inexistente, el símbolo ®, un locale es-ES o léxico de España. Si salta,
se corrige el contenido; no se relaja el candado.

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

- [ ] ¿Las cifras de `src/data/perfil.js` siguen siendo verdad? Son un corte de Meta Ads
      (1 ene 2025 – 17 oct 2026): cada trimestre, sacar uno nuevo, actualizar `cifras`,
      `sectores.js`, la fila del hero y la línea de fuente de `#metricas`, y `npm run og`.
- [ ] ¿El año del footer y del CV están al día?
- [ ] ¿Los casos publicados siguen teniendo permiso del cliente? ¿Hay casos nuevos que
      pasar por la ficha ([`CASOS-FICHA.md`](CASOS-FICHA.md))?
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
- [ ] **Disponibilidad (`src/data/availability.js`)**: si está en `activo: true`, que el
      número siga siendo cierto y que `revisado` sea de hace menos de 45 días. Caduca
      sola, pero una plaza que se llenó y sigue anunciada tres semanas es peor que no
      anunciar nada.
- [ ] **`npm run check:media`**: ningún asset roto, nadie por encima de su presupuesto, y
      **nada pendiente marcado como generado por IA**. Si la lista de pendientes no está
      vacía, el sitio está publicando material placeholder — incluidos, posiblemente,
      retratos generados de una persona real (t.38).

## 5. Certificado, dominio y despliegue

- [ ] Dominio renovado y con fecha de caducidad conocida.
- [ ] Certificado TLS vigente (Vercel lo renueva solo, pero conviene mirarlo).
- [ ] `robots.txt`, `sitemap.xml`, `og:image` y el canonical salen con el dominio real
      (los genera `vite.config.js`; ver §0 «Dominio propio»).
- [ ] Compartir el enlace en un chat y comprobar que la previsualización sale bien.
- [ ] Mandar un mensaje de prueba por el formulario de producción y comprobar que llega.

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
