import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, Download, LogOut, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { fetchFavoriteMaterials, fetchUserDownloads } from '@/lib/api/favorites';
import MaterialCard from '@/components/MaterialCard';
import { MaterialWithStats } from '@/lib/types/favorites';

const Conta = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: favoritos, isLoading: loadingFavoritos } = useQuery<MaterialWithStats[]>({
    queryKey: ['favorite-materials'],
    queryFn: fetchFavoriteMaterials,
    staleTime: 1000 * 60 * 2,
  });

  const { data: downloads, isLoading: loadingDownloads } = useQuery({
    queryKey: ['user-downloads'],
    queryFn: fetchUserDownloads,
    staleTime: 1000 * 60 * 2,
  });

  const nome = (user?.user_metadata?.full_name as string) || user?.email?.split('@')[0] || 'membro';

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-escutaris-offwhite">
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-poppins text-sm text-escutaris-verde/70 hover:text-escutaris-verde transition-colors mb-8"
        >
          <ArrowLeft size={15} /> Voltar para o hub
        </Link>

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p className="font-poppins text-xs tracking-widest uppercase text-escutaris-terracota mb-2">
              Membro do clube
            </p>
            <h1 className="font-cormorant text-4xl font-semibold text-escutaris-verde">
              Olá, {nome}
            </h1>
            <p className="font-poppins text-sm text-muted-foreground mt-1">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="font-poppins text-sm text-escutaris-verde border border-escutaris-verde/30 px-4 py-2 rounded-sm hover:border-escutaris-verde transition-colors"
              >
                Painel administrativo
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 font-poppins text-sm text-muted-foreground hover:text-escutaris-verde transition-colors"
            >
              <LogOut size={15} /> Sair
            </button>
          </div>
        </div>

        {/* Premium teaser */}
        <div className="bg-escutaris-verde text-white rounded-lg p-6 mb-10 flex flex-col sm:flex-row sm:items-center gap-4">
          <Sparkles className="text-escutaris-terracota flex-shrink-0" size={22} />
          <div className="flex-1">
            <p className="font-poppins font-medium text-sm mb-0.5">O premium está chegando</p>
            <p className="font-poppins text-xs text-white/60 leading-relaxed">
              Ferramentas completas, modelos prontos e o Consultor Digital incluído.
              Como membro, você será avisada(o) por e-mail no lançamento — com condição especial.
            </p>
          </div>
        </div>

        {/* Favoritos */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-5">
            <Heart className="text-escutaris-terracota" size={18} />
            <h2 className="font-cormorant text-2xl font-semibold text-escutaris-verde">
              Meus favoritos
            </h2>
          </div>

          {loadingFavoritos ? (
            <p className="font-poppins text-sm text-muted-foreground">Carregando...</p>
          ) : favoritos && favoritos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritos.map((m) => (
                <MaterialCard key={m.id} material={m} />
              ))}
            </div>
          ) : (
            <p className="font-poppins text-sm text-muted-foreground">
              Você ainda não favoritou nenhum material.{' '}
              <Link to="/#materiais" className="text-escutaris-terracota hover:underline">
                Explorar a biblioteca
              </Link>
            </p>
          )}
        </section>

        {/* Histórico de downloads */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Download className="text-escutaris-terracota" size={18} />
            <h2 className="font-cormorant text-2xl font-semibold text-escutaris-verde">
              Meus downloads
            </h2>
          </div>

          {loadingDownloads ? (
            <p className="font-poppins text-sm text-muted-foreground">Carregando...</p>
          ) : downloads && downloads.length > 0 ? (
            <div className="bg-white border border-border rounded-lg divide-y divide-border">
              {downloads.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="font-poppins text-sm text-foreground truncate">{d.title}</p>
                    <p className="font-poppins text-xs text-muted-foreground">
                      {new Date(d.downloaded_at).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <a
                    href={d.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-poppins text-xs font-medium text-escutaris-terracota hover:text-escutaris-terracota/80 transition-colors flex-shrink-0"
                  >
                    Baixar de novo
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-poppins text-sm text-muted-foreground">
              Seus downloads aparecerão aqui.{' '}
              <Link to="/#materiais" className="text-escutaris-terracota hover:underline">
                Ver materiais
              </Link>
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Conta;
