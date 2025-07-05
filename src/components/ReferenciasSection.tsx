import React from 'react';
import { ExternalLink, Building2, BookOpen, FileText, Scale } from 'lucide-react';

const ReferenciasSection = () => {
  const referencias = [
    {
      categoria: 'Órgãos Oficiais',
      icon: <Building2 className="h-5 w-5" />,
      items: [
        {
          title: 'Ministério do Trabalho e Emprego (MTE)',
          description: 'Portal oficial do MTE com normas regulamentadoras e orientações.',
          url: 'https://www.gov.br/trabalho-e-emprego/pt-br',
        },
        {
          title: 'Organização Internacional do Trabalho (OIT)',
          description: 'Agência da ONU dedicada à promoção do trabalho decente.',
          url: 'https://www.ilo.org/brasilia/lang--pt/index.htm',
        },
        {
          title: 'FUNDACENTRO',
          description: 'Fundação Jorge Duprat Figueiredo de Segurança e Medicina do Trabalho.',
          url: 'https://www.fundacentro.gov.br/',
        },
      ],
    },
    {
      categoria: 'Normas e Regulamentações',
      icon: <Scale className="h-5 w-5" />,
      items: [
        {
          title: 'Normas Regulamentadoras - MTE',
          description: 'Portal oficial com todas as Normas Regulamentadoras atualizadas.',
          url: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/ctpp/normas-regulamentadoras',
        },
        {
          title: 'Portaria MTE nº 1.419/2024',
          description: 'Nova redação do Gerenciamento de Riscos Ocupacionais (GRO) - NR-1.',
          url: 'https://www.in.gov.br/web/dou/-/portaria-mte-n-1.419-de-27-de-agosto-de-2024-578654068',
        },
        {
          title: 'Portaria SEPRT nº 1.359/2019',
          description: 'Altera as Normas Regulamentadoras do Ministério do Trabalho.',
          url: 'https://www.in.gov.br/en/web/dou/-/portaria-n-1.359-de-9-de-dezembro-de-2019-232479343',
        },
        {
          title: 'Portaria MS nº 2.309/2020',
          description: 'Lista de Doenças Relacionadas ao Trabalho - LDRT.',
          url: 'https://www.in.gov.br/en/web/dou/-/portaria-n-2.309-de-28-de-agosto-de-2020-274748878',
        },
        {
          title: 'ISO 45003:2021',
          description: 'Gestão de saúde e segurança ocupacional - Saúde e segurança psicológica no trabalho.',
          url: 'https://www.iso.org/standard/64283.html',
        },
      ],
    },
    {
      categoria: 'Publicações Especializadas',
      icon: <BookOpen className="h-5 w-5" />,
      items: [
        {
          title: 'Revista Proteção',
          description: 'Principal revista brasileira de segurança e saúde ocupacional.',
          url: 'https://www.protecao.com.br/',
        },
        {
          title: 'ANAMT - Associação Nacional de Medicina do Trabalho',
          description: 'Conteúdos técnicos e científicos em medicina ocupacional.',
          url: 'https://www.anamt.org.br/',
        },
        {
          title: 'ABRAHSO',
          description: 'Associação Brasileira de Higienistas Ocupacionais.',
          url: 'https://www.abrahso.org.br/',
        },
        {
          title: 'ABERGO - Associação Brasileira de Ergonomia',
          description: 'Dicionário e recursos técnicos em ergonomia.',
          url: 'https://www.abergo.org.br/',
        },
      ],
    },
    {
      categoria: 'Pesquisa e Academia',
      icon: <FileText className="h-5 w-5" />,
      items: [
        {
          title: 'Revista Brasileira de Saúde Ocupacional',
          description: 'Periódico científico da FUNDACENTRO.',
          url: 'https://www.scielo.br/j/rbso/',
        },
        {
          title: 'Cadernos de Saúde Pública',
          description: 'Revista de saúde pública da FIOCRUZ.',
          url: 'https://www.scielo.br/j/csp/',
        },
        {
          title: 'International Journal of Environmental Research',
          description: 'Pesquisas internacionais em saúde ambiental e ocupacional.',
          url: 'https://www.mdpi.com/journal/ijerph',
        },
        {
          title: 'SciELO - Scientific Electronic Library Online',
          description: 'Base de dados com periódicos científicos em saúde ocupacional.',
          url: 'https://www.scielo.br',
        },
        {
          title: 'ILO - International Labour Organization',
          description: 'Recursos sobre riscos psicossociais e estresse relacionado ao trabalho.',
          url: 'https://www.ilo.org',
        },
      ],
    },
    {
      categoria: 'Bibliografia Especializada',
      icon: <BookOpen className="h-5 w-5" />,
      items: [
        {
          title: 'A Loucura do Trabalho - Christophe Dejours',
          description: 'Estudo clássico de psicopatologia do trabalho.',
          url: 'https://www.amazon.com.br/s?k=loucura+do+trabalho+dejours',
        },
        {
          title: 'Patologia do Trabalho - René Mendes',
          description: 'Obra de referência em medicina do trabalho.',
          url: 'https://www.amazon.com.br/s?k=patologia+trabalho+rene+mendes',
        },
        {
          title: 'Saúde Mental e Trabalho - Sato & Carvalho',
          description: 'Aspectos clínicos e institucionais da saúde mental no trabalho.',
          url: 'https://www.amazon.com.br/s?k=saude+mental+trabalho+sato',
        },
        {
          title: 'Fatores Psicossociais no Trabalho - Louis & Serrano',
          description: 'Abordagens, práticas e desafios em fatores psicossociais.',
          url: 'https://www.amazon.com.br/s?k=fatores+psicossociais+trabalho',
        },
      ],
    },
  ];

  return (
    <section className="section-padding" id="referencias">
      <h2 className="text-escutaris-terracotta text-3xl md:text-4xl font-bold mb-8 animate-slide-in flex items-center gap-2">
        <ExternalLink className="h-7 w-7" /> Referências Técnicas e Links Úteis
      </h2>
      
      <div className="space-y-12">
        {referencias.map((categoria, index) => (
          <div key={index} className="animate-fade-in">
            <h3 className="text-escutaris-green text-xl font-semibold mb-6 flex items-center gap-2">
              {categoria.icon}
              {categoria.categoria}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoria.items.map((item, itemIndex) => (
                <a
                  key={itemIndex}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-card p-6 block transition-all hover:shadow-xl hover:scale-105 duration-300 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-escutaris-terracotta/10 rounded-lg group-hover:bg-escutaris-terracotta/20 transition-colors">
                      <ExternalLink className="h-4 w-4 text-escutaris-terracotta" />
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      LINK
                    </div>
                  </div>
                  
                  <h4 className="text-foreground font-semibold mb-2 line-clamp-2 group-hover:text-escutaris-terracotta transition-colors">
                    {item.title}
                  </h4>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div className="mt-4 flex items-center text-escutaris-terracotta text-sm font-medium">
                    Acessar <ExternalLink className="h-3 w-3 ml-1" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReferenciasSection;