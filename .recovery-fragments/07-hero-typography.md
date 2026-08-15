### READ lines 1-30 of 114
# Tarea 07 — Hero: split de letras + animación de entrada

## Objetivo
Dividir el título "PAOLA" en caracteres animables y ejecutar la entrada cinematográfica
del hero cuando el preloader dispara `app:ready`.

## Archivos a crear/editar
- **Crear** `src/js/sections/hero.js`
- **Editar** `src/main.js`
- **Editar** `src/styles/sections.css` (añadir reglas al final)

## Spec

### 1. `src/js/sections/hero.js` (literal)
```js
import gsap from 'gsap'
import { shouldReduceMotion } from '../core/lenis.js'

function splitTitle() {
  const title = document.querySelector('.hero__title')
  if (!title || title.dataset.split) return
  const text = title.textContent
  title.textContent = ''
  // aria-label="Paola" ya existe en el HTML (tarea 02) → accesibilidad OK
  ;[...text].forEach((char) => {
    const span = document.createElement('span')
    span.className = 'char'
    span.textContent = char
    span.setAttribute('aria-hidden', 'true')
    title.appendChild(span)

### EDIT
--- old ---
## Objetivo
Dividir el título "PAOLA" en caracteres animables y ejecutar la entrada cinematográfica
del hero cuando el preloader dispara `app:ready`.
--- new ---
## Objetivo
Dividir el título "PAOLA" en caracteres animables y ejecutar la entrada cinematográfica
del hero cuando el preloader dispara `app:ready`.

> **Restricción de orden con el test A/B (tarea 36).** `initAbTest()` corre **antes** que
> `initHero()` en `main.js` (`PLAN.md` §4.3, restricción b): esta tarea anima el subtítulo
> desde el estado que encuentre en el DOM, así que la variante debe estar ya escrita o se
> vería el cambio de texto durante el reveal.
>
> **El `h1` "PAOLA" no entra en el test A/B.** La marca es marca: solo varía el subtítulo
> (`[data-variant-slot="subtitle"]`). El split de letras nunca toca contenido variable.