#!/usr/bin/env python
"""
Summer Sail - image pipeline.

Takes the 4K PNGs Higgsfield produces and writes web-ready WebP into
assets/img/. Source files are never modified.

Usage:
    python _build/optimize.py <source.png> <out-path-without-extension> [preset]

Presets:
    hero    2560px wide, q82   full-bleed section backgrounds
    page    2048px wide, q82   interior page heroes
    card    1600px wide, q82   destination cards, split images
    thumb   1200px wide, q80   gallery tiles
    square  1400px wide, q82   cropped to 4:3 for card grids

Crop behaviour: the image is resized to cover the target aspect ratio and
centre-cropped, so nothing is ever letterboxed or distorted.
"""
import sys
import os
from PIL import Image

PRESETS = {
    'hero':   (2560, 76, None),
    'page':   (2048, 77, None),
    'card':   (1600, 78, None),
    'thumb':  (1200, 78, None),
    'square': (1400, 78, 4 / 3),
}


def process(src, out_base, preset='hero'):
    width, quality, ratio = PRESETS[preset]
    im = Image.open(src)
    if im.mode not in ('RGB', 'L'):
        im = im.convert('RGB')

    if ratio:
        target_h = width / ratio
        src_ratio = im.width / im.height
        if src_ratio > ratio:                       # too wide -> crop sides
            new_w = int(im.height * ratio)
            left = (im.width - new_w) // 2
            im = im.crop((left, 0, left + new_w, im.height))
        elif src_ratio < ratio:                     # too tall -> crop top/bottom
            new_h = int(im.width / ratio)
            top = (im.height - new_h) // 2
            im = im.crop((0, top, im.width, top + new_h))
        size = (width, int(round(target_h)))
    else:
        size = (width, int(round(im.height * width / im.width)))

    if im.width > size[0]:
        im = im.resize(size, Image.LANCZOS)

    os.makedirs(os.path.dirname(out_base), exist_ok=True)
    dest = out_base + '.webp'
    im.save(dest, 'WEBP', quality=quality, method=6)

    kb = os.path.getsize(dest) / 1024
    print('  %-46s %5dx%-5d %7.0f KB' % (os.path.basename(dest), im.width, im.height, kb))
    return dest


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    process(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else 'hero')
