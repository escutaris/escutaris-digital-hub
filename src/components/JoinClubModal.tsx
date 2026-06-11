import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const JoinClubModal = ({ open, onClose }: Props) => {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(28, 53, 32, 0.7)' }}
      onClick={onClose}
    >
      <div
        className="bg-escutaris-offwhite w-full max-w-md rounded-sm shadow-2xl relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-escutaris-verde/40 hover:text-escutaris-verde transition-colors"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <div className="p-8">
          <p className="font-poppins text-xs tracking-widest uppercase text-escutaris-terracota mb-3">
            Conteúdo para membros
          </p>
          <h2 className="font-cormorant text-3xl font-semibold text-escutaris-verde leading-tight mb-2">
            Entre no clube para baixar
          </h2>
          <p className="font-poppins text-sm text-muted-foreground mb-5 leading-relaxed">
            A conta é gratuita e leva 30 segundos. Como membro, você ganha:
          </p>

          <ul className="space-y-2.5 mb-7">
            {[
              'Download de todos os materiais técnicos',
              'Favoritos e histórico dos seus downloads',
              'Aviso em primeira mão das novidades do clube',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 font-poppins text-sm text-foreground/80 leading-relaxed">
                <Check size={15} className="text-escutaris-terracota mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate('/cadastro')}
            className="w-full bg-escutaris-terracota text-white font-poppins font-medium py-3 rounded-sm hover:bg-escutaris-terracota/90 transition-colors"
          >
            Criar minha conta gratuita
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full mt-3 font-poppins text-sm text-escutaris-verde hover:text-escutaris-verde/70 transition-colors"
          >
            Já tenho conta — entrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinClubModal;
