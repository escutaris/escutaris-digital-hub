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
        {
          title: 'Observatório de Saúde Mental e Trabalho',
          description: 'Iniciativa dedicada ao monitoramento e produção de conhecimento sobre saúde mental no contexto do trabalho.',
          url: 'https://observatoriosaudementaltrabalho.com/proposta/',
        },
        {
          title: 'Observatório de SST — TST',
          description: 'Observatório de Segurança e Saúde no Trabalho do Tribunal Superior do Trabalho.',
          url: 'https://www.tst.jus.br/web/trabalhoseguro/observatorio-sst',
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
        {
          title: 'Convenção nº 155 da OIT — Segurança e Saúde dos Trabalhadores',
          description: 'Estrutura o dever de prevenção dos riscos relacionados ao trabalho e o ambiente de trabalho seguro e saudável.',
          url: 'https://normlex.ilo.org/dyn/normlex/en/f?p=NORMLEXPUB:12100:0::NO::P12100_ILO_CODE:C155',
        },
        {
          title: 'Convenção nº 161 da OIT — Serviços de Saúde no Trabalho',
          description: 'Define o monitoramento da saúde das pessoas trabalhadoras e a estrutura dos serviços de saúde ocupacional.',
          url: 'https://normlex.ilo.org/dyn/normlex/en/f?p=NORMLEXPUB:12100:0::NO::P12100_ILO_CODE:C161',
        },
        {
          title: 'Convenção nº 187 da OIT — Quadro Promocional para SST',
          description: 'Estabelece a gestão contínua de riscos e um sistema nacional de segurança e saúde no trabalho.',
          url: 'https://normlex.ilo.org/dyn/normlex/en/f?p=NORMLEXPUB:12100:0::NO::P12100_ILO_CODE:C187',
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
            
            <ul className="space-y-4">
              {categoria.items.map((item, itemIndex) => (
                <li key={itemIndex} className="border-b border-border/30 pb-4 last:border-b-0 last:pb-0">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block transition-all hover:translate-x-1 duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-escutaris-terracotta/10 rounded-lg group-hover:bg-escutaris-terracotta/20 transition-colors flex-shrink-0 mt-0.5">
                        <ExternalLink className="h-4 w-4 text-escutaris-terracotta" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-foreground font-semibold mb-1 group-hover:text-escutaris-terracotta transition-colors">
                          {item.title}
                        </h4>
                        
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {item.description}
                        </p>
                        
                        <div className="mt-2 flex items-center text-escutaris-terracotta text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Acessar link <ExternalLink className="h-3 w-3 ml-1" />
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReferenciasSection;