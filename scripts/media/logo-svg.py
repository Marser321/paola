#!/usr/bin/env python3
"""
Traza las piezas del logo y ensambla UN SVG animable.

    .venv/bin/python scripts/media/logo-svg.py

Entra:  src-assets/logo-partes/*.pgm   (los escribe logo-partes.py)
Sale:   src/assets/logo-paola-parra.svg

⚠ LOGO TEMPORAL (2026-08-16). Paola todavía no ha elegido identidad definitiva.
Este es un logo generado, del mismo lote que las fotos placeholder, y va a
cambiar. Cuando llegue el bueno: se sustituye el PNG en src-assets/, se vuelve a
correr logo-partes.py y este script, y ya está — la animación del preloader se
escribe contra los IDS de las piezas (monograma, paola-p, …), no contra trazos
concretos, así que sobrevive al cambio mientras el despiece dé las mismas piezas.
Si el logo nuevo tiene otra estructura, hay que revisar `agrupar()` en
logo-partes.py y ORQUESTA en src/js/core/preloader.js.

POR QUÉ ASÍ. El logo original es un PNG de oro fotorrealista. Un trazado fiel al
color son miles de paths, inanimable y más pesado que el propio PNG. Aquí se traza
la SILUETA de cada pieza y el oro se repinta con un degradado SVG muestreado del
PNG (src-assets/logo-partes/paleta.txt), que es lo que lo deja ligero y animable.

`potracer` es el port en Python puro del potrace de Peter Selinger — mismo
algoritmo, con ajuste de Bézier de verdad, no una poligonal. Se usa aquí y no
`brew install potrace` porque esta máquina no tiene Homebrew, y montar un gestor
de paquetes entero para un script de una pasada no compensa.

⚠ LICENCIAS. potrace y su port son GPLv2+. Se usan como HERRAMIENTA de compilación,
igual que Pillow o numpy: no viajan al navegador. La salida de potrace no queda
cubierta por la GPL — lo dice su propia FAQ.

⚠ ESTO TRAZA CONTORNOS, NO EJES. Un `stroke-dasharray` sobre estos paths dibujaría
el BORDE de las letras, no el trazo. La entrada se anima con una máscara de barrido
por pieza; por eso cada una sale como <g id> propio.
"""
from pathlib import Path
import potrace
import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parents[2]
PARTES = RAIZ / "src-assets" / "logo-partes"
# Va a src/assets/ y NO a public/: el preloader lo INLINEA con `?raw` para poder
# animar cada pieza y para que el degradado lea las custom properties del tema.
# Desde public/ habría que traerlo con fetch, y eso mete una ida y vuelta de red
# justo delante de lo primero que ve el visitante.
SALIDA = RAIZ / "src" / "assets" / "logo-paola-parra.svg"

# Mismo umbral que logo-partes.py, o las piezas no encajarían entre sí.
UMBRAL = 128

# Orden de entrada de la animación: el monograma presenta la marca, la firma se
# escribe de izquierda a derecha, el filete subraya y los caps cierran.
ORDEN = [
    ("1-monograma", "monograma"),
    ("2-paola-p", "paola-p"),
    ("3-paola-resto", "paola-resto"),
    ("4-parra-p", "parra-p"),
    ("5-parra-resto", "parra-resto"),
    ("6-filete", "filete"),
    ("7-caps", "caps"),
]


def punto(p):
    """potracer devuelve tuplas o puntos según la versión."""
    return (p[0], p[1]) if isinstance(p, (tuple, list)) else (p.x, p.y)


def trazar(pgm):
    im = Image.open(pgm).convert("L")
    # ⚠ La máscara va INVERTIDA (`<`, no `>=`). `potracer` toma True como FONDO,
    # al revés que pypotrace. Pasándole el trazo como True traza el negativo: sale
    # un contorno extra que cubre el lienzo entero con el dibujo como agujeros, y
    # con fill-rule evenodd el SVG se pinta como un rectángulo dorado macizo. Es
    # exactamente lo que pasó la primera vez.
    datos = np.asarray(im) < UMBRAL
    if datos.all() or not datos.any():
        return "", 0
    bmp = potrace.Bitmap(datos)
    # turdsize 2 barre las motas del resplandor; alphamax 1.0 es el valor por
    # defecto de potrace y el que mejor respeta los remates finos de caligrafía.
    path = bmp.trace(turdsize=2, alphamax=1.0, opticurve=True, opttolerance=0.2)

    trozos = []
    curvas = 0
    for curva in path:
        curvas += 1
        x, y = punto(curva.start_point)
        d = [f"M{x:.2f},{y:.2f}"]
        for seg in curva:
            ex, ey = punto(seg.end_point)
            if seg.is_corner:
                cx, cy = punto(seg.c)
                d.append(f"L{cx:.2f},{cy:.2f}L{ex:.2f},{ey:.2f}")
            else:
                c1x, c1y = punto(seg.c1)
                c2x, c2y = punto(seg.c2)
                d.append(f"C{c1x:.2f},{c1y:.2f} {c2x:.2f},{c2y:.2f} {ex:.2f},{ey:.2f}")
        d.append("Z")
        trozos.append("".join(d))
    return " ".join(trozos), curvas


def paleta():
    txt = (PARTES / "paleta.txt").read_text().strip().splitlines()
    return [ln.split()[1] for ln in txt]


def main():
    im = Image.open(PARTES / "1-monograma.pgm")
    W, H = im.size
    sombra, medio, base, luz, brillo = paleta()

    grupos = []
    for archivo, ident in ORDEN:
        pgm = PARTES / f"{archivo}.pgm"
        if not pgm.exists():
            print(f"  · falta {pgm.name}, se omite")
            continue
        d, n = trazar(pgm)
        if not d:
            continue
        grupos.append(f'    <g id="{ident}">\n      <path d="{d}"/>\n    </g>')
        print(f"  · {ident:14s} {n:3d} contornos  {len(d)//1024:4d} KB de path")

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"
     role="img" aria-label="Paola Parra — Marketing &amp; Meta Ads">
  <!-- Trazado desde src-assets/logo-paola-parra.png con scripts/media/logo-svg.py.
       NO editar a mano: se regenera. El oro es un degradado, no el del PNG píxel a
       píxel; los tonos están muestreados del original (logo-partes/paleta.txt).
       Cada <g id> es una pieza de la animación de entrada. -->
  <defs>
    <!-- Los tonos salen muestreados del PNG, pero se exponen como custom
         properties: inlineado en el preloader, el tema claro los reemplaza. Sin
         eso el extremo alto del degradado ({luz}/{brillo}) desaparece contra el
         papel crema. Los valores literales son el fallback para cuando el
         archivo se abre suelto, fuera del sitio. -->
    <linearGradient id="oro" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0"    stop-color="var(--logo-oro-1, {sombra})"/>
      <stop offset="0.28" stop-color="var(--logo-oro-2, {medio})"/>
      <stop offset="0.52" stop-color="var(--logo-oro-3, {base})"/>
      <stop offset="0.74" stop-color="var(--logo-oro-4, {luz})"/>
      <stop offset="1"    stop-color="var(--logo-oro-5, {brillo})"/>
    </linearGradient>
  </defs>
  <g fill="url(#oro)" fill-rule="evenodd">
{chr(10).join(grupos)}
  </g>
</svg>
'''
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    SALIDA.write_text(svg)
    kb = SALIDA.stat().st_size // 1024
    print(f"\n{SALIDA.relative_to(RAIZ)} · {kb} KB · {len(grupos)} piezas")


if __name__ == "__main__":
    main()
