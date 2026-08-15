# src-assets/ — originales, fuera del build

Aquí van los archivos **originales** que entrega la clienta: fotos a tamaño completo,
capturas de creatividades, el retrato sin recortar, logos en vectorial.

**Vite no publica esta carpeta.** Solo se publica `public/`, así que nada de lo que haya
aquí acaba en `dist/`. Es a propósito: los originales suelen pesar megas y a veces
contienen metadatos (EXIF con geolocalización, por ejemplo) que no deben salir.

El flujo de conversión a `public/img/` está en [`../BRIEFING.md`](../BRIEFING.md) §8.
