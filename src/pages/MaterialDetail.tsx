import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Download, ExternalLink, Loader } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import AbaDiagnostico from '@/components/AbaDiagnostico';
import MaterialCard from '@/components/MaterialCard';
import CopiarLink from '@/components/CopiarLink';
import JoinClubModal from '@/components/JoinClubModal';
import { fetchMaterialBySlug, fetchMaterials, registrarBloqueio } from '@/lib/api/materials';
import { recordDownload } from '@/lib/api/favorites';
import { guardarDownloadPendente } from '@/lib/downloadPendente';
import { useAuth } from '@/lib/useAuth';

/**
 * Página de UM material, para mandar o link direto de um guia (WhatsApp, e-mail,
 * post) sem que a pessoa caia no meio dos 42 cards. A exigência de conta é a
 * mesma do card: sem sessão, o botão abre o convite e o arquivo baixa sozinho
 * depois da entrada.
 *
 * A prévia do link no WhatsApp (capa e título) NÃO sai daqui: robô de prévia não
 * roda JavaScript. Quem responde a ele é o middleware.ts, na raiz do projeto.
 */

const categoryLabel: Record<string, string> = {
  material: 'Material',
  legislacao: 'Legislação',
  ferramenta: 'Ferramenta',
};

const TITULO_PADRAO = 'Comunidade Escutaris | Referência técnica em saúde mental no trabalho';

const MaterialDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [showJoinModal, setShowJoinModal] = useState(false);

  const { data: material, isLoading } = useQuery({
    // com sessão o endereço do arquivo vem junto, por isso o id entra na chave
    queryKey: ['material', slug, user?.id ?? 'visitante'],
    queryFn: () => fetchMaterialBySlug(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

  const { data: todos } = useQuery({
    queryKey: ['materials', '', user?.id ?? 'visitante'],
    queryFn: () => fetchMaterials('', ''),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (material) document.title = `${material.title} | Comunidade Escutaris`;
    return () => {
      document.title = TITULO_PADRAO;
    };
  }, [material]);

  // a página abre no topo, mesmo vindo de um card lá embaixo na lista
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Outros do mesmo grupo (autorais com autorais, técnicos com técnicos)
  const relacionados = (todos || [])
    .filter((m) => m.id !== material?.id && !!m.is_autoral === !!material?.is_autoral)
    .slice(0, 4);

  const casca = (conteudo: React.ReactNode) => (
    <div className="min-h-screen flex flex-col bg-escutaris-offwhite">
      <WhatsAppButton />
      <AbaDiagnostico />
      <Header compacto />
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1">{conteudo}</div>
      <Footer />
    </div>
  );

  if (isLoading) {
    return casca(
      <div className="flex justify-center py-20">
        <Loader className="h-10 w-10 animate-spin text-escutaris-verde/50" />
      </div>
    );
  }

  if (!material) {
    return casca(
      <div className="section-padding text-center">
        <h1 className="section-title mb-3">Material não encontrado</h1>
        <p className="font-poppins text-sm text-muted-foreground mb-8">
          Este endereço não leva a nenhum material. Ele pode ter mudado de nome ou saído do acervo.
        </p>
        <Link to="/#materiais-escutaris" className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Ver todos os materiais
        </Link>
      </div>
    );
  }

  const isWebGuide = material.is_web_guide === true;
  const link = material.file_url;
  const rotulo = isWebGuide ? 'Abrir guia' : 'Baixar material';
  const Icone = isWebGuide ? ExternalLink : Download;
  const classeBotao =
    'inline-flex items-center justify-center gap-2 rounded-sm bg-escutaris-terracota px-6 py-3 font-poppins text-sm font-medium text-white transition-colors hover:bg-escutaris-terracota/90';

  const handleBloqueio = () => {
    guardarDownloadPendente(material.id, material.title);
    registrarBloqueio(material.id);
    setShowJoinModal(true);
  };

  return casca(
    <>
      <div className="pt-8">
        <Link
          to={material.is_autoral ? '/#materiais-escutaris' : '/#materiais'}
          className="inline-flex items-center gap-1.5 font-poppins text-xs text-escutaris-verde/60 hover:text-escutaris-verde transition-colors"
        >
          <ArrowLeft size={14} /> Todos os materiais
        </Link>
      </div>

      <article className="grid gap-8 py-8 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-12">
        {material.cover_url && (
          <img
            src={material.cover_url}
            alt=""
            aria-hidden="true"
            className="w-full max-w-xl lg:max-w-none aspect-[16/9] object-cover rounded-sm shadow-lg"
          />
        )}

        <div>
          <span className="font-poppins text-[10px] uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5 rounded-sm">
            {categoryLabel[material.category] ?? material.category}
          </span>

          <h1 className="font-cormorant text-3xl md:text-4xl font-semibold text-escutaris-verde leading-tight mt-4 mb-4">
            {material.title}
          </h1>

          {material.description && (
            <p className="font-poppins text-sm text-muted-foreground leading-relaxed mb-8 max-w-prose">
              {material.description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                onClick={() => recordDownload(material.id)}
                className={classeBotao}
              >
                <Icone size={16} /> {rotulo}
              </a>
            ) : (
              <button type="button" onClick={handleBloqueio} className={classeBotao}>
                <Icone size={16} /> {rotulo}
              </button>
            )}
            <CopiarLink slug={material.slug!} variante="botao" />
          </div>

          {!user && (
            <p className="font-poppins text-xs text-muted-foreground mt-4">
              Gratuito. Entre com o Google ou pelo link no seu e-mail e o arquivo baixa na hora.
            </p>
          )}
        </div>
      </article>

      {relacionados.length > 0 && (
        <section className="section-padding border-t border-border">
          <h2 className="section-title mb-6">Veja também</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {relacionados.map((m) => (
              <MaterialCard key={m.id} material={m} />
            ))}
          </div>
        </section>
      )}

      <JoinClubModal open={showJoinModal} onClose={() => setShowJoinModal(false)} />
    </>
  );
};

export default MaterialDetail;
