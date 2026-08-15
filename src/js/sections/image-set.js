// Utilidad compartida por backdrops.js y sequence.js (tarea 38).
// Construye el image-set solo con los formatos DECLARADOS. Ojo: image-set()
// elige por tipo soportado, no por orden — si se declara un .avif que no existe,
// Chromium lo pide igualmente y se queda sin imagen, sin caer al webp. Por eso
// el formato se declara y `npm run check:media` comprueba que cada uno existe.
export function imageSet(src, formats = ['avif', 'webp']) {
  return formats.map((f) => `url("/img/${src}.${f}") type("image/${f}")`).join(', ')
}
