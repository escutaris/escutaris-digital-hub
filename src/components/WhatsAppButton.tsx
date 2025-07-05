
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const whatsappLink = "https://api.whatsapp.com/send?phone=557582217557&text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20sobre%20seus%20servi%C3%A7os";
  
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
