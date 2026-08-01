# Gera as capas dos materiais que sao GUIA ONLINE (nao PDF), a partir de um
# print real da propria pagina. Mesma logica que ja funcionava na capa do
# "Reencontro do Cuidado": mostrar o guia de verdade em vez de desenhar um icone.
#
# Requisitos: pip install pillow  ·  Chrome instalado
# Uso: python scripts/gerar_capas_guias.py
# Saida: public/assets/covers/capa_<slug>.webp  (800x450)

import os
import subprocess
import tempfile
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COVERS = os.path.join(RAIZ, "public", "assets", "covers")

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
W, H = 800, 450

# (slug, url, viewport, corte_do_topo)
# viewport menor = conteudo proporcionalmente maior na miniatura, que e o que
# faz o titulo continuar legivel nos 274x154 em que o card exibe a capa.
# corte_do_topo tira a barra de navegacao, que nao diz nada sobre o material.
GUIAS = [
    ("glossario", "https://escutaris-glossario-interativo.vercel.app/", (1120, 700), 74),
    ("guia_hse",  "https://guia-hse.vercel.app",                        (1120, 700), 74),
    ("mapa_nr1",  "https://escutaris-mapa-nr1.vercel.app",              (1400, 788),  0),
]


def capturar(url, destino, viewport):
    subprocess.run(
        [
            CHROME, "--headless", "--disable-gpu", "--hide-scrollbars",
            f"--window-size={viewport[0]},{viewport[1]}",
            f"--screenshot={destino}",
            "--virtual-time-budget=15000",
            url,
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def gerar(slug, url, viewport, corte_topo, tmp):
    bruto = os.path.join(tmp, f"{slug}.png")
    capturar(url, bruto, viewport)

    img = Image.open(bruto).convert("RGB")
    if corte_topo:
        img = img.crop((0, corte_topo, img.width, img.height))
    # corta pelo centro para 16:9 exato, caso o Chrome devolva altura diferente
    alvo = W / H
    if img.width / img.height > alvo:
        nova_l = int(img.height * alvo)
        img = img.crop(((img.width - nova_l) // 2, 0, (img.width + nova_l) // 2, img.height))
    else:
        nova_a = int(img.width / alvo)
        img = img.crop((0, 0, img.width, nova_a))

    img = img.resize((W, H), Image.LANCZOS)

    saida = os.path.join(COVERS, f"capa_{slug}.webp")
    img.save(saida, "WEBP", quality=88, method=6)
    return saida, os.path.getsize(saida)


if __name__ == "__main__":
    os.makedirs(COVERS, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for slug, url, viewport, corte in GUIAS:
            caminho, tamanho = gerar(slug, url, viewport, corte, tmp)
            print(f"{os.path.basename(caminho):30s} {tamanho // 1024:4d} KB")
    print(f"\n{len(GUIAS)} capas de guia online")
