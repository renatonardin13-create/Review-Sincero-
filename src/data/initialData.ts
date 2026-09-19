import { CategoryType, PlatformType, Review, AppSettings, TrendItem } from '../types';

export const CATEGORIES: CategoryType[] = [
  'Tech',
  'Casa e cozinha',
  'Esporte',
  'Beleza e skincare',
  'Infantil e família',
  'Moda',
  'Suplementos e saúde',
  'Emagrecimento',
  'Cabelos e unhas',
  'Bem-estar e qualidade de vida',
  'Fitness e performance',
  'Masculino',
  'Outros'
];

export const PLATFORMS: PlatformType[] = [
  'Logzz',
  'Monetizze',
  'Hotmart',
  'Eduzz',
  'Mercado Livre',
  'Shopee',
  'Amazon',
  'Outra plataforma'
];

export const DEFAULT_SETTINGS: AppSettings = {
  siteName: 'Guia Sincero Tech',
  logoUrl: '',
  authorName: 'Carlos Mendonça',
  defaultTemplate: 'premium',
  socialLinks: {
    instagram: '@guiasincerotech',
    youtube: 'Guia Sincero',
    telegram: 't.me/guiasincero'
  },
  contactEmail: 'contato@guiasincero.com.br',
  exportWithSeoTags: true
};

export const SAMPLE_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    siteName: 'Guia Sincero Tech',
    author: 'Carlos Mendonça',
    productName: 'Fone Bluetooth Pro Wireless ANC X9',
    currentPrice: 'R$ 189,90',
    oldPrice: 'R$ 299,90',
    affiliateUrl: 'https://exemplo.com/produto-afiliado-x9',
    category: 'Tech',
    platform: 'Shopee',
    description: 'Fone de ouvido sem fio com cancelamento ativo de ruído (ANC), modo transparência e bateria de até 30 horas com o estojo.',
    features: [
      'Cancelamento Ativo de Ruído (ANC)',
      'Bluetooth 5.3 de baixa latência',
      'Proteção contra respingos IPX4',
      'Controles touch integrados'
    ],
    mainImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ],
    pros: [
      'Excelente relação custo-benefício na faixa abaixo de R$ 200',
      'ANC surpreendentemente eficiente para abafar barulhos de escritório e trânsito',
      'Encaixe confortável em sessões longas de uso'
    ],
    cons: [
      'Graves ligeiramente exagerados nas configurações padrão (necessita ajuste no equalizador)',
      'Estojo de carregamento marca impressões digitais facilmente na versão preta',
      'Microfone capta um pouco de ruído em ambientes externos muito ventosos'
    ],
    audience: [
      'Estudantes e profissionais que trabalham em ambientes barulhentos',
      'Usuários que buscam bateria duradoura para o dia todo',
      'Quem quer som sem fio de qualidade sem gastar o preço de marcas premium'
    ],
    experience: 'Testado durante 14 dias em rotina de escritório, academia e transporte público. O emparelhamento é instantâneo e a autonomia de bateria realmente cumpre as 6h contínuas prometidas.',
    howItWorks: 'Basta abrir o estojo próximo ao smartphone para o parelhamento automático via Bluetooth 5.3. Os comandos de toque na haste controlam músicas e chamadas.',
    faq: [
      {
        id: 'f1',
        question: 'O fone funciona em celulares Android e iPhone?',
        answer: 'Sim, o X9 é compatível com qualquer dispositivo com Bluetooth (Android, iOS, Windows, Mac).'
      },
      {
        id: 'f2',
        question: 'O cancelamento de ruído é real?',
        answer: 'Sim, ele reduz consideravelmente ruídos constantes como motores de ônibus e ar-condicionado.'
      }
    ],
    scoreCriteria: {
      quality: 8.5,
      design: 9.0,
      practicality: 9.0,
      resources: 8.0,
      costBenefit: 9.5,
      experience: 8.8
    },
    overallScore: 8.8,
    verdict: 'Uma das melhores opções de entrada no mercado atual para quem quer som limpo e cancelamento de ruído real sem pagar caro.',
    testimonials: [
      {
        id: 't1',
        name: 'Marcos Vinicius',
        text: 'Comprei seguindo o review e me surpreendi com a qualidade do ANC pelo preço cobrado.',
        rating: 5,
        origin: 'Compra verificada'
      }
    ],
    template: 'premium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'Publicado'
  }
];

export const SAMPLE_TRENDS: TrendItem[] = [
  {
    id: 'tr-meli-1',
    rank: 1,
    title: 'Fone Bluetooth Dapon H02D',
    searchTerm: 'fone bluetooth dapon review',
    searchQueryDisplay: 'fone bluetooth dapon review',
    category: 'Tech',
    badges: [
      { label: '🔥 Quente', type: 'hot' },
      { label: '⭐ Alto ticket', type: 'ticket' }
    ],
    subtitleMetrics: '49k avaliações • buscas crescendo',
    indicator: '+240% buscas',
    suggestedPrice: 'R$ 189,90',
    suggestedDescription: 'Fone sem fio com redução inteligente de ruído, conexão Bluetooth 5.3 estável e estojo com display digital.'
  },
  {
    id: 'tr-meli-2',
    rank: 2,
    title: 'Xiaomi Redmi Buds 5',
    searchTerm: 'redmi buds 5 mercado livre review',
    searchQueryDisplay: 'redmi buds 5 mercado livre review',
    category: 'Tech',
    badges: [
      { label: '🔥 Quente', type: 'hot' },
      { label: '💡 Oportunidade', type: 'opportunity' }
    ],
    subtitleMetrics: 'Lançamento recente • poucos reviews',
    indicator: '+210% buscas',
    suggestedPrice: 'R$ 219,00',
    suggestedDescription: 'Fone intra-auricular com cancelamento ativo de ruído de até 46dB e autonomia de até 40 horas com estojo.'
  },
  {
    id: 'tr-meli-3',
    rank: 3,
    title: 'Smartwatch Amazfit Bip 5',
    searchTerm: 'amazfit bip 5 vale a pena',
    searchQueryDisplay: 'amazfit bip 5 vale a pena',
    category: 'Tech',
    badges: [
      { label: '📈 Subindo', type: 'rising' }
    ],
    subtitleMetrics: 'GPS integrado • público fiel',
    indicator: '+185% buscas',
    suggestedPrice: 'R$ 459,00',
    suggestedDescription: 'Relógio inteligente com tela ultragrande de 1.91", chamadas bluetooth, GPS com 4 sistemas de satélite e 120+ esportes.'
  },
  {
    id: 'tr-meli-4',
    rank: 4,
    title: 'Carregador Baseus GaN 65W',
    searchTerm: 'carregador baseus 65w vale a pena',
    searchQueryDisplay: 'carregador baseus 65w vale a pena',
    category: 'Tech',
    badges: [
      { label: '🔥 Quente', type: 'hot' },
      { label: '⚡ Alta Demanda', type: 'demand' }
    ],
    subtitleMetrics: 'Compatível notebook e celular • alta margem',
    indicator: '+165% buscas',
    suggestedPrice: 'R$ 149,90',
    suggestedDescription: 'Carregador rápido triplo GaN5 Pro com 2 portas USB-C e 1 USB-A, carregando notebooks e smartphones simultaneamente.'
  },
  {
    id: 'tr-meli-5',
    rank: 5,
    title: 'Notebook Gamer Acer Nitro 5 RTX 3050',
    searchTerm: 'notebook gamer nitro 5 rtx 3050',
    searchQueryDisplay: 'acer nitro 5 rtx 3050 vale a pena',
    category: 'Tech',
    badges: [
      { label: '⭐ Alto ticket', type: 'ticket' },
      { label: '📈 Subindo', type: 'rising' }
    ],
    subtitleMetrics: '35k buscas mensais • alta comissão',
    indicator: '+145% buscas',
    suggestedPrice: 'R$ 4.399,00',
    suggestedDescription: 'Notebook gamer com tela 144Hz Full HD IPS, processador Core i5 12th gen e GPU dedicada RTX 3050 4GB.'
  },
  {
    id: 'tr-meli-casa-1',
    rank: 1,
    title: 'Fritadeira Elétrica Sem Óleo Air Fryer 5L Mondial Inox',
    searchTerm: 'air fryer mondial 5l inox',
    searchQueryDisplay: 'air fryer mondial 5 litros vale a pena',
    category: 'Casa e cozinha',
    badges: [
      { label: '🔥 Quente', type: 'hot' },
      { label: '⚡ Alta Demanda', type: 'demand' }
    ],
    subtitleMetrics: '120k buscas mensais • produto campeão',
    indicator: '+280% buscas',
    suggestedPrice: 'R$ 389,90',
    suggestedDescription: 'Fritadeira com cesto quadrado antiaderente Duraflon, timer de 60 min e controle de temperatura até 200°C.'
  },
  {
    id: 'tr-meli-casa-2',
    rank: 2,
    title: 'Robô Aspirador de Pó Inteligente WAP Robot W300',
    searchTerm: 'robo aspirador wap w300',
    searchQueryDisplay: 'robo aspirador wap w300 review sincero',
    category: 'Casa e cozinha',
    badges: [
      { label: '⭐ Alto ticket', type: 'ticket' },
      { label: '💡 Oportunidade', type: 'opportunity' }
    ],
    subtitleMetrics: '28k avaliações • busca constante',
    indicator: '+195% buscas',
    suggestedPrice: 'R$ 849,90',
    suggestedDescription: 'Aspirador robô com controle remoto, sensores antiqueda e autorrecarga na base inteligente.'
  },
  {
    id: 'tr-meli-esporte-1',
    rank: 1,
    title: 'Tênis Olympikus Corre 3 Running Profissional',
    searchTerm: 'olympikus corre 3 corrida',
    searchQueryDisplay: 'olympikus corre 3 vale a pena corrida',
    category: 'Esporte',
    badges: [
      { label: '🔥 Quente', type: 'hot' },
      { label: '📈 Subindo', type: 'rising' }
    ],
    subtitleMetrics: 'O mais vendido da categoria de corrida nacional',
    indicator: '+320% buscas',
    suggestedPrice: 'R$ 399,90',
    suggestedDescription: 'Tênis de corrida super leve com tecnologia Oxitec respirável e entressola com amortecimento Eleva Pro.'
  },
  {
    id: 'tr-meli-beleza-1',
    rank: 1,
    title: 'Secador de Cabelo Taiff Tourmaline Íon 2000W',
    searchTerm: 'secador taiff tourmaline 2000w',
    searchQueryDisplay: 'secador taiff tourmaline ion 2000w review',
    category: 'Beleza e skincare',
    badges: [
      { label: '🔥 Quente', type: 'hot' },
      { label: '⚡ Alta Demanda', type: 'demand' }
    ],
    subtitleMetrics: '80k compras confirmadas • alta avaliação',
    indicator: '+210% buscas',
    suggestedPrice: 'R$ 229,90',
    suggestedDescription: 'Secador profissional com tecnologia de turmalina e íons negativos para controle de frizz e brilho imediato.'
  },
  {
    id: 'tr-meli-kids-1',
    rank: 1,
    title: 'Câmera Digital Infantil Filmadora HD com Jogos',
    searchTerm: 'camera fotografica infantil digital',
    searchQueryDisplay: 'camera infantil digital grava video vale a pena',
    category: 'Infantil e família',
    badges: [
      { label: '💡 Oportunidade', type: 'opportunity' },
      { label: '📈 Subindo', type: 'rising' }
    ],
    subtitleMetrics: 'Tendência viral em redes sociais',
    indicator: '+175% buscas',
    suggestedPrice: 'R$ 89,90',
    suggestedDescription: 'Câmera infantil compacta com capa de silicone antichoque, filtros divertidos e bateria recarregável.'
  },
  {
    id: 'tr-meli-moda-1',
    rank: 1,
    title: 'Kit 5 Camisetas Básicas Masculinas Algodão Pima',
    searchTerm: 'kit camiseta basica algodao pima',
    searchQueryDisplay: 'camisa algodao pima custo beneficio mercado livre',
    category: 'Moda',
    badges: [
      { label: '🔥 Quente', type: 'hot' },
      { label: '⭐ Alto ticket', type: 'ticket' }
    ],
    subtitleMetrics: '45k avaliações 5 estrelas',
    indicator: '+160% buscas',
    suggestedPrice: 'R$ 159,90',
    suggestedDescription: 'Camisetas lisas de toque macio premium, costura reforçada ombro a ombro que não desbota na lavagem.'
  }
];
