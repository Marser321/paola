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
«Levantar sujeto» del Finder): saca una alfa real, sin croma. Se invoca con
`--mask` y el afinado del borde se hace aquí — ver build_figura(), que explica
por qué la vía directa daba un contorno dentado y sucio en tema claro.

⚠ Vision NO hace matting de mechones: la silueta del pelo sale maciza. Es el
techo de esta herramienta. Para pelo de verdad hace falta un modelo de matting
(rembg/BiRefNet) o un recorte a mano en Photoshop.

⚠ numpy NO está instalado en esta máquina (2026-08-16), así que el módulo no se
puede importar entero y el resto de pasos no corren. build_figura() se escribió
solo con Pillow a propósito y se puede ejecutar aislado. Para todo lo demás hace
falta el venv de abajo.

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

    Vision saca la máscara del sujeto; aquí se afina el borde y se disuelve el
    pie. Va a convivir con las partículas, así que no lleva ni fondo ni sombra:
    lo que no es Paola es transparente de verdad.

    ⚠ POR QUÉ ESTO NO ES `cutout <in> <out>` A SECAS (revisado 2026-08-16).
    Esa vía usa `generateMaskedImage`, que aplica la máscara EN DURO y a la
    resolución a la que Vision la calcula —bastante menor que la foto—. El
    resultado sale escalonado en bloques, sin un píxel de antialias, y encima
    los píxeles del filo arrastran el color del fondo. Sobre el negro del tema
    oscuro no se nota; sobre el papel crema del tema claro se lee como un borde
    sucio y dentado, que es exactamente lo que se reportó.

    La vía buena es `cutout ... --mask`: devuelve el ALFA suave a resolución del
    original y deja el RGB intacto. Con eso se puede:
      1. tapar los huecos que Vision deja dentro del sujeto (hay uno en la
         cadera, sobre el vano iluminado del fondo);
      2. matar el festoneado del pelo con una mediana ANCHA — no se pierde
         detalle porque la máscara no tiene detalle de pelo que perder, es una
         silueta maciza, y una silueta limpia se lee mucho mejor que una ondulada;
      3. erosionar el filo un pelo, para que caiga DENTRO del sujeto;
      4. descontaminar el color del borde.

    TECHO CONOCIDO: Vision no hace matting de mechones. Para pelo de verdad hace
    falta un modelo de matting (rembg/BiRefNet) o un recorte a mano.

    Todo el tratamiento va en PIL, sin numpy, a propósito: así este paso se puede
    ejecutar aunque el resto del archivo no (ver la nota de numpy en la cabecera).
    """
    from PIL import ImageChops, ImageFilter

    src_path = ORIGINALS["caminando"]
    tmp = OUT.parent / "_figura-mask.png"
    if not CUTOUT_BIN.exists():
        sys.exit(f"falta {CUTOUT_BIN}. Compílalo:\n"
                 f"  swiftc -O -o scripts/media/cutout scripts/media/cutout.swift")
    subprocess.run([str(CUTOUT_BIN), str(src_path), str(tmp), "--mask"], check=True,
                   stdout=subprocess.DEVNULL)

    src = Image.open(src_path).convert("RGB")
    mask = Image.open(tmp).convert("L")

    # 1 · cierre morfológico para tapar huecos internos. El máximo con el
    #     original garantiza que solo AÑADA: dilatar y erosionar por su cuenta
    #     engordaría la silueta por fuera.
    mask = ImageChops.lighter(mask, mask.filter(ImageFilter.MaxFilter(9))
                                        .filter(ImageFilter.MinFilter(9)))

    # 2 · alisado del filo. Al doble para que el erosionado del paso 3 sea
    #     subpíxel. La mediana de 15 alcanza el festoneado de ~8 px de Vision.
    big = mask.resize((mask.width * 2, mask.height * 2), Image.LANCZOS)
    big = big.filter(ImageFilter.MedianFilter(15))
    big = big.filter(ImageFilter.GaussianBlur(3.0))
    alpha = big.resize(mask.size, Image.LANCZOS)

    # 3 · remapeo de niveles: erosiona (todo lo que baja de LO se va a cero, y
    #     con ello los píxeles contaminados) y comprime la rampa a un antialias
    #     limpio de ~1,5 px.
    LO, HI = 150, 215
    alpha = alpha.point(
        lambda v: 0 if v <= LO else (255 if v >= HI else int(255 * (v - LO) / (HI - LO)))
    )

    # 4 · descontaminación: el color de los píxeles con alfa parcial se sustituye
    #     por el del primer plano vecino, propagado desde la zona opaca. El alfa
    #     NO se toca: el halo vive en el color, no en la transparencia.
    solido = alpha.point(lambda v: 255 if v >= 250 else 0)
    color = Image.composite(src, Image.new("RGB", src.size, (0, 0, 0)), solido)
    for _ in range(6):
        color = color.filter(ImageFilter.MaxFilter(5))
    color = Image.composite(src, color, solido)
    color = color.filter(ImageFilter.GaussianBlur(1.0))
    color = Image.composite(src, color, solido)

    cut = Image.merge("RGBA", (*color.split(), alpha))

    # 5 · encuadre, con el mismo aire que tenía el asset anterior para no mover
    #     el layout del hero (media.js declara 695×1180).
    x0, y0, x1, y1 = alpha.point(lambda p: 255 if p > 8 else 0).getbbox()
    pad_x = int((x1 - x0) * 0.06)
    x0, x1 = x0 - pad_x, x1 + pad_x
    y0 = y0 - int((y1 - y0) * 0.016)
    y1 = y1 + int((y1 - y0) * 0.036)
    lienzo = Image.new("RGBA", (x1 - x0, y1 - y0), (0, 0, 0, 0))
    lienzo.paste(
        cut.crop((max(x0, 0), max(y0, 0), min(x1, src.width), min(y1, src.height))),
        (max(-x0, 0), max(-y0, 0)),
    )

    ratio = lienzo.width / lienzo.height
    out = lienzo.resize((int(round(1180 * ratio)), 1180), Image.LANCZOS)

    # 6 · el pie se disuelve. Horneado además de la máscara CSS de media.css:
    #     sobre un fondo plano un corte recto en las piernas se lee como recorte.
    a = out.getchannel("A")
    px = a.load()
    W, H = out.size
    inicio = int(H * 0.74)
    for y in range(inicio, H):
        f = 1.0 - (y - inicio) / (H - inicio)
        for x in range(W):
            px[x, y] = int(px[x, y] * f)
    out = Image.merge("RGBA", (*out.split()[:3], a))

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


def build_galerias():
    """Las 15 muestras de las galerías de servicio.

    Vienen ya compuestas de la tanda V2 (ver PROMPTS-TARJETAS-V2.md), en 4:5 y
    nacidas oscuras, así que aquí NO se les aplica el graduado cálido ni el
    desvanecido de borde de los fondos: eso es para los platos fotográficos, que
    llevan texto encima y tienen que apagarse. Estas son el contenido, se ven a
    tamaño grande al abrirse el acordeón, y retocarlas solo las ensuciaría.

    1000×1250 y no los 1122×1402 del original: es el ancho que necesita la
    tarjeta abierta de la galería elástica (~780 px CSS, el doble en pantalla 2×)
    y bajar un punto desde el original afila en vez de emborronar.
    """
    origen = SRC / "generated-v2"
    if not origen.is_dir():
        print(f"  · sin {origen.relative_to(ROOT)}/ — se omiten las galerías")
        return

    total = 0
    for servicio in ("meta-ads", "paid-social", "funnels-cro", "ugc", "auditorias"):
        for i in (1, 2, 3):
            nombre = f"sample-{servicio}-{i}"
            src = origen / f"{nombre}.png"
            if not src.exists():
                print(f"  ⚠ falta {src.name}")
                continue
            im = crop_ratio(Image.open(src).convert("RGB"), 4 / 5)
            im = im.resize((1000, 1250), Image.LANCZOS)
            # El presupuesto se controla en conjunto (budgets.galleries), no una
            # a una: son quince y lo que importa es lo que suman.
            save(im, nombre)
            total += 1
    print(f"  {total} muestras de galería")


def build_proceso():
    """Las 6 etapas del método de trabajo (#proceso).

    Mismo trato que las galerías y por el mismo motivo: nacen ya compuestas, en
    4:5 y oscuras (ver PROMPTS-PROCESO.md), así que NO se les aplica el graduado
    cálido ni el desvanecido de borde. Eso es para los platos fotográficos, que
    llevan texto encima y tienen que apagarse; estas son el contenido.

    840×1050 y no los 1000×1250 de las galerías: el hueco real de la tarjeta es
    de 416 px CSS como mucho (`.process__stack` va a `max-width: 26rem`), así que
    840 ya es el doble para pantallas de densidad 2. Subir de ahí es pagar peso
    por píxeles que nadie ve.
    """
    origen = SRC / "generated-proceso"
    if not origen.is_dir():
        print(f"  · sin {origen.relative_to(ROOT)}/ — se omiten las etapas del proceso")
        return

    etapas = (
        "proceso-01-auditoria",
        "proceso-02-estrategia",
        "proceso-03-creatividades",
        "proceso-04-lanzamiento",
        "proceso-05-optimizacion",
        "proceso-06-escala",
    )
    total = 0
    for nombre in etapas:
        src = origen / f"{nombre}.png"
        if not src.exists():
            print(f"  ⚠ falta {src.name}")
            continue
        im = crop_ratio(Image.open(src).convert("RGB"), 4 / 5)
        im = im.resize((840, 1050), Image.LANCZOS)
        save(im, nombre)
        total += 1
    print(f"  {total}/6 etapas del proceso")
    if total:
        print("    ↳ ahora quita `pendiente: true` de esas etapas en src/data/media.js")


def build_parallax():
    """Capas de parallax: alfa SACADA DE LA LUMINANCIA.

    Las capas del hero son luz sobre negro — polvo en suspensión, bruma, un
    destello. Eso permite resolver el problema que hunde este tipo de asset:
    casi ningún generador de imágenes devuelve canal alfa de verdad, y recortar
    a mano deja el halo gris que se ve como un parche sobre #0E0E0E.

    Aquí no hace falta recortar. Si el elemento ES la luz, su brillo YA es su
    opacidad: se genera sobre negro puro y el alfa se calcula de la luminancia.
    El resultado no puede tener halo, porque no hay borde que decidir — la
    transición a transparente es exactamente la misma que la del elemento a
    negro, que es continua.

    ⚠ Esto solo vale para elementos ADITIVOS (luz, humo iluminado, partículas).
    Para un sujeto opaco recortado hace falta alfa real: ver build_figura(), que
    usa Vision.

    El color se conserva: se divide por el alfa para deshacer la premultiplicación
    que introduce el fondo negro. Sin ese paso las capas salen lavadas al
    componerlas sobre un fondo que no sea negro — por ejemplo el papel crema del
    tema claro.
    """
    origen = SRC / "generated-parallax"
    if not origen.is_dir():
        print(f"  · sin {origen.relative_to(ROOT)}/ — se omiten las capas de parallax")
        return

    total = 0
    for src in sorted(origen.glob("*.png")):
        im = Image.open(src).convert("RGB")
        arr = as_array(im)
        # Luminancia perceptual, no la media de canales: un dorado saturado y un
        # gris del mismo valor no aportan la misma luz.
        lum = arr[..., 0] * 0.2126 + arr[..., 1] * 0.7152 + arr[..., 2] * 0.0722
        alpha = np.clip(lum, 0.0, 1.0)
        # NORMALIZADO, y no es cosmético. La luminancia del oro del sitio es 0.68,
        # así que una capa dorada pensada como sólida se quedaba en un alfa máximo
        # de 174/255 y nunca llegaba a opaca — medido. Escalando al máximo de cada
        # imagen, el canal alfa expresa la FORMA y la fuerza final la decide
        # `opacity` en el manifiesto, que es donde se puede ajustar por tema sin
        # regenerar el archivo. La caída relativa se conserva entera.
        pico = float(alpha.max())
        if pico > 1e-3:
            alpha = np.clip(alpha / pico, 0.0, 1.0)
        # Deshacer la premultiplicación contra el negro. Donde el alfa es casi
        # cero el color no importa y dividir explota, así que se acota.
        safe = np.maximum(alpha, 1e-3)[..., None]
        rgb = np.clip(arr / safe, 0.0, 1.0)
        rgba = np.dstack([rgb, alpha])

        out = Image.fromarray((rgba * 255).round().astype("uint8"), "RGBA")
        ratio = out.width / out.height
        out = out.resize((2000, int(round(2000 / ratio))), Image.LANCZOS)
        save(out, src.stem)
        total += 1
    print(f"  {total} capa(s) de parallax con alfa")
    if total:
        print("    ↳ declárala(s) en src/data/media.js §CAPAS DE PARALLAX")


if __name__ == "__main__":
    print("\n  Construyendo medios desde Selección/\n")
    import sys as _sys
    solo = _sys.argv[1] if len(_sys.argv) > 1 else None
    pasos = {
        "retrato": build_retrato,
        "figura": build_figura,
        "fondos": build_backdrops,
        "galerias": build_galerias,
        "proceso": build_proceso,
        "parallax": build_parallax,
    }
    # Con argumento se ejecuta UN paso. Sin él, todos. Importa poder ir por
    # partes: regenerar los fondos cuando solo han llegado muestras nuevas es
    # reescribir siete archivos que nadie ha tocado.
    if solo and solo in pasos:
        pasos[solo]()
    else:
        for fn in pasos.values():
            fn()
    print()
