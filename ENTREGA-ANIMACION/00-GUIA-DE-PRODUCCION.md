# Entrega de animación — PAOLA

Esta carpeta contiene **26 imágenes fuente** organizadas para image-to-video:

- `01-proyectos/`: 6 creatividades de caso, cada una con su `ANIMACION.txt`.
- `02-servicios/`: 15 muestras, agrupadas por servicio, con un prompt por imagen.
- `03-fondos/`: 5 fotografías fuente de sección y sus prompts.
- `04-recursos-comunes/`: reglas técnicas y negative prompt compartido.

## Dirección: “wow controlado”

El movimiento debe sentirse al segundo vistazo. La web ya tiene scroll horizontal,
profundidad WebGL, deformación de planos, parallax, tipografía y partículas. Añadir vídeo a
todo simultáneamente la convertiría en ruido. La jerarquía recomendada es:

1. **Momento wow principal:** galería 3D de proyectos. Mantener sus texturas estáticas; el
   viaje en profundidad y la curvatura por scroll ya son el movimiento.
2. **Vídeo narrativo:** reproducir el clip solo dentro de la tarjeta de proyecto más cercana
   o activa. Las demás conservan su poster.
3. **Servicios:** solo se reproduce la muestra que el visitante expande. Nunca tres vídeos
   simultáneos en una misma tira.
4. **Fondos:** movimiento subliminal y a baja opacidad. Priorizar Proceso, Métricas y
   Contacto. Servicios y Testimonios son secundarios.

## Orden recomendado de producción

| Prioridad | Piezas | Motivo |
|---|---|---|
| A | Atelier Nord, Masterclass Pro, Zenfit, Glow Skin | El formato del caso ya es vídeo/Reel |
| A | `bg-proceso`, `bg-metricas`, `bg-contacto` | Aportan narrativa sin competir con tarjetas |
| B | Meta Ads 2 y 3, Funnels 2, UGC 2, Auditorías 3 | El movimiento explica el servicio |
| B | Flowstack, Casa Verde | Microanimación ambiental, no vídeo protagonista |
| C | Resto de muestras y fondos | Producir solo si A y B se sienten sobrios |

## Entrega técnica de cada clip

- Duración: 4 s para tarjetas y muestras; 6 s para fondos.
- 24 fps, una sola toma y bucle perfecto.
- Exportar master ProRes o H.264 de alta calidad.
- Web: WebM + MP4, sin audio, `muted`, `playsinline`, poster obligatorio.
- Las tarjetas mantienen su tamaño actual: proyectos `1600×1000`; servicios `1000×1250`.
- Fondos: exportar al menos a 1920 px de ancho, conservando el encuadre fuente.
- El primer y último frame deben ser intercambiables.

## Integración profesional

- Cargar vídeo solo cuando la pieza entra en viewport mediante `IntersectionObserver`.
- Pausar y liberar el vídeo al salir.
- Con `prefers-reduced-motion: reduce`, no descargar vídeo: mostrar el poster.
- En móvil, usar poster por defecto; habilitar vídeo únicamente tras medir peso y batería.
- No reproducir vídeo dentro de todos los planos WebGL. Si se implementa `VideoTexture`,
  activar únicamente el plano más cercano y mantener los demás como texturas estáticas.
- Presupuesto inicial: ≤450 KB por loop de tarjeta, ≤650 KB por fondo y máximo un vídeo
  descargándose por sección.

