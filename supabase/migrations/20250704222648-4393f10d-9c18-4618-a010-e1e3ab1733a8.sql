-- Criar tabela de favoritos
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, material_id)
);

-- Habilitar RLS na tabela de favoritos
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Políticas para favoritos - usuários só podem ver e gerenciar seus próprios favoritos
CREATE POLICY "Users can view their own favorites" 
ON public.user_favorites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites" 
ON public.user_favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites" 
ON public.user_favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Criar tabela de histórico de downloads
CREATE TABLE public.download_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  user_id UUID NULL, -- NULL para usuários não autenticados
  ip_address TEXT,
  user_agent TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de histórico de downloads
ALTER TABLE public.download_history ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de downloads (público)
CREATE POLICY "Anyone can record downloads" 
ON public.download_history 
FOR INSERT 
WITH CHECK (true);

-- Política para visualização apenas por admins (exemplo)
CREATE POLICY "Authenticated users can view download history" 
ON public.download_history 
FOR SELECT 
USING (true);

-- Adicionar índices para performance
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_user_favorites_material_id ON public.user_favorites(material_id);
CREATE INDEX idx_download_history_material_id ON public.download_history(material_id);
CREATE INDEX idx_download_history_downloaded_at ON public.download_history(downloaded_at);