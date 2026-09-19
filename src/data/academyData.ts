import { CourseModule, LessonItem, MemberAcademyData } from '../types';

export const INITIAL_MODULES: CourseModule[] = [
  {
    id: 'mod-1',
    title: 'Módulo 1: Boas-vindas & Visão Estratégica',
    description: 'A mentalidade de conversão e como estruturar reviews de alta performance.',
    order: 1,
    badge: 'COMECE AQUI'
  },
  {
    id: 'mod-2',
    title: 'Módulo 2: Mineração de Produtos & Palavras Lucrativas',
    description: 'Encontre tendências ocultas e termos com alto volume de intenção de compra.',
    order: 2,
    badge: 'MINERAÇÃO'
  },
  {
    id: 'mod-3',
    title: 'Módulo 3: Criação de Reviews com IA em Minutos',
    description: 'Técnicas de copywriting, prós e contras persuasivos e templates de conversão.',
    order: 3,
    badge: 'INTELIGÊNCIA ARTIFICIAL'
  },
  {
    id: 'mod-4',
    title: 'Módulo 4: Banners de Monetização & Comparador',
    description: 'Como monetizar o aplicativo gratuito e converter até 4x mais com banners em slide.',
    order: 4,
    badge: 'MONETIZAÇÃO'
  },
  {
    id: 'mod-5',
    title: 'Módulo 5: Exportação, Hospedagem Grátis & Tráfego',
    description: 'Publique seu site em 2 minutos em plataformas gratuitas com SSL e indexação.',
    order: 5,
    badge: 'TRÁFEGO & VENDAS'
  }
];

export const INITIAL_LESSONS: LessonItem[] = [
  {
    id: 'les-1',
    moduleId: 'mod-1',
    title: '01. Boas-vindas à Academia & Visão Geral da Plataforma',
    duration: '07:45',
    youtubeUrlOrId: 'L_LUpnjgPso',
    youtubeId: 'L_LUpnjgPso',
    description: 'Conheça toda a estrutura da nossa plataforma, como navegar entre as ferramentas e o passo a passo para criar seus primeiros reviews lucrativos.',
    keyTakeaways: [
      'Apresentação de todos os módulos e ferramentas do sistema',
      'Como funciona a esteira de criação de reviews de alta conversão',
      'Configurações essenciais para garantir que seus links de afiliado estejam ativos'
    ],
    materials: [
      {
        id: 'mat-1',
        title: 'Checklist Oficial de Lançamento de Review (PDF)',
        type: 'pdf',
        url: '#'
      },
      {
        id: 'mat-2',
        title: 'Mapa Mental: Funil de Review Sincero',
        type: 'link',
        url: '#'
      }
    ],
    promptTemplate: 'Aja como um especialista em copywriting e avalie os pontos fortes e fracos do produto.',
    order: 1
  },
  {
    id: 'les-2',
    moduleId: 'mod-1',
    title: '02. A Psicologia do "Review Sincero" vs Página de Vendas Tradicional',
    duration: '11:20',
    youtubeUrlOrId: 'kJQP7kiw5Fk',
    youtubeId: 'kJQP7kiw5Fk',
    description: 'Descubra por que compradores pesquisam "Produto X vale a pena?" no Google e no YouTube antes de comprar e como quebrar as 5 principais objeções de compra.',
    keyTakeaways: [
      'O motivo pelo qual o consumidor desconfia de páginas oficiais de venda',
      'A importância de apontar pontos negativos reais e construtivos',
      'Como o veredito sincero multiplica a taxa de clique no botão de afiliado'
    ],
    materials: [
      {
        id: 'mat-3',
        title: 'Guia de Gatilhos Mentais de Honestidade & Transparência',
        type: 'pdf',
        url: '#'
      }
    ],
    order: 2
  },
  {
    id: 'les-3',
    moduleId: 'mod-2',
    title: '03. Como Minerar Produtos Campeões no Radar de Tendências',
    duration: '14:35',
    youtubeUrlOrId: 'fJ9rUzIMcZQ',
    youtubeId: 'fJ9rUzIMcZQ',
    description: 'Aprenda a identificar produtos que estão disparando em buscas no Mercado Livre, Shopee e Amazon em tempo real antes de todo o mercado.',
    keyTakeaways: [
      'Como interpretar a curva de crescimento de buscas em 24h e 48h',
      'Critérios para escolher produtos com ticket médio atrativo e boa margem',
      'Uso do botão "Criar Review" direto da tela de tendências'
    ],
    materials: [
      {
        id: 'mat-4',
        title: 'Planilha de Mineração de Produtos em Alta',
        type: 'download',
        url: '#'
      }
    ],
    order: 1
  },
  {
    id: 'les-4',
    moduleId: 'mod-2',
    title: '04. Encontrando Palavras-Chave Lucrativas com o Planejador Google Ads',
    duration: '16:50',
    youtubeUrlOrId: '9bZkp7q19f0',
    youtubeId: '9bZkp7q19f0',
    description: 'Como usar a ferramenta integrada de palavras-chave para descobrir o volume exato de pesquisas mensais, concorrência e custo por clique.',
    keyTakeaways: [
      'Diferença entre palavras de topo, meio e fundo de funil de compra',
      'Como encontrar termos de baixa concorrência e alto volume',
      'Estratégia de títulos para ranquear na 1ª página do Google'
    ],
    order: 2
  },
  {
    id: 'les-5',
    moduleId: 'mod-3',
    title: '05. Criando Reviews Completos com o Gerador de Inteligência Artificial',
    duration: '18:15',
    youtubeUrlOrId: 'JGwWNGJdvx8',
    youtubeId: 'JGwWNGJdvx8',
    description: 'Passo a passo prático de geração: headline magnética, tabela de critérios de nota, radar de notas, anti-persona e perguntas frequentes.',
    keyTakeaways: [
      'Como preencher os dados do produto para extrair o melhor texto da IA',
      'Ajustando notas dos critérios e veredito final personalizado',
      'Inserção de fotos reais, depoimentos e elementos visuais de autoridade'
    ],
    promptTemplate: 'Crie uma análise sincera e aprofundada com prós, contras, notas de 0 a 10 e para quem este produto NÃO é recomendado.',
    order: 1
  },
  {
    id: 'les-6',
    moduleId: 'mod-3',
    title: '06. Comparador de Produtos: Batalha de Modelos para Multiplicar Vendas',
    duration: '12:40',
    youtubeUrlOrId: '2Vv-BfVoq4g',
    youtubeId: '2Vv-BfVoq4g',
    description: 'Como utilizar o comparador lado a lado para responder a principal dúvida do cliente: "Qual o melhor entre o Modelo A e o Modelo B?".',
    keyTakeaways: [
      'Ganhador da categoria e tabela comparativa item por item',
      'Inserção de múltiplos links de afiliado na mesma página',
      'Aumentando o valor percebido e a conversão global'
    ],
    order: 2
  },
  {
    id: 'les-7',
    moduleId: 'mod-4',
    title: '07. Configurando Banners em Slides para Monetizar o App Gratuito',
    duration: '13:10',
    youtubeUrlOrId: 'M7lc1UVf-VE',
    youtubeId: 'M7lc1UVf-VE',
    description: 'Como usar a ferramenta de Banners em Slides para promover seus produtos físicos, infoprodutos ou links de afiliado direto no dashboard do app.',
    keyTakeaways: [
      'Dimensões exatas: 1200x300 desktop e 600x300 mobile',
      'Copywriting persuasivo para banners com alta taxa de clique (CTR)',
      'Definição de tempos de rotação e prioridade de ofertas'
    ],
    order: 1
  },
  {
    id: 'les-8',
    moduleId: 'mod-5',
    title: '08. Exportando o HTML e Hospedando 100% Grátis na Vercel e Netlify',
    duration: '15:25',
    youtubeUrlOrId: 'kffacxfA7G4',
    youtubeId: 'kffacxfA7G4',
    description: 'Como baixar o arquivo HTML do seu review e colocar seu site no ar com SSL gratuito e carregamento instantâneo em menos de 2 minutos.',
    keyTakeaways: [
      'Exportação limpa e sem dependências externas pesadas',
      'Como subir no Vercel e Netlify por simples arrastar e soltar',
      'Configuração de domínio próprio .com.br ou .com gratuito'
    ],
    order: 1
  }
];

const STORAGE_KEY = 'review_sincero_members_academy_v2';

export function getStoredAcademyData(): MemberAcademyData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.modules) && Array.isArray(parsed.lessons)) {
        return {
          modules: parsed.modules,
          lessons: parsed.lessons,
          completedLessonIds: Array.isArray(parsed.completedLessonIds) ? parsed.completedLessonIds : [],
          userNotesByLesson: parsed.userNotesByLesson || {},
          activeLessonId: parsed.activeLessonId || parsed.lessons[0]?.id
        };
      }
    }
  } catch (e) {
    console.warn('[AcademyData] Falha ao carregar do localStorage:', e);
  }

  return {
    modules: INITIAL_MODULES,
    lessons: INITIAL_LESSONS,
    completedLessonIds: ['les-1'],
    userNotesByLesson: {
      'les-1': 'Anotação inicial: Usar o radar de tendências sempre às terças e quintas.'
    },
    activeLessonId: INITIAL_LESSONS[0]?.id
  };
}

export function saveStoredAcademyData(data: MemberAcademyData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('[AcademyData] Falha ao salvar no localStorage:', e);
  }
}

export function resetStoredAcademyData(): MemberAcademyData {
  const initialData: MemberAcademyData = {
    modules: INITIAL_MODULES,
    lessons: INITIAL_LESSONS,
    completedLessonIds: ['les-1'],
    userNotesByLesson: {},
    activeLessonId: INITIAL_LESSONS[0]?.id
  };
  saveStoredAcademyData(initialData);
  return initialData;
}
