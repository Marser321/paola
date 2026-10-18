#!/usr/bin/env python3
"""
Despiece del logo para animarlo a la entrada.

    python3 scripts/media/logo-partes.py

Lee `src-assets/logo-paola-parra.png` (PNG con alfa) y escribe en
`src-assets/logo-partes/`:

  · un PGM en gris por PIEZA, listo para `potrace`
  · `paleta.txt` con los oros muestreados del propio PNG
  · `mapa.png` para revisar de un vistazo que el agrupado es correcto

POR QUÉ ESTE PASO EXISTE. El logo es un PNG de oro fotorrealista: degradados,
biselado y brillos. Un trazado fiel al color son miles de paths, inanimable y más
pesado que el PNG. Lo que se traza es la SILUETA, y el oro se repinta con un
degradado SVG muestreado de aquí. Para animar la entrada hace falta además que
cada pieza sea un path propio, y eso es lo que separa este script.

CÓMO SE AGRUPAN. Por componentes conexas del alfa y luego por geometría, no por
un número de componente: el orden de barrido cambiaría al menor retoque del PNG y
el despiece se rompería en silencio. Las bandas verticales están medidas sobre
este archivo — si llega otro logo, hay que revisarlas (imprime los grupos).

⚠ LA CALIGRAFÍA SE TRAZA A CONTORNO, NO A EJE. Un `stroke-dasharray` sobre estos
paths dibujaría el BORDE de las letras, no el trazo. La entrada se anima con una
máscara de barrido por pieza, que es la técnica que se usa de verdad para
caligrafía. Por eso importa el despiece: son las unidades de ese barrido.
"""
from PIL import Image, ImageDraw
from collections import deque
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
ORIGEN = RAIZ / "src-assets" / "logo-paola-parra.png"
SALIDA = RAIZ / "src-assets" / "logo-partes"

# Alfa a partir de la cual un píxel cuenta como trazo. El logo lleva un
# resplandor horneado en el alfa: por debajo de ~110 se empiezan a unir piezas
# que deben ir sueltas, y por encima de ~160 se pierden los filetes finos.
UMBRAL = 128
# Piezas por debajo de esto son motas del resplandor, no dibujo.
MINIMO = 60


def componentes(mask, W, H):
    """Componentes conexas a 8 vecinos. BFS iterativo: la recursión desborda."""
    label = [0] * (W * H)
    salida = []
    cur = 0
    for start in range(W * H):
        if not mask[start] or label[start]:
            continue
        cur += 1
        q = deque([start])
        label[start] = cur
        x0 = x1 = start % W
        y0 = y1 = start // W
        n = 0
        while q:
            p = q.popleft()
            n += 1
            px, py = p % W, p // W
            x0, x1 = min(x0, px), max(x1, px)
            y0, y1 = min(y0, py), max(y1, py)
            for dx, dy in ((1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)):
                nx, ny = px + dx, py + dy
                if 0 <= nx < W and 0 <= ny < H:
                    v = ny * W + nx
                    if mask[v] and not label[v]:
                        label[v] = cur
                        q.append(v)
        if n >= MINIMO:
            salida.append({"id": cur, "n": n, "box": (x0, y0, x1, y1)})
    return salida, label


def agrupar(comps, H):
    """
    De componentes a PIEZAS con nombre, por geometría.

    El orden de la lista ES el orden de entrada de la animación: el monograma
    presenta la marca, la firma se escribe de izquierda a derecha, el filete la
    subraya y los caps cierran.
    """
    grupos = {k: [] for k in (
        "1-monograma", "2-paola-p", "3-paola-resto",
        "4-parra-p", "5-parra-resto", "6-filete", "7-caps",
    )}
    for c in comps:
        x0, y0, x1, y1 = c["box"]
        cx = (x0 + x1) / 2
        alto = y1 - y0
        if y0 < 440 and y1 < 470:
            grupos["1-monograma"].append(c)      # PP + destello
        elif y0 > 855:
            grupos["7-caps"].append(c)           # MARKETING & META ADS
        elif alto < 90 and y0 > 760:
            grupos["6-filete"].append(c)         # filetes, puntos e infinito
        elif cx < 745:
            # La firma se parte sola en la mayúscula con su lazo y el resto.
            grupos["2-paola-p" if x0 < 200 else "3-paola-resto"].append(c)
        else:
            grupos["4-parra-p" if x0 < 900 else "5-parra-resto"].append(c)
    return {k: v for k, v in grupos.items() if v}


def main():
    im = Image.open(ORIGEN).convert("RGBA")
    W, H = im.size
    alfa = im.getchannel("A").tobytes()
    mask = bytearray(1 if alfa[i] >= UMBRAL else 0 for i in range(W * H))

    comps, label = componentes(mask, W, H)
    grupos = agrupar(comps, H)
    SALIDA.mkdir(parents=True, exist_ok=True)

    # Un PGM por pieza, a tamaño completo del lienzo: así todas comparten
    # sistema de coordenadas y los paths encajan sin recolocar nada.
    a_img = im.getchannel("A")
    for nombre, cs in grupos.items():
        ids = {c["id"] for c in cs}
        pieza = Image.new("L", (W, H), 0)
        pp = pieza.load()
        ap = a_img.load()
        for p in range(W * H):
            if label[p] in ids:
                x, y = p % W, p // W
                pp[x, y] = ap[x, y]
        pieza.save(SALIDA / f"{nombre}.pgm")
        n = sum(c["n"] for c in cs)
        caja = (min(c["box"][0] for c in cs), min(c["box"][1] for c in cs),
                max(c["box"][2] for c in cs), max(c["box"][3] for c in cs))
        print(f"  {nombre:16s} {len(cs):3d} trazos  {n:7d} px  caja={caja}")

    # Oros reales del PNG, para el degradado del SVG. Se muestrea SOLO donde el
    # alfa es alto: en el resplandor el color ya está mezclado y engaña.
    px = im.load()
    tonos = []
    for y in range(0, H, 3):
        for x in range(0, W, 3):
            r, g, b, a = px[x, y]
            if a > 200:
                tonos.append((0.2126*r + 0.7152*g + 0.0722*b, (r, g, b)))
    tonos.sort()
    muestras = [tonos[int(len(tonos) * q)][1] for q in (0.04, 0.3, 0.6, 0.88, 0.98)]
    texto = "\n".join(
        f"{n:<8} #{r:02X}{g:02X}{b:02X}"
        for n, (r, g, b) in zip(("sombra", "medio", "base", "luz", "brillo"), muestras)
    )
    (SALIDA / "paleta.txt").write_text(texto + "\n")
    print("\npaleta muestreada del PNG:")
    print(texto)

    # Mapa de revisión.
    vis = Image.new("RGB", (W, H), (14, 14, 14))
    d = ImageDraw.Draw(vis)
    colores = [(255,90,90),(90,220,120),(110,160,255),(255,215,90),
               (220,120,255),(120,235,235),(255,150,60)]
    vp = vis.load()
    de_id = {}
    for i, (nombre, cs) in enumerate(sorted(grupos.items())):
        for c in cs:
            de_id[c["id"]] = colores[i % len(colores)]
    for p in range(W * H):
        c = de_id.get(label[p])
        if c:
            vp[p % W, p // W] = c
    for i, (nombre, cs) in enumerate(sorted(grupos.items())):
        caja = (min(c["box"][0] for c in cs), min(c["box"][1] for c in cs),
                max(c["box"][2] for c in cs), max(c["box"][3] for c in cs))
        d.rectangle(caja, outline=colores[i % len(colores)])
    vis.save(SALIDA / "mapa.png")
    print(f"\n{len(grupos)} piezas en {SALIDA}")
    print("Siguiente paso (necesita potrace):")
    print("  for f in src-assets/logo-partes/*.pgm; do \\")
    print('    potrace -s -o "${f%.pgm}.svg" --turdsize 2 --alphamax 1 "$f"; done')


if __name__ == "__main__":
    main()
