-- Remover materiais com URLs exemplo que não funcionam
DELETE FROM public.materials 
WHERE file_url LIKE 'https://example.com%';