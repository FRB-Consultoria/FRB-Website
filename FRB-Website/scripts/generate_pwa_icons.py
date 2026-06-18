"""
Gera os ícones do PWA da FRB Consultoria a partir do logo oficial.

Saída: FRB-Website/FRB-Website/public/icons/  +  public/favicon.ico

Para regenerar (após trocar o logo):
    python scripts/generate_pwa_icons.py

Requisitos: Pillow  (pip install pillow)
"""
from pathlib import Path
from PIL import Image

# ── Caminhos ──────────────────────────────────────────────────────────────
ROOT      = Path(__file__).resolve().parent.parent          # .../FRB-Website
SRC_IMG   = ROOT / "src" / "assets" / "img"
LOGO_WHITE = SRC_IMG / "logoBranca.webp"     # logo branco (ideal p/ fundo escuro)
LOGO_FULL  = SRC_IMG / "FRB copy.png"        # logo colorido em alta resolução
PUBLIC    = ROOT / "public"
OUT       = PUBLIC / "icons"
OUT.mkdir(parents=True, exist_ok=True)

# ── Identidade visual FRB ──────────────────────────────────────────────────
# Fundo azul-marinho do site (#05162b) com leve gradiente diagonal para dar
# profundidade. Logo branco centralizado.
BG_TOP    = (10, 42, 74)     # #0a2a4a
BG_BOTTOM = (5, 22, 43)      # #05162b
ACCENT    = (4, 173, 224)    # #04ade0


def make_background(size):
    """Fundo com gradiente diagonal sutil na identidade FRB."""
    bg = Image.new("RGBA", (size, size), BG_BOTTOM + (255,))
    grad = Image.new("RGBA", (size, size))
    px = grad.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * size)          # 0 (canto sup-esq) -> 1 (inf-dir)
            r = int(BG_TOP[0] * (1 - t) + BG_BOTTOM[0] * t)
            g = int(BG_TOP[1] * (1 - t) + BG_BOTTOM[1] * t)
            b = int(BG_TOP[2] * (1 - t) + BG_BOTTOM[2] * t)
            px[x, y] = (r, g, b, 255)
    return grad


def place_logo(canvas, logo, scale):
    """Centraliza o logo no canvas ocupando `scale` da largura."""
    size = canvas.size[0]
    target_w = int(size * scale)
    ratio = target_w / logo.width
    target_h = int(logo.height * ratio)
    logo_r = logo.resize((target_w, target_h), Image.LANCZOS)
    x = (size - target_w) // 2
    y = (size - target_h) // 2
    canvas.alpha_composite(logo_r, (x, y))
    return canvas


def build_icon(size, scale, maskable=False):
    """
    Ícone quadrado com fundo da marca + logo branco centralizado.
    maskable=True usa mais respiro (safe-zone de ~20%) para máscaras do Android.
    """
    canvas = make_background(size)
    logo = Image.open(LOGO_WHITE).convert("RGBA")
    canvas = place_logo(canvas, logo, scale)
    return canvas


def main():
    logo_white = Image.open(LOGO_WHITE)
    print(f"Logo fonte: {LOGO_WHITE.name} {logo_white.size}")

    # Ícones "any" (logo ocupa 64% da largura — bom enquadramento)
    for size in (192, 512):
        icon = build_icon(size, scale=0.64)
        path = OUT / f"icon-{size}.png"
        icon.save(path, "PNG")
        print(f"  OK {path.relative_to(ROOT)}")

    # Ícones "maskable" (safe-zone: logo a 50% da largura, fundo full-bleed)
    for size in (192, 512):
        icon = build_icon(size, scale=0.50, maskable=True)
        path = OUT / f"icon-maskable-{size}.png"
        icon.save(path, "PNG")
        print(f"  OK {path.relative_to(ROOT)}")

    # Apple touch icon (iOS adiciona cantos arredondados; fundo preenche tudo)
    apple = build_icon(180, scale=0.62)
    apple_path = OUT / "apple-touch-icon.png"
    apple.save(apple_path, "PNG")
    print(f"  OK {apple_path.relative_to(ROOT)}")

    # Favicons PNG (16 / 32 / 48)
    for size in (16, 32, 48):
        # Para tamanhos pequenos, logo maior (76%) p/ legibilidade
        icon = build_icon(size, scale=0.80)
        path = OUT / f"favicon-{size}.png"
        icon.save(path, "PNG")
        print(f"  OK {path.relative_to(ROOT)}")

    # favicon.ico multi-resolução (16/32/48) na raiz do public
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    base = build_icon(48, scale=0.80)
    ico_path = PUBLIC / "favicon.ico"
    base.save(ico_path, format="ICO", sizes=ico_sizes)
    print(f"  OK {ico_path.relative_to(ROOT)}")

    print("\nÍcones PWA gerados com sucesso.")


if __name__ == "__main__":
    main()
