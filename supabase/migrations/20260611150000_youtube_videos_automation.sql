-- Automação: vídeos do canal @Escutaris entram sozinhos no hub
-- O banco confere o feed público do YouTube a cada 6 horas e guarda os vídeos novos.

CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE TABLE IF NOT EXISTS public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante pode ver os vídeos; só o robô (função) escreve
DROP POLICY IF EXISTS "Anyone can view videos" ON public.videos;
CREATE POLICY "Anyone can view videos"
ON public.videos
FOR SELECT
USING (true);

CREATE INDEX IF NOT EXISTS idx_videos_published_at ON public.videos (published_at DESC);

-- Busca o feed do canal e insere o que for novo
CREATE OR REPLACE FUNCTION public.fetch_youtube_videos()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, extensions
AS $$
DECLARE
  feed_xml XML;
  ns TEXT[][] := ARRAY[
    ARRAY['a', 'http://www.w3.org/2005/Atom'],
    ARRAY['yt', 'http://www.youtube.com/xml/schemas/2015'],
    ARRAY['media', 'http://search.yahoo.com/mrss/']
  ];
  inserted_count INTEGER := 0;
BEGIN
  SELECT content::xml INTO feed_xml
  FROM extensions.http_get('https://www.youtube.com/feeds/videos.xml?channel_id=UCsYHf4NlGHBNac-olFa2gsA');

  WITH entries AS (
    SELECT unnest(xpath('/a:feed/a:entry', feed_xml, ns)) AS entry
  ),
  parsed AS (
    -- caminhos absolutos: o fragmento extraído vira um documento cujo
    -- elemento raiz é <entry>, então busca relativa não encontra nada
    SELECT
      (xpath('/a:entry/yt:videoId/text()', entry, ns))[1]::TEXT AS video_id,
      (xpath('/a:entry/a:title/text()', entry, ns))[1]::TEXT AS title,
      (xpath('/a:entry/media:group/media:description/text()', entry, ns))[1]::TEXT AS description,
      ((xpath('/a:entry/media:group/media:thumbnail/@url', entry, ns))[1])::TEXT AS thumbnail_url,
      ((xpath('/a:entry/a:published/text()', entry, ns))[1])::TEXT::TIMESTAMPTZ AS published_at
    FROM entries
  ),
  ins AS (
    INSERT INTO public.videos (video_id, title, description, thumbnail_url, video_url, published_at)
    SELECT
      video_id,
      title,
      description,
      thumbnail_url,
      'https://www.youtube.com/watch?v=' || video_id,
      published_at
    FROM parsed
    WHERE video_id IS NOT NULL AND title IS NOT NULL
    ON CONFLICT (video_id) DO UPDATE
      SET title = EXCLUDED.title,
          description = EXCLUDED.description,
          thumbnail_url = EXCLUDED.thumbnail_url
    RETURNING 1
  )
  SELECT count(*) INTO inserted_count FROM ins;

  RETURN inserted_count;
END;
$$;

-- A função roda como o robô do banco; visitantes não podem chamá-la
REVOKE EXECUTE ON FUNCTION public.fetch_youtube_videos() FROM PUBLIC, anon, authenticated;

-- Agenda: confere o canal 1x ao dia (18h na Bahia = 21h UTC)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'fetch-youtube-videos') THEN
    PERFORM cron.unschedule('fetch-youtube-videos');
  END IF;
  PERFORM cron.schedule(
    'fetch-youtube-videos',
    '0 21 * * *',
    'SELECT public.fetch_youtube_videos()'
  );
END;
$$;

-- Carga inicial: traz os vídeos que já existem no canal agora
SELECT public.fetch_youtube_videos() AS videos_importados;
