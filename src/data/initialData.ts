import { CategoryType, PlatformType, Review, AppSettings, TrendItem, PromoBannerSlide } from '../types';

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

export const DEFAULT_PROMO_BANNERS: PromoBannerSlide[] = [
  {
    id: 'banner-01',
    title: 'Comunidade VIP de Afiliados Pro',
    description: 'Aprenda as melhores estratégias para vender todos os dias no Mercado Livre, Shopee e Produtos Físicos com comissões de até 70%.',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    desktopImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    mobileImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
    affiliateUrl: 'https://exemplo.com/afiliados-pro',
    ctaText: 'Quero Acessar Agora',
    badgeText: '🔥 OFERTA EXCLUSIVA',
    badgeColor: 'gold',
    active: true,
    targetBlank: true
  },
  {
    id: 'banner-02',
    title: 'Kit Suplementos Performance & Foco',
    description: 'Creatina Creapure + Whey Isolado com cupom exclusivo de 35% OFF e frete grátis para todo o Brasil.',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    desktopImageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    mobileImageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    affiliateUrl: 'https://exemplo.com/suplementos-oferta',
    ctaText: 'Pegar Cupom 35% OFF',
    badgeText: '⚡ 35% DE DESCONTO',
    badgeColor: 'red',
    active: true,
    targetBlank: true
  },
  {
    id: 'banner-03',
    title: 'Smartwatch Pro Ultra Séries 9',
    description: 'Monitor cardíaco, GPS integrado, bateria de 7 dias e compatível com Android e iOS por menos de R$ 150 na Shopee.',
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80',
    desktopImageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80',
    mobileImageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
    affiliateUrl: 'https://exemplo.com/smartwatch-shopee',
    ctaText: 'Ver Produto na Shopee',
    badgeText: '⭐ MAIS VENDIDO',
    badgeColor: 'blue',
    active: true,
    targetBlank: true
  }
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
  exportWithSeoTags: true,
  promoBanners: DEFAULT_PROMO_BANNERS,
  bannerAutoplaySpeed: 6,
  enableBannerCarousel: true,
  enableQuickLoginShortcuts: true
};

export const SAMPLE_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    siteName: 'Guia Sincero Tech',
    author: 'Carlos Mendonça',
    productName: 'Fone Bluetooth Pro Wireless ANC X9',
    currentPrice: '189,90',
    oldPrice: '299,90',
    affiliateUrl: 'https://exemplo.com/produto-afiliado-x9',
    category: 'Tech',
    platform: 'Shopee',
    description: 'Fone de ouvido sem fio intra-auricular com cancelamento ativo de ruído (ANC), modo transparência, drivers de 10mm e bateria de até 30 horas com o estojo.',
    features: [
      'Cancelamento Ativo de Ruído (ANC de até 35dB)',
      'Bluetooth 5.3 com baixa latência para vídeos e jogos',
      'Proteção contra respingos de suor e chuva IPX4',
      'Controles touch responsivos com microfones duplos'
    ],
    mainImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=900&q=80'
    ],
    quickVerdict: {
      summary: 'Excelente fone TWS com isolamento acústico eficiente, conexão estável e graves encorpados por menos de R$ 200.',
      strengths: [
        'ANC realmente funcional para abafar ruídos de escritório e transporte',
        'Autonomia real de 6h contínuas + 24h na case',
        'Encaixe firme e ergonômico no canal auditivo'
      ],
      weaknesses: [
        'Graves um pouco elevados na equalização de fábrica',
        'Estojo fosco pode marcar marcas de dedos com o tempo'
      ],
      idealFor: [
        'Quem estuda ou trabalha em ambientes movimentados',
        'Praticantes de caminhada e academia que querem som sem fios'
      ],
      notIdealFor: [
        'Audiófilos que buscam equalização estritamente flat para estúdio'
      ]
    },
    comparisonProducts: [
      { id: 'c1', name: 'Fone X9 Pro ANC (Avaliado)', price: 'R$ 189,90', score: 8.8, batteryOrPower: '30h total', mainDiff: 'Melhor custo-benefício com ANC', highlight: 'Nosso Veredito' },
      { id: 'c2', name: 'Redmi Buds 5', price: 'R$ 219,00', score: 8.9, batteryOrPower: '40h total', mainDiff: 'ANC de 46dB com app dedicado', highlight: 'Mais potente' },
      { id: 'c3', name: 'QCY T13 ANC', price: 'R$ 149,00', score: 8.3, batteryOrPower: '28h total', mainDiff: 'Opção mais econômica', highlight: 'Mais barato' }
    ],
    pros: [
      'Excelente relação custo-benefício na faixa abaixo de R$ 200',
      'ANC surpreendentemente eficiente para abafar barulhos de escritório e trânsito',
      'Encaixe confortável em sessões longas de uso sem fadiga'
    ],
    cons: [
      'Graves ligeiramente exagerados nas configurações padrão (ajustável no equalizador)',
      'Estojo de carregamento marca impressões digitais na versão preta',
      'Microfone capta ruído secundário em ambientes com vento muito forte'
    ],
    audience: [
      'Estudantes e profissionais que trabalham em ambientes barulhentos',
      'Usuários que buscam bateria duradoura para o dia todo',
      'Quem quer som sem fio de qualidade sem gastar o preço de marcas premium'
    ],
    antiPersonaPhrase: 'Não indicado para audiófilos que exigem resposta de frequência plana para produção musical em estúdio.',
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
        answer: 'Sim, o microfone interno capta o ruído ambiente e inverte a fase sonora para atenuar sons contínuos de ar condicionado e trânsito.'
      }
    ],
    scoreCriteria: {
      quality: 8.7,
      design: 9.0,
      practicality: 9.2,
      resources: 8.4,
      costBenefit: 9.5,
      experience: 8.8
    },
    overallScore: 8.9,
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
  },
  {
    id: 'rev-002',
    siteName: 'Guia Sincero Casa',
    author: 'Carlos Mendonça',
    productName: 'Fritadeira Elétrica Sem Óleo Air Fryer 5L Digital Painel Touch',
    currentPrice: '349,90',
    oldPrice: '499,90',
    affiliateUrl: 'https://exemplo.com/produto-airfryer-5l',
    category: 'Casa e cozinha',
    platform: 'Mercado Livre',
    description: 'Fritadeira sem óleo de 5 litros com cesto antiaderente quadrado, painel digital touch com 8 funções pré-programadas e 1500W de potência.',
    features: [
      'Cesto quadrado com capacidade real de 5 litros',
      'Painel digital touch intuitivo com 8 receitas rápidas',
      'Revestimento antiaderente premium de fácil limpeza',
      'Timer sonoro de 60 minutos com desligamento automático'
    ],
    mainImage: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80'
    ],
    quickVerdict: {
      summary: 'Excelente air fryer para famílias de 3 a 5 pessoas. Cesto quadrado aproveita muito mais o espaço e assa uniformemente.',
      strengths: [
        'Cesto quadrado acomoda alimentos inteiros sem amontoar',
        'Painel digital moderno e muito fácil de operar',
        'Antiaderente eficiente, não gruda resíduos'
      ],
      weaknesses: [
        'Aparelho volumoso, requer espaço na bancada',
        'Cabo de energia um pouco curto (1 metro)'
      ],
      idealFor: [
        'Famílias que buscam refeições rápidas e crocantes sem gordura',
        'Quem quer praticidade para assar, grelhar e gratinar no dia a dia'
      ],
      notIdealFor: [
        'Cozinhas muito compactas sem espaço livre na bancada'
      ]
    },
    comparisonProducts: [
      { id: 'c1', name: 'Air Fryer 5L Digital (Analisada)', price: 'R$ 349,90', score: 9.1, batteryOrPower: '1500W', mainDiff: 'Cesto quadrado + Painel touch', highlight: 'Recomendação' },
      { id: 'c2', name: 'Mondial 4L Tradicional', price: 'R$ 299,00', score: 8.5, batteryOrPower: '1500W', mainDiff: 'Botões analógicos mecânicos', highlight: 'Mais simples' },
      { id: 'c3', name: 'Philips Walita 5L', price: 'R$ 649,00', score: 9.4, batteryOrPower: '2000W', mainDiff: 'Tecnologia Twin Turbo Star', highlight: 'Mais cara' }
    ],
    pros: [
      'Cesto quadrado de 5L comporta até frangos inteiros ou 1kg de batatas',
      'Aquecimento rápido e uniforme em menos de 3 minutos',
      'Fácil higienização pois o cesto pode ir à lava-louças'
    ],
    cons: [
      'Consumo em 200°C exige tomada de 20A',
      'Estrutura externa esquenta suavemente nas laterais'
    ],
    audience: [
      'Casais e famílias que cozinham diariamente',
      'Pessoas que buscam reduzir óleo e gordura nas refeições',
      'Quem valoriza rapidez e facilidade de limpeza'
    ],
    antiPersonaPhrase: 'Não recomendada para quem mora sozinho em kitnet sem tomada de 20A ou espaço de bancada.',
    experience: 'Testamos com batata frita rústica, frango à passarinho, pão de queijo e legumes grelhados. A textura ficou crocante por fora e macia por dentro.',
    howItWorks: 'O ar quente circula em alta velocidade pelo cesto em 360°, selando os alimentos e garantindo crocância uniforme.',
    faq: [
      {
        id: 'f1',
        question: 'Precisa colocar óleo nos alimentos?',
        answer: 'Não é obrigatório, mas um leve fio de azeite em legumes e batatas ajuda na crocância dourada.'
      },
      {
        id: 'f2',
        question: 'O antiaderente descasca?',
        answer: 'Utilizando apenas o lado macio da esponja e espátulas de silicone, o revestimento dura anos intacto.'
      }
    ],
    scoreCriteria: {
      quality: 9.2,
      design: 9.3,
      practicality: 9.4,
      resources: 8.8,
      costBenefit: 9.3,
      experience: 9.0
    },
    overallScore: 9.1,
    verdict: 'Uma das melhores compras para casa em 2026. Entrega capacidade real e ótimo acabamento por um preço justo.',
    testimonials: [
      {
        id: 't1',
        name: 'Juliana Costa',
        text: 'Melhor compra que fiz pro meu apartamento. O cesto quadrado cabe muito mais comida que os redondos.',
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
    title: 'Fone Bluetooth Dapon H02D TWS',
    searchTerm: 'fone bluetooth dapon review',
    searchQueryDisplay: 'fone bluetooth dapon review',
    category: 'Tech',
    thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
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
    thumbnail: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
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
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
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
    title: 'Carregador Baseus GaN 65W Turbo',
    searchTerm: 'carregador baseus 65w vale a pena',
    searchQueryDisplay: 'carregador baseus 65w vale a pena',
    category: 'Tech',
    thumbnail: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
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
    thumbnail: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
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
    thumbnail: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=600&q=80',
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
    thumbnail: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=600&q=80',
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
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
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
    thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
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
    thumbnail: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80',
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
    thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
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
