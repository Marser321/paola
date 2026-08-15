#!/usr/bin/env python3
"""
Genera los assets de public/img/ a partir de los originales de `Selección/`.

NO forma parte de `npm run build`. Es una herramienta de UNA SOLA PASADA: se
ejecuta cuando llegan fotos nuevas, escupe los .avif/.webp y ahí acaba su
trabajo. Por eso puede permitirse dependencias (Pillow, numpy) que el sitio no
tiene: nada de esto viaja al navegador.

    python3 -m venv .venv && .venv/bin/pip install Pillow numpy
    swiftc -O -o scripts/media/cutout scripts/media/cutout.swift
    .venv/bin/python scripts/media/build-media.py

El recorte del hero lo hace `cutout.swift` con Vision (el mismo motor que el
«Levantar sujeto» del Finder): saca una alfa real, con pelo, sin croma.

Las decisiones de encuadre viven en SPECS, abajo. Están razonadas una a una:
cada foto va donde su espacio negativo cae del lado del texto de esa sección.
"""

import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "Selección"
OUT = ROOT / "public" / "img"
CUTOUT_BIN = ROOT / "scripts" / "media" / "cutout"

# Los originales llegaron con nombre de ChatGPT. Se les pone alias corto aquí y
# no se renombran en disco: la carpeta `Selección` es material de origen y se
# queda tal cual llegó.
ORIGINALS = {
    "retrato":     SRC / "ChatGPT Image 15 ago 2026, 18_45_32 (7).png",
    "caminando":   SRC / "ChatGPT Image 15 ago 2026, 18_47_04 (6).png",
    "escritorio":  SRC / "Nueva carpeta" / "ChatGPT Image 15 ago 2026, 19_02_00 (1).png",
    "dashboards":  SRC / "Nueva carpeta" / "ChatGPT Image 15 ago 2026, 19_02_01 (4).png",
    "sillon":      SRC / "Nueva carpeta" / "ChatGPT Image 15 ago 2026, 19_02_01 (5).png",
    "pasillo":     SRC / "Nueva carpeta" / "ChatGPT Image 15 ago 2026, 19_02_01 (6).png",
    "ventana":     SRC / "Nueva carpeta" / "ChatGPT Image 15 ago 2026, 19_02_02 (9).png",
}


# ============================================================
# GRADO DE COLOR
# ============================================================

def _to_hsv(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx, mn = rgb.max(-1), rgb.min(-1)
    d = mx - mn
    v = mx
    s = np.where(mx > 0, d / np.maximum(mx, 1e-6), 0.0)
    h = np.zeros_like(mx)
    m = d > 1e-6
    i = m & (mx == r); h[i] = ((g - b)[i] / d[i]) % 6
    i = m & (mx == g); h[i] = ((b - r)[i] / d[i]) + 2
    i = m & (mx == b); h[i] = ((r - g)[i] / d[i]) + 4
    return (h * 60.0) % 360.0, s, v


def _to_rgb(h, s, v):
    hp = h / 60.0
    c = v * s
    x = c * (1 - np.abs(hp % 2 - 1))
    z = np.zeros_like(c)
    seg = hp.astype(int) % 6
    conds = [seg == i for i in range(6)]
    out = np.stack([
        np.select(conds, [c, x, z, z, x, c]),
        np.select(conds, [x, c, c, x, z, z]),
        np.select(conds, [z, z, x, c, c, x]),
    ], axis=-1) + (v - c)[..., None]
    return np.clip(out, 0, 1)


def kill_violet(rgb, strength=1.0):
    """Saca el violeta malva de la ecuación.

    Se DESATURA, no se repinta de dorado: el oro con valor bajo es verde oliva,
    así que rotar el tono manchaba de oliva todas las sombras. Bajando la
    saturación casi a cero esa luz vuelve a ser luz neutra y el único color que
    queda en el encuadre es el ámbar, que es justo el que se quiere conservar.

    Dos guardas para no tocar a Paola:
      · la banda se corta en 320°, y los labios rosas viven en 335-350°;
      · sólo entra lo que tiene el azul por encima del rojo, así que la piel
        queda fuera aunque roce la banda.
    """
    h, s, v = _to_hsv(rgb)
    r, b = rgb[..., 0], rgb[..., 2]

    lo, hi, feather = 250.0, 320.0, 22.0
    w = np.clip((h - (lo - feather)) / feather, 0, 1)
    w *= np.clip(((hi + feather) - h) / feather, 0, 1)
    w *= np.clip(s / 0.10, 0, 1)
    w *= (b >= r).astype(np.float32)
    w *= strength

    # El tono es circular: 280° → 42° en línea recta pasa por el verde. Se va por
    # el camino corto, que además es el cálido (violeta → magenta → rojo → oro).
    delta = ((42.0 - h + 180.0) % 360.0) - 180.0
    h = (h + delta * w) % 360.0
    s = s * (1 - w * 0.88)
    return _to_rgb(h, s, v)


def warm_grade(rgb, sat=0.88, gain=1.0, lift=0.0, gamma=1.0):
    """Grado común a TODOS los fondos: misma cámara, misma hora del día.

    Es la mitad del arreglo de «los fondos no son coherentes». La otra mitad es
    el desvanecido de los bordes. Aquí sólo se iguala el color: una pizca menos
    de saturación, sesgo al ámbar y negros pegados al fondo del sitio.
    """
    h, s, v = _to_hsv(rgb)
    # Sesgo al ámbar: los tonos fríos se acercan al oro, los cálidos se quedan.
    cold = np.clip((np.abs(((h - 210.0 + 180.0) % 360.0) - 180.0) < 90.0).astype(np.float32), 0, 1)
    delta = ((42.0 - h + 180.0) % 360.0) - 180.0
    h = (h + delta * cold * 0.35) % 360.0
    s = s * sat
    v = np.clip((v ** gamma) * gain + lift, 0, 1)
    return _to_rgb(h, s, v)


# ============================================================
# ENCUADRE Y DESVANECIDO
# ============================================================

def crop_ratio(im, ratio, anchor_x=0.5, anchor_y=0.5):
    """Recorta al ratio pedido conservando todo lo posible del original."""
    w, h = im.size
    if w / h > ratio:
        nw, nh = int(round(h * ratio)), h
    else:
        nw, nh = w, int(round(w / ratio))
    x = int(round((w - nw) * anchor_x))
    y = int(round((h - nh) * anchor_y))
    return im.crop((x, y, x + nw, y + nh))


def edge_fade(size, fade_side, top=0.16, bottom=0.16, side=0.55, tail=0.06):
    """Alfa del «plato» fotográfico: la foto se desvanece por los cuatro lados.

    ESTO es lo que arregla los fondos. Antes cada sección enseñaba un rectángulo
    de textura con el borde cortado a hacha justo en la costura entre secciones:
    de ahí que se sintieran ajenos y despegados. Con la foto muriendo en
    transparencia por arriba y por abajo, las secciones se sueldan; y muriendo
    también hacia el lado del texto, la columna de lectura nunca compite con la
    imagen.

    Al ir la alfa HORNEADA en el archivo, el mismo plato funciona sobre el fondo
    oscuro y sobre el claro sin una sola regla condicional.
    """
    w, h = size
    ys = np.linspace(0, 1, h)[:, None]
    xs = np.linspace(0, 1, w)[None, :]

    a = np.ones((h, w), dtype=np.float32)
    a *= np.clip(ys / top, 0, 1)                    # entra por arriba
    a *= np.clip((1 - ys) / bottom, 0, 1)           # muere por abajo
    if fade_side == "left":                          # texto a la izquierda
        a *= np.clip((xs - tail) / side, 0, 1)
    elif fade_side == "right":                       # texto a la derecha
        a *= np.clip(((1 - xs) - tail) / side, 0, 1)
    # smoothstep: una rampa lineal deja una banda visible donde arranca.
    return a * a * (3 - 2 * a)


def bottom_fade(alpha, start=0.72):
    """Disuelve la parte baja de la figura del hero.

    El original ya la corta por la pantorrilla. Un corte recto se lee como un
    error de recorte; desvaneciéndolo, se lee como que emerge de la penumbra.
    """
    h = alpha.shape[0]
    ys = np.linspace(0, 1, h)[:, None]
    ramp = np.clip((1 - ys) / (1 - start), 0, 1)
    return alpha * (ramp * ramp * (3 - 2 * ramp))


# ============================================================
# SALIDA
# ============================================================

def save(im, name, max_kb=None):
    OUT.mkdir(parents=True, exist_ok=True)
    written = []
    for ext, kwargs in (("avif", dict(quality=58)), ("webp", dict(quality=80, method=6))):
        path = OUT / f"{name}.{ext}"
        im.save(path, **kwargs)
        kb = path.stat().st_size // 1024
        written.append(f"{ext} {kb}KB")
        if max_kb and kb > max_kb:
            print(f"    ⚠ {name}.{ext} = {kb}KB (presupuesto {max_kb}KB)")
    print(f"  · {name:22s} {im.size[0]}×{im.size[1]}  {'  '.join(written)}")


def load(alias):
    path = ORIGINALS[alias]
    if not path.exists():
        sys.exit(f"falta el original: {path}")
    return Image.open(path).convert("RGB")


def as_array(im):
    return np.asarray(im, dtype=np.float32) / 255.0


def as_image(arr, alpha=None):
    rgb = (np.clip(arr, 0, 1) * 255).astype(np.uint8)
    im = Image.fromarray(rgb, "RGB")
    if alpha is not None:
        im.putalpha(Image.fromarray((np.clip(alpha, 0, 1) * 255).astype(np.uint8), "L"))
    return im


# ============================================================
# RECETAS
# ============================================================

def build_retrato():
    """SOBRE MÍ · retrato 4:5.

    El primer plano con las dos luces. Es el único sitio del sitio donde Paola
    se mira de frente y de cerca, así que es el que aguanta el peso de «quién lo
    opera». Sale sin violeta y sin más grado: la luz ámbar de la derecha ya
    estaba en la paleta del sitio antes de que existiera el sitio.
    """
    im = load("retrato")
    arr = kill_violet(as_array(im))
    out = as_image(arr).resize((1000, 1250), Image.LANCZOS)
    save(out, "paola-retrato-4x5", max_kb=400)


def build_figura():
    """HERO · figura recortada con alfa real.

    Vision saca la máscara del sujeto; aquí sólo se recorta a su caja, se deja
    aire y se disuelve el pie. Va a convivir con las partículas, así que no
    lleva ni fondo ni sombra: lo que no es Paola es transparente de verdad.
    """
    src = ORIGINALS["caminando"]
    tmp = OUT.parent / "_figura-cut.png"
    if not CUTOUT_BIN.exists():
        sys.exit(f"falta {CUTOUT_BIN}. Compílalo:\n"
                 f"  swiftc -O -o scripts/media/cutout scripts/media/cutout.swift")
    subprocess.run([str(CUTOUT_BIN), str(src), str(tmp)], check=True,
                   stdout=subprocess.DEVNULL)

    cut = Image.open(tmp).convert("RGBA")
    box = cut.getchannel("A").point(lambda p: 255 if p > 8 else 0).getbbox()
    x0, y0, x1, y1 = box
    pad_x = int((x1 - x0) * 0.06)
    x0, x1 = max(0, x0 - pad_x), min(cut.width, x1 + pad_x)
    y0 = max(0, y0 - int((y1 - y0) * 0.04))
    cut = cut.crop((x0, y0, x1, y1))

    arr = as_array(cut.convert("RGB"))
    alpha = np.asarray(cut.getchannel("A"), dtype=np.float32) / 255.0
    alpha = bottom_fade(alpha, start=0.74)

    out = as_image(arr, alpha)
    ratio = out.width / out.height
    out = out.resize((int(round(1180 * ratio)), 1180), Image.LANCZOS)
    save(out, "paola-figura", max_kb=320)
    tmp.unlink(missing_ok=True)


# name, alias, ratio, anchor_x, lado por el que se desvanece, presupuesto
BACKDROPS = [
    # RESULTADOS: los monitores con las gráficas. Es la única foto del set que
    # enseña literalmente de qué habla la sección.
    ("bg-metricas",    "dashboards", 16 / 7, 0.50, "left",  260),
    # SERVICIOS: la cabecera va pegada arriba a la izquierda en sticky, así que
    # hace falta el hueco a la izquierda. Ella entra por la derecha.
    ("bg-servicios",   "escritorio", 16 / 7, 0.62, "left",  220),
    # PROCESO: el pasillo. Un método es un recorrido, y esta es la única foto
    # con dirección de marcha.
    ("bg-proceso",     "pasillo",    16 / 7, 0.60, "left",  260),
    # PRUEBA SOCIAL: el sillón. Registro conversado, no de escritorio.
    ("bg-testimonios", "sillon",     16 / 8, 0.62, "left",  220),
    # CONTACTO: la ventana. La sección que cierra el sitio mira afuera.
    ("bg-contacto",    "ventana",    16 / 8, 0.40, "right", 220),
]


def build_backdrops():
    """Los cinco platos fotográficos, con la MISMA receta los cinco.

    Sustituyen a las texturas abstractas (`bg-*-fondo` / `bg-*-frente`), que se
    generaron por IA, nunca dejaron de parecer manchas y encima obligaban a
    `mix-blend-mode: screen` y a una capa teñida por máscara para no ensuciar la
    sección. Una foto con la alfa horneada no necesita nada de eso.
    """
    for name, alias, ratio, ax, side, budget in BACKDROPS:
        im = crop_ratio(load(alias), ratio, anchor_x=ax, anchor_y=0.5)
        arr = warm_grade(kill_violet(as_array(im)), sat=0.86, gain=0.94, gamma=1.14)
        alpha = edge_fade(im.size, side)
        out = as_image(arr, alpha)
        out = out.resize((1600, int(round(1600 / ratio))), Image.LANCZOS)
        save(out, name, max_kb=budget)


if __name__ == "__main__":
    print("\n  Construyendo medios desde Selección/\n")
    build_retrato()
    build_figura()
    build_backdrops()
    print()
