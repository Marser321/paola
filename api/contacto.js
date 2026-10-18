// api/contacto.js — función de Vercel: el formulario de contacto, convertido en
// un correo a Paola.
//
// Existe porque el formulario no llegaba a ningún sitio: hasta el 2026-10-17 era
// Netlify Forms sobre un deploy de Vercel. Sin dependencias: Node 22 trae fetch,
// Request y Response, y el envío va por la API REST de Resend
// (https://resend.com/docs/api-reference/emails/send-email).
//
// VARIABLES DE ENTORNO (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY  la clave de la cuenta de Resend
//   CONTACT_TO      a quién llega: el correo de Paola (varios, separados por comas)
//   CONTACT_FROM    remitente de un dominio VERIFICADO en Resend, por ejemplo
//                   'Web Paola Parra <web@su-dominio.com>'
// Si falta cualquiera, responde 503 y el formulario enseña su aviso de error. El
// contrato es el de todo el sitio: nunca fingir que algo funcionó.
//
// Acepta los dos envíos: JSON (core/contact-form.js) y el POST nativo del <form>
// cuando no hay JS, al que contesta redirigiendo de vuelta a #contacto.

// Los mismos `value` del <select> de index.html. Uno desconocido no rompe nada:
// se trata como «Todavía no lo sé».
const PLANES = ['Todavía no lo sé', 'Auditoría', 'Gestión mensual', 'Sistema de captación']
const LIMITES = { nombre: 120, email: 200, plan: 80, mensaje: 5000 }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

async function leer(request) {
  const tipo = request.headers.get('content-type') || ''
  if (tipo.includes('application/json')) return { datos: await request.json(), nativo: false }
  // El POST nativo del <form>, sin JS: application/x-www-form-urlencoded.
  return { datos: Object.fromEntries(new URLSearchParams(await request.text())), nativo: true }
}

/** Datos limpios y recortados, o null si falta algo obligatorio. */
function validar(crudo) {
  const texto = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
  // Una línea: un salto en el nombre o en el email acabaría dentro del asunto.
  const linea = (v, max) => texto(v, max).replace(/[\r\n]+/g, ' ')

  const datos = {
    nombre: linea(crudo.nombre, LIMITES.nombre),
    email: linea(crudo.email, LIMITES.email),
    plan: linea(crudo.plan, LIMITES.plan),
    mensaje: texto(crudo.mensaje, LIMITES.mensaje),
  }
  if (!PLANES.includes(datos.plan)) datos.plan = PLANES[0]

  const completo = datos.nombre && EMAIL.test(datos.email) && datos.mensaje && crudo.privacidad
  return completo ? datos : null
}

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })

export async function POST(request) {
  let entrada
  try {
    entrada = await leer(request)
  } catch {
    return json(400, { error: 'formato' })
  }

  const crudo = entrada.datos && typeof entrada.datos === 'object' ? entrada.datos : {}
  // Sin JS, la respuesta es volver a la página, con el resultado en la URL.
  const responder = (status, body) =>
    entrada.nativo
      ? Response.redirect(new URL(`/?contacto=${body.ok ? 'ok' : 'error'}#contacto`, request.url), 303)
      : json(status, body)

  // Honeypot: un bot rellena el campo oculto. Se le dice que sí y no se envía nada.
  if (crudo['bot-field']) return responder(200, { ok: true })

  const datos = validar(crudo)
  if (!datos) return responder(400, { error: 'validacion' })

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) return responder(503, { error: 'no-configurado' })

  try {
    const envio = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: CONTACT_TO.split(',').map((s) => s.trim()).filter(Boolean),
        // Responder al correo es responder a quien escribió, no al remitente técnico.
        reply_to: datos.email,
        subject: `Web · ${datos.plan} · ${datos.nombre}`,
        text: [`Nombre: ${datos.nombre}`, `Email: ${datos.email}`, `Le interesa: ${datos.plan}`, '', datos.mensaje].join('\n'),
      }),
    })
    if (!envio.ok) return responder(502, { error: 'envio' })
  } catch {
    return responder(502, { error: 'envio' })
  }

  return responder(200, { ok: true })
}
