# CONTENT.md — Copy deck (español) + datos

> **ÚNICA fuente de textos visibles.** El agente ejecutor copia literalmente de aquí.
> Todo es placeholder profesional: la persona reemplazará nombre, cifras y enlaces.
> Marcas de reemplazo: buscar `«...»` al final del proyecto (tarea 16 incluye checklist).

> **Tono del concepto "LA CAMPAÑA ERES TÚ"** (ver `PLAN.md` §1 y §11): todo el copy del
> tracker es **declarativo, nunca ufano**. Se describe la campaña, nunca a la persona que
> visita. No existe "interés: alto", "perfil" ni "usuario indeciso". La gracia está en el
> contraste con la industria, no en el poder sobre el visitante.

---

## 0. Identidad

- **Nombre marca:** `PAOLA` (placeholder — reemplazar por nombre real)
- **Descriptor:** Meta Ads Specialist · Performance Marketing
- **Ubicación placeholder:** Barcelona, ES
- **Email placeholder:** `hola@paola-ads.com`
- **Año footer:** 2026

## 1. Preloader

Re-encuadrado como el arranque de una campaña (mismo efecto técnico que la tarea 06:
contador + barra + cortina; solo cambia el texto).

- Label superior (mono): `INICIANDO CAMPAÑA`
- Línea de estado (mono, `--muted`): `PAOLA_2026 · OBJETIVO: CONVERSIÓN`
- Contador: `0% → 100%`
- Al llegar a 100, antes de la cortina: `ENTREGANDO IMPRESIÓN`

## 2. Header / Navegación

- Logo: `PAOLA®`
- Nav: `Proyectos` · `Servicios` · `Proceso` · `Sobre mí` · `Contacto`

## 3. Hero

- Label superior (mono): `META ADS SPECIALIST — PERFORMANCE MARKETING`
- Título: `PAOLA` (**no entra en el test A/B**: la marca es marca)
- Subtítulo: **dos variantes, ver §3.1**
- Meta-fila (mono, 3 ítems): `ROAS MEDIO 4.2X` · `+$2M GESTIONADOS` · `FB · IG`
- Indicador scroll: `SCROLL`

### 3.1 Variantes del test A/B (tarea 36)

Se sirve una al azar en cada carga. El HUD la muestra y permite conmutarla.
La parte en negrita lleva `.accent-text`.

| Variante | Subtítulo |
|---|---|
| **A** | `Convierto presupuesto publicitario en `**`crecimiento medible`**`.` |
| **B** | `Cada euro invertido tiene que `**`volver acompañado`**`.` |

Ambas deben caber en dos líneas a 1440px y en tres a 360px sin desbordar.

## 4. Marquee (loop)

Secuencia (repetir): `META ADS` · `PAID SOCIAL` · `FUNNELS` · `CRO` ·
`UGC STRATEGY` · `MEDIA BUYING`
Separador entre ítems: `✦` (o `•`). Ítems alternos con estilo outline (`is-outline`).

---

## 5. Etapas del embudo (estructura del sitio)

> ⚠ **Los rótulos «Etapa 0X · Interés» se retiraron el 2026-08-16** junto con el resto
> del concepto de campaña. El orden de las secciones que describe este apartado sigue
> siendo el bueno; lo que ya no se imprime es el nombre de la etapa.

Sustituyen a los índices genéricos `01 —`, `02 —`… Cinco etapas, diez secciones: que dos
secciones compartan etapa es lo que hace que el embudo se lea como embudo.

| Etapa | Nombre | `data-stage` | Secciones |
|---|---|---|---|
| 01 | `ALCANCE` | `alcance` | Hero, Marquee, Métricas |
| 02 | `INTERÉS` | `interes` | Proyectos |
| 03 | `CONSIDERACIÓN` | `consideracion` | Servicios, Proceso |
| 04 | `INTENCIÓN` | `intencion` | Sobre mí, Testimonios |
| 05 | `CONVERSIÓN` | `conversion` | Informe, Contacto |

**Labels de sección** (el `<span class="section-label__stage">` va en `--text`, el nombre
de sección en `--muted`):

| Sección | Label completo |
|---|---|
| `#metricas` | `Etapa 01 · Alcance` — `Resultados` |
| `#proyectos` | `Etapa 02 · Interés` — `Creatividades` |
| `#servicios` | `Etapa 03 · Consideración` — `Servicios` |
| `#proceso` | `Etapa 03 · Consideración` — `Proceso` |
| `#sobre-mi` | `Etapa 04 · Intención` — `Quién lo opera` |
| `#testimonios` | `Etapa 04 · Intención` — `Prueba social` |
| `#informe` | `Etapa 05 · Conversión` — `Tu informe` |
| `#contacto` | `Etapa 05 · Conversión` — `Contacto` |

## 6. Métricas (Etapa 01 · Alcance — Resultados)

| Valor | data-count | data-decimals | data-prefix | data-suffix | Label | data-spark |
|---|---|---|---|---|---|---|
| 4.2x | `4.2` | `1` | — | `x` | `ROAS MEDIO` | `2.1,2.8,3.3,3.6,4.0,4.2` |
| +$2M | `2` | `0` | `+$` | `M` | `AD SPEND GESTIONADO` | `0.3,0.7,1.0,1.4,1.7,2.0` |
| 98% | `98` | `0` | — | `%` | `RETENCIÓN DE CLIENTES` | `88,91,93,95,97,98` |
| 120+ | `120` | `0` | — | `+` | `CAMPAÑAS LANZADAS` | `20,45,68,84,103,120` |

`data-spark` alimenta la sparkline SVG de 1px (tarea 10). Es la serie histórica de la
métrica, no un adorno: el último valor coincide siempre con `data-count`.

## 7. Proyectos / Creatividades (Etapa 02 · Interés)

- H2: `Proyectos que `**`escalan`**
- Hint mono bajo el header: `ARRASTRA EL SCROLL →`
- Hint de backstage (mono, en la card): `VER BACKSTAGE`

Cada caso se presenta como una **creatividad de anuncio** con su chrome real
(tarea 34): cabecera `PAOLA® · Patrocinado`, badge de formato, botón CTA inferior.
El chrome es decorativo (`aria-hidden`); el contenido real del caso es el que se lee.

Los 6 casos (fuente: `src/data/projects.js`, tarea 03):

| # | Cliente | Sector | Año | Tags | KPI principal | KPI secundario |
|---|---|---|---|---|---|---|
| 1 | ATELIER NORD | E-commerce moda | 2025 | META ADS · ESCALA | ROAS 5.8X | +212% REVENUE |
| 2 | FLOWSTACK | SaaS B2B | 2025 | LEAD GEN · B2B | CPL −47% | 3.2X PIPELINE |
| 3 | MASTERCLASS PRO | Infoproducto | 2024 | LAUNCH · WEBINAR | 12.400 LEADS | CPA $1.80 |
| 4 | CASA VERDE | Retail local | 2024 | TRÁFICO · LOCAL | +180% TRÁFICO | ROAS 3.4X |
| 5 | ZENFIT | App móvil | 2025 | APP INSTALLS | CPI $0.90 | 45K INSTALACIONES |
| 6 | GLOW SKIN | DTC belleza | 2026 | DTC · UGC | ROAS 7.1X | 0→$80K/MES |

Descripción tipo por card (1 línea, cuerpo): `Estrategia full-funnel, creatividades UGC
y optimización semanal de campañas.` (varía levemente por proyecto en `projects.js`).

Gradientes por card (placeholders, definidos en `projects.js`):
1. `#7B19C8 → #C559C4` 2. `#C559C4 → #F57327` 3. `#2B0A4A → #7B19C8`
4. `#F57327 → #C559C4` 5. `#161616 → #7B19C8` 6. `#7B19C8 → #F57327`

### 7.1 Datos de anuncio y backstage (tareas 03 y 34)

`audienceShort` es lo que muestra el cursor en hover (tarea 05): debe caber en una
píldora, máximo ~24 caracteres. `audience` completa vive en el backstage textual.

> ⚠ **NDA:** presupuestos y audiencias son datos de cliente. En la versión real
> (tarea 23) se publican como **rangos**, nunca cifras exactas, y siempre con permiso.

| # | Cliente | Formato | Audiencia (backstage) | `audienceShort` (cursor) | Presupuesto | Objetivo | CTA |
|---|---|---|---|---|---|---|---|
| 1 | ATELIER NORD | `REELS 9:16` | `MUJERES 25-44 · ES · INTERESES MODA` | `MUJERES 25-44 · ES` | `$12-18K/MES` | `VENTAS CATÁLOGO` | `COMPRAR AHORA` |
| 2 | FLOWSTACK | `ESTÁTICO 4:5` | `DECISORES IT · ES/LATAM · LOOKALIKE 1%` | `DECISORES IT · ES` | `$6-9K/MES` | `GENERACIÓN DE LEADS` | `MÁS INFORMACIÓN` |
| 3 | MASTERCLASS PRO | `VÍDEO 1:1` | `25-55 · ES · AUDIENCIA CÁLIDA 180D` | `AUDIENCIA CÁLIDA` | `$20-30K/LANZAMIENTO` | `REGISTROS WEBINAR` | `REGISTRARSE` |
| 4 | CASA VERDE | `CARRUSEL 1:1` | `RADIO 15KM · 30-60 · HOGAR Y JARDÍN` | `RADIO 15KM · 30-60` | `$2-3K/MES` | `TRÁFICO A TIENDA` | `CÓMO LLEGAR` |
| 5 | ZENFIT | `REELS 9:16` | `18-34 · ES/PT/IT · FITNESS` | `18-34 · FITNESS` | `$10-14K/MES` | `INSTALACIONES DE APP` | `INSTALAR AHORA` |
| 6 | GLOW SKIN | `REELS 9:16` | `MUJERES 20-40 · ES · SKINCARE` | `MUJERES 20-40 · ES` | `$15-25K/MES` | `VENTAS CATÁLOGO` | `COMPRAR AHORA` |

### 7.2 El test A/B de cada caso (backstage)

Se muestran las dos hipótesis y cuál ganó. Label de la ganadora: `GANADORA`.

| # | Variante A | Variante B | Ganadora | Resultado | Antes → Después |
|---|---|---|---|---|---|
| 1 | `Producto en primer plano` | `Testimonio a cámara` | **B** | `+64% CTR` | `ROAS 2.1X → 5.8X` |
| 2 | `Formulario nativo` | `Landing con demo en vídeo` | **B** | `−47% CPL` | `CPL $84 → $45` |
| 3 | `Webinar en directo` | `Webinar automatizado` | **A** | `+31% ASISTENCIA` | `CPA $4.20 → $1.80` |
| 4 | `Oferta de temporada` | `Producto + horario de tienda` | **A** | `+180% VISITAS` | `1.100 → 3.080 VISITAS/MES` |
| 5 | `Demo de la app en pantalla` | `UGC de usuaria entrenando` | **B** | `−38% CPI` | `CPI $1.45 → $0.90` |
| 6 | `Antes/después de piel` | `Rutina de 15 segundos` | **B** | `ROAS 7.1X` | `0 → $80K/MES` |

## 8. Servicios (Etapa 03 · Consideración)

- H2: `Lo que hago`

| # | Título | Tags mono | Descripción |
|---|---|---|---|
| 01 | Meta Ads | FB · IG · ADVANTAGE+ | Campañas de conversión en Facebook e Instagram: estructura, segmentación, pujas y escala horizontal y vertical. |
| 02 | Paid Social | TIKTOK · PINTEREST · LINKEDIN | Expansión multicanal cuando el funnel lo justifica, con creatividades nativas por plataforma. |
| 03 | Funnels & CRO | LANDINGS · A/B · TRACKING | Páginas y flujos que convierten: CAPI, píxel, eventos, tests A/B y análisis de drop-off. |
| 04 | UGC & Creatividades | GUIONES · HOOKS · TESTING | Sistema de producción y testing creativo: hooks, ángulos y iteración semanal basada en datos. |
| 05 | Auditorías & Consultoría | AUDIT · ROADMAP · MENTORING | Auditoría completa de la cuenta publicitaria con roadmap accionable a 90 días. |

## 9. Proceso (Etapa 03 · Consideración)

- H2: `Método de trabajo`

| # | Paso | Descripción |
|---|---|---|
| 01 | Auditoría | Análisis de cuenta, tracking y competencia. Detectamos fugas de presupuesto y oportunidades rápidas. |
| 02 | Estrategia | Hipótesis, ángulos, estructura de campañas y presupuesto por fase del funnel. |
| 03 | Creatividades | Producción de anuncios (UGC, estáticos, vídeo) orientados a hook + prueba social + CTA. |
| 04 | Lanzamiento | Setup técnico impecable: CAPI, eventos, catálogos y estructura de testing. |
| 05 | Optimización | Iteración semanal: kill de perdedores, escala de ganadores, refresco creativo. |
| 06 | Escala | Crecimiento sostenible protegiendo el ROAS: más presupuesto, más canales, más mercados. |

## 10. Sobre mí (Etapa 04 · Intención — Quién lo opera)

- H2: `Hola, soy Paola`
- Párrafo 1: `Llevo más de 6 años gestionando campañas de paid social para marcas que
  quieren crecer con datos, no con intuición. Mi obsesión: que cada euro invertido
  tenga un retorno medible.`
- Párrafo 2: `Trabajo con un número reducido de clientes para estar dentro de cada
  cuenta, cada semana. Sin humo: reporting claro, testing constante y decisiones
  basadas en números.`
- CV (lista mono):
  - `2019 — MEDIA BUYER · AGENCIA PERFORMANCE (BCN)`
  - `2021 — SENIOR MEDIA BUYER · E-COMMERCE GROUP`
  - `2023 — FREELANCE · META ADS SPECIALIST`
  - `2026 — +40 MARCAS ACOMPAÑADAS`
- Imagen: placeholder con gradiente `#2B0A4A → #161616` + mono overlay `FOTO — 4:5`.

## 11. Testimonios (Etapa 04 · Intención — Prueba social)

1. `«Paola duplicó nuestro ROAS en 90 días y por fin entendimos qué campañas
   funcionaban y por qué.»` — **Marta G.**, CEO · ATELIER NORD
2. `«Reporting impecable y una velocidad de testing que no habíamos visto en
   ninguna agencia.»` — **Daniel R.**, CMO · FLOWSTACK
3. `«Pasamos de quemar presupuesto a escalar con control total. La mejor
   inversión del año.»` — **Lucía P.**, Fundadora · GLOW SKIN

---

## 12. Panel de sesión / HUD (tarea 32) — RETIRADO

> ⚠ **RETIRADO el 2026-08-16.** El panel flotante «SESIÓN EN CURSO» ya no existe.
> Se conserva aquí como registro de lo que hubo y por qué se fue, no como spec.
> Lo que ocupa su sitio está en §20-22 (planes, calculadora y preguntas).

Rail lateral discreto. **Describe la campaña, nunca a la persona.**

- Título del panel (mono, `--muted`): `SESIÓN EN CURSO`
- Filas:

| Label | Valor inicial | Formato |
|---|---|---|
| `TIEMPO` | `00:00` | `mm:ss` |
| `PROFUNDIDAD` | `0%` | entero + barra de 1px |
| `ETAPA` | `ALCANCE` | nombre de etapa (§5) |
| `SEÑALES` | `1` | entero |
| `VARIANTE` | `A` | `A` o `B` + botón `CAMBIAR` |

- Botón de apagado: `DESACTIVAR PANEL`
- Al reactivarlo desde el footer: `REACTIVAR PANEL DE SESIÓN`
- Fila extra **solo con `prefers-reduced-motion`** (sustituye a los toasts):
  `ÚLTIMA SEÑAL` → nombre de la última señal emitida.
- Estado con el panel desactivado (texto del enlace del footer): `PANEL DESACTIVADO`

## 13. Señales y toasts (tarea 33) — RETIRADO

> ⚠ **RETIRADO el 2026-08-16.** Los avisos flotantes de señal se fueron con el panel.
> Se conserva aquí como registro de lo que hubo y por qué se fue, no como spec.
> Lo que ocupa su sitio está en §20-22.

Los nombres de señal son vocabulario literal de Ads Manager y **no se traducen nunca**
(tampoco en la tarea 28 de i18n): esa es la gracia. La glosa en español sí se traduce.

Formato del toast: `▸ ` + nombre + ` — ` + glosa.

| Señal | Glosa | Cuándo |
|---|---|---|
| `PageView` | `impresión servida` | al iniciar |
| `ViewContent` | `contenido visto` | primera sección ≠ hero al 50% |
| `Scroll75` | `75% de profundidad` | profundidad máxima ≥ 75% |
| `ContentEngagement` | `interés en «CLIENTE»` | card visible ≥2,5 s |
| `Dwell60` | `60 s en página` | 60 s de sesión activa |
| `Retargeting` | `has vuelto` | vuelta a la pestaña tras ≥20 s fuera |
| `Conversion` | `objetivo cumplido` | click en el CTA o envío del formulario |

**Título de la pestaña durante el retargeting** (tarea 31). Al perder el foco más de
20 s, `document.title` pasa a:

- `← Esto es retargeting · PAOLA`

Al volver se restaura **exactamente** el título vigente (no una constante: la tarea 28
puede haberlo cambiado de idioma).

## 14. Informe de sesión (tarea 35) — RETIRADO

> ⚠ **RETIRADO el 2026-08-16.** «La campaña eres tú» no se entendía y no vendía: en el punto en el que quien mira ya está decidiendo, el sitio hablaba de sí mismo.
> Se conserva aquí como registro de lo que hubo y por qué se fue, no como spec.
> Lo que ocupa su sitio está en §20-22, que ocupan literalmente su hueco entre testimonios y contacto.

- H2: `La campaña `**`eres tú`**
- Entradilla (cuerpo): `Mientras leías, esta página hacía lo mismo que hago cada día
  con las cuentas que gestiono: medir. Este es el informe de tu visita.`

**Cabecera del panel:**
- Título: `INFORME DE SESIÓN`
- Estados (mono, en este orden): `EN ESPERA` → `COMPILANDO…` → `COMPILADO`
- Tras la señal `Conversion`, el estado pasa a: `OBJETIVO CUMPLIDO`

**Filas del panel** (`<dl>`; valor inicial sin JS: `—`):

| Label | Formato del valor |
|---|---|
| `Tiempo en sesión` | `mm:ss` |
| `Profundidad` | `NN%` |
| `Señales emitidas` | entero |
| `Etapa alcanzada` | nombre de etapa |
| `Creatividades vistas` | `N / 6` |
| `Más atención` | `CLIENTE (mm:ss)` |
| `Variante servida` | `A` o `B`, + ` · cambiada manualmente` si procede |

**Bloque de probabilidad:**
- Label: `Probabilidad de conversión`
- Etiqueta permanente (mono, `--muted`): `ESTIMACIÓN HEURÍSTICA`
- Botón: `ver fórmula` / `ocultar fórmula`
- Texto de la fórmula: `Heurística local: profundidad ×30 + permanencia ×20 +
  creatividades ×20 + señales ×15 + conversión ×15. Máximo 99: ninguna estimación
  honesta dice 100%.`

**Nota final** (el copy que define el proyecto — no alterar sin releer `PLAN.md` §11):

> `Nada de esto ha salido de tu navegador. Sin cookies, sin píxel y sin servidor: se ha
> calculado aquí y desaparece cuando cierres la pestaña.`
>
> `Medir bien no es recoger más datos. Es recoger los justos y saber leerlos. Eso es
> exactamente lo que hago con las cuentas que gestiono.`

**Estado con el panel desactivado:** el informe se congela y muestra en su cabecera
`PANEL DESACTIVADO`, con la nota: `Has apagado la medición. El informe se queda como
estaba.`

## 15. Contacto (Etapa 05 · Conversión)

- CTA gigante: `¿ESCALAMOS?`
- Texto previo (mono): `¿TIENES UN PROYECTO ENTRE MANOS?`
- Email: `hola@paola-ads.com`
- Reloj: `HORA LOCAL — 00:00:00` (se actualiza por JS)

## 16. Footer

- Marquee inverso: `TRABAJEMOS JUNTOS ✦ LET'S WORK TOGETHER ✦` (loop)
- Social (mono): `LINKEDIN` · `INSTAGRAM` · `X` → `href="#"` placeholder
- Línea inferior: `© 2026 PAOLA — TODOS LOS DERECHOS RESERVADOS`
- Enlace de panel: `REACTIVAR PANEL DE SESIÓN` (ver §12)
- Botón: `VOLVER ARRIBA ↑`

## 17. Consentimiento y legal (tarea 24)

El banner deja de ser un trámite y se convierte en parte del statement. Separa
explícitamente la medición local (que no necesita permiso) de la externa (que sí).

**Banner:**
> `Esta página mide tu visita en tu propio navegador y te enseña el resultado al final.
> Eso no sale de aquí y no necesita tu permiso.`
> `Lo que sí lo necesita: Google Analytics y Meta Pixel, que envían datos fuera.`

- Botones: `Rechazar` · `Aceptar` · enlace `Más información`

**Tabla de `cookies.html`** (tres filas, la columna de la derecha se repite a propósito):

| Almacenamiento | Para qué | ¿Se envía a alguien? |
|---|---|---|
| `paola-consent` (localStorage) | Recordar tu decisión sobre analítica | No |
| `paola-session` (sessionStorage) | Datos del panel de sesión; se borra al cerrar la pestaña | No |
| `paola-hud` (localStorage) | Recordar si has desactivado el panel | No |
| Google Analytics / Meta Pixel | Analítica y medición publicitaria | **Sí** — solo si aceptas |

**Cláusula para `privacidad.html`:**
> `Los datos del panel de sesión (tiempo, profundidad de scroll, secciones vistas) se
> calculan y se conservan únicamente en tu navegador. No se transmiten a ningún
> servidor, no se asocian a tu identidad y no se conservan entre visitas. Puedes
> desactivar el panel en cualquier momento desde el propio panel.`

## 18. Meta / SEO (tarea 16)

- `<title>`: `PAOLA — Meta Ads Specialist · Performance Marketing`
- Description: `Especialista en Meta Ads (Facebook e Instagram). Escala tu e-commerce
  o negocio digital con campañas de performance medibles: ROAS medio 4.2x, +$2M
  gestionados.`
- OG title/description: mismos textos. OG image: placeholder `public/og.jpg` (1200×630,
  se documenta cómo generarla; si no existe, se omite la etiqueta).

## 19. Checklist de reemplazo (para la persona, post-build)

- [ ] Nombre real y logo
- [ ] Email y enlaces sociales
- [ ] Métricas reales (4 KPIs + sus series `data-spark`)
- [ ] 6 casos reales: nombres, cifras, imágenes (sustituir gradientes por capturas)
- [ ] Datos de anuncio de cada caso: formato, audiencia, presupuesto **en rango**,
      objetivo, CTA y el test A/B con su ganadora — **con permiso del cliente** (§7.1)
- [ ] Foto retrato (4:5) en Sobre mí
- [ ] Testimonios reales con permiso
- [ ] OG image real
- [ ] Año footer si cambia
- [ ] **Verificar que la declaración de privacidad del §14 sigue siendo literalmente
      cierta**: si se añade cualquier script de terceros, o si las fuentes siguen
      cargándose desde CDN externo, hay que corregir el copy o self-hostear (ver
      `PLAN.md` §11 y tarea 17 §5)


---

## 20. Planes — «Cómo trabajamos» (`#planes`)

Ocupa, con §21 y §22, el hueco del informe retirado. **Sin precios, y es una decisión:**
cada formato se presupuesta sobre la cuenta que tiene delante, y una cifra en la web
descalificaría a la mitad de los buenos encajes antes de la primera llamada.

- Rótulo: `TRABAJAR JUNTOS`
- H2: `Tres formas de `**`empezar`**
- Entradilla: `Ninguna empieza con un contrato. Las tres empiezan con la misma llamada de
  30 minutos, en la que miramos tu cuenta y te digo cuál de ellas te hace falta — o si no
  te hace falta ninguna.`

Cada tarjeta lleva, en este orden: etiqueta de duración · título · **para quién es** ·
cuatro puntos de qué incluye · **qué te llevas** · CTA `Pedir propuesta`.

| # | Etiqueta | Título |
|---|---|---|
| 1 | `Puntual · 2 semanas` | Auditoría |
| 2 | `Continuo · mínimo 3 meses` | Gestión mensual (destacada) |
| 3 | `Puntual · 6 semanas` | Sprint de escala |

El CTA de cada tarjeta **precualifica el formulario**: al pulsarlo, el desplegable «Qué te
interesa» de `#contacto` queda puesto en ese plan. El texto literal de las tres vive en
`src/i18n/es.js` §plans y en `index.html`; los dos tienen que decir lo mismo
(`npm run check:i18n`).

## 21. Calculadora de escala (`#calculadora`)

- Rótulo: `CALCULADORA`
- H2: `Echa la cuenta `**`antes`**` de invertir`
- Tres controles: inversión mensual · ROAS objetivo · ticket medio.
- Cuatro salidas: retorno estimado · sobre lo invertido · ventas al mes · coste máximo
  por venta.

**Regla de honestidad — es la razón de que esta sección exista y no una previsión.** Aquí
estaba el informe, que estimaba una «probabilidad de conversión» con una heurística
inventada. Lo que se publica ahora es solo lo que se puede afirmar sin mentir: una
multiplicación con los números de quien mira. El cierre lo dice en voz alta:

> **Multiplicar es la parte fácil.** Llegar a ese ROAS con ese ticket es todo lo demás de
> esta página: la estructura, las creatividades y las semanas de testing. Y el cálculo se
> hace en tu navegador — no se envía a ninguna parte.

Cualquier cifra que se añada a este bloque tiene que pasar el mismo listón.

## 22. Preguntas frecuentes (`#faq`)

- Rótulo: `PREGUNTAS`
- H2: `Antes de escribirme`

Seis preguntas, y las seis responden a una objeción real: inversión mínima · plazos ·
permanencia · sectores · quién produce las creatividades · qué hay que tener montado.
El tono es el del resto del sitio — **dice también lo que NO encaja** («si vendes offline
[…] hay perfiles mejores que el mío»), que es lo que hace creíble el resto.
