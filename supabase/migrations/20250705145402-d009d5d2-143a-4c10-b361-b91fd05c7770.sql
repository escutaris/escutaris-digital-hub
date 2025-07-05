-- Remover todos os materiais com PDFs não funcionais (HTML do Google Drive)
DELETE FROM public.materials 
WHERE file_url IN (
  '/nr-09-avaliacao-controle-exposicoes.pdf',
  '/nr-17-ergonomia.pdf', 
  '/ldrt-lista-doencas-trabalho.pdf',
  '/manual-fatores-psicossociais-abergo.pdf',
  '/pgr-programa-gerenciamento-riscos.pdf'
);