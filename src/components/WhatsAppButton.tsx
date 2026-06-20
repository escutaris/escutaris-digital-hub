
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const whatsappLink = "https://api.whatsapp.com/send?phone=5571981357004&text=Ol%C3%A1!%20Vim%20da%20Comunidade%20Escutaris%20e%20gostaria%20de%20atendimento.";
  
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a 
        href={whatsappLink}
        target="_blank" 
        rel="noreferrer"
        className="bg-escutaris-green hover:bg-escutaris-green-dark text-white p-3 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 duration-300"
        aria-label="Fale conosco pelo WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
};

export default WhatsAppButton;
