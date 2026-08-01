# Gera as capas dos materiais de TERCEIROS (MTE, OIT, CGU, OMS, academicos).
# Mesmo sistema das capas autorais, com duas diferencas deliberadas:
#   - campo Poseidon (verde quase preto) no lugar do verde-marca
#   - o rodape traz a FONTE do documento, nao "ESCUTARIS"
# Assim da para saber de bate-pronto o que e material da casa e o que e
# documento reunido de fora.
#
# Requisitos: pip install pymupdf pillow requests
# Uso: python scripts/gerar_capas_terceiros.py
# Saida: public/assets/covers/capa_<slug>.webp  (800x450)

import os
import io
import fitz
import requests
from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(RAIZ, "public", "assets")
COVERS = os.path.join(ASSETS, "covers")
CACHE = os.path.join(RAIZ, "tmp-pdfs-terceiros")

HOME = os.path.expanduser("~")
FONTES = os.path.join(HOME, "Desktop", "Escutaris-do-Desktop", "Assets Design Escutaris")
GARET = os.path.join(FONTES, "garet", "Garet-Heavy.ttf")
POPPINS_SB = os.path.join(FONTES, "poppins", "Poppins-SemiBold.ttf")
POPPINS_L = os.path.join(FONTES, "poppins", "Poppins-Light.ttf")

W, H = 800, 450

CAMPO = "#222D19"   # Poseidon
TEXTO = "#F8F7F4"   # off-white
ACENTO = "#A95821"  # cobre

STORAGE = "https://ywmqphwdzbmntfusemkl.supabase.co/storage/v1/object/public/materials/"

# (slug, origem, rotulo, titulo curto, fonte no rodape)
# origem: caminho relativo em public/assets OU url completa
MATERIAIS = [
    ("copsoq",              "copsoq-manual-versao-portuguesa.pdf",        "INSTRUMENTO", "COPSOQ",                          "UNIV. DE AVEIRO"),
    ("eri",                 "eri-esforco-recompensa-versao-brasileira.pdf","INSTRUMENTO", "Esforço e recompensa (ERI)",     "CHOR ET AL."),
    ("hse_ms",              "hse-management-standards-aplicacao.pdf",     "ARTIGO",      "HSE Management Standards",        "ARTIGO CIENTÍFICO"),
    ("nasa_tlx",            "nasa-tlx-carga-mental.pdf",                  "INSTRUMENTO", "NASA-TLX",                        "CARGA MENTAL"),
    ("proart",              "proart-protocolo-riscos-psicossociais.pdf",  "PROTOCOLO",   "PROART",                          "UnB"),

    ("nr1",                 STORAGE + "NR01atualizada2024II.pdf",         "NORMA",       "NR-1 atualizada",                 "MTE · 2024"),
    ("nr17",                STORAGE + "nr-17-atualizada-2023.pdf",        "NORMA",       "NR-17 Ergonomia",                 "MTE · 2023"),
    ("portaria_1419",       STORAGE + "portaria-mte-no-1-419-nr-01-gro-nova-redacao.pdf", "PORTARIA", "Portaria 1.419",     "MTE · 2024"),

    ("doencas_trabalho",    STORAGE + "doencas_relacionadas_trabalho_2ed_p1.pdf", "MANUAL", "Doenças relacionadas ao trabalho", "MINISTÉRIO DA SAÚDE"),
    ("riscos_psicossociais",STORAGE + "guia-nr-01-revisado.pdf",          "GUIA",        "Fatores de risco psicossociais",  "MTE · 2025"),
    ("lideranca",           STORAGE + "Guia%20Lideranca%20responsavel.pdf","GUIA",       "Liderança responsável",           "GUIA DE PREVENÇÃO"),
    ("assedio",             STORAGE + "guia-prevencao-assedio-moral-sexual-mte.pdf", "GUIA", "Prevenção ao assédio",        "MTE"),
    ("guia_lilas",          STORAGE + "guia-lilas-assedio-discriminacao-cgu-2024.pdf", "GUIA", "Guia Lilás",                "CGU · 2024"),
    ("ambiente_positivo",   STORAGE + "Guia%20Pratico%20por%20Um%20Ambiente%20de%20Trabalho%20Mais%20Positivo.pdf", "GUIA", "Ambiente de trabalho positivo", "GUIA PRÁTICO"),
    ("nr1_cap15",           STORAGE + "manual-gro-pgr-nr1-mte-2026.pdf",  "MANUAL",      "Capítulo 1.5 da NR-1",            "MTE · 2026"),
    ("gro_pgr",             STORAGE + "Doc%20Oficial%20-%20Perguntas-e-respostas-GRO-PGR-1a-rodada.pdf", "PERGUNTAS", "Perguntas e respostas GRO/PGR", "MTE · 2026"),

    # origem None = nao existe PDF proprio (o material e uma pagina web) ou a fonte
    # bloqueia o download: a capa sai sem miniatura, so com o titulo.
    # O IRIS/OMS devolve uma pagina em branco para cliente automatizado, mesmo com
    # User-Agent de navegador, entao o who_ilo entra sem miniatura de proposito.
    ("who_ilo",             None,                                        "DIRETRIZES",  "Mental health at work",           "OMS · OIT · 2022"),
    ("c190_oit",            None,                                        "CONVENÇÃO",   "Convenção 190",                   "OIT · 2019"),
]


# alguns repositorios (IRIS/OMS) devolvem 403 para cliente sem User-Agent de navegador
CABECALHO = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "application/pdf,*/*",
}


def obter_pdf(origem, slug):
    """Caminho local do PDF, ou None quando nao ha PDF (pagina web) ou a fonte bloqueia."""
    if origem is None:
        return None
    if origem.startswith("http"):
        os.makedirs(CACHE, exist_ok=True)
        local = os.path.join(CACHE, f"{slug}.pdf")
        if not os.path.exists(local):
            r = requests.get(origem, timeout=120, headers=CABECALHO)
            if r.status_code != 200:
                return None
            with open(local, "wb") as f:
                f.write(r.content)
        return local
    return os.path.join(ASSETS, origem)


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


def gerar(slug, origem, rotulo, titulo, fonte_rodape):
    img = Image.new("RGB", (W, H), CAMPO)
    d = ImageDraw.Draw(img)

    caminho_pdf = obter_pdf(origem, slug)
    margem = 50

    pagina = None
    if caminho_pdf:
        doc = fitz.open(caminho_pdf)
        pix = doc[0].get_pixmap(dpi=150)
        pagina = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        doc.close()
        # guarda contra pagina em branco: alguns repositorios devolvem um PDF
        # de uma folha vazia em vez do documento quando o cliente e automatizado
        hist = pagina.convert("L").histogram()
        if sum(hist[240:]) / (pagina.width * pagina.height) > 0.985:
            pagina = None

    if pagina is not None:
        alt = 340
        pagina = pagina.resize((int(pagina.width * alt / pagina.height), alt), Image.LANCZOS)
        px, py = W - pagina.width - 50, (H - alt) // 2

        d.rectangle([px + 10, py + 12, px + pagina.width + 10, py + alt + 12], fill="#0D1108")
        d.rectangle([px + 5, py + 6, px + pagina.width + 5, py + alt + 6], fill="#151C0F")
        img.paste(pagina, (px, py))
        d.rectangle([px, py, px + pagina.width - 1, py + alt - 1], outline=ACENTO, width=1)
        largura_txt = px - 46 - margem
    else:
        # a fonte nao deixa baixar (ex.: IRIS/OMS devolve 403 mesmo com User-Agent).
        # Sem miniatura, o titulo ocupa a largura toda e a capa segue no mesmo sistema.
        px = None
        largura_txt = W - margem * 2 - 40

    f_rot = ImageFont.truetype(POPPINS_SB, 21)
    f_pe = ImageFont.truetype(POPPINS_L, 18)

    tam = 46
    while tam >= 28:
        f_tit = ImageFont.truetype(GARET, tam)
        linhas = quebra(d, titulo, f_tit, largura_txt)
        if len(linhas) <= 3:
            break
        tam -= 3

    espacado(d, (margem, 64), rotulo, f_rot, ACENTO, esp=4)

    y = 122
    for linha in linhas:
        d.text((margem, y), linha, font=f_tit, fill=TEXTO)
        y += int(tam * 1.2)

    d.line([(margem, y + 20), (margem + 76, y + 20)], fill=ACENTO, width=4)
    espacado(d, (margem, H - 64), fonte_rodape, f_pe, TEXTO, esp=1)

    saida = os.path.join(COVERS, f"capa_{slug}.webp")
    img.save(saida, "WEBP", quality=88, method=6)
    return saida, os.path.getsize(saida)


if __name__ == "__main__":
    os.makedirs(COVERS, exist_ok=True)
    total = 0
    for item in MATERIAIS:
        try:
            caminho, tamanho = gerar(*item)
            total += tamanho
            print(f"{os.path.basename(caminho):32s} {tamanho // 1024:4d} KB")
        except Exception as e:
            print(f"capa_{item[0]}.webp  FALHOU: {e}")
    print(f"\n{len(MATERIAIS)} materiais · {total // 1024} KB")
