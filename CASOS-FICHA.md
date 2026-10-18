# Ficha de caso — para Paola

La web enseña hoy los **sectores** donde se ha invertido (con la cifra real de Meta Ads)
y deja un hueco para un caso real en cada uno. Un caso **solo aparece cuando está
completo**: si falta un dato obligatorio, no se publica nada de él. Así no vuelve a
pasar lo de la plantilla, con clientes y cifras que no existían.

Rellena una ficha por caso (lo ideal: uno por cada sector destacado — joyería, salud y
estética, crédito, seguros) y pásasela a Mario. Él la pasa a `src/data/sectores.js`.

---

## 1. Datos del caso

| Campo | Obligatorio | Ejemplo |
|---|---|---|
| Sector | sí | Salud, estética y odontología |
| Título (sin el nombre del cliente si así se pactó) | sí | Clínica estética en Florida |
| Cómo aparece la marca en el anuncio | no | Clínica estética · Florida |
| Periodo | sí | Mar–ago 2026 |
| **El reto** (2–3 frases) | sí | Recibían leads por formulario, pero nadie los llamaba a tiempo y casi ninguno llegaba a la cita. |
| **Qué hicimos** (3–5 pasos) | sí | Embudo TOFU-MOFU-BOFU en Meta Ads · Landing de una sola acción · Pipeline en GoHighLevel con recordatorios por SMS · Eventos de cita enviados por API de Conversiones |
| **Resultado** (1–3 cifras, cada una con su etiqueta) | sí, al menos una | `$18` CPL · `64` citas al mes · `$52` por cita |
| Antes → después | no | CPL $41 → CPL $18 |
| Inversión (**siempre en rango**) | no | US$3–5K/mes |
| Herramientas | no | Meta Ads · GoHighLevel · API de Conversiones |
| CTA del anuncio | no | Reservar |

Las cifras tienen que poder verse en Ads Manager o en el CRM: si alguien pregunta,
se enseñan.

## 2. El creativo

Un creativo **real** de la campaña (el anuncio que corrió), en buena resolución:
imagen o un fotograma del video. Se publica a 1600×1000 (8:5), así que conviene que
lo importante no esté pegado a los bordes. Y una frase que describa qué se ve (sirve
de texto alternativo), por ejemplo: «Anuncio de la clínica: una paciente sonríe tras
el tratamiento, con el botón Reservar».

## 3. Permiso

- [ ] El cliente autorizó **por escrito** publicar el caso (un WhatsApp sirve).
- [ ] Sabemos si quiere aparecer con su nombre o sin él.
- [ ] Revisé las cifras contra Ads Manager / el CRM.

Sin las tres marcas, el caso no se publica.

---

## Testimonios

Mismo criterio. Pide 3 testimonios cortos (por WhatsApp o desde Google Reviews), con
permiso para publicarlos:

| Campo | Ejemplo |
|---|---|
| La cita, literal | «Pasamos de no saber de dónde venían los clientes a verlo todo en el CRM.» |
| Nombre (o, si prefiere no salir, su rol y su sector) | María L. — Dueña · Clínica estética |
| Dónde lo dijo | Google Reviews |
| ¿Autorizó publicarlo? | sí |

Van a `src/data/testimonios.js`. Con uno solo, la sección aparece.

---

## Datos de contacto que faltan

En `src/data/perfil.js` → `contacto`. Mientras estén vacíos, no se muestran:

- Correo de contacto
- URL de LinkedIn
- Ciudad y zona horaria (para el reloj de la sección de contacto)

Y para que el formulario entregue los mensajes, las tres variables de Resend en Vercel
(ver `MAINTENANCE.md` §0).
