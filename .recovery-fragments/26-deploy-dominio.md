### EDIT
--- old ---
## ⚠ No hacer
- No usar redirects SPA (`/* → /index.html`): este sitio es MPA, no los necesita.
--- new ---
## Bloqueantes de lanzamiento del concepto

Esta tarea **no se cierra** sin estas tres comprobaciones en el sitio ya publicado:

1. **Self-hosting de fuentes aplicado** (tarea 17 §5). Con las fuentes en CDN, la frase
   "nada de esto ha salido de tu navegador" del informe es falsa: cada visita expone la IP
   del visitante a Fontshare y a Google (`PLAN.md` §11.9). Si por lo que sea no se hace,
   hay que **cambiar el copy** del informe antes de publicar. Una de las dos cosas.
2. **Panel de red limpio en producción.** Abrir el sitio publicado, recorrerlo entero con
   DevTools → Network abierto y **sin aceptar cookies**: solo deben aparecer el documento,
   los assets propios y nada más. Ni una petición a terceros.
3. **HUD, informe y opt-out funcionando en el dominio real**, no solo en local.

## ⚠ No hacer
- **No lanzar con las fuentes en CDN y el copy del informe sin tocar.** Es la
  contradicción que un jurado o un cliente técnico detecta primero.
- No usar redirects SPA (`/* → /index.html`): este sitio es MPA, no los necesita.