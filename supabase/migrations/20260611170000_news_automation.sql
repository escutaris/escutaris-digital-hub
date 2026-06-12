-- Automação de notícias: o robô lê as fontes diariamente e deixa rascunhos
-- para aprovação no painel admin. Nada é publicado sem o clique da admin.

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA extensions;

-- Colunas novas: de onde a notícia veio (e link da matéria original)
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS source_name TEXT;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS source_url TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_news_source_url ON public.news (source_url) WHERE source_url IS NOT NULL;

-- Correção: admins precisam enxergar rascunhos (a regra antiga só mostrava publicadas)
DROP POLICY IF EXISTS "Admins can view all news" ON public.news;
CREATE POLICY "Admins can view all news"
ON public.news
FOR SELECT
USING (public.is_admin());

-- Fontes vigiadas pelo robô
CREATE TABLE IF NOT EXISTS public.news_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  feed_url TEXT NOT NULL,
  -- 'none': feed já vem filtrado | 'mental': exige termo de saúde mental
  -- 'mental_and_work': exige saúde mental E contexto de trabalho
  filter_mode TEXT NOT NULL DEFAULT 'mental',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage news sources" ON public.news_sources;
CREATE POLICY "Admins manage news sources"
ON public.news_sources
FOR ALL
USING (public.is_admin());

INSERT INTO public.news_sources (name, feed_url, filter_mode) VALUES
  ('ANAMT',                'https://www.anamt.org.br/portal/?feed=rss2',                       'mental'),
  ('ABP',                  'https://www.abp.org.br/blog-feed.xml',                             'mental_and_work'),
  ('ABERGO',               'https://www.abergo.org.br/blog-feed.xml',                          'mental'),
  ('ABRH Nacional',        'https://abrhbrasil.org.br/feed/',                                  'mental'),
  ('Fiocruz',              'https://agencia.fiocruz.br/rss.xml',                               'mental_and_work'),
  ('Ministério da Saúde',  'https://www.gov.br/saude/pt-br/assuntos/noticias/RSS',             'mental_and_work'),
  ('OPAS',                 'https://www.paho.org/pt/rss.xml',                                  'mental_and_work'),
  ('OMS',                  'https://www.who.int/rss-feeds/news-english.xml',                   'mental_and_work'),
  ('NIOSH (EUA)',          'https://tools.cdc.gov/api/v2/resources/media/342019.rss',          'mental'),
  ('OSHA (EUA)',           'https://www.osha.gov/rss/quicktakes.xml',                          'mental'),
  ('HSE (Reino Unido)',    'https://press.hse.gov.uk/feed/',                                   'mental'),
  ('Imprensa: NR-1 e riscos psicossociais', 'https://news.google.com/rss/search?q=%22riscos%20psicossociais%22%20OR%20%22NR-1%22&hl=pt-BR&gl=BR&ceid=BR:pt-419', 'none'),
  ('Imprensa: saúde mental no trabalho', 'https://news.google.com/rss/search?q=%22sa%C3%BAde%20mental%20no%20trabalho%22&hl=pt-BR&gl=BR&ceid=BR:pt-419', 'none'),
  ('Imprensa: Fundacentro / MTE / INSS', 'https://news.google.com/rss/search?q=Fundacentro%20OR%20(INSS%20%22sa%C3%BAde%20mental%22)%20OR%20(%22Minist%C3%A9rio%20do%20Trabalho%22%20psicossocial)&hl=pt-BR&gl=BR&ceid=BR:pt-419', 'none'),
  ('Imprensa: OIT', 'https://news.google.com/rss/search?q=%22OIT%22%20%22sa%C3%BAde%20mental%22&hl=pt-BR&gl=BR&ceid=BR:pt-419', 'none')
ON CONFLICT (name) DO UPDATE SET feed_url = EXCLUDED.feed_url, filter_mode = EXCLUDED.filter_mode;

-- Transforma um título em endereço de página (sem acentos, com hífens)
CREATE OR REPLACE FUNCTION public.slugify(input TEXT)
RETURNS TEXT
LANGUAGE sql IMMUTABLE
SET search_path = public, extensions
AS $$
  SELECT trim(both '-' FROM regexp_replace(lower(extensions.unaccent(coalesce(input,''))), '[^a-z0-9]+', '-', 'g'));
$$;

-- O robô: lê cada fonte, filtra pelo tema e cria rascunhos
CREATE OR REPLACE FUNCTION public.fetch_news_from_sources()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, extensions
AS $$
DECLARE
  src RECORD;
  feed_xml XML;
  items XML[];
  item XML;
  v_title TEXT; v_link TEXT; v_desc TEXT; v_pub TEXT;
  v_pub_ts TIMESTAMPTZ;
  v_slug TEXT;
  per_source INTEGER;
  added INTEGER := 0;
  ns TEXT[][] := ARRAY[ARRAY['a', 'http://www.w3.org/2005/Atom']];
  mental_re CONSTANT TEXT := '(psicossoc|saude mental|sa..?de mental|nr-?\s?1\b|ass..?dio|burnout|esgotamento|transtorno|ansiedade|depress|adoecimento|sofrimento|suic|mental health|psychosocial|workplace stress|well-?being|bem-estar|harassment|bullying)';
  work_re CONSTANT TEXT := '(trabalh|ocupacional|empres|emprego|corporativ|laboral|previdenc|afastamento|workplace|occupational|worker|employee|labou?r)';
BEGIN
  FOR src IN SELECT * FROM public.news_sources WHERE active LOOP
    BEGIN
      SELECT content::xml INTO feed_xml FROM extensions.http_get(src.feed_url);

      -- formato RSS clássico; se vazio, tenta o formato Atom
      items := xpath('/rss/channel/item', feed_xml);
      IF coalesce(array_length(items, 1), 0) = 0 THEN
        items := xpath('/a:feed/a:entry', feed_xml, ns);
      END IF;

      per_source := 0;

      FOREACH item IN ARRAY items LOOP
        EXIT WHEN per_source >= 5;
        BEGIN
          v_title := (xpath('title/text()', item))[1]::TEXT;
          IF v_title IS NULL THEN
            v_title := (xpath('a:title/text()', item, ns))[1]::TEXT;
          END IF;

          v_link := (xpath('link/text()', item))[1]::TEXT;
          IF v_link IS NULL THEN
            v_link := ((xpath('a:link/@href', item, ns))[1])::TEXT;
          END IF;

          v_desc := (xpath('description/text()', item))[1]::TEXT;
          IF v_desc IS NULL THEN
            v_desc := (xpath('a:summary/text()', item, ns))[1]::TEXT;
          END IF;

          v_pub := (xpath('pubDate/text()', item))[1]::TEXT;
          IF v_pub IS NULL THEN
            v_pub := (xpath('a:published/text()', item, ns))[1]::TEXT;
          END IF;

          CONTINUE WHEN v_title IS NULL OR v_link IS NULL;

          -- limpa HTML e espaços do resumo
          v_desc := trim(regexp_replace(regexp_replace(coalesce(v_desc, ''), '<[^>]+>', ' ', 'g'), '\s+', ' ', 'g'));
          v_title := trim(regexp_replace(v_title, '\s+', ' ', 'g'));

          -- data de publicação (formatos variados; se falhar, usa agora)
          BEGIN
            v_pub_ts := regexp_replace(coalesce(v_pub, ''), '^[A-Za-z]{3},\s*', '')::TIMESTAMPTZ;
          EXCEPTION WHEN OTHERS THEN
            v_pub_ts := now();
          END;

          -- só novidades das últimas 3 semanas
          CONTINUE WHEN v_pub_ts < now() - INTERVAL '21 days';

          -- filtro de tema
          IF src.filter_mode = 'mental' THEN
            CONTINUE WHEN (v_title || ' ' || v_desc) !~* mental_re;
          ELSIF src.filter_mode = 'mental_and_work' THEN
            CONTINUE WHEN (v_title || ' ' || v_desc) !~* mental_re
                       OR (v_title || ' ' || v_desc) !~* work_re;
          END IF;

          -- evita repetidas (mesmo link ou mesmo título nos últimos 90 dias)
          CONTINUE WHEN EXISTS (SELECT 1 FROM public.news WHERE source_url = v_link);
          CONTINUE WHEN EXISTS (
            SELECT 1 FROM public.news
            WHERE lower(title) = lower(v_title)
              AND created_at > now() - INTERVAL '90 days'
          );

          v_slug := left(public.slugify(v_title), 80) || '-' || substr(md5(v_link), 1, 6);

          INSERT INTO public.news (
            title, description, content, slug,
            is_published, is_featured, published_at,
            source_name, source_url
          ) VALUES (
            left(v_title, 200),
            coalesce(nullif(left(v_desc, 400), ''), left(v_title, 200)),
            '<p>' || coalesce(nullif(v_desc, ''), v_title) || '</p>'
              || '<p><a href="' || v_link || '" target="_blank" rel="noopener noreferrer">Ler a notícia completa na fonte →</a></p>'
              || '<p><em>Selecionada automaticamente · Fonte: ' || src.name || '</em></p>',
            v_slug,
            false,  -- rascunho: aguarda aprovação da admin
            false,
            v_pub_ts,
            src.name,
            v_link
          );

          per_source := per_source + 1;
          added := added + 1;
        EXCEPTION WHEN OTHERS THEN
          CONTINUE; -- item com problema não derruba a varredura
        END;
      END LOOP;
    EXCEPTION WHEN OTHERS THEN
      CONTINUE; -- fonte fora do ar não derruba as demais
    END;
  END LOOP;

  RETURN added;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.fetch_news_from_sources() FROM PUBLIC, anon, authenticated;

-- Agenda: varredura diária às 6h da manhã (Bahia) = 9h UTC
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'fetch-news-daily') THEN
    PERFORM cron.unschedule('fetch-news-daily');
  END IF;
  PERFORM cron.schedule(
    'fetch-news-daily',
    '0 9 * * *',
    'SELECT public.fetch_news_from_sources()'
  );
END;
$$;

-- Primeira varredura agora, para você já ter rascunhos para aprovar
SELECT public.fetch_news_from_sources() AS rascunhos_criados;
