# Gera as capas dos materiais AUTORAIS a partir da primeira pagina real do PDF.
# A pagina vira uma miniatura com sombra sobre um campo de cor da marca.
# Resolve o descompasso de formato: o PDF e A4 em pe, o card e 16:9 deitado.
#
# Requisitos: pip install pymupdf pillow
# Uso: python scripts/gerar_capas_autorais.py
# Saida: public/assets/covers/capa_<slug>.webp  (800x450)

import os
import fitz
from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(RAIZ, "public", "assets")
COVERS = os.path.join(ASSETS, "covers")

HOME = os.path.expanduser("~")
FONTES = os.path.join(HOME, "Desktop", "Escutaris-do-Desktop", "Assets Design Escutaris")
GARET = os.path.join(FONTES, "garet", "Garet-Heavy.ttf")
POPPINS_SB = os.path.join(FONTES, "poppins", "Poppins-SemiBold.ttf")
POPPINS_L = os.path.join(FONTES, "poppins", "Poppins-Light.ttf")

W, H = 800, 450

# paleta v2: campo por categoria, ambar como unico acento quente
CAMPO = {
    "material":   "#46603A",  # verde-marca
    "ferramenta": "#565E48",  # verde-musgo
}
TEXTO = "#F8F7F4"   # off-white
ACENTO = "#C98A42"  # ambar

# (arquivo pdf, slug da capa, categoria, rotulo, titulo curto)
MATERIAIS = [
    ("apostila-gro-na-pratica.pdf",                      "apostila_gro",        "material",   "APOSTILA",   "GRO na prática"),
    ("cartilha-10-condutas-lideres.pdf",                 "10_condutas",         "material",   "CARTILHA",   "10 condutas para líderes"),
    ("checklist-nr1-psicossocial.pdf",                   "checklist_nr1",       "ferramenta", "CHECKLIST",  "Checklist NR-1 psicossocial"),
    ("formacao-recomendada-documentos-sst.pdf",          "formacao_sst",        "material",   "REFERÊNCIA", "Formação para documentos de SST"),
    ("guia-conversas-de-acolhimento.pdf",                "acolhimento",         "material",   "GUIA",       "Conversas de acolhimento"),
    ("kit-dds-saude-mental-seguranca.pdf",               "kit_dds",             "ferramenta", "KIT",        "12 diálogos de segurança"),
    ("livreto-hse-para-colaboradores.pdf",               "livreto_hse",         "material",   "LIVRETO",    "Entendendo o questionário HSE"),
    ("matriz-risco-psicossocial.pdf",                    "matriz_risco",        "material",   "MATERIAL",   "Matriz de risco psicossocial"),
    ("miniguia-7-etapas-plano-de-acao.pdf",              "miniguia_7_etapas",   "material",   "MINIGUIA",   "7 etapas até o plano de ação"),
    ("modelo-aep-e-pgr.pdf",                             "aep_pgr",             "ferramenta", "MODELO",     "AEP e PGR"),
    ("passo-a-passo-gro.pdf",                            "passo_a_passo_gro",   "ferramenta", "GUIA RÁPIDO","12 passos do GRO"),
    ("perguntas-reconhecimento-fatores-psicossociais.pdf","perguntas_fatores",  "ferramenta", "ROTEIRO",    "Perguntas para reconhecer os fatores"),
    ("procedimento-governanca-saude-mental.pdf",         "governanca",          "ferramenta", "MODELO",     "Governança em saúde mental"),
    ("guia-questionario-hse-it.pdf",                     "hse_it_guia",         "ferramenta", "GUIA",       "Questionário HSE-IT"),
    ("dinamicas-silencio-desengajamento.pdf",            "dinamicas_silencio",  "material",   "SÍNTESE",    "Dinâmicas de silêncio no trabalho"),
    ("quebrando-o-ciclo-do-silencio.pdf",                "ciclo_do_silencio",   "material",   "EBOOK",      "Quebrando o ciclo do silêncio"),
]


def quebra(draw, texto, fonte, largura):
    linhas, atual = [], ""
    for palavra in texto.split():
        teste = (atual + " " + palavra).strip()
        if draw.textlength(teste, font=fonte) <= largura:
            atual = teste
        else:
            if atual:
                linhas.append(atual)
            atual = palavra
    if atual:
        linhas.append(atual)
    return linhas


def espacado(draw, xy, texto, fonte, cor, esp=4):
    x, y = xy
    for ch in texto:
        draw.text((x, y), ch, font=fonte, fill=cor)
        x += draw.textlength(ch, font=fonte) + esp


def gerar(pdf, slug, categoria, rotulo, titulo):
    img = Image.new("RGB", (W, H), CAMPO[categoria])
    d = ImageDraw.Draw(img)

    # miniatura real da primeira pagina
    doc = fitz.open(os.path.join(ASSETS, pdf))
    pix = doc[0].get_pixmap(dpi=150)
    pagina = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    doc.close()

    alt = 340
    pagina = pagina.resize((int(pagina.width * alt / pagina.height), alt), Image.LANCZOS)
    px, py = W - pagina.width - 50, (H - alt) // 2

    # sombra em duas camadas, para nao ficar chapada
    d.rectangle([px + 10, py + 12, px + pagina.width + 10, py + alt + 12], fill="#141A10")
    d.rectangle([px + 5, py + 6, px + pagina.width + 5, py + alt + 6], fill="#1B2415")
    img.paste(pagina, (px, py))
    d.rectangle([px, py, px + pagina.width - 1, py + alt - 1], outline=ACENTO, width=1)

    # bloco de texto a esquerda
    margem = 50
    largura_txt = px - 46 - margem

    f_rot = ImageFont.truetype(POPPINS_SB, 21)
    f_pe = ImageFont.truetype(POPPINS_L, 20)

    # diminui ate caber em 3 linhas E nenhuma linha estourar a largura.
    # so contar linhas nao basta: uma palavra longa e indivisivel cabe em uma
    # linha e mesmo assim invade a miniatura.
    tam = 46
    while tam >= 22:
        f_tit = ImageFont.truetype(GARET, tam)
        linhas = quebra(d, titulo, f_tit, largura_txt)
        mais_larga = max(d.textlength(l, font=f_tit) for l in linhas)
        if len(linhas) <= 3 and mais_larga <= largura_txt:
            break
        tam -= 2

    espacado(d, (margem, 64), rotulo, f_rot, ACENTO, esp=4)

    y = 122
    for linha in linhas:
        d.text((margem, y), linha, font=f_tit, fill=TEXTO)
        y += int(tam * 1.2)

    d.line([(margem, y + 20), (margem + 76, y + 20)], fill=ACENTO, width=4)
    d.text((margem, H - 66), "ESCUTARIS", font=f_pe, fill=TEXTO)

    saida = os.path.join(COVERS, f"capa_{slug}.webp")
    img.save(saida, "WEBP", quality=88, method=6)
    return saida, os.path.getsize(saida)


if __name__ == "__main__":
    os.makedirs(COVERS, exist_ok=True)
    total = 0
    for item in MATERIAIS:
        caminho, tamanho = gerar(*item)
        total += tamanho
        print(f"{os.path.basename(caminho):38s} {tamanho // 1024:4d} KB")
    print(f"\n{len(MATERIAIS)} capas · {total // 1024} KB no total")
