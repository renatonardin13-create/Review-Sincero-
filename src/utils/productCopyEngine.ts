/**
 * Product Copywriting & Intelligence Engine
 * Generates high-converting, tailored Portuguese copy for affiliate reviews,
 * including headlines, SEO meta tags, buying triggers, pros/cons, verdicts, and authentic testimonials.
 */

export interface GeneratedFullCopy {
  headline: string;
  description: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  suggestedSeoTitles: string[];
  audience: string[];
  antiPersonaPhrase: string;
  pros: string[];
  cons: string[];
  verdict: string;
  overallScore: number;
  stockRemaining: number;
  testimonials: Array<{
    id: string;
    name: string;
    rating: number;
    photo: string;
    text: string;
    origin: string;
  }>;
  faq: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
}

export type HeadlineFormulaType =
  | 'sincero'
  | 'alerta'
  | 'custo'
  | 'teste'
  | 'segredo'
  | 'antes'
  | 'semfiltro'
  | 'economia'
  | 'urgencia'
  | 'comparativo';

export interface HeadlineFormulaOption {
  id: HeadlineFormulaType;
  label: string;
  badge: string;
  color: string;
  generate: (name: string) => string;
}

export const HEADLINE_FORMULAS: HeadlineFormulaOption[] = [
  {
    id: 'sincero',
    label: 'Padrão Sincero',
    badge: '★ MAIS USADO',
    color: 'border-[#3B82F6] text-[#93C5FD] bg-[#1E293B]',
    generate: (name) => `Review Sincero: ${name || 'Este Produto'} Vale a Pena ou é Furada? (Análise 2026)`
  },
  {
    id: 'alerta',
    label: 'Alerta / Curiosidade',
    badge: '⚠️ ATENÇÃO',
    color: 'border-[#EF4444] text-[#FCA5A5] bg-[#450A0A]/40',
    generate: (name) => `ALERTA: Não compre o ${name || 'produto'} antes de ver este teste sincero!`
  },
  {
    id: 'custo',
    label: 'Custo-Benefício',
    badge: '🏆 CAMPEÃO',
    color: 'border-[#F59E0B] text-[#FDE68A] bg-[#451A03]/40',
    generate: (name) => `${name || 'Produto'}: O Melhor Custo-Benefício de 2026? Testamos na Prática!`
  },
  {
    id: 'teste',
    label: 'Teste Prático 30 Dias',
    badge: '🔍 EXPERIÊNCIA',
    color: 'border-[#10B981] text-[#6EE7B7] bg-[#064E3B]/40',
    generate: (name) => `Testamos o ${name || 'Produto'} por 30 dias: Veja os Prós, Contras e o Veredito Real`
  },
  {
    id: 'segredo',
    label: 'Segredo / Revelado',
    badge: '⚡ REVELAÇÃO',
    color: 'border-[#8B5CF6] text-[#C4B5FD] bg-[#2E1065]/40',
    generate: (name) => `O que NINGUÉM te conta sobre o ${name || 'Produto'} antes de comprar!`
  },
  {
    id: 'antes',
    label: 'Antes de Comprar',
    badge: '🛑 PARE E LEIA',
    color: 'border-[#EC4899] text-[#FBCFE8] bg-[#500724]/40',
    generate: (name) => `NÃO COMPRE ${name || 'o Produto'} Sem Ver Isto! (Análise Completa e Honesta)`
  },
  {
    id: 'semfiltro',
    label: 'Veredito Sem Filtro',
    badge: '🛡️ 100% REAL',
    color: 'border-[#06B6D4] text-[#67E8F9] bg-[#083344]/40',
    generate: (name) => `${name || 'Produto'} é Bom Mesmo ou é Puro Marketing? Minha Opinião Sem Filtro`
  },
  {
    id: 'economia',
    label: 'Economia Inteligente',
    badge: '💰 CUSTO REAL',
    color: 'border-[#84CC16] text-[#BEF264] bg-[#1A2E05]/40',
    generate: (name) => `${name || 'Produto'}: Vale Cada Centavo ou é Dinheiro Jogado Fora?`
  },
  {
    id: 'urgencia',
    label: 'Urgência & Promoção',
    badge: '⏳ OPORTUNIDADE',
    color: 'border-[#F97316] text-[#FDBA74] bg-[#431407]/40',
    generate: (name) => `${name || 'Produto'} em Promoção Relâmpago: Vale a Pena Aproveitar Hoje?`
  },
  {
    id: 'comparativo',
    label: 'Comparativo Definitivo',
    badge: '🔥 VS CONCORRENTES',
    color: 'border-[#6366F1] text-[#A5B4FC] bg-[#1E1B4B]/40',
    generate: (name) => `${name || 'Produto'} Supera Marcas Caras? Análise Comparativa Definitiva 2026`
  }
];

export function generateHeadlineByFormula(type: HeadlineFormulaType, name: string): string {
  const found = HEADLINE_FORMULAS.find(f => f.id === type);
  if (found) return found.generate(name);
  return `${name || 'Produto'}: Review Sincero e Vale a Pena? (Análise 2026)`;
}

function normalize(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function slugify(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates high-converting SEO Meta Titles for Google SERP
 */
export function generateSeoTitles(productName: string): string[] {
  const p = productName?.trim() || 'Produto';
  return [
    `${p}: Review Sincero e Teste Prático (2026)`,
    `${p} Vale a Pena? Análise Completa e Veredito`,
    `${p} é Bom Mesmo? Cuidado Antes de Comprar!`,
    `Review ${p}: Prós, Contras e Onde Comprar Barato`
  ];
}

/**
 * Generates an optimized Google SEO snippet description (< 160 chars)
 */
export function generateSeoDescription(productName: string): string {
  const p = productName?.trim() || 'Produto';
  const norm = normalize(p);

  if (norm.includes('lanterna') || norm.includes('iluminac') || norm.includes('tatica')) {
    return `Descubra se a ${p} é potente, resistente e dura a noite toda. Teste sincero de alcance, bateria, prós, contras e melhor preço com garantia!`;
  }
  if (norm.includes('fone') || norm.includes('headset') || norm.includes('earbud')) {
    return `Análise completa do ${p}: qualidade de som, bateria e conforto testados na prática. Veja se vale a pena comprar hoje com desconto oficial!`;
  }
  if (norm.includes('cadeira') || norm.includes('escritorio') || norm.includes('ergonomica')) {
    return `Review sincero da ${p}: conforto lombar, inclinação e durabilidade para home office. Confira prós, contras e se vale a pena em 2026!`;
  }
  if (norm.includes('air fryer') || norm.includes('fritadeira') || norm.includes('panela')) {
    return `Testamos a ${p}: rapidez, economia de energia e facilidade de limpeza. Veja o veredito sincero e onde comprar pelo menor preço seguro!`;
  }
  return `Review sincero do ${p}: confira teste prático, durabilidade, prós, contras e veredito de especialista antes de comprar. Veja o melhor preço seguro!`;
}

/**
 * Master copy generator tailored to Brazilian e-commerce buyer psychology
 */
export function generateFullProductCopy(
  productName: string,
  category?: string
): GeneratedFullCopy {
  const name = productName?.trim() || 'Produto';
  const norm = normalize(name + ' ' + (category || ''));

  const slug = slugify(name);
  const seoTitles = generateSeoTitles(name);
  const seoTitle = seoTitles[0];
  const seoDescription = generateSeoDescription(name);
  const defaultHeadline = HEADLINE_FORMULAS[0].generate(name);

  // 1. LANTERNAS / ILUMINAÇÃO / CAMPING / TÁTICA
  if (
    norm.includes('lanterna') ||
    norm.includes('holofote') ||
    norm.includes('farol') ||
    norm.includes('tatica') ||
    norm.includes('camping') ||
    (norm.includes('bateria') && (norm.includes('led') || norm.includes('luz')))
  ) {
    return {
      headline: `Review Sincero: ${name} Vale a Pena ou é Furada? (Teste de Alcance & Bateria 2026)`,
      description: `Análise detalhada sobre feixe de luz, autonomia real da bateria de lítio, resistência à chuva (IPX6) e corpo em alumínio aeroespacial do ${name}. Descubra se entrega a potência prometida ou se é apenas marketing.`,
      slug: slug || 'lanterna-com-bateria-recarregavel',
      seoTitle,
      seoDescription,
      suggestedSeoTitles: seoTitles,
      audience: [
        `Quem precisa de iluminação potente e confiável no ${name} para emergências, camping ou trilhas`,
        'Profissionais de segurança, mecânica ou obras que executam manutenções noturnas',
        'Motoristas que desejam segurança no porta-luvas para eventuais panes na estrada',
        `Quem quer a garantia de um ${name} durável para não ficar na mão no escuro`
      ],
      antiPersonaPhrase:
        `Se você só precisa de uma luz fraca do celular uma vez por mês e não busca a potência do ${name}, esse produto não é para você.`,
      pros: [
        `Feixe de luz ultrabrilhante com alcance de longo alcance no ${name}`,
        `Bateria recarregável de lítio com excelente autonomia no ${name}`,
        `Corpo usinado em liga de alumínio aeroespacial resistente a quedas no ${name}`,
        `Carregamento prático via cabo USB / Tipo-C com indicador LED no ${name}`,
        `Múltiplos modos de iluminação (Foco Alto, Econômico e SOS) no ${name}`
      ],
      cons: [
        `O corpo metálico do ${name} dissipa calor naturalmente quando operado no modo turbo contínuo`,
        `Devido ao alto volume de vendas do ${name}, o estoque promocional na loja oficial costuma oscilar`
      ],
      verdict:
        `Testamos o ${name} em situações de escuridão total e o feixe superou expectativas. A bateria segurou firme e o acabamento metálico passa muita robustez. Pelo preço promocional com entrega oficial, é sem dúvidas uma das melhores compras da categoria.`,
      overallScore: 9.6,
      stockRemaining: 7,
      testimonials: [
        {
          id: 't-l1',
          name: 'Marcos Roberto',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          text: `Comprei o ${name} para deixar no carro e levar nas pescarias noturnas. O alcance do foco é absurdo de forte, clareou a margem inteira do rio.`,
          origin: 'Comprador Verificado'
        },
        {
          id: 't-l2',
          name: 'Patrícia Mendes',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
          text: `Chegou super rápido em 3 dias. O ${name} tem material resistente em alumínio de verdade. Recomendo muito!`,
          origin: 'Compradora Verificada'
        },
        {
          id: 't-l3',
          name: 'Carlos Eduardo',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          text: `Uso o ${name} no trabalho de manutenção. O foco ajustável e modo econômico são perfeitos. Muito superior a modelos comuns.`,
          origin: 'Comprador Verificado'
        },
        {
          id: 't-l4',
          name: 'Renata Oliveira',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          text: `O ${name} salvou nossa família na queda de energia. Clareia a sala inteira virada pro teto e recarrega fácil. Valeu cada centavo.`,
          origin: 'Compradora Verificada'
        }
      ],
      faq: [
        {
          id: 'f-1',
          question: `A bateria do ${name} realmente dura quanto tempo?`,
          answer:
            `Nos nossos testes práticos, a bateria recarregável do ${name} durou entre 6 a 10 horas de uso contínuo dependendo da intensidade.`
        },
        {
          id: 'f-2',
          question: `O ${name} é resistente à água e chuvas fortes?`,
          answer:
            `Sim! O ${name} possui vedação de borracha nos conectores aguentando chuva, umidade e respingos sem danificar o circuito.`
        }
      ]
    };
  }

  // 2. FERRAMENTAS / PARAFUSADEIRA / FURADEIRA
  if (
    norm.includes('parafusadeira') ||
    norm.includes('furadeira') ||
    norm.includes('ferramenta') ||
    norm.includes('esmerilhadeira') ||
    norm.includes('trena') ||
    norm.includes('martelete')
  ) {
    return {
      headline: `Review Sincero: ${name} Vale a Pena em 2026? Testamos Torque e Bateria`,
      description: `Colocamos o ${name} à prova em madeira maciça, alvenaria e montagens pesadas. Descubra a autonomia da bateria, empunhadura e custo-benefício.`,
      slug: slug || 'parafusadeira-impacto-bateria',
      seoTitle,
      seoDescription,
      suggestedSeoTitles: seoTitles,
      audience: [
        `Quem faz reparos em casa e quer praticidade usando o ${name}`,
        `Profissionais autônomos e montadores que buscam o ${name} pelo ótimo torque`,
        'Quem quer evitar o esforço de ferramentas manuais e ganhar agilidade',
        `Quem busca um kit completo com bateria durável no ${name}`
      ],
      antiPersonaPhrase:
        `Se você nunca precisa fazer pequenos reparos e prefere sempre pagar mão de obra externa, o ${name} não terá utilidade para você.`,
      pros: [
        `Torque potente com controle de velocidade e reverso no ${name}`,
        `Bateria de íon-lítio com rápido carregamento e alta durabilidade no ${name}`,
        `Design ergonômico com empunhadura emborrachada confortável no ${name}`,
        `Luz LED auxiliar integrada para iluminação precisa durante o uso do ${name}`,
        `Acompanha maleta e ponteiras essenciais para uso imediato do ${name}`
      ],
      cons: [
        `Para furos contínuos em concreto armado muito denso, recomenda-se ponteira específica no ${name}`,
        `A alta procura pelo ${name} em promoção na loja oficial pode gerar esgotamento de lote`
      ],
      verdict:
        `O ${name} surpreendeu pelo torque vigoroso e robustez. Montamos armários inteiros com apenas uma carga de bateria. Pelo valor promocional na loja oficial, entrega um custo-benefício imbatível.`,
      overallScore: 9.4,
      stockRemaining: 9,
      testimonials: [
        {
          id: 't-f1',
          name: 'Rodrigo Silveira',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          text: `Montei meus móveis todos com o ${name}! O torque é forte e a bateria aguentou o dia inteiro de trabalho.`,
          origin: 'Comprador Verificado'
        },
        {
          id: 't-f2',
          name: 'Felipe Alencar',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          text: `O ${name} é leve, compacto e entra fácil em lugares apertados. Aprovado 100%!`,
          origin: 'Comprador Verificado'
        }
      ],
      faq: [
        {
          id: 'f-f1',
          question: `O ${name} fura parede de alvenaria comum?`,
          answer:
            `Sim, o ${name} fura alvenaria e tijolos perfeitamente com a broca correta de vídea, além de madeira e metal.`
        }
      ]
    };
  }

  // 3. CADEIRA ERGONÔMICA / HOME OFFICE
  if (norm.includes('cadeira') || norm.includes('escritorio') || norm.includes('ergonomica') || norm.includes('gamer')) {
    return {
      headline: `Review Sincero: ${name} Salva a Lombar no Home Office? (Teste 2026)`,
      description: `Testamos a ergonomia, apoio de lombar, tecido respirável e regulagens do ${name} por 30 dias de trabalho intenso. Veja se acaba com as dores.`,
      slug: slug || 'cadeira-ergonomica-escritorio',
      seoTitle,
      seoDescription,
      suggestedSeoTitles: seoTitles,
      audience: [
        `Quem passa horas sentado trabalhando e busca o conforto ergonômico do ${name}`,
        `Pessoas que precisam de apoio lombar ajustável e assento macio no ${name}`,
        'Quem quer melhorar a postura e evitar dores nas costas ao longo do dia',
        `Quem deseja um design moderno para seu ambiente de trabalho com o ${name}`
      ],
      antiPersonaPhrase:
        `Se você raramente passa tempo na escrivaninha, investir no ${name} pode não ser necessário.`,
      pros: [
        `Encosto em tecido respirável de alta densidade no ${name}`,
        `Apoio lombar ajustável que mantém a postura correta no ${name}`,
        `Mecanismo relax com trava de inclinação suave no ${name}`,
        `Pistão a gás certificado e estrutura reforçada no ${name}`,
        `Rodízios silenciosos em PU que protegem o piso ao usar o ${name}`
      ],
      cons: [
        `A montagem inicial do ${name} leva cerca de 20 minutos com manual e chave inclusos`,
        `Pessoas acima de 1,95m de altura podem necessitar ajustar o apoio de cabeça no limite máximo do ${name}`
      ],
      verdict:
        `Após semanas de uso por 8 horas diárias, o ${name} proporcionou alívio imediato da tensão lombar. A estrutura passa muita firmeza e a espuma do assento não deformou. Vale o investimento na sua saúde.`,
      overallScore: 9.5,
      stockRemaining: 5,
      testimonials: [
        {
          id: 't-c1',
          name: 'Marcos Rezende',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          text: `Melhor compra que fiz pro home office. O ${name} eliminou minhas dores nas costas no fim do dia.`,
          origin: 'Comprador Verificado'
        }
      ],
      faq: [
        {
          id: 'f-c1',
          question: `O ${name} suporta até quantos quilos?`,
          answer: `A estrutura reforçada do ${name} suporta com total estabilidade até 130 kg.`
        }
      ]
    };
  }

  // 4. TECH / FONES / SMARTWATCH
  if (norm.includes('fone') || norm.includes('headset') || norm.includes('airpod') || norm.includes('tws') || norm.includes('smartwatch') || norm.includes('celular') || norm.includes('smartphone')) {
    return {
      headline: `Review Sincero: ${name} Vale a Pena em 2026? Testamos Som e Bateria`,
      description: `Testamos a fidelidade sonora dos graves, cancelamento de ruído, conexão Bluetooth e bateria do ${name}. Veja se compensa frente a modelos caros.`,
      slug: slug || 'fone-bluetooth-tws-sem-fio',
      seoTitle,
      seoDescription,
      suggestedSeoTitles: seoTitles,
      audience: [
        `Quem busca praticidade, ótimo som e autonomia no ${name}`,
        `Pessoas que fazem reuniões online e precisam do microfone do ${name}`,
        'Quem não quer fios atrapalhando durante treinos ou rotina diária',
        `Quem procura alta qualidade de tecnologia no ${name} sem pagar fortunas`
      ],
      antiPersonaPhrase:
        `Se você não utiliza fones portáteis ou tecnologias sem fio no dia a dia, o ${name} pode não ser a escolha ideal.`,
      pros: [
        `Excelente qualidade de som com graves definidos e áudio limpo no ${name}`,
        `Conexão Bluetooth 5.3 estável com pareamento instantâneo do ${name}`,
        `Bateria de longa duração para uso contínuo do ${name}`,
        `Design anatômico e leveza extrema para o dia a dia com o ${name}`,
        `Resistência contra suor e respingos d'água no ${name}`
      ],
      cons: [
        `O cabo de carregamento incluso no ${name} possui comprimento padrão`,
        `Devido ao sucesso do ${name}, o estoque promocional costuma ter alta rotatividade`
      ],
      verdict:
        `O ${name} entrega uma experiência excelente no uso diário. O pareamento é imediato, o som é encorpado e a bateria surpreende na rotina. Pelo valor promocional verificado na loja oficial, é uma compra acertada.`,
      overallScore: 9.3,
      stockRemaining: 8,
      testimonials: [
        {
          id: 't-fo1',
          name: 'Lucas P.',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          text: `O som do ${name} é sensacional, graves fortes que não abafam a voz. Fica bem firme durante o treino.`,
          origin: 'Comprador Verificado'
        }
      ],
      faq: [
        {
          id: 'f-fo1',
          question: `O ${name} funciona em qualquer dispositivo?`,
          answer: `Sim, o ${name} é compatível com qualquer dispositivo Android, iOS, Windows ou Bluetooth.`
        }
      ]
    };
  }

  // 5. CASA / COZINHA / AIR FRYER / ELETRO
  if (norm.includes('air fryer') || norm.includes('fritadeira') || norm.includes('panela') || norm.includes('liquidificador') || norm.includes('aspirador') || norm.includes('robo')) {
    return {
      headline: `Review Sincero: ${name} Vale a Pena em 2026? Teste de Eficiência`,
      description: `Testamos a praticidade, facilidade de limpeza, consumo de energia e resultado do ${name} em receitas reais. Veja se vale a pena ter na sua casa.`,
      slug: slug || 'fritadeira-eletrica-sem-oleo',
      seoTitle,
      seoDescription,
      suggestedSeoTitles: seoTitles,
      audience: [
        `Quem quer praticidade e agilidade nas tarefas do lar com o ${name}`,
        `Pessoas que buscam economizar tempo e esforço usando o ${name}`,
        `Quem quer refeições saudáveis sem bagunça na cozinha com o ${name}`,
        'Quem mora sozinho ou em família e valoriza facilidade de limpeza'
      ],
      antiPersonaPhrase:
        `Se você não costuma cozinhar ou utilizar eletrodomésticos práticos, o ${name} não mudará sua rotina.`,
      pros: [
        `Preparo rápido e saboroso de alimentos sem necessidade de óleo no ${name}`,
        `Cesto antiaderente premium muito fácil e rápido de lavar no ${name}`,
        `Economia de tempo e energia na cozinha utilizando o ${name}`,
        `Timer inteligente e controles simples de manusear no ${name}`,
        `Design moderno e compacto que valoriza o ambiente com o ${name}`
      ],
      cons: [
        `Recomenda-se realizar a cura simples do antiaderente no primeiro uso do ${name}`,
        `O cabo elétrico do ${name} possui comprimento padrão de bancada`
      ],
      verdict:
        `O ${name} transforma a rotina diária trazendo muita praticidade. A limpeza é simples e rápida, e o resultado final nas receitas atende perfeitamente. Excelente aquisição para o lar.`,
      overallScore: 9.5,
      stockRemaining: 6,
      testimonials: [
        {
          id: 't-a1',
          name: 'Ana Paula Ramos',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
          text: `Facilitou demais a minha vida na cozinha! O ${name} é super prático e rápido de limpar.`,
          origin: 'Compradora Verificada'
        }
      ],
      faq: [
        {
          id: 'f-a1',
          question: `O ${name} consome muita energia?`,
          answer: `Não, o ${name} foi projetado com alta eficiência energética para um consumo baixo e consciente.`
        }
      ]
    };
  }

  // 6. SUPLEMENTOS / SAÚDE / FITING / BELEZA / COSMÉTICOS / CREATINA / WHEY / VITAMINAS
  if (
    norm.includes('creatina') ||
    norm.includes('whey') ||
    norm.includes('suplemento') ||
    norm.includes('proteina') ||
    norm.includes('vitamina') ||
    norm.includes('colageno') ||
    norm.includes('omega') ||
    norm.includes('termogenico') ||
    norm.includes('pre treino') ||
    norm.includes('saude') ||
    norm.includes('beleza') ||
    norm.includes('skincare') ||
    norm.includes('cosmetico') ||
    norm.includes('perfume') ||
    norm.includes('shampoo') ||
    norm.includes('suplementacao') ||
    norm.includes('massa')
  ) {
    return {
      headline: `Review Sincero: ${name} Vale a Pena em 2026? Testamos Pureza e Resultados`,
      description: `Análise detalhada sobre efeitos, solubilidade, grau de pureza e custo por dose do ${name}. Descubra se cumpre o que promete e se vale o investimento.`,
      slug: slug || 'suplemento-analise-sincera',
      seoTitle,
      seoDescription,
      suggestedSeoTitles: seoTitles,
      audience: [
        `Quem busca otimizar a performance, força e saúde com o ${name} original`,
        `Praticantes de atividades físicas e esportes que priorizam qualidade de matéria-prima no ${name}`,
        `Quem deseja evitar produtos falsificados adquirindo na loja oficial do ${name}`,
        `Quem busca o melhor custo por dose com laudo de pureza comprovado do ${name}`
      ],
      antiPersonaPhrase:
        `Se você não busca constância no consumo e prefere arriscar com produtos sem procedência, o ${name} não é para você.`,
      pros: [
        `Matéria-prima de altíssima pureza com laudo de qualidade no ${name}`,
        `Rápida absorção e excelentes resultados práticos percebidos no ${name}`,
        `Fórmula sem sabores artificiais enjoativos e fácil solubilidade do ${name}`,
        `Excelente custo-benefício por dose comparado a marcas concorrentes no ${name}`,
        `Produto 100% original com nota fiscal e garantia do fabricante no ${name}`
      ],
      cons: [
        `Devido à alta procura do ${name}, os lotes promocionais esgotam rapidamente no distribuidor oficial`,
        `Exige constância e consumo diário conforme a orientação para obter o máximo resultado com o ${name}`
      ],
      verdict:
        `Testamos o ${name} e comprova-se uma excelente opção no mercado. O grau de pureza, solubilidade e resultados práticos atendem perfeitamente quem busca desempenho real. Vale muito a pena adquirir pelo distribuidor oficial verificado.`,
      overallScore: 9.6,
      stockRemaining: 6,
      testimonials: [
        {
          id: 't-s1',
          name: 'Bruno Machado',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          text: `Uso o ${name} há mais de 2 meses e a diferença na força e recuperação foi notável. Dissolve super rápido na água.`,
          origin: 'Comprador Verificado'
        },
        {
          id: 't-s2',
          name: 'Camila Duarte',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
          text: `Chegou super rápido com nota fiscal e bem lacrado. O ${name} tem excelente qualidade. Recomendo!`,
          origin: 'Compradora Verificada'
        }
      ],
      faq: [
        {
          id: 'f-s1',
          question: `O ${name} é original e possui laudo de pureza?`,
          answer: `Sim! O ${name} comercializado pela loja oficial indicada é 100% original, aprovado pela Anvisa e acompanha nota fiscal.`
        }
      ]
    };
  }

  // 7. GENÉRICO INTELIGENTE / QUALQUER OUTRO PRODUTO
  return {
    headline: defaultHeadline,
    description: `Análise completa e sincera sobre a durabilidade, usabilidade e custo-benefício do ${name}. Confira nosso teste real antes de fechar sua compra.`,
    slug: slug || 'analise-produto-sincero',
    seoTitle,
    seoDescription,
    suggestedSeoTitles: seoTitles,
    audience: [
      `Quem busca a melhor versão de ${name} com garantia e nota fiscal na loja oficial`,
      `Pessoas que priorizam durabilidade e materiais de qualidade comprovada no ${name}`,
      `Quem quer evitar imitações ou produtos sem garantia adquirindo o ${name} oficial`,
      `Quem quer aproveitar o preço promocional de lançamento do ${name}`
    ],
    antiPersonaPhrase:
      `Se você não tem interesse em adquirir um ${name} durável e prefere arriscar com modelos genéricos sem garantia, esse review não é para você.`,
    pros: [
      `Excelente padrão de acabamento e durabilidade comprovada no uso do ${name}`,
      `Alta eficiência e facilidade de manuseio no dia a dia com o ${name}`,
      `Desempenho prático que atende e supera as expectativas no ${name}`,
      `Garantia direta do fabricante com suporte ao consumidor e compra 100% segura do ${name}`
    ],
    cons: [
      `Devido ao alto volume de pedidos do ${name}, o estoque promocional costuma oscilar na loja oficial`,
      `Algumas opções ou variações do ${name} podem esgotar nas primeiras horas de campanha`
    ],
    verdict:
      `Testamos o ${name} exaustivamente e podemos confirmar que o produto entrega exatamente o que promete. Pelo preço promocional praticado na loja verificada, o custo-benefício é imbatível. Vale muito a pena o investimento.`,
    overallScore: 9.4,
    stockRemaining: 8,
    testimonials: [
      {
        id: 't-g1',
        name: 'Marcos R.',
        rating: 5,
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        text: `Comprei o ${name} após pesquisar muito e superou minhas expectativas. Chegou super rápido e a qualidade é excelente!`,
        origin: 'Comprador Verificado'
      },
      {
        id: 't-g2',
        name: 'Patrícia Mendes',
        rating: 5,
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        text: `Esperava algo bom, mas o ${name} me surpreendeu de verdade. Acabamento impecável e fácil de usar no dia a dia. Recomendo demais!`,
        origin: 'Compradora Verificada'
      },
      {
        id: 't-g3',
        name: 'Carlos Eduardo',
        rating: 5,
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        text: `Entrega muito rápida em 3 dias úteis. O ${name} veio bem lacrado com nota fiscal e garantia. Valeu cada centavo investido.`,
        origin: 'Comprador Verificado'
      },
      {
        id: 't-g4',
        name: 'Renata Oliveira',
        rating: 5,
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        text: `Estava com receio de comprar pela internet, mas a loja é super séria. O ${name} é 100% original e atendimento nota dez!`,
        origin: 'Compradora Verificada'
      }
    ],
    faq: [
      {
        id: 'f-g1',
        question: `O ${name} é original com garantia?`,
        answer: `Sim, o ${name} comprado através do link oficial possui garantia do fabricante, nota fiscal e suporte completo.`
      },
      {
        id: 'f-g2',
        question: `Qual o prazo médio de entrega do ${name}?`,
        answer: `A entrega do ${name} é realizada com rastreamento ativo com prazo estimado entre 3 a 7 dias úteis.`
      }
    ]
  };
}

/**
 * Generates an authentic single testimonial text for a given product and index
 */
export function generateSingleTestimonialText(productName: string, idx: number): string {
  const p = productName?.trim() || 'produto';
  const norm = normalize(p);

  if (norm.includes('lanterna') || norm.includes('iluminac') || norm.includes('tatica')) {
    const list = [
      `Comprei a lanterna para deixar no porta-luvas do carro e em acampamentos. O feixe ilumina tudo a centenas de metros e a bateria durou a noite inteira.`,
      `Chegou muito rápido em 3 dias. Corpo pesado em liga de alumínio, resistente de verdade. O indicador de bateria evita ficar no escuro de surpresa.`,
      `Uso no meu trabalho de manutenção noturna. O foco ajustável e o modo econômico são perfeitos. Muito superior a lanternas que custam o dobro.`,
      `Salvou nossa família durante uma queda de energia que durou o dia todo. Clareia a casa inteira e recarrega fácil no USB. Recomendo muito!`,
      `Material excelente, resistente a respingos e com acabamento de primeira. Valeu cada centavo investido!`
    ];
    return list[idx % list.length];
  }

  if (norm.includes('parafusadeira') || norm.includes('furadeira') || norm.includes('ferramenta')) {
    const list = [
      `Montei meu quarto planejado inteiro só com ela! O torque é muito forte e a bateria aguentou o dia todo.`,
      `Uso em montagens diárias. Compacta, leve e muito potente. A luz de LED na ponta ajuda muito em lugares escuros.`,
      `Excelente custo-benefício. Já tive ferramentas mais caras que não tinham a mesma força e durabilidade.`,
      `Chegou bem embalada na maleta com todos os bits e carregador bivolt. Muito fácil de manusear. Recomendo 100%!`,
      `Muito satisfeito! Bateria carrega rápido e não perde força durante o aperto. Ótima compra.`
    ];
    return list[idx % list.length];
  }

  const genericList = [
    `Comprei o ${p} após pesquisar muito e superou todas as expectativas. Acabamento de primeira e muito prático!`,
    `Chegou em 3 dias super bem embalado com nota fiscal. Funciona perfeitamente e é muito durável.`,
    `Estava em dúvida antes de comprar, mas valeu cada centavo. Excelente investimento para o dia a dia!`,
    `Muito satisfeito com o ${p}! A loja oficial enviou rápido com rastreio atualizado. Recomendo sem medo.`,
    `Qualidade impecável, cumpre 100% o que promete. Já indiquei para amigos e familiares!`
  ];
  return genericList[idx % genericList.length];
}
