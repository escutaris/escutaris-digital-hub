import React, { useState } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Material } from '@/lib/types/material';
import { MaterialWithStats } from '@/lib/types/favorites';
import { recordDownload } from '@/lib/api/favorites';
import { registrarBloqueio } from '@/lib/api/materials';
import { guardarDownloadPendente } from '@/lib/downloadPendente';
import { useAuth } from '@/lib/useAuth';
import { EXIGIR_LOGIN_PARA_BAIXAR } from '@/lib/config';
import JoinClubModal from './JoinClubModal';

interface MaterialCardProps {
  material: Material | MaterialWithStats;
}

const categoryLabel: Record<string, string> = {
  material: 'Material',
  legislacao: 'Legislação',
  ferramenta: 'Ferramenta',
};

const MaterialCard = ({ material }: MaterialCardProps) => {
  const { user } = useAuth();
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Guia online abre a página; material de verdade baixa o arquivo. Quem decide
  // é o banco (coluna is_web_guide), porque o endereço do arquivo não vem mais
  // na listagem pública.
  const isWebGuide = material.is_web_guide === true;

  // Quem tem sessão recebe o endereço junto com a lista, então o botão é um link
  // de verdade e o navegador cuida de abrir a nova aba. Sem sessão não há
  // endereço nenhum no card, e o clique só abre o convite.
  const link = material.file_url;

  const handleBloqueio = () => {
    guardarDownloadPendente(material.id, material.title);
    registrarBloqueio(material.id);
    setShowJoinModal(true);
  };

  const handleLinkClick = () => {
    recordDownload(material.id);
  };

  return (
    <>
      <div className="glass-card group flex flex-col h-full overflow-hidden">
        {material.cover_url && (
          <img
            src={material.cover_url}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="w-full aspect-[16/9] object-cover"
          />
        )}
        <div className="p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-poppins text-[10px] uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5 rounded-sm">
                {categoryLabel[material.category] ?? material.category}
              </span>
              {material.is_new && (
                <span className="tag-new">Novo</span>
              )}
            </div>
            <div className="w-8 h-8 bg-escutaris-verde/5 rounded-sm flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4 text-escutaris-verde/50" />
            </div>
          </div>

          {/* Content */}
          <h3 className="font-cormorant text-lg font-semibold text-escutaris-verde leading-snug mb-2 line-clamp-2">
            {material.title}
          </h3>

          {material.description && (
            <p className="font-poppins text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1 mb-4">
              {material.description}
            </p>
          )}

          {/* Footer */}
          <div className="border-t border-border/50 pt-3 mt-auto">
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                onClick={handleLinkClick}
                className="inline-flex items-center gap-2 text-xs font-poppins font-medium text-escutaris-terracota hover:text-escutaris-terracota/80 transition-colors"
              >
                {isWebGuide ? <ExternalLink size={13} /> : <Download size={13} />}
                {isWebGuide ? 'Abrir guia' : 'Baixar material'}
              </a>
            ) : (
              <button
                type="button"
                onClick={handleBloqueio}
                className="inline-flex items-center gap-2 text-xs font-poppins font-medium text-escutaris-terracota hover:text-escutaris-terracota/80 transition-colors"
              >
                {isWebGuide ? <ExternalLink size={13} /> : <Download size={13} />}
                {isWebGuide ? 'Abrir guia' : 'Baixar material'}
              </button>
            )}
          </div>
        </div>
      </div>

      <JoinClubModal
        open={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </>
  );
};

export default MaterialCard;
