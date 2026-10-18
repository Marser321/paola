#!/usr/bin/env node
// Pruebas de api/contacto.js. Sin dependencias: node:assert y un fetch simulado.
//
//   npm run test:contacto
//
// POR QUÉ EXISTE. `vite dev` no ejecuta /api, así que en local el formulario
// siempre cae en su aviso de error y no hay forma de ver la función trabajar.
// Esto la ejecuta tal cual, con las cuatro salidas que importan: sin configurar,
// datos inválidos, un bot, y un envío bueno (y uno que Resend rechaza).

import assert from 'node:assert/strict'
import { POST } from '../api/contacto.js'

const BUENO = {
  nombre: 'Ana Pérez',
  email: 'ana@ejemplo.com',
  plan: 'Auditoría',
  mensaje: 'Tengo una clínica en Miami y quiero más citas.',
  privacidad: 'si',
}

const ENV = { RESEND_API_KEY: 're_prueba', CONTACT_TO: 'paola@ejemplo.com', CONTACT_FROM: 'Web <web@ejemplo.com>' }

const pedir = (cuerpo, tipo = 'json') =>
  new Request('https://paola.test/api/contacto', {
    method: 'POST',
    headers: { 'Content-Type': tipo === 'json' ? 'application/json' : 'application/x-www-form-urlencoded' },
    body: tipo === 'json' ? JSON.stringify(cuerpo) : new URLSearchParams(cuerpo).toString(),
  })

const fetchReal = globalThis.fetch
let llamadas = []
function simularResend(status = 200) {
  llamadas = []
  globalThis.fetch = async (url, opciones) => {
    llamadas.push({ url, cuerpo: JSON.parse(opciones.body) })
    return new Response('{}', { status })
  }
}

function conEnv(vars) {
  for (const k of Object.keys(ENV)) delete process.env[k]
  Object.assign(process.env, vars)
}

const casos = [
  ['sin variables de entorno → 503 y no envía', async () => {
    conEnv({})
    simularResend()
    const r = await POST(pedir(BUENO))
    assert.equal(r.status, 503)
    assert.equal(llamadas.length, 0)
  }],
  ['email inválido → 400', async () => {
    conEnv(ENV)
    simularResend()
    const r = await POST(pedir({ ...BUENO, email: 'no-es-un-email' }))
    assert.equal(r.status, 400)
    assert.equal(llamadas.length, 0)
  }],
  ['sin aceptar la privacidad → 400', async () => {
    conEnv(ENV)
    simularResend()
    const { privacidad, ...sinPrivacidad } = BUENO
    const r = await POST(pedir(sinPrivacidad))
    assert.equal(r.status, 400)
  }],
  ['honeypot relleno → 200 y NO envía', async () => {
    conEnv(ENV)
    simularResend()
    const r = await POST(pedir({ ...BUENO, 'bot-field': 'spam' }))
    assert.equal(r.status, 200)
    assert.equal(llamadas.length, 0)
  }],
  ['envío bueno → 200, a Resend, con reply_to del visitante', async () => {
    conEnv(ENV)
    simularResend()
    const r = await POST(pedir(BUENO))
    assert.equal(r.status, 200)
    assert.equal(llamadas.length, 1)
    assert.equal(llamadas[0].url, 'https://api.resend.com/emails')
    assert.equal(llamadas[0].cuerpo.reply_to, BUENO.email)
    assert.deepEqual(llamadas[0].cuerpo.to, ['paola@ejemplo.com'])
    assert.match(llamadas[0].cuerpo.subject, /Auditoría · Ana Pérez/)
    assert.match(llamadas[0].cuerpo.text, /clínica en Miami/)
  }],
  ['un salto de línea en el nombre no llega al asunto', async () => {
    conEnv(ENV)
    simularResend()
    await POST(pedir({ ...BUENO, nombre: 'Ana\r\nBcc: otro@ejemplo.com' }))
    assert.doesNotMatch(llamadas[0].cuerpo.subject, /[\r\n]/)
  }],
  ['plan desconocido → se trata como «Todavía no lo sé»', async () => {
    conEnv(ENV)
    simularResend()
    await POST(pedir({ ...BUENO, plan: 'Sprint de escala' }))
    assert.match(llamadas[0].cuerpo.subject, /Todavía no lo sé/)
  }],
  ['Resend rechaza → 502', async () => {
    conEnv(ENV)
    simularResend(422)
    const r = await POST(pedir(BUENO))
    assert.equal(r.status, 502)
  }],
  ['POST nativo sin JS → 303 de vuelta a #contacto', async () => {
    conEnv(ENV)
    simularResend()
    const r = await POST(pedir(BUENO, 'form'))
    assert.equal(r.status, 303)
    assert.match(r.headers.get('location'), /\?contacto=ok#contacto$/)
  }],
]

let fallos = 0
for (const [nombre, prueba] of casos) {
  try {
    await prueba()
    console.log(`  ✓ ${nombre}`)
  } catch (error) {
    fallos++
    console.error(`  ✗ ${nombre}\n    ${error.message}`)
  }
}
globalThis.fetch = fetchReal

if (fallos) {
  console.error(`\n✗ api/contacto.js: ${fallos} de ${casos.length} pruebas fallan.`)
  process.exit(1)
}
console.log(`\n✓ api/contacto.js: ${casos.length} pruebas en verde.`)
