# Tarea 30 — MAINTENANCE.md (rutina trimestral)

> ♻ **Archivo parcialmente reconstruido** (2026-08-15). La tabla de dependencias y toda
> la sección "2.1 Revisión trimestral del concepto" son **literales** del transcript. El
> resto de la rutina se ha reescrito.

## Objetivo
Dejar escrito qué se revisa cada trimestre para que el sitio no envejezca en silencio.

## Archivos a crear/editar
- **Crear** `MAINTENANCE.md` (raíz)

## Spec

`MAINTENANCE.md` con siete bloques: estado de partida, dependencias, revisión del
concepto, contenido, salud técnica, dominio y despliegue, accesibilidad y cierre. Más una
lista de lo que **no** hay que hacer en un mantenimiento.

### Lo que hace distinta a esta rutina

Un mantenimiento normal mira dependencias y certificados. Aquí hay dos cosas más que
pueden romperse **sin dar un solo error**:

1. **`gsap` no es solo animación: es el único reloj del sitio** (`PLAN.md` §9.8). Si
   cambia la API de `gsap.ticker`, se caen a la vez el tracker, el HUD, la cola de toasts,
   el reloj del footer y el informe. Por eso la tabla de dependencias lo marca aparte.
2. **La declaración de privacidad puede volverse mentira sin que nadie toque el copy.**
   Basta con que alguien añada un embed, un script de terceros o devuelva las fuentes al
   CDN. Por eso la revisión del concepto es una comprobación de red, no una lectura.

## Criterios de aceptación
- [x] `MAINTENANCE.md` existe y cubre los siete bloques.
- [x] Incluye la tabla de dependencias con la nota sobre `gsap.ticker`.
- [x] Incluye la revisión trimestral del concepto con sus cinco comprobaciones.
- [x] Recoge las cifras de referencia actuales (62,55 KB de JS inicial) para poder
  detectar una regresión de peso.
- [x] Enlaza `BLOCKERS.md` y `QA-LOG.md`, y advierte de no reactivar §B-01 ni §B-02.
- [ ] Primera ejecución real de la rutina. **Pendiente**: no tiene sentido hasta que el
  sitio esté publicado (tarea 26).

## Verificación
Esta tarea es documentación: se considera hecha cuando alguien que no ha tocado el
proyecto puede seguir la rutina de principio a fin sin preguntar nada.

## ⚠ No hacer
- No convertir el mantenimiento en un rediseño: si aparece trabajo de producto, se abre
  una tarea aparte.
- No actualizar las cuatro dependencias a la vez: de una en una, con build entre medias.
- No dar por buena la declaración de privacidad sin abrir el panel de red.
