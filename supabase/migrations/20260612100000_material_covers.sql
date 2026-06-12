-- Capa opcional nos materiais da biblioteca
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS cover_url TEXT;
