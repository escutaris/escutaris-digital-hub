-- Corrigir URLs dos materiais PDF baixados do Google Drive
UPDATE public.materials 
SET file_url = '/nr-09-avaliacao-controle-exposicoes.pdf'
WHERE title = 'NR-09 - Avaliação e Controle das Exposições Ocupacionais';

UPDATE public.materials 
SET file_url = '/nr-17-ergonomia.pdf'
WHERE title = 'NR-17 - Ergonomia';

UPDATE public.materials 
SET file_url = '/ldrt-lista-doencas-trabalho.pdf'
WHERE title = 'LDRT - Lista de Doenças Relacionadas ao Trabalho';

UPDATE public.materials 
SET file_url = '/manual-fatores-psicossociais-abergo.pdf'
WHERE title = 'Manual de Fatores Psicossociais no Trabalho - ABERGO';

UPDATE public.materials 
SET file_url = '/pgr-programa-gerenciamento-riscos.pdf'
WHERE title = 'PGR - Programa de Gerenciamento de Riscos';