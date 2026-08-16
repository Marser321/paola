// Entrada de las páginas legales (tarea 24).
// Solo estilos y el conmutador de tema. Sin tracker: igual que en caso.html, el
// concepto vive en la one-page.
//
// Aquí vivía el botón de «retirar el consentimiento de analítica». Se retiró con
// el banner: no había analítica externa que consentir, así que el botón borraba
// una decisión sobre algo que no existe.

import '../../styles/tokens.css'
import '../../styles/base.css'
import '../../styles/sections.css'
import '../../styles/legal.css'

import { initTheme } from '../ui/theme.js'

// El tema ya lo aplica el <script> del <head>; esto solo pone el botón, para
// que no haya que volver a la portada para cambiarlo.
initTheme()
