-- Capa opcional nos materiais da biblioteca
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Materiais autorais da Escutaris têm seção própria na home
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS is_autoral BOOLEAN NOT NULL DEFAULT false;
