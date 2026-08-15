### READ lines 45-74 of 175
  requestAnimationFrame(frame)
}

export function initScramble() {
  if (shouldReduceMotion()) return

  const targets = document.querySelectorAll(
    '.hero__meta span, .metric__label, .section-label, .projects__hint'
  )

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target
        observer.unobserve(el)
        el.dataset.original = el.textContent
        scrambleElement(el)
      })
    },
    { threshold: 0.6 }
  )

  targets.forEach((el) => observer.observe(el))
}
```

### 2. `src/js/fx/split-titles.js` (literal)
```js
import gsap from 'gsap'

### EDIT
--- old ---
  const targets = document.querySelectorAll(
    '.hero__meta span, .metric__label, .section-label, .projects__hint'
  )
--- new ---
  // OJO con dos cosas (ver "⚠ No hacer"):
  // 1) Se apunta a .section-label__stage / __name, NO a .section-label: ese
  //    contenedor tiene DOS hijos <span> y scramblearlo por textContent los
  //    destruiría, perdiendo la jerarquía de color del label de etapa.
  // 2) La UI del tracker queda excluida: escribe los mismos nodos a 4 Hz.
  const targets = document.querySelectorAll(
    '.hero__meta span, .metric__label, .section-label__stage, .section-label__name, .projects__hint'
  )

### READ lines 170-180 of 180
# 2) H2 "Proyectos que escalan": entra por palabras, "escalan" con gradiente
# 3) Subir y bajar: no se repiten
# 4) Reduced-motion: todo estático
```

## ⚠ No hacer
- No aplicar scramble a párrafos ni a KPIs con contador (tarea 10): solo labels
  listados en el selector.
- No hacer split del h1 del hero (ya tiene su propia animación por caracteres).
- No re-inicializar el split en resize: las máscaras por palabra son estables.


### EDIT
--- old ---
## ⚠ No hacer
- No aplicar scramble a párrafos ni a KPIs con contador (tarea 10): solo labels
  listados en el selector.
- No hacer split del h1 del hero (ya tiene su propia animación por caracteres).
- No re-inicializar el split en resize: las máscaras por palabra son estables.
--- new ---
## Ajustes obligatorios por la fase E

1. **Excluir la UI del tracker del scramble.** `.hud`, `.report`, `.signal-toast` y sus
   descendientes escriben `textContent` a 4 Hz desde sus consumidores. Un scramble sobre
   esos mismos nodos pelearía por ellos y produciría parpadeo permanente. La exclusión ya
   está aplicada en el selector de arriba (no aparecen), pero **si alguien amplía el
   selector, esta es la regla**: nada dentro de `.hud`, `.report` ni `.signal-toast`.
2. **Apuntar a `.section-label__stage` / `__name`, nunca a `.section-label`.** Ese
   contenedor tiene dos hijos; escribir su `textContent` los borra.
3. **Sustituir el `requestAnimationFrame` propio de `scrambleElement` por
   `gsap.ticker.add()` / `gsap.ticker.remove()`.** `PLAN.md` §9.8 fija un único RAF para
   todo el sitio; el scramble es el último sitio donde quedaba uno suelto.

## ⚠ No hacer
- No aplicar scramble a párrafos ni a KPIs con contador (tarea 10): solo labels
  listados en el selector.
- **No aplicar scramble a nada dentro de `.hud`, `.report` o `.signal-toast`.**
- No hacer split del h1 del hero (ya tiene su propia animación por caracteres).
- No hacer split del H2 del informe: `La campaña eres tú` es el remate del sitio y debe
  leerse limpio, no montado por palabras.
- No re-inicializar el split en resize: las máscaras por palabra son estables.