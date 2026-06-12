// Gera capas editoriais para os materiais — sistema baseado no feedback:
// fundo chapado por categoria, sigla grande, símbolo linear abstrato,
// fonte/instituição embaixo, bastante respiro.
// Uso: node scripts/gerar-capas-sobrias.cjs (gera SVGs em tmp-capas/)
const fs = require('fs');
const path = require('path');

// Sistema de cores por categoria (feedback da consultoria de design)
const CORES = {
  legislacao: { bg: '#1C3520', texto: '#F0EDE6', acento: '#C97B5D' },  // verde profundo
  manual:     { bg: '#F0EDE6', texto: '#3E5230', acento: '#8F3F25' },  // verde-musgo s/ claro
  diretrizes: { bg: '#A7B8AC', texto: '#1C3520', acento: '#F0EDE6' },  // verde-sálvia
  prevencao:  { bg: '#8F3F25', texto: '#F0EDE6', acento: '#E8C9B8' },  // terracota sóbrio
  ferramenta: { bg: '#E5DCC8', texto: '#1C3520', acento: '#8F3F25' },  // bege com verde
};

const ROTULO = {
  legislacao: 'LEGISLAÇÃO',
  manual: 'MANUAL TÉCNICO',
  diretrizes: 'DIRETRIZES',
  prevencao: 'PREVENÇÃO',
  ferramenta: 'FERRAMENTA',
};

// Símbolos lineares abstratos (stroke only), centrados em 0,0
const SIMBOLOS = {
  documento: `<rect x="-42" y="-52" width="84" height="104" rx="6"/><line x1="-22" y1="-22" x2="22" y2="-22"/><line x1="-22" y1="0" x2="22" y2="0"/><line x1="-22" y1="22" x2="10" y2="22"/>`,
  selo: `<circle cx="0" cy="-8" r="46"/><circle cx="0" cy="-8" r="32"/><line x1="-16" y1="32" x2="-26" y2="56"/><line x1="16" y1="32" x2="26" y2="56"/>`,
  fluxo: `<rect x="-74" y="-48" width="62" height="38" rx="5"/><rect x="12" y="12" width="62" height="38" rx="5"/><path d="M -12 -29 H 20 V 12" fill="none"/>`,
  ondas: `<path d="M -64 18 Q -32 -30 0 18 Q 32 66 64 18" fill="none"/><path d="M -64 -14 Q -32 -62 0 -14 Q 32 34 64 -14" fill="none" opacity="0.55"/>`,
  pulso: `<path d="M -72 4 H -32 L -16 -36 L 6 38 L 20 4 H 72" fill="none"/>`,
  rede: `<circle cx="-48" cy="26" r="13"/><circle cx="0" cy="-38" r="13"/><circle cx="48" cy="26" r="13"/><line x1="-38" y1="17" x2="-9" y2="-29"/><line x1="38" y1="17" x2="9" y2="-29"/><line x1="-35" y1="26" x2="35" y2="26"/>`,
  sol: `<circle cx="0" cy="0" r="26"/><line x1="0" y1="-58" x2="0" y2="-42"/><line x1="0" y1="42" x2="0" y2="58"/><line x1="-58" y1="0" x2="-42" y2="0"/><line x1="42" y1="0" x2="58" y2="0"/><line x1="-41" y1="-41" x2="-30" y2="-30"/><line x1="30" y1="30" x2="41" y2="41"/><line x1="41" y1="-41" x2="30" y2="-30"/><line x1="-30" y1="30" x2="-41" y2="41"/>`,
  dialogo: `<ellipse cx="-38" cy="-8" rx="30" ry="22"/><path d="M -52 12 L -58 30 L -36 14" fill="none"/><ellipse cx="42" cy="2" rx="30" ry="22"/><path d="M 56 22 L 62 40 L 40 24" fill="none"/><line x1="2" y1="-44" x2="2" y2="48" stroke-dasharray="7 7"/>`,
  escudo: `<path d="M 0 -56 C 30 -44 44 -42 44 -34 L 44 8 C 44 38 22 54 0 62 C -22 54 -44 38 -44 8 L -44 -34 C -44 -42 -30 -44 0 -56 Z" fill="none"/><path d="M -16 2 L -4 16 L 20 -14" fill="none"/>`,
  circulos: `<circle cx="-28" cy="-12" r="32"/><circle cx="28" cy="-12" r="32"/><circle cx="0" cy="26" r="32"/>`,
  curva: `<path d="M -60 36 C -20 36 -28 -36 16 -36 C 44 -36 52 -10 60 -10" fill="none"/><circle cx="-60" cy="36" r="7"/><circle cx="60" cy="-10" r="7"/>`,
};

const CAPAS = [
  { nome: 'sobria_portaria_1419',        cat: 'legislacao', sigla: ['Portaria', '1.419'],       simbolo: 'selo',      fonte: 'MTE • 2024' },
  { nome: 'sobria_nr1',                  cat: 'legislacao', sigla: ['NR-1'],                     simbolo: 'documento', fonte: 'MTE • 2024' },
  { nome: 'sobria_nr17',                 cat: 'legislacao', sigla: ['NR-17'],                    simbolo: 'curva',     fonte: 'MTE • 2023' },
  { nome: 'sobria_gro_pgr',              cat: 'manual',     sigla: ['GRO · PGR'],                simbolo: 'fluxo',     fonte: 'MTE • 2026' },
  { nome: 'sobria_riscos_psicossociais', cat: 'manual',     sigla: ['Riscos', 'Psicossociais'],  simbolo: 'ondas',     fonte: 'NR-1 • GRO' },
  { nome: 'sobria_lideranca',            cat: 'prevencao',  sigla: ['Liderança'],                simbolo: 'rede',      fonte: 'GUIA • PREVENÇÃO' },
  { nome: 'sobria_ambiente_positivo',    cat: 'prevencao',  sigla: ['Ambiente', 'Positivo'],     simbolo: 'sol',       fonte: 'GUIA • PREVENÇÃO' },
  { nome: 'sobria_doencas_trabalho',     cat: 'manual',     sigla: ['Doenças e', 'Trabalho'],    simbolo: 'pulso',     fonte: 'MS • 2ª EDIÇÃO' },
  { nome: 'sobria_c190_oit',             cat: 'legislacao', sigla: ['C190'],                     simbolo: 'dialogo',   fonte: 'OIT • 2019' },
  { nome: 'sobria_who_ilo',              cat: 'diretrizes', sigla: ['WHO + ILO'],                simbolo: 'circulos',  fonte: 'OMS • OIT • 2022' },
  { nome: 'sobria_nr1_cap15',            cat: 'manual',     sigla: ['NR-1', 'Cap. 1.5'],         simbolo: 'fluxo',     fonte: 'MTE • 2026' },
  { nome: 'sobria_assedio',              cat: 'prevencao',  sigla: ['Prevenção', 'ao Assédio'],  simbolo: 'dialogo',   fonte: 'MTE' },
  { nome: 'sobria_guia_lilas',           cat: 'prevencao',  sigla: ['Guia', 'Lilás'],            simbolo: 'escudo',    fonte: 'CGU • 2024' },
  // genéricas para o seletor do admin
  { nome: 'sobria_legislacao',           cat: 'legislacao', sigla: ['Norma'],                    simbolo: 'documento', fonte: 'ESCUTARIS' },
  { nome: 'sobria_material',             cat: 'manual',     sigla: ['Guia'],                     simbolo: 'documento', fonte: 'ESCUTARIS' },
  { nome: 'sobria_ferramenta',           cat: 'ferramenta', sigla: ['Ferramenta'],               simbolo: 'fluxo',     fonte: 'ESCUTARIS' },
];

const FONTE_TXT = 'Century Gothic, Segoe UI, Arial, sans-serif';

function svgCapa({ cat, sigla, simbolo, fonte }) {
  const c = CORES[cat];
  const W = 1280, H = 720;
  const umaLinha = sigla.length === 1;
  const tam = umaLinha ? 120 : 92;
  const baseSigla = umaLinha ? 318 : 262;
  const textos = umaLinha
    ? `<text x="${W/2}" y="${baseSigla + tam*0.36}" text-anchor="middle" font-family="${FONTE_TXT}" font-size="${tam}" font-weight="bold" fill="${c.texto}">${sigla[0]}</text>`
    : `<text x="${W/2}" y="${baseSigla}" text-anchor="middle" font-family="${FONTE_TXT}" font-size="${tam}" font-weight="bold" fill="${c.texto}">${sigla[0]}</text>
       <text x="${W/2}" y="${baseSigla + tam + 8}" text-anchor="middle" font-family="${FONTE_TXT}" font-size="${tam}" font-weight="bold" fill="${c.texto}">${sigla[1]}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${c.bg}"/>
  <text x="${W/2}" y="112" text-anchor="middle" font-family="${FONTE_TXT}" font-size="26" letter-spacing="10" fill="${c.acento}">${ROTULO[cat]}</text>
  ${textos}
  <g transform="translate(${W/2}, 524)" stroke="${c.acento}" stroke-width="3.5" fill="none" opacity="0.6" stroke-linecap="round" stroke-linejoin="round">
    ${SIMBOLOS[simbolo]}
  </g>
  <text x="${W/2}" y="668" text-anchor="middle" font-family="${FONTE_TXT}" font-size="23" letter-spacing="7" fill="${c.texto}" fill-opacity="0.7">${fonte}</text>
</svg>`;
}

const outDir = path.join(__dirname, '..', 'tmp-capas');
fs.mkdirSync(outDir, { recursive: true });
for (const capa of CAPAS) {
  fs.writeFileSync(path.join(outDir, `${capa.nome}.svg`), svgCapa(capa));
}
console.log(`${CAPAS.length} SVGs gerados em tmp-capas/`);
