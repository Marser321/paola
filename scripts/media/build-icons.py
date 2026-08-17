#!/usr/bin/env python3
"""
Genera el favicon y los iconos de aplicación a partir de la TIPOGRAFÍA REAL.

    .venv/bin/pip install "fonttools[woff]"
    .venv/bin/python scripts/media/build-icons.py

Por qué existe y no está dibujado a mano: la «P» del icono es la MISMA que la del
logotipo de la cabecera, sacada de ClashDisplay-Bold.woff2. Antes era un trazado
aproximado y se notaba al ponerlos uno al lado del otro.

⚠ COLOR. El icono anterior usaba el gradiente Meta (violeta → rosa → naranja),
que dejó de ser el acento del sitio: se replegó a la barra del informe y el
acento pasó a ser el oro (tokens.css §TEMA). Era el último sitio del proyecto
donde el malva seguía representando a la marca.

ORO PLANO en el favicon, gradiente en los iconos grandes. Medido a 16 px —el
tamaño real de una pestaña— el oro plano da 6,2:1 de contraste medio contra el
fondo del icono y el gradiente 5,8:1. La diferencia es pequeña y por sí sola no
decidiría: lo que inclina la balanza es que a 16 px un gradiente de tres paradas
cae en unos 9 px de alto y no llega a leerse COMO gradiente, así que se paga un
extremo más apagado sin ganar nada a cambio. En 192 y 512 sí hay píxeles para que
se vea como lo que es, y ahí se conserva.
"""

import json
from pathlib import Path

from PIL import Image, ImageDraw
from fontTools.pens.recordingPen import RecordingPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public"
FONT = OUT / "fonts" / "ClashDisplay-Bold.woff2"

# Tokens de src/styles/tokens.css. Excepción documentada de PLAN.md §9.2: ni un
# SVG estático ni un PNG leen custom properties.
FONDO = "#0E0E0E"
ORO = "#D4AF37"          # --gold
ORO_OSCURO = "#8A6A1F"   # --gold-deep
ORO_CLARO = "#F2DFA6"    # --gold-soft


def contorno_p(pasos=24):
    """La «P» de Clash Display Bold, aplanada a polígonos.

    Se aplana aquí en vez de usar un rasterizador de SVG porque en esta máquina no
    hay ninguno, y porque hacen falta los PNG de todas formas.
    """
    fuente = TTFont(FONT)
    glifo = fuente.getBestCmap()[ord("P")]
    pluma = RecordingPen()
    fuente.getGlyphSet()[glifo].draw(pluma)

    def bezier(p0, puntos, grado):
        """de Casteljau para cuadráticas (grado 2) y cúbicas (grado 3)."""
        ctrl = [p0] + list(puntos)
        salida = []
        for i in range(1, pasos + 1):
            t = i / pasos
            tmp = ctrl[:]
            for _ in range(grado):
                tmp = [
                    (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
                    for a, b in zip(tmp, tmp[1:])
                ]
            salida.append(tmp[0])
        return salida

    contornos, actual, cursor = [], [], (0, 0)
    for op, args in pluma.value:
        if op == "moveTo":
            if actual:
                contornos.append(actual)
            cursor = args[0]
            actual = [cursor]
        elif op == "lineTo":
            cursor = args[0]
            actual.append(cursor)
        elif op == "qCurveTo":
            # TrueType encadena cuadráticas con puntos implícitos entre controles.
            pts = list(args)
            fin = pts[-1]
            controles = pts[:-1]
            for i, c in enumerate(controles):
                siguiente = (
                    fin
                    if i == len(controles) - 1
                    else ((c[0] + controles[i + 1][0]) / 2, (c[1] + controles[i + 1][1]) / 2)
                )
                actual.extend(bezier(cursor, [c, siguiente], 2))
                cursor = siguiente
        elif op == "curveTo":
            actual.extend(bezier(cursor, list(args), 3))
            cursor = args[-1]
        elif op == "closePath" and actual:
            contornos.append(actual)
            actual = []
    if actual:
        contornos.append(actual)
    return contornos


def dibujar(lado, gradiente):
    """Un icono cuadrado: fondo redondeado y la P centrada."""
    esc = 8  # se dibuja en grande y se reduce: es el antialiasing del pobre, y basta
    L = lado * esc
    im = Image.new("RGBA", (L, L), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, L - 1, L - 1], radius=int(L * 0.1875), fill=FONDO)

    contornos = contorno_p()
    xs = [p[0] for c in contornos for p in c]
    ys = [p[1] for c in contornos for p in c]
    ancho, alto = max(xs) - min(xs), max(ys) - min(ys)

    # La P ocupa el 56% del lado. Más grande toca las esquinas del redondeo;
    # más pequeña deja el icono con aire de placa y pierde presencia en la pestaña.
    k = (L * 0.56) / alto
    dx = (L - ancho * k) / 2 - min(xs) * k
    dy = (L + alto * k) / 2 + min(ys) * k  # +y arriba en la fuente, abajo en la imagen

    # Máscara del glifo. Se pinta aparte para poder rellenarla con un degradado.
    mascara = Image.new("L", (L, L), 0)
    dm = ImageDraw.Draw(mascara)
    for i, c in enumerate(contornos):
        pts = [(p[0] * k + dx, dy - p[1] * k) for p in c]
        # El contrapunzón de la P (el hueco) es el segundo contorno: se resta.
        dm.polygon(pts, fill=255 if i == 0 else 0)

    if gradiente:
        relleno = Image.new("RGBA", (L, L))
        dg = ImageDraw.Draw(relleno)
        a = tuple(int(ORO_OSCURO[i:i + 2], 16) for i in (1, 3, 5))
        b = tuple(int(ORO[i:i + 2], 16) for i in (1, 3, 5))
        c = tuple(int(ORO_CLARO[i:i + 2], 16) for i in (1, 3, 5))
        for y in range(L):
            t = y / (L - 1)
            ini, fin, u = (a, b, t * 2) if t < 0.5 else (b, c, (t - 0.5) * 2)
            dg.line([(0, y), (L, y)], fill=tuple(int(ini[j] + (fin[j] - ini[j]) * u) for j in range(3)) + (255,))
    else:
        relleno = Image.new("RGBA", (L, L), ORO)

    im.paste(relleno, (0, 0), mascara)
    return im.resize((lado, lado), Image.LANCZOS)


def svg():
    """favicon.svg — el que ven las pestañas. Oro plano, por el motivo de arriba."""
    contornos = contorno_p(pasos=10)
    xs = [p[0] for c in contornos for p in c]
    ys = [p[1] for c in contornos for p in c]
    ancho, alto = max(xs) - min(xs), max(ys) - min(ys)
    k = (64 * 0.56) / alto
    dx = (64 - ancho * k) / 2 - min(xs) * k
    dy = (64 + alto * k) / 2 + min(ys) * k

    partes = []
    for c in contornos:
        pts = [(round(p[0] * k + dx, 2), round(dy - p[1] * k, 2)) for p in c]
        partes.append("M" + " L".join(f"{x},{y}" for x, y in pts) + " Z")

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <!-- Generado por scripts/media/build-icons.py. No editar a mano.
       La P sale de ClashDisplay-Bold, la misma tipografia del logotipo.
       Colores de tokens.css: fondo {FONDO} y oro {ORO}.
       Oro PLANO y no el gradiente de marca: a 16px el gradiente no llega a
       leerse como tal y solo aporta un extremo mas apagado. -->
  <rect width="64" height="64" rx="12" fill="{FONDO}"/>
  <path fill-rule="evenodd" fill="{ORO}" d="{' '.join(partes)}"/>
</svg>
"""


if __name__ == "__main__":
    print("\n  Iconos desde ClashDisplay-Bold\n")
    (OUT / "favicon.svg").write_text(svg())
    print(f"  · favicon.svg           64×64    oro plano")

    for nombre, lado, grad in (
        ("apple-touch-icon.png", 180, True),
        ("icon-192.png", 192, True),
        ("icon-512.png", 512, True),
    ):
        dibujar(lado, grad).save(OUT / nombre)
        kb = (OUT / nombre).stat().st_size // 1024
        print(f"  · {nombre:22s} {lado}×{lado}  {'gradiente':9s} {kb} KB")

    # Prueba de legibilidad: el tamaño real de una pestaña.
    dibujar(16, False).save("/tmp/favicon-16.png")
    dibujar(16, True).save("/tmp/favicon-16-grad.png")
    print("\n  prueba a 16px en /tmp/favicon-16*.png\n")
