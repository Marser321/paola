#!/usr/bin/env python3
"""Export the six illustrative service photos. Requires Pillow with AVIF support.

    python3 scripts/media/build-service-visuals.py

Sources remain untouched in src-assets/services-v2. The same exports are reused
by the process section. This does not regenerate images or modify older assets.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
IDS = ('meta-ads', 'crm-ghl', 'medicion', 'landings', 'ia-video', 'auditoria')

for service in IDS:
    name = f'servicio-{service}-v2'
    with Image.open(ROOT / 'src-assets' / 'services-v2' / f'{name}.png') as source:
        image = source.convert('RGB').resize((1200, 800), Image.Resampling.LANCZOS)
        for format_name, quality in [('WEBP', 78), ('AVIF', 62)]:
            target = ROOT / 'public' / 'img' / f'{name}.{format_name.lower()}'
            image.save(target, format=format_name, quality=quality)
            print(f'{target.name}: {target.stat().st_size / 1024:.1f} KB')
