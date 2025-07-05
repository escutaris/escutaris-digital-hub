-- Inserir os materiais do Google Drive na tabela materials
INSERT INTO public.materials (title, description, file_url, category, is_new) VALUES
(
  'NR-09 - Avaliação e Controle das Exposições Ocupacionais',
  'Norma Regulamentadora que estabelece os requisitos para avaliação e controle das exposições ocupacionais a agentes físicos, químicos e biológicos.',
  '/materials/nr-09-avaliacao-controle-exposicoes.pdf',
  'legislacao',
  true
),
(
  'NR-17 - Ergonomia',
  'Norma Regulamentadora que visa estabelecer parâmetros que permitam a adaptação das condições de trabalho às características psicofisiológicas dos trabalhadores.',
  '/materials/nr-17-ergonomia.pdf',
  'legislacao',
  true
),
(
  'LDRT - Lista de Doenças Relacionadas ao Trabalho',
  'Lista oficial de doenças relacionadas ao trabalho estabelecida pelo Ministério da Saúde (Portaria MS nº 2.309/2020).',
  '/materials/ldrt-lista-doencas-trabalho.pdf',
  'legislacao',
  true
),
(
  'Manual de Fatores Psicossociais no Trabalho - ABERGO',
  'Manual técnico da Associação Brasileira de Ergonomia sobre identificação, avaliação e controle de fatores psicossociais no ambiente de trabalho.',
  '/materials/manual-fatores-psicossociais-abergo.pdf',
  'material',
  true
),
(
  'PGR - Programa de Gerenciamento de Riscos',
  'Documento técnico complementar à NR-01 sobre implementação e operacionalização do Programa de Gerenciamento de Riscos.',
  '/materials/pgr-programa-gerenciamento-riscos.pdf',
  'material',
  true
);