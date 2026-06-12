import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play, Youtube } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Video {
  id: string;
  video_id: string;
  title: string;
  thumbnail_url: string | null;
  published_at: string | null;
}

const fetchVideos = async (): Promise<Video[]> => {
  const { data, error } = await (supabase as any)
    .from('videos')
    .select('id, video_id, title, thumbnail_url, published_at')
    .order('published_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Erro ao buscar vídeos:', error);
    return [];
  }
  return data || [];
};

const VideoCard = ({ video }: { video: Video }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="glass-card overflow-hidden flex flex-col">
      <div className="relative aspect-video bg-escutaris-verde/10">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.video_id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full group"
            aria-label={`Assistir: ${video.title}`}
          >
            {video.thumbnail_url && (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-escutaris-verde/30 group-hover:bg-escutaris-verde/20 transition-colors">
              <span className="w-12 h-12 rounded-full bg-escutaris-terracota flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play size={20} className="text-white ml-0.5" fill="white" />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-poppins text-sm font-medium text-escutaris-verde leading-snug line-clamp-2">
          {video.title}
        </h3>
        {video.published_at && (
          <p className="font-poppins text-xs text-muted-foreground mt-1.5">
            {new Date(video.published_at).toLocaleDateString('pt-BR', {
              day: '2-digit', month: 'long', year: 'numeric',
            })}
          </p>
        )}
      </div>
    </div>
  );
};

const VideosSection = () => {
  const { data: videos, isLoading } = useQuery<Video[]>({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    staleTime: 1000 * 60 * 10,
  });

  // Seção só aparece quando houver vídeos importados
  if (isLoading || !videos || videos.length === 0) return null;

  return (
    <section className="section-padding" id="videos">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
        <div>
          <p className="font-poppins text-xs tracking-widest uppercase text-escutaris-terracota mb-2">
            Direto do canal
          </p>
          <h2 className="section-title">Vídeos para aprender no seu ritmo</h2>
        </div>
        <a
          href="https://www.youtube.com/@Escutaris"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 font-poppins text-sm text-escutaris-verde/70 hover:text-escutaris-verde transition-colors flex-shrink-0"
        >
          <Youtube size={16} /> Ver canal completo
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </section>
  );
};

export default VideosSection;
