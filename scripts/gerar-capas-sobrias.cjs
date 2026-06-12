// Gera capas tipográficas sóbrias (estilo coleção editorial) para os materiais.
// Uso: node scripts/gerar-capas-sobrias.cjs && (conversão via sharp-cli no chamador)
const fs = require('fs');
const path = require('path');

const CORES = {
  legislacao: { bg: '#1C3520', texto: '#F0EDE6', acento: '#B95839' },
  material:   { bg: '#F0EDE6', texto: '#1C3520', acento: '#B95839' },
  ferramenta: { bg: '#8F3F25', texto: '#F0EDE6', acento: '#F0EDE6' },
};

const ROTULO = {
  legislacao: 'LEGISLAÇÃO',
  material: 'MATERIAL TÉCNICO',
  ferramenta: 'FERRAMENTA',
};

const CAPAS = [
  { nome: 'sobria_portaria_1419',       cat: 'legislacao', linhas: ['Portaria', '1.419/2024'] },
  { nome: 'sobria_nr1',                 cat: 'legislacao', linhas: ['NR-1'] },
  { nome: 'sobria_nr17',                cat: 'legislacao', linhas: ['NR-17'] },
  { nome: 'sobria_gro_pgr',             cat: 'material',   linhas: ['GRO · PGR'] },
  { nome: 'sobria_riscos_psicossociais',cat: 'material',   linhas: ['Riscos', 'Psicossociais'] },
  { nome: 'sobria_lideranca',           cat: 'material',   linhas: ['Liderança', 'Responsável'] },
  { nome: 'sobria_ambiente_positivo',   cat: 'material',   linhas: ['Ambiente', 'Positivo'] },
  { nome: 'sobria_doencas_trabalho',    cat: 'material',   linhas: ['Doenças e', 'Trabalho'] },
  { nome: 'sobria_c190_oit',            cat: 'legislacao', linhas: ['Convenção', '190 · OIT'] },
  { nome: 'sobria_who_ilo',             cat: 'material',   linhas: ['WHO · ILO', '2022'] },
  { nome: 'sobria_nr1_cap15',           cat: 'material',   linhas: ['NR-1', 'Cap. 1.5'] },
  { nome: 'sobria_assedio',             cat: 'material',   linhas: ['Prevenção', 'ao Assédio'] },
  { nome: 'sobria_guia_lilas',          cat: 'material',   linhas: ['Guia', 'Lilás'] },
  // genéricas para o seletor do admin
  { nome: 'sobria_legislacao',          cat: 'legislacao', linhas: ['Norma'] },
  { nome: 'sobria_material',            cat: 'material',   linhas: ['Guia'] },
  { nome: 'sobria_ferramenta',          cat: 'ferramenta', linhas: ['Ferramenta'] },
];

const FONTE = 'Century Gothic, Segoe UI, Arial, sans-serif';

function svgCapa({ cat, linhas }) {
  const c = CORES[cat];
  const W = 1280, H = 720;
  const umaLinha = linhas.length === 1;
  const tam = umaLinha ? 150 : 110;
  const meio = H / 2 + 20;
  const textos = umaLinha
    ? `<text x="${W/2}" y="${meio + tam*0.32}" text-anchor="middle" font-family="${FONTE}" font-size="${tam}" font-weight="bold" fill="${c.texto}">${linhas[0]}</text>`
    : `<text x="${W/2}" y="${meio - 16}" text-anchor="middle" font-family="${FONTE}" font-size="${tam}" font-weight="bold" fill="${c.texto}">${linhas[0]}</text>
       <text x="${W/2}" y="${meio + tam - 6}" text-anchor="middle" font-family="${FONTE}" font-size="${tam}" font-weight="bold" fill="${c.texto}">${linhas[1]}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${c.bg}"/>
  <rect x="42" y="42" width="${W-84}" height="${H-84}" fill="none" stroke="${c.acento}" stroke-opacity="0.5" stroke-width="2"/>
  <text x="${W/2}" y="128" text-anchor="middle" font-family="${FONTE}" font-size="28" letter-spacing="10" fill="${c.acento}">${ROTULO[cat]}</text>
  ${textos}
  <line x1="${W/2 - 60}" y1="${H-150}" x2="${W/2 + 60}" y2="${H-150}" stroke="${c.acento}" stroke-opacity="0.6" stroke-width="2"/>
  <text x="${W/2}" y="${H-92}" text-anchor="middle" font-family="${FONTE}" font-size="24" letter-spacing="8" fill="${c.texto}" fill-opacity="0.75">ESCUTARIS</text>
</svg>`;
}

const outDir = path.join(__dirname, '..', 'tmp-capas');
fs.mkdirSync(outDir, { recursive: true });
for (const capa of CAPAS) {
  fs.writeFileSync(path.join(outDir, `${capa.nome}.svg`), svgCapa(capa));
}
console.log(`${CAPAS.length} SVGs gerados em tmp-capas/`);
