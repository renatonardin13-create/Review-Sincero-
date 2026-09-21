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
  return normalize(str)
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
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
      description: `Análise detalhada sobre feixe de luz, autonomia real da bateria de lítio, resistência à chuva (IPX6) e corpo em alumínio aeroespacial. Descubra se entrega a potência prometida ou se é apenas marketing.`,
      slug: slug || 'lanterna-com-bateria-recarregavel',
      seoTitle,
      seoDescription,
      suggestedSeoTitles: seoTitles,
      audience: [
        'Quem precisa de iluminação potente e confiável para emergências, camping, trilhas ou viagens',
        'Profissionais de segurança, mecânica ou obras que executam manutenções noturnas',
        'Motoristas que desejam segurança no porta-luvas para eventuais panes na estrada',
        'Quem já se frustrou com lanternas baratas que descarregam rápido ou quebram na primeira queda'
      ],
      antiPersonaPhrase:
        'Se você só precisa de uma luz fraca do celular uma vez por mês e não se importa com alcance ou resistência, não precisa de uma lanterna profissional.',
      pros: [
        'Feixe de luz ultrabrilhante com alcance de longo alcance mesmo em escuridão total',
        'Bateria recarregável de lítio com longa autonomia e indicador LED de nível de carga',
        'Corpo usinado em liga de alumínio aeroespacial resistente a quedas e respingos de chuva (IPX6)',
        'Carregamento prático via cabo USB / Tipo-C compatível com carregador de celular ou powerbank',
        'Múltiplos modos de iluminação (Foco Alto, Econômico e Strobo/SOS para emergências)'
      ],
      cons: [
        'Corpo metálico dissipa calor naturalmente quando operado no modo turbo contínuo',
        'Feixe extremamente forte que exige cuidado para não apontar diretamente aos olhos'
      ],
      verdict:
        'Testamos a lanterna em situações extremas de escuridão total e o feixe superou expectativas. A bateria segurou firme e o acabamento metálico passa muita robustez. Pelo preço promocional com entrega oficial, é sem dúvidas a melhor escolha da categoria.',
      overallScore: 9.6,
      stockRemaining: 7,
      testimonials: [
        {
          id: 't-l1',
          name: 'Marcos Roberto',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          text: 'Comprei para deixar no carro e levar nas pescarias noturnas. O alcance do foco é absurdo de forte, clareou a margem inteira do rio. A bateria durou o fim de semana todo sem recarregar.',
          origin: 'Comprador Verificado'
        },
        {
          id: 't-l2',
          name: 'Patrícia Mendes',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
          text: 'Chegou super rápido em 3 dias em Campinas. Material resistente de verdade em alumínio, nada de plástico frágil. O indicador de bateria evita ficar na mão no escuro. Recomendo muito!',
          origin: 'Compradora Verificada'
        },
        {
          id: 't-l3',
          name: 'Carlos Eduardo',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          text: 'Uso diariamente no meu trabalho de manutenção em galpões. O foco ajustável e o modo econômico são perfeitos. Muito superior a lanternas que cobram o dobro em lojas de ferramentas.',
          origin: 'Comprador Verificado'
        },
        {
          id: 't-l4',
          name: 'Renata Oliveira',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          text: 'Comprei por precaução após uma tempestade deixar o bairro 2 dias sem luz. Salvou nossa família! Clareia a sala inteira virada pro teto e recarrega fácil no USB. Valeu cada centavo.',
          origin: 'Compradora Verificada'
        }
      ],
      faq: [
        {
          id: 'f-1',
          question: 'A bateria realmente dura quanto tempo?',
          answer:
            'Nos nossos testes práticos, a bateria recarregável durou entre 6 a 10 horas de uso contínuo dependendo da intensidade escolhida, com indicador LED que avisa quando precisa recarregar.'
        },
        {
          id: 'f-2',
          question: 'É resistente à água e chuvas fortes?',
          answer:
            'Sim! Possui vedação de borracha nos conectores com certificação IPX6, aguentando chuvas fortes, umidade e respingos sem danificar o circuito interno.'
        },
        {
          id: 'f-3',
          question: 'Como funciona o carregamento?',
          answer:
            'Acompanha cabo USB / Tipo-C, podendo ser recarregada em tomadas convencionais de celular, portas USB do computador ou até no carregador veicular e powerbank.'
        },
        {
          id: 'f-4',
          question: 'Qual é o prazo de entrega e garantia?',
          answer:
            'Pela loja oficial indicada, a entrega é rastreada pelos Correios e transportadoras com prazo médio de 3 a 7 dias úteis, contando com garantia de 30 dias para devolução sem burocracia.'
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
      description: `Colocamos a ${name} à prova em madeira maciça, alvenaria e montagens pesadas. Descubra a autonomia da bateria, empunhadura e custo-benefício.`,
      slug: slug || 'parafusadeira-impacto-bateria',
      seoTitle,
      seoDescription,
      suggestedSeoTitles: seoTitles,
      audience: [
        'Quem faz reparos em casa e quer economizar sem precisar chamar montador a cada móvel',
        'Profissionais autônomos, marceneiros ou eletricistas que buscam ferramenta leve e potente',
        'Quem já cansou de usar chave de fenda manual e quer agilidade e precisão nos parafusos',
        'Quem busca um kit completo com bateria durável sem pagar fortuna em marcas importadas'
      ],
      antiPersonaPhrase:
        'Se você nunca aperta um parafuso na vida ou prefere sempre pagar mão de obra externa, uma parafusadeira de impacto não terá utilidade para você.',
      pros: [
        'Torque potente com controle de velocidade e reverso na empunhadura',
        'Bateria de íon-lítio com carregamento rápido e sem efeito memória',
        'Design ergonômico com empunhadura emborrachada que não cansa a mão',
        'Luz LED auxiliar integrada para iluminar o ponto exato de trabalho',
        'Acompanha maleta e ponteiras essenciais para uso imediato'
      ],
      cons: [
        'Para furos contínuos em concreto armado muito denso, um martelete SDS é mais adequado',
        'O manual vem resumido, mas o manuseio é 100% intuitivo'
      ],
      verdict:
        'A ferramenta surpreendeu pelo torque vigoroso e robustez. Montamos armários inteiros com apenas uma carga de bateria. Pelo valor cobrado na promoção oficial, entrega mais força que concorrentes bem mais caros.',
      overallScore: 9.4,
      stockRemaining: 9,
      testimonials: [
        {
          id: 't-f1',
          name: 'Rodrigo Silveira',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          text: 'Montei meu quarto planejado inteiro só com ela! O torque é muito forte e a bateria aguentou o dia todo. Melhor investimento que fiz.',
          origin: 'Comprador Verificado'
        },
        {
          id: 't-f2',
          name: 'Felipe Alencar',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          text: 'Uso em instalação de ar condicionado. Leve, compacta e entra fácil em lugares apertados. Aprovada 100%!',
          origin: 'Comprador Verificado'
        },
        {
          id: 't-f3',
          name: 'Luciana Martins',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
          text: 'Chegou em 4 dias bem embalada com a maleta. Muito fácil de usar até pra quem nunca mexeu com ferramentas. Recomendo!',
          origin: 'Compradora Verificada'
        },
        {
          id: 't-f4',
          name: 'Marcio Santos',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
          text: 'Excelente custo-benefício. Já usei marcas de 800 reais que não duravam tanto a bateria quanto essa. Pode comprar sem medo.',
          origin: 'Comprador Verificado'
        }
      ],
      faq: [
        {
          id: 'f-f1',
          question: 'Fura parede de alvenaria comum?',
          answer:
            'Sim, fura alvenaria e tijolos perfeitamente com a broca correta de vídea, além de madeira, drywall e chapas de metal.'
        },
        {
          id: 'f-f2',
          question: 'A bateria é bivolt?',
          answer:
            'Sim, o carregador é bivolt automático (110V/220V), funcionando em qualquer tomada do Brasil.'
        }
      ]
    };
  }

  // 3. CADEIRA ERGONÔMICA / HOME OFFICE
  if (norm.includes('cadeira') || norm.includes('escritorio') || norm.includes('ergonomica') || norm.includes('gamer')) {
    return {
      headline: `Review Sincero: ${name} Salva a Lombar no Home Office? (Teste 2026)`,
      description: `Testamos a ergonomia, apoio de lombar, tecido respirável em mesh e regulagens de altura por 30 dias de trabalho intenso. Veja se realmente acaba com as dores nas costas.`,
      slug: slug || 'cadeira-ergonomica-escritorio',
      seoTitle,
      seoDescription,
      suggestedSeoTitles: seoTitles,
      audience: [
        'Quem passa mais de 6 horas por dia sentado trabalhando ou estudando e sente incômodo na coluna',
        'Pessoas que buscam apoio lombar ajustável e assento confortável que não afunda com o tempo',
        'Quem quer melhorar a postura e evitar gastos com fisioterapia ou dores musculares',
        'Quem deseja uma cadeira com design executivo e moderno que combina com qualquer ambiente'
      ],
      antiPersonaPhrase:
        'Se você só senta na escrivaninha 15 minutos por semana, qualquer cadeira básica comum já atende sua necessidade.',
      pros: [
        'Encosto em mesh respirável de alta densidade que não esquenta nos dias quentes',
        'Apoio lombar ajustável que mantém a curvatura anatômica correta da coluna',
        'Mecanismo relax com trava de inclinação para momentos de descanso',
        'Pistão a gás classe 4 certificado com sustentação robusta e regulagem suave',
        'Rodízios silenciosos em PU que não riscam pisos de madeira ou porcelanato'
      ],
      cons: [
        'A montagem inicial leva cerca de 20 minutos, embora venha com chave e manual ilustrado',
        'Pessoas acima de 1,95m podem preferir regular o apoio de cabeça no limite máximo'
      ],
      verdict:
        'Após semanas de uso por 8 horas diárias, a redução de tensão nos ombros e na lombar foi imediata. A espuma do assento não deformou e a estrutura passa muita firmeza. Vale cada centavo investido na sua saúde.',
      overallScore: 9.5,
      stockRemaining: 5,
      testimonials: [
        {
          id: 't-c1',
          name: 'Marcos Rezende',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          text: 'Melhor compra que fiz pro home office esse ano. As dores no fim do dia na lombar sumiram completamente. Recomendo demais.',
          origin: 'Comprador Verificado'
        },
        {
          id: 't-c2',
          name: 'Patrícia Moura',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
          text: 'Esperava algo mediano pelo preço, mas chegou e me surpreendeu. O acabamento é impecável e o apoio de cabeça ajuda muito.',
          origin: 'Compradora Verificada'
        },
        {
          id: 't-c3',
          name: 'Guilherme Santos',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          text: 'Trabalho 9 horas por dia sentado. A inclinação para relaxar no almoço é sensacional e a montagem foi muito tranquila.',
          origin: 'Comprador Verificado'
        },
        {
          id: 't-c4',
          name: 'Renata Oliveira',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          text: 'Chegou super rápido em 4 dias no interior de SP. Chave e parafusos vieram todos certinhos com peças extras. Recomendo 100%!',
          origin: 'Compradora Verificada'
        }
      ],
      faq: [
        {
          id: 'f-c1',
          question: 'Suporta até quantos quilos?',
          answer: 'A estrutura com pistão classe 4 é reforçada e suporta com folga até 130 kg com total estabilidade.'
        },
        {
          id: 'f-c2',
          question: 'Acompanha as ferramentas para montar?',
          answer: 'Sim, acompanha chave Allen e todos os parafusos identificados passo a passo no manual em português.'
        }
      ]
    };
  }

  // 4. TECH / FONES / SMARTWATCH
  if (norm.includes('fone') || norm.includes('headset') || norm.includes('airpod') || norm.includes('tws') || norm.includes('smartwatch')) {
    return {
      headline: `Review Sincero: ${name} Vale a Pena em 2026? Testamos Som e Bateria`,
      description: `Testamos a fidelidade sonora dos graves, cancelamento de ruído, estabilidade do Bluetooth 5.3 e autonomia real da case. Veja se compensa frente a modelos caros.`,
      slug: slug || 'fone-bluetooth-tws-sem-fio',
      seoTitle,
      seoDescription,
      suggestedSeoTitles: seoTitles,
      audience: [
        'Quem ama ouvir música com graves marcantes durante treinos, corrida ou deslocamentos',
        'Pessoas que fazem reuniões online ou chamadas e precisam de microfone com voz clara',
        'Quem não quer cabos atrapalhando nem ter que carregar o fone todo dia',
        'Quem procura excelente qualidade sonora sem ter que pagar R$ 800+ em marcas de grife'
      ],
      antiPersonaPhrase:
        'Se você é um audiófilo de estúdio profissional que exige fones cabeados de alta impedância com DAC dedicado, fones portáteis não são seu foco.',
      pros: [
        'Conexão Bluetooth 5.3 instantânea e sem atraso em vídeos e jogos',
        'Graves encorpados e agudos limpos sem distorcer no volume máximo',
        'Encaixe firme e anatômico que não cai durante corridas ou musculação',
        'Bateria com autonomia de até 6h contínuas + 24h na case de carregamento',
        'Resistente ao suor e respingos com certificação IPX4'
      ],
      cons: [
        'A case não possui carregamento por indução sem fio (apenas cabo USB-C incluso)',
        'Alta procura costuma esgotar as cores mais procuradas rapidamente'
      ],
      verdict:
        'O produto entrega uma experiência sonora equivalente a fones do dobro do valor. O pareamento é imediato, o isolamento passivo funciona muito bem e a bateria surpreende. Pelo valor promocional, é uma compra certeira.',
      overallScore: 9.3,
      stockRemaining: 8,
      testimonials: [
        {
          id: 't-fo1',
          name: 'Lucas P.',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          text: 'O som é sensacional, graves fortes que não abafam a voz. Uso na academia todo dia e não cai do ouvido de jeito nenhum.',
          origin: 'Comprador Verificado'
        },
        {
          id: 't-fo2',
          name: 'Beatriz Lima',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
          text: 'A bateria dura muito! Uso o dia todo no trabalho e só recarrego a caixinha uma vez por semana. Amei o design minimalista.',
          origin: 'Compradora Verificada'
        },
        {
          id: 't-fo3',
          name: 'Thiago Nogueira',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          text: 'Excelente microfone para reuniões no Meet e chamadas no WhatsApp. As pessoas me escutam alto e sem eco. Recomendo.',
          origin: 'Comprador Verificado'
        },
        {
          id: 't-fo4',
          name: 'Mariana Duarte',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          text: 'Chegou antes do prazo! Pareou super rápido com meu iPhone e com o notebook da empresa. Custo-benefício nota 10.',
          origin: 'Compradora Verificada'
        }
      ],
      faq: [
        {
          id: 'f-fo1',
          question: 'Funciona em qualquer celular?',
          answer: 'Sim, compatível com qualquer dispositivo com Bluetooth (iPhone, Android, Xiaomi, notebooks e tablets).'
        },
        {
          id: 'f-fo2',
          question: 'Tem garantia de troca?',
          answer: 'Sim, garantia legal de 30 dias pela loja oficial para troca ou reembolso caso haja qualquer problema.'
        }
      ]
    };
  }

  // 5. CASA / COZINHA / AIR FRYER / ELETRO
  if (norm.includes('air fryer') || norm.includes('fritadeira') || norm.includes('panela') || norm.includes('liquidificador') || norm.includes('aspirador')) {
    return {
      headline: `Review Sincero: ${name} Vale a Pena em 2026? Teste de Eficiência`,
      description: `Testamos a praticidade, facilidade de limpeza, consumo de energia e resultado no dia a dia com receitas reais. Veja se compensa ter na sua cozinha.`,
      slug: slug || 'fritadeira-eletrica-sem-oleo',
      seoTitle,
      seoDescription,
      suggestedSeoTitles: seoTitles,
      audience: [
        'Quem quer cozinhar refeições saudáveis sem óleo de forma rápida e prática',
        'Famílias e pessoas práticas que não querem perder tempo lavando louça engordurada',
        'Quem busca economizar gás de cozinha usando um aparelho elétrico eficiente',
        'Quem mora sozinho ou a dois e deseja porções rápidas e crocantes'
      ],
      antiPersonaPhrase:
        'Se você nunca cozinha em casa ou prefere fritura tradicional imersa em litros de óleo, esse produto não mudará sua rotina.',
      pros: [
        'Prepara alimentos crocantes por fora e macios por dentro sem pingar óleo',
        'Cesto antiaderente premium de fácil remoção que não gruda os alimentos',
        'Economiza tempo e reduz a bagunça de gordura no fogão e azulejos',
        'Timer inteligente com aviso sonoro e desligamento automático de segurança',
        'Consumo de energia baixo comparado ao forno convencional'
      ],
      cons: [
        'Nos primeiros usos é recomendado fazer o processo de cura do antiaderente conforme o manual',
        'Ocupa um espaço dedicado na bancada, sendo bom medir antes'
      ],
      verdict:
        'Um dos aparelhos que mais transformam a rotina na cozinha. Alimentos ficam prontos na metade do tempo do forno e a limpeza com esponja macia leva menos de dois minutos. Excelente aquisição com alto retorno diário.',
      overallScore: 9.5,
      stockRemaining: 6,
      testimonials: [
        {
          id: 't-a1',
          name: 'Ana Paula Ramos',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
          text: 'Minha vida mudou na cozinha! Frango, batata rústica e até bolinhos ficam perfeitos em 15 minutos. E não fica cheiro de gordura na casa.',
          origin: 'Compradora Verificada'
        },
        {
          id: 't-a2',
          name: 'Fabio Meireles',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          text: 'Comprei para economizar gás e a conta de luz nem sentiu diferença. Fácil demais de limpar, nada gruda no cesto. Nota 10!',
          origin: 'Comprador Verificado'
        },
        {
          id: 't-a3',
          name: 'Camila Fernandes',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          text: 'Chegou antes do prazo pela transportadora, tudo bem embalado sem nenhum arranhão. Super recomendo a loja oficial.',
          origin: 'Compradora Verificada'
        },
        {
          id: 't-a4',
          name: 'Marcio Vieira',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          text: 'Design lindo e acabamento de primeira linha. Já usei todos os dias dessa semana. Praticidade pura!',
          origin: 'Comprador Verificado'
        }
      ],
      faq: [
        {
          id: 'f-a1',
          question: 'Qual a voltagem do produto?',
          answer: 'Está disponível em 110V e 220V na página de finalização da compra na loja oficial.'
        },
        {
          id: 'f-a2',
          question: 'O antiaderente dura muito?',
          answer: 'Sim, utilizando espátulas de silicone e o lado macio da esponja, o revestimento dura anos sem descascar.'
        }
      ]
    };
  }

  // 6. GENÉRICO INTELIGENTE / QUALQUER OUTRO PRODUTO
  return {
    headline: defaultHeadline,
    description: `Análise completa e sincera sobre a durabilidade, usabilidade e custo-benefício do ${name}. Confira nosso teste real antes de fechar sua compra.`,
    slug: slug || 'analise-produto-sincero',
    seoTitle,
    seoDescription,
    suggestedSeoTitles: seoTitles,
    audience: [
      `Quem busca a melhor versão de ${name} com garantia e nota fiscal na loja oficial`,
      'Pessoas que priorizam durabilidade e materiais de qualidade comprovada',
      'Quem quer evitar produtos falsificados ou imitações baratas que quebram rápido',
      'Quem quer aproveitar o preço promocional de lançamento por tempo limitado'
    ],
    antiPersonaPhrase:
      `Se você não tem interesse em adquirir um ${name} durável e prefere arriscar com modelos genéricos sem garantia, esse review não é para você.`,
    pros: [
      'Excelente padrão de acabamento e durabilidade comprovada em uso real',
      'Alta eficiência e entrega rápida com código de rastreio direto da loja oficial',
      'Fácil manuseio com instruções claras em português',
      'Garantia do fabricante com suporte direto ao consumidor'
    ],
    cons: [
      'Devido ao alto volume de pedidos, o estoque promocional costuma oscilar',
      'Algumas opções de cores podem esgotar nas primeiras horas de campanha'
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
        text: `Esperava algo bom, mas me surpreendeu de verdade. Acabamento impecável e fácil de usar no dia a dia. Recomendo demais!`,
        origin: 'Compradora Verificada'
      },
      {
        id: 't-g3',
        name: 'Carlos Eduardo',
        rating: 5,
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        text: `Entrega muito rápida em 3 dias úteis. Veio bem lacrado com nota fiscal e garantia. Valeu cada centavo investido.`,
        origin: 'Comprador Verificado'
      },
      {
        id: 't-g4',
        name: 'Renata Oliveira',
        rating: 5,
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        text: `Estava com receio de comprar pela internet, mas a loja é super séria. Produto 100% original e atendimento nota dez!`,
        origin: 'Compradora Verificada'
      }
    ],
    faq: [
      {
        id: 'f-g1',
        question: 'O produto é original com garantia?',
        answer: 'Sim, comprado através do link oficial possui garantia do fabricante, nota fiscal e suporte completo.'
      },
      {
        id: 'f-g2',
        question: 'Qual o prazo médio de entrega?',
        answer: 'A entrega é realizada com rastreamento ativo com prazo estimado entre 3 a 7 dias úteis para a maior parte do Brasil.'
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
