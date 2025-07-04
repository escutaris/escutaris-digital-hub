-- Create news table
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  slug TEXT UNIQUE NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "News are viewable by everyone" 
ON public.news 
FOR SELECT 
USING (is_published = true);

-- Create policies for admin management
CREATE POLICY "Authenticated users can insert news" 
ON public.news 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update news" 
ON public.news 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete news" 
ON public.news 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_news_updated_at
BEFORE UPDATE ON public.news
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample news
INSERT INTO public.news (title, description, content, slug, is_featured) VALUES 
(
  'Nova planilha de avaliação de riscos psicossociais disponível',
  'Lançamos uma ferramenta completa para avaliação de riscos psicossociais alinhada com a NR-1 e ISO 45003.',
  'A Escutaris acaba de lançar uma nova planilha especializada para avaliação de riscos psicossociais no ambiente de trabalho. Esta ferramenta foi desenvolvida seguindo as diretrizes da NR-1 (Disposições Gerais e Gerenciamento de Riscos Ocupacionais) e da ISO 45003 (Gestão da saúde e segurança psicológica no trabalho).

A planilha oferece:
- Metodologia estruturada para identificação de fatores de risco
- Critérios de avaliação padronizados
- Sistema de pontuação baseado em evidências científicas
- Relatórios automáticos com recomendações
- Interface intuitiva para facilitadores e gestores

Esta ferramenta representa um marco importante na evolução das práticas de gestão de saúde mental organizacional no Brasil, oferecendo às empresas um recurso confiável e cientificamente embasado para cuidar do bem-estar psicológico de seus colaboradores.',
  'nova-planilha-avaliacao-riscos-psicossociais',
  true
),
(
  'Webinar: Saúde Mental nas Organizações',
  'Participe do nosso próximo webinar sobre estratégias para promover bem-estar psicológico no ambiente corporativo.',
  'Junte-se a nós em nosso próximo webinar "Saúde Mental nas Organizações: Estratégias Práticas para o Bem-estar Corporativo", que acontecerá em breve.

Durante este evento online, abordaremos:
- As principais causas de adoecimento mental no trabalho
- Como implementar programas efetivos de prevenção
- Ferramentas práticas para gestores e RH
- Cases de sucesso em empresas brasileiras
- Aspectos legais e normativos (NR-1, ISO 45003)

O webinar é gratuito e destinado a profissionais de RH, gestores, líderes e todos os interessados em promover ambientes de trabalho mais saudáveis. Ao final, haverá uma sessão de perguntas e respostas com nossos especialistas.

Garante já sua vaga e contribua para a transformação da cultura organizacional em sua empresa!',
  'webinar-saude-mental-organizacoes',
  false
);