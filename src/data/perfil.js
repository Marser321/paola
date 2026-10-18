// PERFIL — quién es, cómo se la contacta y qué cifras puede afirmar la web.
//
// >>> ES EL ÚNICO SITIO DONDE SE ESCRIBE UN DATO DE CONTACTO O UNA CIFRA. <<<
//
// Lo leen, cada uno por su lado:
//   · vite.config.js (plugin `sitio`), al construir: el enlace de correo, las
//     redes del pie y el JSON-LD van escritos en el HTML estático;
//   · el navegador: el aviso de error del formulario y el reloj de contacto;
//   · scripts/og/build-og.mjs: las cifras de la imagen para compartir;
//   · scripts/check-contenido.mjs: que el HTML no diga otra cosa que esto.
//
// MISMO CONTRATO QUE src/data/availability.js: un campo VACÍO no se pinta. Ni un
// enlace a «#», ni un correo que no existe, ni una hora que no es la suya. Hasta
// el 2026-10-17 la web enlazaba LinkedIn, Instagram y X a «#» y mandaba escribir
// a hola@paola-ads.com, que nunca existió: un dato inventado cuesta más que un
// hueco, porque el hueco no se nota y el dato falso sí.

export const perfil = {
  nombre: 'Paola Parra',
  rol: 'Paid Media Manager',
  empresa: 'AD Media Solution',

  // Rellenar con los de verdad. Vacíos, cada uno desaparece sin dejar hueco.
  contacto: {
    email: '',       // 'paola@…' → mailto en el CTA, línea de correo y JSON-LD
    linkedin: '',    // URL completa del perfil → pie y `sameAs` del JSON-LD
    ciudad: '',      // la que acompaña al reloj: «Hora en Miami —»
    zonaHoraria: '', // IANA, p. ej. 'America/New_York'. Sin ella no hay reloj
  },

  // Lo que el JSON-LD declara como `knowsAbout`. Son los diferenciales que la
  // auditoría pide enseñar, no una nube de palabras clave.
  especialidades: [
    'Meta Ads',
    'GoHighLevel',
    'CRM',
    'Automatizaciones de marketing',
    'API de Conversiones de Meta',
    'Landing pages',
    'Embudos de captación de leads',
    'Edición de video',
  ],

  // CIFRAS — de la auditoría del 17 oct 2026 (Ajustes_Web_Paola_Parra.pdf), que
  // las sacó de Meta Ads: gasto por cuenta del 1 ene 2025 al 17 oct 2026, solo
  // cuentas en USD con acceso de lectura.
  //
  // ⚠ La cifra real es MAYOR: no entran las cuentas en otras monedas, las
  // deshabilitadas ni las que no tenían el conector activo. Por eso todo lo que
  // se publique a partir de aquí se redondea HACIA ABAJO («+US$1.1M», no «1.2»).
  //
  // `invertido` es la suma de las nueve filas de src/data/sectores.js; el
  // comprobador de contenido verifica que sigan cuadrando.
  cifras: {
    invertido: 1137187,
    cuentas: 59,
    cuentasMas10k: 22,
    marcas: 40,
    anios: 9, // en marketing digital desde 2017
    equipo: 4,
    periodo: { desde: '2025-01-01', hasta: '2026-10-17' },
  },
}
