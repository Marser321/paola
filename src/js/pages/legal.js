// Entrada de las páginas legales (tarea 24).
// Solo estilos y el conmutador de tema.
//
// Aquí vivía el botón de «retirar el consentimiento de analítica». Se retiró con
// el banner: no había analítica externa que consentir, así que el botón borraba
// una decisión sobre algo que no existe.

import '../../styles/tokens.css'
import '../../styles/base.css'
import '../../styles/sections.css'
import '../../styles/legal.css'
import '../../styles/pill-nav.css'

import { initPillNav } from '../ui/pill-nav.js'
import { initTheme } from '../ui/theme.js'

// El menú es el mismo objeto en las cuatro páginas del sitio: si aquí siguiera
// siendo texto suelto, pasar de la portada a un aviso legal cambiaría el chrome.
// Va antes que el conmutador de tema, que se cuelga de la misma .site-nav.
initPillNav()

// El tema ya lo aplica el <script> del <head>; esto solo pone el botón, para
// que no haya que volver a la portada para cambiarlo.
initTheme()
