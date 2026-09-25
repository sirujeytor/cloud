"""Genera los iconos PNG de la extension (circulo + tacha, estilo 'bloqueado')."""
from PIL import Image, ImageDraw

BG = (26, 31, 54, 255)       # fondo oscuro
RING = (45, 212, 191, 255)   # teal
BAR = (255, 255, 255, 255)   # blanco

def make_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    pad = max(1, size // 16)
    draw.ellipse([pad, pad, size - pad, size - pad], fill=BG)
    ring_w = max(1, size // 10)
    draw.ellipse(
        [pad + ring_w, pad + ring_w, size - pad - ring_w, size - pad - ring_w],
        outline=RING,
        width=max(1, size // 12),
    )
    bar_w = max(1, size // 8)
    margin = size // 3.2
    draw.line([(margin, margin), (size - margin, size - margin)], fill=BAR, width=bar_w)
    return img


for s in (16, 48, 128):
    make_icon(s).save(f"/home/user/cloud/incognito-adblock/icons/icon{s}.png")

print("iconos generados")
