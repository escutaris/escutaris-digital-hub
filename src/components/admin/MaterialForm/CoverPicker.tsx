import React from 'react';
import { Label } from '@/components/ui/label';
import { Check, ImageOff } from 'lucide-react';

// Banco de capas da marca (em public/assets/covers/)
const COVERS = [
  'analise_relatorios_corporativos',
  'auditoria_conformidade_documentos',
  'colaboracao_resolucao_desafios',
  'comunicacao_transparente_lideranca',
  'conversa_individual_lideranca',
  'dashboard_saude_seguranca',
  'documento_normativo_indicadores',
  'equipe_colaboracao_positiva',
  'equipe_reuniao_estrategica',
  'gestor_planejamento_estrategico',
  'indicadores_saude_seguranca',
  'isolamento_social_respeitoso',
  'lideranca_autoconhecimento',
  'lideranca_dialogo_com_equipe',
  'medico_trabalho_gestao_ocupacional',
  'metodologia_questionario_digital',
  'monitoramento_bem_estar_clima',
  'pesquisa_anonima_multiplataforma',
  'planejamento_conformidade_digital',
  'questionario_digital_confidencial',
  'rh_sst_plano_implementacao',
  'risco_invisivel_ambiente_corporativo',
  'roda_conversa_ambiente_acolhedor',
  'seguranca_psicologica_grupo',
  'simplificacao_processos_digitais',
  'sobrecarga_emocional_trabalho',
  'visao_estrategica_ambiente_corporativo',
];

interface CoverPickerProps {
  coverUrl: string | null;
  setCoverUrl: (url: string | null) => void;
}

const CoverPicker: React.FC<CoverPickerProps> = ({ coverUrl, setCoverUrl }) => {
  return (
    <div className="space-y-2">
      <Label>Capa do material (opcional)</Label>
      <p className="text-xs text-muted-foreground">
        Escolha uma imagem do banco da marca para ilustrar o cartão na biblioteca.
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-64 overflow-y-auto border rounded-md p-2">
        <button
          type="button"
          onClick={() => setCoverUrl(null)}
          className={`relative aspect-[16/9] rounded-sm border-2 flex flex-col items-center justify-center gap-1 text-muted-foreground bg-muted/40 ${
            coverUrl === null ? 'border-primary' : 'border-transparent hover:border-border'
          }`}
        >
          <ImageOff size={16} />
          <span className="text-[10px]">Sem capa</span>
        </button>

        {COVERS.map((name) => {
          const url = `/assets/covers/${name}.webp`;
          const selected = coverUrl === url;
          return (
            <button
              key={name}
              type="button"
              onClick={() => setCoverUrl(url)}
              title={name.replace(/_/g, ' ')}
              className={`relative aspect-[16/9] rounded-sm overflow-hidden border-2 ${
                selected ? 'border-primary' : 'border-transparent hover:border-border'
              }`}
            >
              <img
                src={url}
                alt={name.replace(/_/g, ' ')}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {selected && (
                <span className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                  <Check size={18} className="text-white drop-shadow" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CoverPicker;
