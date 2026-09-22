import React, { useState, useEffect } from 'react';
import {
  Review,
  AppSettings,
  CategoryType,
  PlatformType,
  TemplateType,
  FAQItem,
  TestimonialItem,
  KeywordSuggestion
} from '../types';
import { getStoredUser, isUserAdmin, checkUserReviewLimit } from '../services/authService';
import { CATEGORIES, PLATFORMS } from '../data/initialData';
import { ReviewRenderer } from './ReviewRenderer';
import { QuizGeneratorModule } from './QuizGeneratorModule';
import { matchProductImage, validateAndNormalizeReviewImages } from '../utils/productImageMatcher';
import { generateStandaloneReviewHtml } from '../utils/exportHtmlUtils';
import {
  generateFullProductCopy,
  slugify,
  generateSingleTestimonialText,
  generateSeoTitles,
  generateSeoDescription,
  generateHeadlineByFormula,
  HEADLINE_FORMULAS,
  HeadlineFormulaType
} from '../utils/productCopyEngine';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Upload,
  Check,
  Plus,
  Trash2,
  Copy,
  Download,
  Code,
  Save,
  Eye,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Flame,
  ShoppingBag,
  Zap,
  Globe,
  Sliders,
  Laptop,
  Smartphone,
  Tablet,
  CheckCircle,
  HelpCircle,
  Star,
  Search,
  Timer,
  AlertCircle,
  MessageCircle,
  Share2,
  TrendingUp,
  RefreshCw,
  X,
  Package,
  Clock,
  Flame as FireIcon,
  Tag,
  Image as ImageIcon,
  Users,
  AlertTriangle,
  XCircle,
  Award,
  FileText
} from 'lucide-react';

const POPULAR_NICHES = [
  {
    name: 'Fone de Ouvido Bluetooth TWS Sem Fio Bateria de Longa Duração',
    label: 'Fone Bluetooth',
    icon: '🎧',
    oldPrice: '119.90',
    currentPrice: '59.90',
    category: 'Tech',
    platform: 'Mercado Livre',
    affiliateUrl: 'https://www.mercadolivre.com.br/',
    mainImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    headline: 'Review Sincero: Fone de Ouvido Bluetooth TWS Sem Fio Bateria de Longa Duração Vale a Pena?',
    ctaText: 'QUERO O MEU POR R$ 59.90 →',
    slug: 'fone-de-ouvido-bluetooth-tws-sem-fio-bateria-de-longa-duracao',
    siteName: 'ReviewFísico',
    author: '',
    seoTitle: 'Fone de Ouvido Bluetooth TWS Sem Fio Bateria de Longa Duração - Review Sincero e Vale a Pena? (Análise 2026)',
    seoDescription: 'Descubra se Fone de Ouvido Bluetooth TWS Sem Fio Bateria de Longa Duração é bom, vale a pena e confira prós, contras, veredito e onde comprar com o melhor preço e garantia.',
    keywords: [
      { id: 'k1', term: 'funciona mesmo', searches: '34.200 buscas/mês', cpc: 'CPC R$ 1,75', difficulty: 'Alta' as const, selected: true },
      { id: 'k2', term: 'vale a pena análise', searches: '21.500 buscas/mês', cpc: 'CPC R$ 2,50', difficulty: 'Média' as const, selected: true },
      { id: 'k3', term: 'onde comprar original com desconto', searches: '15.880 buscas/mês', cpc: 'CPC R$ 3,10', difficulty: 'Alta' as const, selected: true },
      { id: 'k4', term: 'resenha e resultados', searches: '9.500 buscas/mês', cpc: 'CPC R$ 1,30', difficulty: 'Baixa' as const, selected: false }
    ]
  },
  {
    name: 'Fritadeira Sem Óleo Air Fryer Digital 5L Painel Touch',
    label: 'Air Fryer',
    icon: '🌪️',
    oldPrice: '489.90',
    currentPrice: '329.00',
    category: 'Casa e cozinha',
    platform: 'Mercado Livre',
    affiliateUrl: 'https://www.mercadolivre.com.br/',
    mainImage: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=800&q=80',
    headline: 'Review Sincero: Air Fryer Digital 5L é boa mesmo ou só propaganda?',
    ctaText: 'GARANTIR COM DESCONTO POR R$ 329.00 →',
    slug: 'air-fryer-digital-5l-painel-touch',
    siteName: 'ReviewFísico',
    author: 'Carlos Mendonça',
    seoTitle: 'Air Fryer Digital 5L Painel Touch - Vale a Pena Comprar? Análise Sincera 2026',
    seoDescription: 'Confira nossa avaliação prática da Air Fryer Digital 5L: capacidade real, economia de energia, facilidade de limpeza e onde comprar o modelo original.',
    keywords: [
      { id: 'k1', term: 'air fryer 5l é boa', searches: '28.400 buscas/mês', cpc: 'CPC R$ 1,90', difficulty: 'Alta' as const, selected: true },
      { id: 'k2', term: 'como limpar air fryer', searches: '18.100 buscas/mês', cpc: 'CPC R$ 0,95', difficulty: 'Baixa' as const, selected: true },
      { id: 'k3', term: 'menor preço air fryer digital', searches: '12.300 buscas/mês', cpc: 'CPC R$ 2,20', difficulty: 'Média' as const, selected: true }
    ]
  },
  {
    name: 'Robô Aspirador de Pó Inteligente com Mop e Sensor Anti-Queda',
    label: 'Robô Aspirador',
    icon: '🤖',
    oldPrice: '799.00',
    currentPrice: '449.90',
    category: 'Casa e cozinha',
    platform: 'Shopee',
    affiliateUrl: 'https://shopee.com.br/',
    mainImage: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=800&q=80',
    headline: 'Review Sincero: Robô Aspirador Inteligente com Mop Funciona Mesmo?',
    ctaText: 'QUERO O MEU POR R$ 449.90 →',
    slug: 'robo-aspirador-inteligente-mop-sensor',
    siteName: 'ReviewFísico',
    author: '',
    seoTitle: 'Robô Aspirador de Pó com Mop - Vale a Pena? Resenha Completa e Teste',
    seoDescription: 'Testamos na prática o Robô Aspirador Inteligente: potência de sucção, autonomia da bateria e se realmente limpa pelos de pets e poeira.',
    keywords: [
      { id: 'k1', term: 'robo aspirador limpa bem', searches: '22.000 buscas/mês', cpc: 'CPC R$ 2,10', difficulty: 'Alta' as const, selected: true },
      { id: 'k2', term: 'robo aspirador vale a pena', searches: '19.400 buscas/mês', cpc: 'CPC R$ 1,80', difficulty: 'Média' as const, selected: true }
    ]
  },
  {
    name: 'Smartwatch Relógio Inteligente com Monitor Cardíaco e Notificações',
    label: 'Smartwatch',
    icon: '⌚',
    oldPrice: '199.90',
    currentPrice: '89.90',
    category: 'Tech',
    platform: 'Shopee',
    affiliateUrl: 'https://shopee.com.br/',
    mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    headline: 'Review Sincero: Smartwatch Relógio Inteligente Vale a Pena?',
    ctaText: 'COMPRAR COM FRETE GRÁTIS POR R$ 89.90 →',
    slug: 'smartwatch-relogio-inteligente-monitor-cardiaco',
    siteName: 'ReviewFísico',
    author: '',
    seoTitle: 'Smartwatch Relógio Inteligente - Análise Sincera e Prós e Contras',
    seoDescription: 'Avaliação detalhada sobre bateria, precisão dos sensores e compatibilidade com Android e iPhone.',
    keywords: [
      { id: 'k1', term: 'smartwatch barato e bom', searches: '31.000 buscas/mês', cpc: 'CPC R$ 1,40', difficulty: 'Alta' as const, selected: true },
      { id: 'k2', term: 'como configurar smartwatch', searches: '14.500 buscas/mês', cpc: 'CPC R$ 0,80', difficulty: 'Baixa' as const, selected: true }
    ]
  },
  {
    name: 'Whey Protein 100% Concentrado Puro Alta Absorção 900g',
    label: 'Whey Protein',
    icon: '💪',
    oldPrice: '149.90',
    currentPrice: '99.90',
    category: 'Suplementos e saúde',
    platform: 'Mercado Livre',
    affiliateUrl: 'https://www.mercadolivre.com.br/',
    mainImage: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=800&q=80',
    headline: 'Review Sincero: Whey Protein 100% Puro Funciona Mesmo para Ganho de Massa?',
    ctaText: 'QUERO O MEU POR R$ 99.90 →',
    slug: 'whey-protein-100-concentrado-puro-900g',
    siteName: 'ReviewFísico',
    author: 'Lucas Treinador',
    seoTitle: 'Whey Protein 100% Puro 900g - Tabela Nutricional e Review Sincero',
    seoDescription: 'Confira laudos, sabor, solubilidade e se vale a pena comprar este suplemento proteico.',
    keywords: [
      { id: 'k1', term: 'melhor whey custo beneficio', searches: '45.000 buscas/mês', cpc: 'CPC R$ 2,80', difficulty: 'Alta' as const, selected: true }
    ]
  },
  {
    name: 'Cadeira Ergonômica de Escritório Presidente com Apoio de Lombar e Braços 3D',
    label: 'Cadeira Ergonômica',
    icon: '🪑',
    oldPrice: '890.00',
    currentPrice: '549.90',
    category: 'Casa e cozinha',
    platform: 'Mercado Livre',
    affiliateUrl: 'https://www.mercadolivre.com.br/',
    mainImage: 'https://images.unsplash.com/photo-1580481077197-28564f51952f?auto=format&fit=crop&w=800&q=80',
    headline: 'Review Sincero: Cadeira Ergonômica Presidente Vale a Pena para Home Office?',
    ctaText: 'QUERO A MINHA POR R$ 549.90 →',
    slug: 'cadeira-ergonomica-presidente-escritorio',
    siteName: 'ReviewFísico',
    author: '',
    seoTitle: 'Cadeira Ergonômica Presidente - Acaba com as Dores nas Costas? Review 2026',
    seoDescription: 'Testamos a cadeira presidente ergonômica durante 30 dias de trabalho intenso. Confira durabilidade e conforto.',
    keywords: [
      { id: 'k1', term: 'cadeira ergonomica boa e barata', searches: '27.000 buscas/mês', cpc: 'CPC R$ 3,40', difficulty: 'Alta' as const, selected: true }
    ]
  }
];

interface CreateReviewWizardProps {
  initialReview?: Review | null;
  settings: AppSettings;
  userReviews: Review[];
  onSave: (review: Review) => void;
  onCancel: () => void;
  defaultPlatformMode?: 'meli' | 'shopee' | 'pf';
}

export const CreateReviewWizard: React.FC<CreateReviewWizardProps> = ({
  initialReview,
  settings,
  userReviews,
  onSave,
  onCancel,
  defaultPlatformMode = 'meli'
}) => {
  const [step, setStep] = useState<number>(1);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showAiPromptModal, setShowAiPromptModal] = useState<boolean>(false);
  const [showBatchPhotosModal, setShowBatchPhotosModal] = useState<boolean>(false);
  const [batchPhotosText, setBatchPhotosText] = useState<string>('');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedTarget, setCopiedTarget] = useState<string | null>(null);
  const [generatedHtmlContent, setGeneratedHtmlContent] = useState<string>('');
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const [generatingTitles, setGeneratingTitles] = useState<boolean>(false);
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    desc: string;
    type: 'lovable' | 'google-studio' | 'claude' | 'chatgpt' | 'v0' | 'copy' | 'error';
    action?: {
      label: string;
      onClick: () => void;
    };
  } | null>(null);
  const [isSearchingKeywords, setIsSearchingKeywords] = useState<boolean>(false);
  const [keywordWarning, setKeywordWarning] = useState<string | null>(null);
  const [isLimitExceeded, setIsLimitExceeded] = useState<boolean>(false);
  const [activeGeneratorMode, setActiveGeneratorMode] = useState<'review' | 'quiz'>('review');

  const showActionToast = (message: string, type: 'success' | 'error' | 'info') => {
    setActionToast({ message, type: type === 'error' ? 'info' : type });
  };

  // Copy & Intelligence Generator States
  const [isGeneratingFullCopy, setIsGeneratingFullCopy] = useState<boolean>(false);
  const [isGeneratingGatilhos, setIsGeneratingGatilhos] = useState<boolean>(false);
  const [isGeneratingSeoDesc, setIsGeneratingSeoDesc] = useState<boolean>(false);
  const [selectedHeadlineFormula, setSelectedHeadlineFormula] = useState<HeadlineFormulaType>('sincero');
  const [actionToast, setActionToast] = useState<{ message: string; type?: 'success' | 'info' } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!actionToast) return;
    const timer = setTimeout(() => setActionToast(null), 3500);
    return () => clearTimeout(timer);
  }, [actionToast]);

  useEffect(() => {
    const user = getStoredUser();
    if (user && !isUserAdmin(user)) {
      const allowed = checkUserReviewLimit(user, settings, userReviews.length);
      setIsLimitExceeded(!allowed);
    }
  }, [userReviews, settings]);

  // Form State initialized with defaults matching the screenshot
  const [formData, setFormData] = useState<Review>(() => {
    if (initialReview) return validateAndNormalizeReviewImages(initialReview);

    const defaultNiche = POPULAR_NICHES[0];
    return {
      id: 'rev-' + Date.now(),
      siteName: 'ReviewFísico',
      author: '',
      productName: '',
      headline: defaultNiche.headline,
      ctaButtonText: defaultNiche.ctaText,
      slug: '',
      currentPrice: defaultNiche.currentPrice,
      oldPrice: defaultNiche.oldPrice,
      affiliateUrl: defaultNiche.affiliateUrl,
      category: defaultNiche.category,
      platform: defaultNiche.platform,
      customPlatform: '',
      description:
        'Análise sincera e detalhada sobre durabilidade, conforto, cancelamento de ruído e autonomia da bateria para você decidir sua compra sem surpresas.',
      features: [
        'Conexão Bluetooth 5.3 com emparelhamento instantâneo',
        'Bateria com até 30 horas de reprodução total com case',
        'Proteção contra respingos e suor IPX5',
        'Microfone integrado com redução inteligente de ruído para chamadas'
      ],
      mainImage: defaultNiche.mainImage,
      images: [
        defaultNiche.mainImage,
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
      ],
      pros: [
        'Excelente custo-benefício comparado a fones de R$ 300+',
        'Encaixe firme e ergonômico no ouvido, não cai em treinos',
        'Graves presentes e agudos bem balanceados',
        'Entrega rápida e compra garantida na loja oficial'
      ],
      cons: [
        'Case não possui carregamento sem fio por indução',
        'Alta procura gera oscilação pontual de estoque'
      ],
      audience: [
        'Quem busca praticidade para ouvir músicas e podcasts no dia a dia',
        'Praticantes de esportes, academia e corrida',
        'Estudantes e profissionais que fazem muitas reuniões online'
      ],
      experience:
        'Testado em situações reais de uso no metrô, academia e chamadas. O isolamento passivo surpreendeu positivamente.',
      howItWorks:
        'Basta abrir o estojo de carregamento perto do celular para sincronizar via Bluetooth 5.3 instantaneamente.',
      faq: [
        {
          id: 'f1',
          question: 'O produto é original?',
          answer:
            'Sim! Recomendamos sempre clicar no link oficial indicado nesta página para garantir que você está comprando com o vendedor oficial e garantia.'
        },
        {
          id: 'f2',
          question: 'Como funciona a garantia e devolução?',
          answer:
            'Você conta com garantia oficial e até 30 dias para devolução gratuita caso o produto não atenda suas expectativas.'
        },
        {
          id: 'f3',
          question: 'Funciona em iPhone e celulares Android?',
          answer:
            'Sim, é 100% compatível com qualquer dispositivo com Bluetooth (iOS, Android, Windows, Mac e Smart TVs).'
        },
        {
          id: 'f4',
          question: 'Qual o tempo de duração da bateria?',
          answer:
            'Cada carga dura cerca de 6 a 8 horas contínuas de uso, e o estojo de carregamento fornece mais 4 recargas completas.'
        }
      ],
      scoreCriteria: {
        quality: 9.0,
        design: 8.8,
        practicality: 9.2,
        resources: 8.6,
        costBenefit: 9.5,
        experience: 9.0
      },
      overallScore: 9.0,
      verdict:
        'Pelo valor promocional atual, é sem dúvidas um dos melhores produtos da categoria. Supera opções mais caras e entrega ótima durabilidade.',
      testimonials: [
        {
          id: 't1',
          name: 'Marcos R.',
          text: 'Cara, melhor compra que fiz pro home office esse ano. A massagem no fim do dia salva a lombar. Recomendo demais.',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1580481077197-28564f51952f?auto=format&fit=crop&w=400&q=80',
          origin: 'Comprador Verificado'
        },
        {
          id: 't2',
          name: 'Patrícia M.',
          text: 'Esperava algo mediano pelo preço, mas chegou e me surpreendeu. Acabamento bom, super confortável e o apoio dos pés é maravilhoso.',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=400&q=80',
          origin: 'Compradora Verificada'
        },
        {
          id: 't3',
          name: 'Guilherme Santos',
          text: 'Trabalho 9 horas por dia sentado e as dores na lombar sumiram. A inclinação de 150 graus é sensacional para relaxar na hora do almoço.',
          rating: 5,
          photo: '',
          origin: 'Comprador Verificado'
        },
        {
          id: 't4',
          name: 'Renata Oliveira',
          text: 'Chegou super rápido em 4 dias no interior de SP. Muito fácil de montar, chave e parafusos vieram todos certinhos. Recomendo 100%!',
          rating: 5,
          photo: '',
          origin: 'Compradora Verificada'
        }
      ],
      template: 'premium',
      keywordPlanner: {
        mainKeyword: defaultNiche.name,
        highIntentTerms: ['funciona mesmo', 'vale a pena análise', 'onde comprar original com desconto'],
        suggestions: defaultNiche.keywords
      },
      socialCommunity: {
        whatsappGroupUrl: 'https://chat.whatsapp.com/...',
        whatsappVipText: 'Entre no nosso Canal VIP do WhatsApp para receber promoções em primeira mão!',
        instagramUrl: 'https://instagram.com/seuusuario',
        telegramUrl: 'https://t.me/seucanal',
        youtubeUrl: 'https://youtube.com/@seucanal',
        tiktokUrl: 'https://tiktok.com/@seuusuario'
      },
      seoSettings: {
        metaTitle: defaultNiche.seoTitle,
        metaDescription: defaultNiche.seoDescription
      },
      urgencySettings: {
        enableTimer: true,
        timerMinutes: 15,
        enableScarcityBar: true,
        stockRemaining: 7,
        enableFakeAlerts: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Publicado'
    };
  });

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState<boolean>(() => {
    if (initialReview && initialReview.slug) {
      return initialReview.slug !== slugify(initialReview.productName);
    }
    return false;
  });

  const handleProductNameChange = (newProductName: string) => {
    setFormData((prev) => {
      const isMainKeywordDefaultOrMatching =
        !prev.keywordPlanner?.mainKeyword ||
        prev.keywordPlanner.mainKeyword === prev.productName;

      const updatedMainKeyword = isMainKeywordDefaultOrMatching
        ? newProductName
        : (prev.keywordPlanner?.mainKeyword || newProductName);

      return {
        ...prev,
        productName: newProductName,
        slug: !isSlugManuallyEdited ? slugify(newProductName) : prev.slug,
        keywordPlanner: {
          mainKeyword: updatedMainKeyword,
          highIntentTerms: prev.keywordPlanner?.highIntentTerms || [],
          suggestions: prev.keywordPlanner?.suggestions || []
        }
      };
    });
  };

  const handleSlugChange = (newSlug: string) => {
    if (newSlug.trim() === '') {
      setIsSlugManuallyEdited(false);
      setFormData((prev) => ({
        ...prev,
        slug: slugify(prev.productName)
      }));
    } else {
      setIsSlugManuallyEdited(true);
      setFormData((prev) => ({
        ...prev,
        slug: newSlug
      }));
    }
  };

  const handleSave = () => {
    const user = getStoredUser();
    if (user && !isUserAdmin(user)) {
      if (isLimitExceeded) {
        alert('Limite de reviews atingido! Por favor, atualize para o plano Premium para criar mais reviews.');
        return;
      }
    }
    onSave(formData);
  };

  // Re-synchronize and validate consistency when initialReview prop changes
  useEffect(() => {
    if (initialReview) {
      setFormData(validateAndNormalizeReviewImages(initialReview));
    }
  }, [initialReview]);

  // Auto-generate CTA button text when price changes
  const handlePriceChange = (priceVal: string) => {
    setFormData((prev) => {
      const formattedPrice = priceVal.trim();
      const currentCta = prev.ctaButtonText || '';
      const autoCta = formattedPrice ? `QUERO A MINHA POR R$ ${formattedPrice} →` : 'QUERO A MINHA AGORA →';
      return {
        ...prev,
        currentPrice: formattedPrice,
        ctaButtonText: currentCta.startsWith('QUERO') || !currentCta ? autoCta : currentCta
      };
    });
  };

  // Generate headline variations by formula
  const handleGenerateHeadline = (formulaType: HeadlineFormulaType) => {
    setSelectedHeadlineFormula(formulaType);
    const prod = formData.productName || 'Produto';
    const newHeadline = generateHeadlineByFormula(formulaType, prod);
    setFormData((prev) => ({ ...prev, headline: newHeadline }));
    setActionToast({
      message: `Fórmula aplicada: "${newHeadline.slice(0, 48)}..."`,
      type: 'success'
    });
  };

  // Full High-Converting Copy Generation (Image 2 Fix)
  const handleGenerateFullCopy = async () => {
    const pName = (formData.productName || '').trim();
    if (!pName) {
      setActionToast({ message: 'Digite o nome do produto primeiro no campo indicado.', type: 'info' });
      return;
    }

    setIsGeneratingFullCopy(true);
    try {
      // 1. Match verified product images (guaranteeing 4 authentic images)
      const matched = matchProductImage(pName, formData.category);
      const guaranteedFourImages = matched.gallery.slice(0, 4);

      // 2. Generate complete high-converting copy
      const copy = generateFullProductCopy(pName, formData.category);

      // 3. Try to get Gemini SEO titles if server route is available
      let titles = copy.suggestedSeoTitles;
      try {
        const resp = await fetch('/api/gemini/generate-titles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productName: pName })
        });
        const data = await resp.json();
        if (Array.isArray(data?.titles) && data.titles.length > 0) {
          titles = data.titles;
        }
      } catch (e) {
        // Fallback already prepared in copy.suggestedSeoTitles
      }

      setSuggestedTitles(titles);

      // 4. Update complete formData with high-converting structured copy
      setFormData((prev) => ({
        ...prev,
        headline: copy.headline,
        description: copy.description,
        slug: copy.slug || prev.slug,
        seoSettings: {
          metaTitle: titles[0] || copy.seoTitle,
          metaDescription: copy.seoDescription
        },
        mainImage: guaranteedFourImages[0] || matched.mainImage,
        images: guaranteedFourImages,
        audience: copy.audience,
        antiPersonaPhrase: copy.antiPersonaPhrase,
        pros: copy.pros,
        cons: copy.cons,
        verdict: copy.verdict,
        overallScore: copy.overallScore,
        urgencySettings: {
          ...prev.urgencySettings!,
          stockRemaining: copy.stockRemaining,
          enableScarcityBar: true,
          enableTimer: true,
          enableFakeAlerts: true
        },
        testimonials: copy.testimonials,
        faq: copy.faq
      }));

      setActionToast({
        message: `✨ Copy completa e 4 fotos verificadas geradas com sucesso para "${pName}"!`,
        type: 'success'
      });
    } catch (err) {
      console.error('Erro ao gerar copy completa:', err);
      setActionToast({ message: 'Erro ao gerar copy. Verifique os dados.', type: 'info' });
    } finally {
      setIsGeneratingFullCopy(false);
    }
  };

  // Apply all 4 verified images to gallery
  const handleApplyAllVerifiedImages = () => {
    const match = matchProductImage(formData.productName, formData.category);
    const four = match.gallery.slice(0, 4);
    setFormData((prev) => ({
      ...prev,
      mainImage: four[0] || prev.mainImage,
      images: four
    }));
    setActionToast({ message: 'Todas as 4 fotos verificadas aplicadas à galeria!', type: 'success' });
  };

  // Auto-fill everything via Niche Preset
  const handleApplyNiche = (niche: typeof POPULAR_NICHES[0]) => {
    setIsSlugManuallyEdited(false);
    const autoSlug = slugify(niche.name);
    setFormData((prev) => ({
      ...prev,
      productName: niche.name,
      headline: niche.headline,
      ctaButtonText: niche.ctaText,
      slug: autoSlug,
      oldPrice: niche.oldPrice,
      currentPrice: niche.currentPrice,
      category: niche.category,
      platform: niche.platform,
      affiliateUrl: niche.affiliateUrl,
      mainImage: niche.mainImage,
      images: [niche.mainImage, ...(prev.images.slice(1))],
      keywordPlanner: {
        mainKeyword: niche.name,
        highIntentTerms: niche.keywords.filter((k) => k.selected).map((k) => k.term),
        suggestions: niche.keywords
      },
      seoSettings: {
        metaTitle: niche.seoTitle,
        metaDescription: niche.seoDescription
      }
    }));
  };

  const handleGenerateTitles = async () => {
    if (!formData.productName) {
      setActionToast({ message: 'Digite o nome do produto primeiro.', type: 'info' });
      return;
    }
    setGeneratingTitles(true);
    try {
      const response = await fetch("/api/gemini/generate-titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: formData.productName })
      });
      const data = await response.json();
      const titles = (Array.isArray(data?.titles) && data.titles.length > 0)
        ? data.titles
        : generateSeoTitles(formData.productName);

      setSuggestedTitles(titles);
      if (titles[0]) {
        setFormData((prev) => ({
          ...prev,
          seoSettings: {
            metaTitle: titles[0],
            metaDescription: prev.seoSettings?.metaDescription || ''
          }
        }));
      }
      setActionToast({ message: 'Títulos SEO de alta conversão gerados!', type: 'success' });
    } catch (err) {
      console.error("Erro ao gerar títulos:", err);
      const titles = generateSeoTitles(formData.productName);
      setSuggestedTitles(titles);
      if (titles[0]) {
        setFormData((prev) => ({
          ...prev,
          seoSettings: {
            metaTitle: titles[0],
            metaDescription: prev.seoSettings?.metaDescription || ''
          }
        }));
      }
    } finally {
      setGeneratingTitles(false);
    }
  };

  const handleGenerateSeoDescription = async () => {
    if (!formData.productName) {
      setActionToast({ message: 'Digite o nome do produto primeiro.', type: 'info' });
      return;
    }
    setIsGeneratingSeoDesc(true);
    try {
      const response = await fetch("/api/gemini/generate-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: formData.productName })
      });
      const data = await response.json();
      const desc = data?.metaDescription || generateSeoDescription(formData.productName);
      setFormData((prev) => ({
        ...prev,
        seoSettings: {
          metaTitle: prev.seoSettings?.metaTitle || data?.metaTitle || `${formData.productName}: Review Sincero (2026)`,
          metaDescription: desc
        }
      }));
      setActionToast({ message: 'Meta Description do Google gerada com sucesso!', type: 'success' });
    } catch (err) {
      const desc = generateSeoDescription(formData.productName);
      setFormData((prev) => ({
        ...prev,
        seoSettings: {
          metaTitle: prev.seoSettings?.metaTitle || `${formData.productName}: Review Sincero (2026)`,
          metaDescription: desc
        }
      }));
    } finally {
      setIsGeneratingSeoDesc(false);
    }
  };

  // Toggle Keyword Selection
  const toggleKeywordSelection = (id: string) => {
    setFormData((prev) => {
      const currentSuggestions = prev.keywordPlanner?.suggestions || [];
      const updatedSuggestions = currentSuggestions.map((s) =>
        s.id === id ? { ...s, selected: !s.selected } : s
      );
      const updatedHighIntent = updatedSuggestions.filter((s) => s.selected).map((s) => s.term);
      return {
        ...prev,
        keywordPlanner: {
          mainKeyword: prev.keywordPlanner?.mainKeyword || prev.productName,
          highIntentTerms: updatedHighIntent,
          suggestions: updatedSuggestions
        }
      };
    });
  };

  // Remove high intent tag
  const removeHighIntentTag = (termToRemove: string) => {
    setFormData((prev) => {
      const currentSuggestions = prev.keywordPlanner?.suggestions || [];
      const updatedSuggestions = currentSuggestions.map((s) =>
        s.term === termToRemove ? { ...s, selected: false } : s
      );
      const updatedHighIntent = (prev.keywordPlanner?.highIntentTerms || []).filter(
        (t) => t !== termToRemove
      );
      return {
        ...prev,
        keywordPlanner: {
          mainKeyword: prev.keywordPlanner?.mainKeyword || prev.productName,
          highIntentTerms: updatedHighIntent,
          suggestions: updatedSuggestions
        }
      };
    });
  };

  // Search more keywords dynamically
  const handleSearchKeywords = async () => {
    const term = formData.productName || 'produto';
    setIsSearchingKeywords(true);
    setKeywordWarning(null);

    try {
      // (Removido planejador de palavras-chave)
      const response: any = { data: [] };
      
      let isReal = response.isRealApiConfigured || false;
      let resultsList = response.results || [];

      if (!response.success) {
        setKeywordWarning(response.message || 'A integração com o Google Ads não está configurada ou ativa no servidor.');
        isReal = false;
        resultsList = [];
      }

      // (Removido planejador de palavras-chave)
      const formatted: KeywordSuggestion[] = [];

      setFormData((prev) => {
        const selectedTerms = formatted.filter(f => f.selected).map(f => f.term);
        return {
          ...prev,
          keywordPlanner: {
            mainKeyword: term,
            highIntentTerms: Array.from(new Set([
              ...(prev.keywordPlanner?.highIntentTerms || []),
              ...selectedTerms
            ])),
            suggestions: formatted
          }
        };
      });
    } catch (err) {
      console.error('[CreateReviewWizard] Erro ao buscar palavras-chave:', err);
      setKeywordWarning('Falha na comunicação de rede. Exibindo dados locais.');
    } finally {
      setIsSearchingKeywords(false);
    }
  };

  // Slugify URL
  const handleShortenSlug = () => {
    const autoSlug = slugify(formData.productName);
    const words = autoSlug.split('-').filter(Boolean);
    const shortened = words.length > 0 ? words.slice(0, 3).join('-') : 'review-produto';
    setIsSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: shortened }));
  };

  // Calculate Overall Score
  const calculateOverallScore = (criteria: typeof formData.scoreCriteria) => {
    const values = Object.values(criteria);
    const sum = values.reduce((a, b) => a + b, 0);
    return Number((sum / values.length).toFixed(1));
  };

  const updateCriterion = (key: keyof typeof formData.scoreCriteria, val: number) => {
    const updated = { ...formData.scoreCriteria, [key]: val };
    const newScore = calculateOverallScore(updated);
    setFormData({ ...formData, scoreCriteria: updated, overallScore: newScore });
  };

  // Testimonials management
  const updateTestimonial = (idx: number, partial: Partial<TestimonialItem>) => {
    const updated = [...formData.testimonials];
    updated[idx] = { ...updated[idx], ...partial };
    setFormData((prev) => ({ ...prev, testimonials: updated }));
  };

  const handleAddNewTestimonial = () => {
    const names = ['Bruno Silva', 'Lucas Almeida', 'Mariana Costa', 'Gabriel Lima', 'Larissa Rocha', 'Rafael Ramos'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const newTestimonial: TestimonialItem = {
      id: 't-' + Date.now(),
      name: randomName,
      text: `Excelente aquisição! Chegou muito rápido e atendeu 100% o que prometeu. Super recomendo a compra!`,
      photo: '',
      rating: 5,
      origin: 'Comprador Verificado'
    };
    setFormData((prev) => ({ ...prev, testimonials: [...prev.testimonials, newTestimonial] }));
  };

  const handleDeleteTestimonial = (idx: number) => {
    const updated = formData.testimonials.filter((_, i) => i !== idx);
    setFormData((prev) => ({ ...prev, testimonials: updated }));
  };

  const handlePhotoUrlChange = (idx: number, photoUrl: string) => {
    const updated = [...formData.testimonials];
    const current = updated[idx];
    const newText = (!current.text || current.text.trim().length === 0)
      ? `Chegou certinho em casa conforme a foto. Produto original e muito bem embalado. Nota 10!`
      : current.text;
    updated[idx] = { ...current, photo: photoUrl, text: newText };
    setFormData((prev) => ({ ...prev, testimonials: updated }));
  };

  const handleGenerateSingleTestimonialText = (idx: number) => {
    const pName = formData.productName || 'Produto';
    const text = generateSingleTestimonialText(pName, idx);
    updateTestimonial(idx, { text });
    setActionToast({ message: `Depoimento #${idx + 1} gerado para "${pName}"!`, type: 'success' });
  };

  const handleAutoGenerateAllTestimonials = () => {
    const pName = formData.productName || 'Produto';
    const copy = generateFullProductCopy(pName, formData.category);
    setFormData((prev) => ({
      ...prev,
      testimonials: copy.testimonials
    }));
    setActionToast({
      message: `${copy.testimonials.length} depoimentos e fotos verificadas gerados para "${pName}"!`,
      type: 'success'
    });
  };

  const handleBatchPhotosSubmit = () => {
    const urls = batchPhotosText
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.startsWith('http'));

    if (urls.length === 0) {
      setShowBatchPhotosModal(false);
      return;
    }

    const updated = [...formData.testimonials];
    urls.forEach((url, i) => {
      if (i < updated.length) {
        updated[i] = { ...updated[i], photo: url };
      } else {
        const names = ['André Costa', 'Juliana Lima', 'Matheus Souza', 'Fernanda Dias', 'Thiago Mendes'];
        updated.push({
          id: 't-' + Date.now() + '-' + i,
          name: names[(i - updated.length) % names.length] || `Comprador #${i + 1}`,
          rating: 5,
          photo: url,
          text: `Chegou super rápido em casa conforme a foto. Produto original e muito bem embalado. Recomendo!`,
          origin: 'Comprador Verificado'
        });
      }
    });

    setFormData((prev) => ({ ...prev, testimonials: updated }));
    setBatchPhotosText('');
    setShowBatchPhotosModal(false);
  };

  // Gatilhos & Urgência Helpers (Enhanced with productCopyEngine)
  const handleAutoGenerateGatilhos = () => {
    const prod = formData.productName || 'Produto';
    setIsGeneratingGatilhos(true);
    try {
      const copy = generateFullProductCopy(prod, formData.category);

      setFormData((prev) => ({
        ...prev,
        author: prev.author || '',
        overallScore: copy.overallScore,
        guaranteeDays: prev.guaranteeDays || 30,
        verifiedReviewsCount: prev.verifiedReviewsCount || 2184,
        urgencySettings: {
          ...prev.urgencySettings!,
          stockRemaining: copy.stockRemaining,
          enableScarcityBar: true,
          enableTimer: true,
          enableFakeAlerts: true
        },
        audience: copy.audience,
        antiPersonaPhrase: copy.antiPersonaPhrase,
        pros: copy.pros,
        cons: copy.cons,
        verdict: copy.verdict
      }));

      setActionToast({
        message: `🪄 Gatilhos de alta conversão atualizados para "${prod}"!`,
        type: 'success'
      });
    } catch (err) {
      console.error('Erro ao gerar gatilhos:', err);
    } finally {
      setIsGeneratingGatilhos(false);
    }
  };

  const handleAutoGenerateAudience = () => {
    const pName = formData.productName?.trim() || 'Produto';
    const copy = generateFullProductCopy(pName, formData.category);
    setFormData((prev) => ({
      ...prev,
      audience: copy.audience,
      antiPersonaPhrase: copy.antiPersonaPhrase
    }));
    setActionToast({ message: `Público-alvo e frase de corte gerados para "${pName}"!`, type: 'success' });
  };

  const handleAutoGeneratePros = () => {
    const pName = formData.productName?.trim() || 'Produto';
    const copy = generateFullProductCopy(pName, formData.category);
    setFormData((prev) => ({ ...prev, pros: copy.pros }));
    setActionToast({ message: `Pontos fortes (Prós) gerados para "${pName}"!`, type: 'success' });
  };

  const handleAutoGenerateCons = () => {
    const pName = formData.productName?.trim() || 'Produto';
    const copy = generateFullProductCopy(pName, formData.category);
    setFormData((prev) => ({ ...prev, cons: copy.cons }));
    setActionToast({ message: `Pontos de atenção (Contras) gerados para "${pName}"!`, type: 'success' });
  };

  const handleAutoGenerateVerdict = () => {
    const pName = formData.productName?.trim() || 'Produto';
    const copy = generateFullProductCopy(pName, formData.category);
    setFormData((prev) => ({ ...prev, verdict: copy.verdict }));
    setActionToast({ message: `Veredito final do especialista gerado para "${pName}"!`, type: 'success' });
  };

  const handleAddNewAudienceItem = () => {
    setFormData((prev) => ({
      ...prev,
      audience: [...prev.audience, 'Novo critério de identificação do comprador ideal...']
    }));
  };

  const handleUpdateAudienceItem = (idx: number, val: string) => {
    const updated = [...formData.audience];
    updated[idx] = val;
    setFormData((prev) => ({ ...prev, audience: updated }));
  };

  const handleDeleteAudienceItem = (idx: number) => {
    const updated = formData.audience.filter((_, i) => i !== idx);
    setFormData((prev) => ({ ...prev, audience: updated }));
  };

  const handleAddNewPro = () => {
    setFormData((prev) => ({
      ...prev,
      pros: [...prev.pros, 'Novo ponto forte comprovado nos testes...']
    }));
  };

  const handleUpdatePro = (idx: number, val: string) => {
    const updated = [...formData.pros];
    updated[idx] = val;
    setFormData((prev) => ({ ...prev, pros: updated }));
  };

  const handleDeletePro = (idx: number) => {
    const updated = formData.pros.filter((_, i) => i !== idx);
    setFormData((prev) => ({ ...prev, pros: updated }));
  };

  const handleAddNewCon = () => {
    setFormData((prev) => ({
      ...prev,
      cons: [...prev.cons, 'Ponto de atenção ou detalhe para se atentar...']
    }));
  };

  const handleUpdateCon = (idx: number, val: string) => {
    const updated = [...formData.cons];
    updated[idx] = val;
    setFormData((prev) => ({ ...prev, cons: updated }));
  };

  const handleDeleteCon = (idx: number) => {
    const updated = formData.cons.filter((_, i) => i !== idx);
    setFormData((prev) => ({ ...prev, cons: updated }));
  };

  // Helper resiliente para cópia segura para a área de transferência em qualquer navegador / iframe
  const safeCopyToClipboard = async (text: string): Promise<boolean> => {
    if (!text) return false;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      console.warn('Clipboard API rejeitou ou não disponível, utilizando fallback:', err);
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error('Fallback execCommand falhou:', err);
      return false;
    }
  };

  // =========================================================================
  // FONTE ÚNICA DE VERDADE: PRD / PROMPT COMPLETO GERADO PARA TODAS AS IAS
  // =========================================================================
  const generatedPrompt = `DOCUMENTO DE REQUISITOS DE PRODUTO (PRD) — PÁGINA DE REVIEW + QUIZ INTERATIVO DE ALTA CONVERSÃO

Você é um engenheiro frontend sênior e especialista em marketing de afiliados de alta conversão.
Crie uma aplicação web completa, moderna, responsiva e otimizada para SEO e conversão, que engloba UMA PÁGINA DE REVIEW COMPLETA E UM QUIZ INTERATIVO PERSONALIZADO para o produto informado a seguir.

========================================
1. DADOS TÉCNICOS E OFERTA DO PRODUTO
========================================
- Nome do Produto: ${formData.productName}
- Headline do Review: ${formData.headline || formData.productName}
- Preço Atual Promocional: R$ ${formData.currentPrice}
${formData.oldPrice ? `- Preço Anterior Sem Desconto: R$ ${formData.oldPrice}` : ''}
- Link Oficial de Checkout / Afiliado: ${formData.affiliateUrl || 'https://www.mercadolivre.com.br/'}
- Plataforma Oficial: ${formData.platform}
- Categoria do Produto: ${formData.category}
- Nome do Portal de Avaliação: ${formData.siteName || 'ReviewFísico'}
- Nome do Avaliador / Especialista: ${formData.author || 'Especialista em Reviews'}
- Nota Geral do Especialista: ${formData.overallScore || 9.2} / 10
- Garantia Incondicional: ${formData.guaranteeDays || 30} dias
- Avalições Verificadas: ${formData.verifiedReviewsCount || 2184} clientes satisfeitos
- Unidades Restantes em Estoque Promocional: ${formData.urgencySettings?.stockRemaining || 3} unidades
- Link do Suporte / Comunidade WhatsApp: ${formData.socialCommunity?.whatsappGroupUrl || ''}

========================================
2. PÚBLICO-ALVO & FRASE DE CORTE (ANTI-PERSONA)
========================================
Público Ideal:
${formData.audience && formData.audience.length > 0 ? formData.audience.map((a) => `• ${a}`).join('\n') : '• Quem busca máxima durabilidade e custo-benefício\n• Quem exige garantia e nota fiscal na loja oficial'}

Frase Anti-Persona (Para quem NÃO é recomendado):
"${formData.antiPersonaPhrase || 'Se você não pretende utilizar o produto com frequência e busca apenas a opção mais barata sem garantia, não recomendamos este produto.'}"

========================================
3. ANÁLISE SINCERA (PRÓS, CONTRAS E VEREDITO)
========================================
Pontos Fortes (Prós):
${formData.pros && formData.pros.length > 0 ? formData.pros.map((p) => `✓ ${p}`).join('\n') : '✓ Excelente qualidade de construção\n✓ Preço promocional justo pela entrega'}

Pontos de Atenção (Contras):
${formData.cons && formData.cons.length > 0 ? formData.cons.map((c) => `× ${c}`).join('\n') : '× Estoque promocional costuma acabar rapidamente'}

Veredito do Especialista:
"${formData.verdict || 'Aprovado em nossos testes práticos com nota alta. A compra vale muito a pena pelo preço de oferta.'}"

========================================
4. FOTOS, DEPOIMENTOS E FAQ
========================================
Foto Principal: ${formData.mainImage || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'}
${formData.images && formData.images.filter(Boolean).length > 0 ? formData.images.filter(Boolean).map((img, i) => `- Foto ${i + 1}: ${img}`).join('\n') : ''}

Depoimentos de Clientes:
${formData.testimonials && formData.testimonials.length > 0 ? formData.testimonials.map((t) => `- "${t.text || ''}" — ${t.name || 'Cliente'} (${t.rating || 5}★, ${t.origin || 'Compra Verificada'})`).join('\n') : '- "Superou minhas expectativas, entrega muito rápida!" — Marcos S. (5★)'}

Perguntas Frequentes (FAQ):
${formData.faq && formData.faq.length > 0 ? formData.faq.map((f: FAQItem) => `P: ${f.question}\nR: ${f.answer}`).join('\n\n') : 'P: O frete é seguro?\nR: Sim, envio rastreado com garantia de entrega.'}

========================================
5. REQUISITOS DO PRD — MÓDULO 1: PÁGINA DE REVIEW DE ALTA CONVERSÃO
========================================
1. Header / Topbar com barra de escassez (apenas ${formData.urgencySettings?.stockRemaining || 3} unidades promocionais restantes), cronômetro regressivo de 15 minutos e aviso de frete com rastreio.
2. Banner e Identidade do Portal "${formData.siteName || 'ReviewFísico'}" com nota editorial ${formData.overallScore || 9.2}/10 por ${formData.author || 'Especialista'}.
3. Apresentação do Produto ${formData.productName}: Título de impacto, Preço promocional (R$ ${formData.currentPrice}), foto principal com galeria de miniaturas selecionáveis e botão de CTA verde reluzente para ${formData.affiliateUrl || '#'}.
4. Seção de Identificação: Tabela interativa "Para Quem É" vs "Para Quem NÃO É" (Anti-Persona).
5. Cards de Prós e Contras em duas colunas contrastantes.
6. Bloco Veredito do Especialista assinado por ${formData.author || 'Especialista'}.
7. Módulo de Depoimentos Reais com avatares e avaliação por estrelas.
8. FAQ sanfonado (accordion) com respostas expandíveis.
9. Barra Flutuante de Compra Fixa (Sticky CTA) no rodapé mobile e desktop com gatilho de oferta.

========================================
6. REQUISITOS DO PRD — MÓDULO 2: QUIZ INTERATIVO PERSONALIZADO DO PRODUTO
========================================
Crie um Quiz Interativo de Diagnóstico e Recomendação de Compra focado exclusivamente no produto "${formData.productName}":
- Pergunta 1 (Maior Necessidade): "Qual é o seu maior objetivo ou necessidade principal ao procurar pelo ${formData.productName}?" (Forneça 3 a 4 opções de resposta).
- Pergunta 2 (Frequência / Contexto): "Com que frequência você pretende utilizar o ${formData.productName} no seu dia a dia?" (Opções: Diariamente, Finais de semana, Uso profissional, Ocasiões especiais).
- Pergunta 3 (Prioridade de Compra): "O que é mais importante para você no momento da compra?" (Opções: Menor preço com desconto exclusivo, Garantia oficial de originalidade, Envio rápido com rastreamento, Suporte direto).
- RECURSOS TÉCNICOS DO QUIZ:
  • Barra de progresso dinâmica que avança a cada clique (25%, 50%, 75%, 100%).
  • Animação suave entre cada pergunta.
  • Loader de Análise Interativa ao finalizar a última pergunta: Mostre uma tela de carregamento com frases como: "Analisando seu perfil...", "Verificando estoque do ${formData.productName}...", "Liberando cupom promocional...".
  • Tela de Resultado Final Customizado: "Diagnóstico Concluído! O ${formData.productName} é 100% RECOMENDADO para o seu perfil!".
  • Apresente a Oferta Exclusiva com liberação de Cupom de Desconto, cronômetro de 10 minutos para garantir o preço de R$ ${formData.currentPrice} e botão direto para o checkout oficial (${formData.affiliateUrl}).

========================================
7. NAVEGAÇÃO & INTERAÇÃO
========================================
1. Adicione um menu/tabs no topo permitindo alternar facilmente entre "Página de Review" e "Quiz Interativo de Recomendação".
2. Estilização moderna e elegante utilizando Tailwind CSS.
3. Certifique-se de que todos os botões de ação (CTA) levem o usuário para o link oficial (${formData.affiliateUrl}).`;

  // Alias para total compatibilidade sem duplicar estados
  const claudeHtmlPrompt = generatedPrompt;

  const handleCopyPrompt = async () => {
    const success = await safeCopyToClipboard(generatedPrompt);
    setCopiedPrompt(true);
    setCopiedTarget('manual');
    if (success) {
      setToastMessage({
        title: 'Prompt Copiado com Sucesso!',
        desc: 'O prompt completo de alta conversão foi copiado para sua área de transferência (Ctrl+V).',
        type: 'copy',
        action: {
          label: 'COPIAR NOVAMENTE',
          onClick: () => handleCopyPrompt()
        }
      });
    } else {
      setToastMessage({
        title: 'Não foi possível copiar automaticamente.',
        desc: 'Selecione o texto na caixa abaixo e utilize Ctrl+C.',
        type: 'error'
      });
    }
    setTimeout(() => {
      setCopiedPrompt(false);
      setCopiedTarget(null);
    }, 3500);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const handleOpenLovable = async () => {
    await safeCopyToClipboard(generatedPrompt);
    setCopiedPrompt(true);
    setCopiedTarget('lovable');
    setToastMessage({
      title: 'Prompt Copiado! Abrindo Lovable...',
      desc: 'O Lovable está sendo aberto. O prompt já foi copiado para sua área de transferência e pode ser colado com Ctrl+V se necessário!',
      type: 'lovable',
      action: {
        label: 'COPIAR NOVAMENTE',
        onClick: () => handleCopyPrompt()
      }
    });
    setTimeout(() => {
      setCopiedPrompt(false);
      setCopiedTarget(null);
    }, 4000);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
    const lovableUrl = `https://lovable.dev/?prompt=${encodeURIComponent(generatedPrompt)}`;
    window.open(lovableUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenGoogleAIStudio = async () => {
    await safeCopyToClipboard(generatedPrompt);
    setCopiedPrompt(true);
    setCopiedTarget('google-studio');
    setToastMessage({
      title: 'Prompt Copiado! Abrindo Google AI Studio...',
      desc: 'Abrindo ai.studio/build — basta pressionar Ctrl+V no campo "Describe an app and let Gemini do the rest" para criar a página!',
      type: 'google-studio',
      action: {
        label: 'COPIAR NOVAMENTE',
        onClick: () => handleCopyPrompt()
      }
    });
    setTimeout(() => {
      setCopiedPrompt(false);
      setCopiedTarget(null);
    }, 4000);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
    const aiStudioUrl = `https://ai.studio/build?prompt=${encodeURIComponent(generatedPrompt)}`;
    window.open(aiStudioUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenClaude = async () => {
    // 1. Obter exatamente o generatedPrompt atual da fonte única da verdade
    const success = await safeCopyToClipboard(generatedPrompt);
    setCopiedPrompt(true);
    setCopiedTarget('claude');

    if (success) {
      setToastMessage({
        title: '✓ Prompt copiado! Cole no Claude com Ctrl+V.',
        desc: 'Pressione Ctrl+V no campo de mensagem para colar o PRD completo.',
        type: 'claude',
        action: {
          label: 'COPIAR NOVAMENTE',
          onClick: () => handleCopyPrompt()
        }
      });
    } else {
      setToastMessage({
        title: 'Aviso da área de transferência',
        desc: "Não foi possível copiar automaticamente. Clique em 'Copiar Apenas o Texto' para copiar o prompt.",
        type: 'error',
        action: {
          label: 'Copiar Apenas o Texto',
          onClick: () => handleCopyPrompt()
        }
      });
    }

    setTimeout(() => {
      setCopiedPrompt(false);
      setCopiedTarget(null);
    }, 4000);
    setTimeout(() => {
      setToastMessage(null);
    }, 7000);

    // 2. Abrir Claude em nova aba de forma limpa e oficial
    window.open('https://claude.ai/new', '_blank', 'noopener,noreferrer');
  };

  const handleOpenChatGPT = async () => {
    // 1. Obter exatamente o generatedPrompt atual da fonte única da verdade
    const success = await safeCopyToClipboard(generatedPrompt);
    setCopiedPrompt(true);
    setCopiedTarget('chatgpt');

    if (success) {
      setToastMessage({
        title: '✓ Prompt copiado! Cole no ChatGPT com Ctrl+V.',
        desc: 'Pressione Ctrl+V no campo de mensagem para colar o PRD completo.',
        type: 'chatgpt',
        action: {
          label: 'COPIAR NOVAMENTE',
          onClick: () => handleCopyPrompt()
        }
      });
    } else {
      setToastMessage({
        title: 'Aviso da área de transferência',
        desc: "Não foi possível copiar automaticamente. Clique em 'Copiar Apenas o Texto' para copiar o prompt.",
        type: 'error',
        action: {
          label: 'Copiar Apenas o Texto',
          onClick: () => handleCopyPrompt()
        }
      });
    }

    setTimeout(() => {
      setCopiedPrompt(false);
      setCopiedTarget(null);
    }, 4000);
    setTimeout(() => {
      setToastMessage(null);
    }, 7000);

    // 2. Abrir ChatGPT em nova aba de forma limpa e oficial
    window.open('https://chatgpt.com/', '_blank', 'noopener,noreferrer');
  };

  const handleOpenV0 = async () => {
    await safeCopyToClipboard(generatedPrompt);
    setCopiedPrompt(true);
    setCopiedTarget('v0');
    setToastMessage({
      title: 'Prompt Copiado! Abrindo v0.dev...',
      desc: 'Abrindo v0.dev — seu prompt está pronto para gerar os componentes.',
      type: 'v0',
      action: {
        label: 'COPIAR NOVAMENTE',
        onClick: () => handleCopyPrompt()
      }
    });
    setTimeout(() => {
      setCopiedPrompt(false);
      setCopiedTarget(null);
    }, 4000);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
    window.open(`https://v0.dev/chat?q=${encodeURIComponent(generatedPrompt)}`, '_blank', 'noopener,noreferrer');
  };

  const handleGenerateHtml = () => {
    const html = generateStandaloneReviewHtml(formData as any);
    setGeneratedHtmlContent(html);
    setIsHtmlModalOpen(true);
    setToastMessage({
      title: 'HTML Gerado com Sucesso!',
      desc: 'O código HTML fiel à página atual foi gerado e está pronto para uso.',
      type: 'copy'
    });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyHtml = () => {
    const html = generateStandaloneReviewHtml(formData as any);
    setGeneratedHtmlContent(html);
    navigator.clipboard.writeText(html);
    setCopiedHtml(true);
    setToastMessage({
      title: 'HTML Copiado com Sucesso!',
      desc: 'O código HTML autônomo foi copiado para a área de transferência.',
      type: 'copy'
    });
    setTimeout(() => setCopiedHtml(false), 3000);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleDownloadHtml = () => {
    const html = generateStandaloneReviewHtml(formData as any);
    setGeneratedHtmlContent(html);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeSlug = slugify(formData.slug || formData.productName) || 'review-produto';
    link.download = `${safeSlug}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToastMessage({
      title: 'Download Iniciado!',
      desc: `O arquivo ${safeSlug}.html foi baixado para o seu computador.`,
      type: 'copy'
    });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const currentSlug = formData.slug || slugify(formData.productName) || '';

  const previewUrl = `https://ais-dev-7ghi3svtc6qxgyrly5seds-19146718761.us-east1.run.app/review/${currentSlug}`;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300 pb-28">
      {/* =========================================================================
          TOP HEADER WITH ACTIONS (MATCHING SCREENSHOT HEADER EXACTLY)
         ========================================================================= */}
      <div className="space-y-4">
        {/* Back Link */}
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8E8E8E] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para Páginas de Review</span>
        </button>

        {/* Title & Action Buttons Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Criar Nova Página de Review
            </h1>
            <p className="text-xs md:text-sm text-[#8E8E8E] mt-1">
              Gere páginas persuasivas de alta conversão com cronômetro, barra de escassez,
              prós/contras e depoimentos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Gerar Toda a Copy com IA */}
            <button
              onClick={() => {
                handleGenerateHeadline('sincero');
                handleSearchKeywords();
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Gerar Toda a Copy com IA</span>
            </button>

            {/* Modelo Exemplo */}
            <button
              onClick={() => handleApplyNiche(POPULAR_NICHES[0])}
              className="flex items-center gap-1.5 bg-[#141414] hover:bg-[#1E1E1E] text-[#D4D4D4] hover:text-white border border-[#2E2E2E] font-semibold px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F5C542]" />
              <span>Modelo Exemplo</span>
            </button>

            {/* Visualizar */}
            <button
              onClick={() => setShowPreviewModal(true)}
              className="flex items-center gap-1.5 bg-[#141414] hover:bg-[#1E1E1E] text-[#D4D4D4] hover:text-white border border-[#2E2E2E] font-semibold px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Visualizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FLUXO SELECTION (GERAR PÁGINA DE REVIEW vs GERAR QUIZ)
         ========================================================================= */}
      <div className="bg-[#0D1117] border border-[#1E293B] p-1.5 rounded-2xl flex items-center gap-2 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveGeneratorMode('review')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeGeneratorMode === 'review'
              ? 'bg-[#1E293B] text-white border border-[#3B82F6]/60 shadow-lg shadow-blue-500/10'
              : 'text-[#8E8E8E] hover:text-white hover:bg-[#121824]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#3B82F6]" />
          <span>GERAR PÁGINA DE REVIEW</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveGeneratorMode('quiz')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeGeneratorMode === 'quiz'
              ? 'bg-[#1E293B] text-white border border-[#22C55E]/60 shadow-lg shadow-green-500/10'
              : 'text-[#8E8E8E] hover:text-white hover:bg-[#121824]'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-[#22C55E]" />
          <span>GERAR QUIZ DO PRODUTO</span>
        </button>
      </div>

      {activeGeneratorMode === 'quiz' ? (
        <QuizGeneratorModule
          review={formData}
          onUpdateQuizConfig={(cfg) => setFormData((prev) => ({ ...prev, quizConfig: cfg }))}
          setActionToast={({ message, type }) => showActionToast(message, type)}
        />
      ) : (
        <>
          {/* =========================================================================
              HORIZONTAL STEP TABS (1. PRODUTO & PREÇO, 2. GALERIA, ETC.)
             ========================================================================= */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#1E1E1E]">
        {[
          { num: 1, label: '1. Produto & Preço' },
          { num: 2, label: `2. Galeria (${formData.images.filter(Boolean).length})` },
          { num: 3, label: '3. Gatilhos & Urgência' },
          { num: 4, label: `4. Avaliações (${formData.testimonials.length})` },
          { num: 5, label: `5. Dúvidas / FAQ (${formData.faq.length})` }
        ].map((tab) => {
          const isActive = step === tab.num;
          return (
            <button
              key={tab.num}
              onClick={() => setStep(tab.num)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1E293B] text-white border border-[#3B82F6]/60 shadow-md shadow-blue-500/10'
                  : 'text-[#8E8E8E] hover:text-white hover:bg-[#121212]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          STEP 1: PRODUTO & PREÇO (MATCHING THE ENTIRE USER SCREENSHOT)
         ========================================================================= */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* 1. PASSO 1 - DADOS DO PRODUTO FÍSICO */}
          <div className="bg-[#101010] border border-[#262626] rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2.5 text-[#F59E0B]">
              <div className="w-6 h-6 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center">
                <Package className="w-3.5 h-3.5 text-[#F59E0B]" />
              </div>
              <h3 className="text-sm font-bold text-[#F59E0B]">
                Passo 1 — Dados do produto físico
              </h3>
            </div>
            <p className="text-xs text-[#8E8E8E]">
              Preencha com os dados do material de divulgação da plataforma (Logzz, Monetizze,
              etc.).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                  NOME DO SEU SITE
                </label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  placeholder="Ex: ReviewFísico, Mundo Review..."
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                  SEU NOME
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder=""
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>
          </div>

          {/* 2. PLANEJADOR DE PALAVRAS-CHAVE (GOOGLE ADS & SEO) */}
          <div className="bg-[#0D1117] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[#60A5FA]">
                  <TrendingUp className="w-4 h-4 text-[#60A5FA]" />
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Planejador de Palavras-Chave (Google Ads & SEO)
                  </h3>
                </div>
                <p className="text-xs text-[#8E8E8E] mt-1">
                  Estrutura baseada no planejador do Google Ads com termos mais pesquisados para
                  posicionar sua página no topo do Google.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSearchKeywords}
                disabled={isSearchingKeywords}
                className={`flex items-center gap-1.5 ${isSearchingKeywords ? 'bg-[#0F172A] opacity-60 cursor-not-allowed' : 'bg-[#1E293B] hover:bg-[#283548]'} text-[#93C5FD] border border-[#3B82F6]/40 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0`}
              >
                {isSearchingKeywords ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Buscando...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Buscar Termos Mais Pesquisados</span>
                  </>
                )}
              </button>
            </div>

            
            {/* Main Keyword Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                  PALAVRA-CHAVE PRINCIPAL
                </label>
                <a 
                  href="https://ads.google.com/aw/keywordplanner/ideas/new?ocid=146771323&euid=156883603&__u=1579093947&uscid=146771323&__c=4388368227&authuser=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E293B] text-white rounded-lg text-[10px] font-bold hover:bg-[#2D3748] transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Acessar Planejador Google Ads
                </a>
              </div>
              <input
                type="text"
                value={formData.keywordPlanner?.mainKeyword ?? formData.productName ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    keywordPlanner: {
                      mainKeyword: e.target.value,
                      highIntentTerms: prev.keywordPlanner?.highIntentTerms || [],
                      suggestions: prev.keywordPlanner?.suggestions || []
                    }
                  }))
                }
                className="w-full bg-[#080B10] border border-[#1E293B] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                placeholder="Ex: Fone de Ouvido Bluetooth TWS Sem Fio Bateria de Longa Duração"
              />
            </div>

            {/* Selected High Intent Tags */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                TERMOS DE ALTA INTENÇÃO (SELECIONADOS PARA SEO)
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {formData.keywordPlanner?.highIntentTerms &&
                formData.keywordPlanner.highIntentTerms.length > 0 ? (
                  formData.keywordPlanner.highIntentTerms.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E293B] text-[#93C5FD] border border-[#3B82F6]/30 text-xs font-semibold"
                    >
                      <span>✓ {tag}</span>
                      <button
                        type="button"
                        onClick={() => removeHighIntentTag(tag)}
                        className="hover:text-red-400 p-0.5 cursor-pointer"
                        title="Remover termo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#666]">Nenhum termo selecionado</span>
                )}
              </div>
            </div>

            {/* Keyword Suggestions Table */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs text-[#8E8E8E] font-medium px-1">
                <span>Sugestões de Termos Mais Pesquisados no Google Ads</span>
                <span className="text-[11px] bg-[#1E293B] text-[#93C5FD] px-2 py-0.5 rounded font-mono">
                  Volume Mensal Estimado
                </span>
              </div>

              <div className="border border-[#1E293B] rounded-xl overflow-hidden divide-y divide-[#1E293B] bg-[#080B10]">
                {formData.keywordPlanner?.suggestions?.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleKeywordSelection(item.id)}
                    className={`flex items-center justify-between p-3.5 text-xs transition-colors cursor-pointer ${
                      item.selected ? 'bg-[#1E293B]/40 text-white' : 'text-[#A1A1A1] hover:bg-[#121824]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => {}}
                        className="rounded border-[#3B82F6] text-[#3B82F6] focus:ring-0 cursor-pointer"
                      />
                      <span className="font-medium text-white">{item.term}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[#8E8E8E] font-mono flex items-center gap-1">
                        <span>🔍</span>
                        <span>{item.searches}</span>
                      </span>
                      <span className="text-[#22C55E] font-mono font-semibold">{item.cpc}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          item.difficulty === 'Alta'
                            ? 'bg-[#EA580C]/20 text-[#FB923C] border border-[#EA580C]/30'
                            : item.difficulty === 'Média'
                            ? 'bg-[#EAB308]/20 text-[#FDE047] border border-[#EAB308]/30'
                            : 'bg-[#22C55E]/20 text-[#86EFAC] border border-[#22C55E]/30'
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. GERADOR INTELIGENTE DE COPY PARA SEU PRODUTO */}
          <div className="bg-gradient-to-r from-[#1E293B]/80 via-[#0F172A] to-[#1E1B4B]/80 border border-[#3B82F6]/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#60A5FA]">
                <Sparkles className="w-4 h-4 text-[#60A5FA]" />
                <h4 className="text-sm font-bold text-white">
                  Gerador Inteligente de Copy para Seu Produto
                </h4>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Digite o nome do seu produto e gere automaticamente headline, prós, contras,
                público-alvo e depoimentos em 1 clique.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateFullCopy}
              disabled={isGeneratingFullCopy}
              className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-5 py-3 rounded-xl text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer shrink-0 hover:scale-[1.02] disabled:opacity-50"
            >
              {isGeneratingFullCopy ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Gerando Copy Completa...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                  <span>Preencher Tudo Automaticamente</span>
                </>
              )}
            </button>
          </div>

          {/* 4. INFORMAÇÕES BÁSICAS DO PRODUTO */}
          <div className="bg-[#101010] border border-[#262626] rounded-2xl p-5 md:p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Informações Básicas do Produto
              </h3>
              <p className="text-xs text-[#8E8E8E] mt-0.5">
                Defina os dados principais do produto e os valores promocionais.
              </p>
            </div>

            {/* Row: Product Name & Affiliate URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                    NOME DO PRODUTO *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateFullCopy}
                    disabled={isGeneratingFullCopy}
                    className="text-[10px] bg-[#3B82F6]/15 hover:bg-[#3B82F6]/30 text-[#60A5FA] border border-[#3B82F6]/40 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50 shadow-sm"
                    title="Gera Headline, SEO, 4 Fotos Verificadas, Gatilhos e Depoimentos para este produto"
                  >
                    {isGeneratingFullCopy ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-[#60A5FA]" />
                        <span>Gerando Copy & Fotos...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-[#F5C542]" />
                        <span>Gerar Copy deste Produto</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => handleProductNameChange(e.target.value)}
                  placeholder="Ex: Fone de Ouvido Bluetooth TWS Sem Fio Bateria de Longa Duração"
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                  LINK DE AFILIADO (URL DE DESTINO) *
                </label>
                <input
                  type="url"
                  value={formData.affiliateUrl}
                  onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                  placeholder="https://www.mercadolivre.com.br/..."
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            {/* Popular Niches Buttons */}
            <div className="space-y-2 pt-1">
              <span className="text-xs text-[#777] font-medium">Ou teste com nichos populares:</span>
              <div className="flex flex-wrap items-center gap-2">
                {POPULAR_NICHES.map((niche, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyNiche(niche)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-[#222] border border-[#2A2A2A] text-xs text-[#C0C0C0] hover:text-white transition-all cursor-pointer"
                  >
                    <span>{niche.icon}</span>
                    <span>{niche.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Row: Preço Original, Preço com Desconto, Plataforma */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                  PREÇO ORIGINAL (RISCO)
                </label>
                <input
                  type="text"
                  value={formData.oldPrice}
                  onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                  placeholder="Ex: 119.9"
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                  PREÇO COM DESCONTO (DESTAQUE) *
                </label>
                <input
                  type="text"
                  value={formData.currentPrice}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="Ex: 59.9"
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white font-bold text-[#22C55E] placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                  PLATAFORMA / LOJA *
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#3B82F6] cursor-pointer"
                >
                  <option value="Mercado Livre">Mercado Livre</option>
                  <option value="Shopee">Shopee</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Logzz">Logzz</option>
                  <option value="Monetizze">Monetizze</option>
                  <option value="Braip">Braip</option>
                  <option value="Hotmart">Hotmart</option>
                  <option value="Eduzz">Eduzz</option>
                  <option value="Kiwify">Kiwify</option>
                  <option value="Outra plataforma">Outra plataforma</option>
                </select>
              </div>
            </div>

            {/* Row: Headline & CTA Button Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                      HEADLINE / CHAMADA PRINCIPAL
                    </label>
                    <span className="text-[9px] bg-[#3B82F6]/20 text-[#60A5FA] font-bold px-1.5 py-0.5 rounded">
                      AUTO-GERADA
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGenerateHeadline('sincero')}
                    className="text-[10px] text-[#A1A1A1] hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Gerar Outra Opção</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.headline || ''}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="Review Sincero: Fone de Ouvido Bluetooth TWS..."
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                  TEXTO DO BOTÃO DE COMPRA (CTA)
                </label>
                <input
                  type="text"
                  value={formData.ctaButtonText || ''}
                  onChange={(e) => setFormData({ ...formData, ctaButtonText: e.target.value })}
                  placeholder="QUERO A MINHA POR R$ 59.9 →"
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white font-semibold placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                />
                <p className="text-[10px] text-[#777]">
                  Atualiza automaticamente quando você digita o Preço com Desconto.
                </p>
              </div>
            </div>

            {/* Headline formulas selector pills (Image 1: Coloque Mais Modelos) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#999] font-medium flex items-center gap-1.5">
                  <span>💡</span>
                  <span>Fórmulas de Headline de Alta Conversão (Clique para aplicar):</span>
                </span>
                <span className="text-[10px] text-[#3B82F6] font-semibold">
                  10 Modelos Disponíveis
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {HEADLINE_FORMULAS.map((formula) => {
                  const isSelected = selectedHeadlineFormula === formula.id;
                  return (
                    <button
                      key={formula.id}
                      type="button"
                      onClick={() => handleGenerateHeadline(formula.id)}
                      className={`flex flex-col items-start gap-1 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1E293B] border-[#3B82F6] ring-1 ring-[#3B82F6]/50 shadow-md'
                          : 'bg-[#121212] hover:bg-[#1A1A1A] border-[#262626] hover:border-[#383838]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${formula.color}`}>
                          {formula.badge}
                        </span>
                        {isSelected && <span className="text-[10px] text-[#38BDF8]">✓</span>}
                      </div>
                      <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-[#D1D5DB]'}`}>
                        {formula.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slug URL & Encurtar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                  SLUG DA URL PÚBLICA
                </label>
                <button
                  type="button"
                  onClick={handleShortenSlug}
                  className="text-[10px] text-[#F5C542] hover:text-[#FFD95A] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3 h-3" />
                  <span>Encurtar URL</span>
                </button>
              </div>

              <div className="flex items-center gap-2 bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-2.5">
                <span className="text-xs text-[#777] font-mono shrink-0">/review/</span>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="creatina-100-pura"
                  className="w-full bg-transparent text-xs text-white placeholder-[#555] focus:outline-none font-mono"
                />
              </div>
              <p className="text-[11px] text-[#60A5FA] font-mono break-all">
                Link final:{' '}
                <span className="text-[#93C5FD] underline">{previewUrl}</span>
              </p>
            </div>
          </div>

          {/* 5. REDES SOCIAIS & COMUNIDADE (WIDGET ME SIGA) */}
          <div className="bg-[#101010] border border-[#262626] rounded-2xl p-5 md:p-6 space-y-5">
            <div className="flex items-center gap-2.5 text-[#22C55E]">
              <MessageCircle className="w-4 h-4 text-[#22C55E]" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Redes Sociais & Comunidade (Widget "Me Siga")
              </h3>
            </div>
            <p className="text-xs text-[#8E8E8E]">
              Adicione seus perfis de redes sociais (WhatsApp, Instagram, Telegram, YouTube,
              TikTok) para exibi-los em um widget elegante na página de review.
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                  LINK DO GRUPO / CANAL DO WHATSAPP
                </label>
                <input
                  type="url"
                  value={formData.socialCommunity?.whatsappGroupUrl || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialCommunity: {
                        ...formData.socialCommunity,
                        whatsappGroupUrl: e.target.value
                      }
                    })
                  }
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#22C55E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                  TEXTO DO BANNER VIP DO WHATSAPP
                </label>
                <input
                  type="text"
                  value={formData.socialCommunity?.whatsappVipText || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialCommunity: {
                        ...formData.socialCommunity,
                        whatsappVipText: e.target.value
                      }
                    })
                  }
                  placeholder="Entre no nosso Canal VIP do WhatsApp para receber promoções em primeira mão!"
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#22C55E]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                    INSTAGRAM (URL DO PERFIL)
                  </label>
                  <input
                    type="url"
                    value={formData.socialCommunity?.instagramUrl || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialCommunity: {
                          ...formData.socialCommunity,
                          instagramUrl: e.target.value
                        }
                      })
                    }
                    placeholder="https://instagram.com/seuusuario"
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                    TELEGRAM (CANAL / GRUPO)
                  </label>
                  <input
                    type="url"
                    value={formData.socialCommunity?.telegramUrl || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialCommunity: {
                          ...formData.socialCommunity,
                          telegramUrl: e.target.value
                        }
                      })
                    }
                    placeholder="https://t.me/seucanal"
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                    YOUTUBE (CANAL)
                  </label>
                  <input
                    type="url"
                    value={formData.socialCommunity?.youtubeUrl || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialCommunity: {
                          ...formData.socialCommunity,
                          youtubeUrl: e.target.value
                        }
                      })
                    }
                    placeholder="https://youtube.com/@seucanal"
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                    TIKTOK (PERFIL)
                  </label>
                  <input
                    type="url"
                    value={formData.socialCommunity?.tiktokUrl || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialCommunity: {
                          ...formData.socialCommunity,
                          tiktokUrl: e.target.value
                        }
                      })
                    }
                    placeholder="https://tiktok.com/@seuusuario"
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 6. OTIMIZAÇÃO PARA MOTORES DE BUSCA (SEO META TAGS) */}
          <div className="bg-[#101010] border border-[#262626] rounded-2xl p-5 md:p-6 space-y-5">
            <div className="flex items-center gap-2.5 text-[#3B82F6]">
              <Globe className="w-4 h-4 text-[#3B82F6]" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Otimização para Motores de Busca (SEO Meta Tags)
              </h3>
            </div>
            <p className="text-xs text-[#8E8E8E]">
              Configure o Título e a Descrição que aparecerão nos resultados do Google e redes
              sociais para maximizar seus acessos orgânicos.
            </p>

            <div className="space-y-4">
              {/* Meta Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                    SEO META TITLE (TÍTULO DA PÁGINA NO GOOGLE)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleGenerateTitles}
                      disabled={generatingTitles || !formData.productName}
                      className="text-[10px] font-bold text-[#3B82F6] hover:text-[#60A5FA] disabled:text-[#555] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {generatingTitles ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Gerando títulos...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-[#F5C542]" />
                          <span>Gerar títulos com IA</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-[#8E8E8E] font-mono">
                      {formData.seoSettings?.metaTitle?.length || 0}/60 caracteres
                    </span>
                  </div>
                </div>
                {suggestedTitles.length > 0 && (
                  <div className="mt-2 space-y-2 bg-[#1E293B]/80 border border-[#334155] p-3 rounded-xl">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                        ✨ Sugestões de Título (Clique para usar):
                      </p>
                      <span className="text-[9px] text-[#60A5FA]">Pronto para Rankear</span>
                    </div>
                    {suggestedTitles.map((title, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            seoSettings: {
                              metaTitle: title,
                              metaDescription: prev.seoSettings?.metaDescription || ''
                            }
                          }));
                          setActionToast({ message: `Título SEO selecionado: "${title.slice(0, 45)}..."`, type: 'success' });
                        }}
                        className="block w-full text-left text-xs text-white p-2 hover:bg-[#334155] rounded-lg transition-colors border border-transparent hover:border-[#38BDF8]/40"
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  value={formData.seoSettings?.metaTitle || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seoSettings: {
                        metaTitle: e.target.value,
                        metaDescription: formData.seoSettings?.metaDescription || ''
                      }
                    })
                  }
                  placeholder="Fone de Ouvido Bluetooth TWS Sem Fio Bateria de Longa Duração - Review Sincero e Vale a Pena? (Análise 2026)"
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                    SEO META DESCRIPTION (DESCRIÇÃO DO GOOGLE)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleGenerateSeoDescription}
                      disabled={isGeneratingSeoDesc || !formData.productName}
                      className="text-[10px] font-bold text-[#3B82F6] hover:text-[#60A5FA] disabled:text-[#555] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {isGeneratingSeoDesc ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Gerando descrição...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-[#F5C542]" />
                          <span>Gerar descrição com IA</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-[#8E8E8E] font-mono">
                      {formData.seoSettings?.metaDescription?.length || 0}/160 caracteres
                    </span>
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={formData.seoSettings?.metaDescription || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seoSettings: {
                        metaTitle: formData.seoSettings?.metaTitle || '',
                        metaDescription: e.target.value
                      }
                    })
                  }
                  placeholder="Descubra se Fone de Ouvido Bluetooth TWS Sem Fio Bateria de Longa Duração é bom, vale a pena e confira prós, contras, veredito e onde comprar com o melhor preço e garantia."
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6] resize-none"
                />
              </div>

              {/* SERP PREVIEW (MATCHING SCREENSHOT GOOGLE CARD) */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-[#A1A1A1] uppercase tracking-wider block">
                  PRÉ-VISUALIZAÇÃO NO GOOGLE (SERP PREVIEW):
                </span>

                <div className="bg-[#0A0E17] border border-[#1E293B] rounded-xl p-4 space-y-1.5 font-sans">
                  <div className="text-xs text-[#22C55E] font-mono break-all">
                    https://links-ofertas.vercel.app/review/{currentSlug}
                  </div>
                  <h4 className="text-sm md:text-base font-medium text-[#60A5FA] hover:underline cursor-pointer">
                    {formData.seoSettings?.metaTitle ||
                      `${formData.productName} - Review Sincero e Vale a Pena? (Análise 2026)`}
                  </h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                    {formData.seoSettings?.metaDescription ||
                      `Descubra se ${formData.productName} é bom, vale a pena e confira prós, contras, veredito e onde comprar com o melhor preço e garantia.`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 7. EXPORTAR PARA IA BUILDERS (LOVABLE & GOOGLE AI STUDIO) */}
          <div className="bg-gradient-to-r from-[#1E1035] via-[#0D111A] to-[#0B1A3A] border border-[#7C3AED]/30 rounded-2xl p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base">🚀</span>
                <h4 className="text-sm font-bold text-white">
                  Criar Página no Lovable ou Google AI Studio com 1 Clique
                </h4>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Gere o PRD completo (Página de Review + Quiz Interativo do produto) e abra o Lovable ou Google AI Studio em 1 clique.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenLovable}
                className="flex items-center gap-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold px-3.5 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>🚀 Lovable</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </button>

              <button
                type="button"
                onClick={handleOpenGoogleAIStudio}
                className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-3.5 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>✨ Google Studio IA</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </button>

              <button
                type="button"
                onClick={() => setShowAiPromptModal(true)}
                className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#334155] text-[#D4D4D4] hover:text-white border border-[#334155] font-semibold px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F5C542]" />
                <span>Ver Prompt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: GALERIA DE FOTOS
         ========================================================================= */}
      {step === 2 && (
        <div className="bg-[#101010] border border-[#262626] rounded-2xl p-6 space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#22C55E]" />
                <span>Galeria de Fotos Reais do Produto</span>
              </h3>
              <p className="text-xs text-[#8E8E8E] mt-1">
                Garantimos que as imagens sejam 100% fiéis ao produto anunciado ({formData.productName || 'Produto'}).
              </p>
            </div>

            {/* Smart Auto-Match Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyAllVerifiedImages}
                className="flex items-center gap-1.5 bg-[#22C55E]/15 hover:bg-[#22C55E]/25 text-[#22C55E] border border-[#22C55E]/40 font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-md"
                title="Aplica as 4 fotos verificadas direto na galeria e capa"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Aplicar Todas as 4 Fotos</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const match = matchProductImage(formData.productName, formData.category);
                  const four = match.gallery.slice(0, 4);
                  setFormData({
                    ...formData,
                    mainImage: four[0] || match.mainImage,
                    images: four
                  });
                  setActionToast({ message: 'Fotos sincronizadas com o produto com sucesso!', type: 'success' });
                }}
                className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#334155] text-white border border-[#334155] font-semibold px-3 py-2 rounded-xl text-xs transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sincronizar</span>
              </button>
            </div>
          </div>

          {/* SUGGESTED VERIFIED IMAGES FOR THIS PRODUCT (IMAGE 6 FIX) */}
          {(() => {
            const match = matchProductImage(formData.productName, formData.category);
            const suggestions = match.gallery.slice(0, 4);
            const labels = ['Foto 1 (Capa)', 'Foto 2 (Ângulo)', 'Foto 3 (Detalhes)', 'Foto 4 (Embalagem/Uso)'];

            return (
              <div className="p-4 md:p-5 rounded-2xl bg-[#0D0D0D] border border-[#262626] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                      <span>Fotos Verificadas (4 Imagens Autênticas):</span>
                    </span>
                    <span className="text-[10px] bg-[#22C55E]/15 text-[#22C55E] font-bold px-2 py-0.5 rounded-full">
                      Alta Resolução
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyAllVerifiedImages}
                    className="text-[11px] font-bold text-[#22C55E] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <span>⚡ Aplicar as 4 Fotos com 1 Clique</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {suggestions.map((sug, sIdx) => {
                    const isCurrentMain = formData.mainImage === sug;
                    const isInGallery = (formData.images || []).includes(sug);

                    return (
                      <div
                        key={sIdx}
                        onClick={() => {
                          const updated = [...(formData.images || [])];
                          if (updated.length < 4) {
                            while (updated.length < 4) updated.push('');
                          }
                          updated[sIdx] = sug;
                          setFormData({
                            ...formData,
                            mainImage: sIdx === 0 ? sug : formData.mainImage,
                            images: updated
                          });
                          setActionToast({
                            message: `Foto #${sIdx + 1} aplicada à galeria!`,
                            type: 'success'
                          });
                        }}
                        className={`group relative rounded-xl overflow-hidden aspect-square border-2 cursor-pointer transition-all ${
                          isCurrentMain
                            ? 'border-[#22C55E] ring-2 ring-[#22C55E]/40 shadow-lg shadow-green-500/10'
                            : isInGallery
                            ? 'border-[#3B82F6] ring-1 ring-[#3B82F6]/30'
                            : 'border-[#262626] hover:border-[#3B82F6]'
                        }`}
                      >
                        <img
                          src={sug}
                          alt={labels[sIdx]}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold bg-black/70 text-[#C0C0C0] px-1.5 py-0.5 rounded backdrop-blur-sm">
                              {labels[sIdx]}
                            </span>
                            {isCurrentMain && (
                              <span className="bg-[#22C55E] text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                                ★ Capa
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData({
                                ...formData,
                                mainImage: sug,
                                images: [sug, ...formData.images.filter((img) => img !== sug)].slice(0, 4)
                              });
                              setActionToast({ message: 'Definida como Foto de Capa!', type: 'success' });
                            }}
                            className="text-[10px] font-bold bg-[#22C55E] text-black hover:bg-[#16A34A] py-1 px-2 rounded-md shadow text-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Definir como Capa
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#A1A1A1] uppercase tracking-wider">
                FOTO PRINCIPAL (CAPA / DESTAQUE) *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.mainImage}
                  onChange={(e) => {
                    const val = e.target.value;
                    const newImages = [...formData.images];
                    newImages[0] = val;
                    setFormData({
                      ...formData,
                      mainImage: val,
                      images: newImages
                    });
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#A1A1A1] uppercase tracking-wider block">
                  FOTOS DA GALERIA (SLOTS 1 A 4)
                </label>
                <button
                  type="button"
                  onClick={handleApplyAllVerifiedImages}
                  className="text-[10px] text-[#22C55E] hover:underline font-bold cursor-pointer"
                >
                  Preencher com as 4 Fotos Verificadas
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((idx) => {
                  const img = formData.images[idx] || (idx === 0 ? formData.mainImage : '');
                  const slotNames = ['Capa Principal', 'Ângulo 2', 'Detalhes / Prática', 'Embalagem / Uso'];
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="aspect-square bg-[#080808] border border-[#262626] rounded-xl overflow-hidden relative group flex items-center justify-center">
                        {img && img.trim() ? (
                          <img
                            src={img.trim()}
                            alt={`Foto ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const fallback = matchProductImage(formData.productName, formData.category).gallery[idx] || matchProductImage(formData.productName, formData.category).mainImage;
                              (e.target as HTMLImageElement).src = fallback;
                            }}
                          />
                        ) : (
                          <span className="text-xs text-[#555] font-medium">+ {slotNames[idx]}</span>
                        )}
                        <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-black/70 text-white px-1.5 py-0.5 rounded">
                          #{idx + 1} {slotNames[idx]}
                        </span>
                      </div>
                      <input
                        type="url"
                        value={img}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          while (newImages.length <= idx) newImages.push('');
                          newImages[idx] = e.target.value;
                          setFormData({
                            ...formData,
                            images: newImages,
                            mainImage: idx === 0 ? e.target.value : formData.mainImage
                          });
                        }}
                        placeholder={`URL Foto ${idx + 1}`}
                        className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-[#555]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 3: GATILHOS & URGÊNCIA (PÚBLICO, PRÓS/CONTRAS, VEREDITO & ESCASSEZ)
         ========================================================================= */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* BANNER: GERAÇÃO AUTOMÁTICA DE GATILHOS */}
          <div className="bg-[#0D111A] border border-[#2563EB]/40 rounded-2xl p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-[#1E3A8A]/50 border border-[#3B82F6]/50 text-[#60A5FA] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                  <Sparkles className="w-3 h-3 text-[#60A5FA]" />
                  <span>Geração Automática de Gatilhos</span>
                </span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-white">
                Gerar Argumentos de Venda para: <span className="text-[#38BDF8]">{formData.productName || 'Seu Produto'}</span>
              </h3>
              <p className="text-xs text-[#94A3B8] max-w-2xl leading-relaxed">
                Não precisa digitar nada manual! Clique no botão ao lado para preencher automaticamente o <strong className="text-white font-medium">Público-Alvo</strong>, <strong className="text-white font-medium">Frase de Corte</strong>, <strong className="text-white font-medium">Prós</strong>, <strong className="text-white font-medium">Contras</strong> e <strong className="text-white font-medium">Veredito</strong> adaptados para este produto.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAutoGenerateGatilhos}
              disabled={isGeneratingGatilhos}
              className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold px-5 py-3 rounded-xl text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer shrink-0 hover:scale-[1.02] disabled:opacity-60"
            >
              {isGeneratingGatilhos ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Gerando Gatilhos...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#F5C542]" />
                  <span>🪄 Gerar Gatilhos com 1 Clique</span>
                </>
              )}
            </button>
          </div>

          {/* 3 CONFIG / METRIC CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CARD 1: UNIDADES RESTANTES */}
            <div className="bg-[#0D111A] border border-[#EAB308]/30 rounded-2xl p-4 md:p-5 space-y-3">
              <label className="text-xs font-bold text-[#EAB308] flex items-center gap-1.5">
                <span>⚠️</span>
                <span>Unidades Restantes (Barra de Estoque)</span>
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={formData.urgencySettings?.stockRemaining ?? 3}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    urgencySettings: {
                      ...formData.urgencySettings!,
                      stockRemaining: parseInt(e.target.value, 10) || 1
                    }
                  })
                }
                className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#EAB308]"
              />
              <p className="text-[11px] text-[#94A3B8]">
                Exibirá: <span className="text-[#EAB308] font-medium">Restam apenas {formData.urgencySettings?.stockRemaining ?? 3} unidades neste preço</span> com barra de progresso.
              </p>
            </div>

            {/* CARD 2: NOTA DO ESPECIALISTA & NOME */}
            <div className="bg-[#0D111A] border border-[#3B82F6]/30 rounded-2xl p-4 md:p-5 space-y-3">
              <label className="text-xs font-bold text-[#60A5FA] flex items-center gap-1.5">
                <span>🎖️</span>
                <span>Nota do Especialista & Nome</span>
              </label>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={formData.overallScore || 9.2}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        overallScore: parseFloat(e.target.value) || 9.0
                      })
                    }
                    className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl px-3 py-2.5 text-sm font-bold text-[#60A5FA] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div className="col-span-8">
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        author: e.target.value
                      })
                    }
                    placeholder="Nome do avaliador"
                    className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Selo com nota visual no review, veredito e assinatura.
              </p>
            </div>

            {/* CARD 3: GARANTIA & AVALIAÇÕES */}
            <div className="bg-[#0D111A] border border-[#22C55E]/30 rounded-2xl p-4 md:p-5 space-y-3">
              <label className="text-xs font-bold text-[#22C55E] flex items-center gap-1.5">
                <span>🛡️</span>
                <span>Garantia & Avaliações</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-[#94A3B8] mb-1 font-semibold">Garantia (dias)</div>
                  <input
                    type="number"
                    min="1"
                    value={formData.guaranteeDays ?? 30}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guaranteeDays: parseInt(e.target.value, 10) || 7
                      })
                    }
                    className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#22C55E]"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-[#94A3B8] mb-1 font-semibold">Qtd Avaliações</div>
                  <input
                    type="number"
                    min="1"
                    value={formData.verifiedReviewsCount ?? 2184}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        verifiedReviewsCount: parseInt(e.target.value, 10) || 100
                      })
                    }
                    className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#22C55E]"
                  />
                </div>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Exibe selo de garantia de {formData.guaranteeDays ?? 30} dias e nota baseada em {formData.verifiedReviewsCount ?? 2184} opiniões.
              </p>
            </div>
          </div>

          {/* CARD: PÚBLICO-ALVO & ANTI-PERSONA */}
          <div className="bg-[#0D111A] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#38BDF8]" />
                  <span>"Pra quem esse produto realmente faz sentido"</span>
                </h4>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Pontos que definem o comprador ideal (com checks de identificação).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoGenerateAudience}
                  className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#334155] text-white border border-[#334155] font-semibold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>✨ Auto-Gerar Público</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddNewAudienceItem}
                  className="flex items-center gap-1 bg-[#1E293B] hover:bg-[#334155] text-white border border-[#334155] font-semibold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Item</span>
                </button>
              </div>
            </div>

            {/* AUDIENCE LIST */}
            <div className="space-y-2.5">
              {formData.audience.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#07090F] border border-[#1E293B] rounded-xl px-3.5 py-2.5 flex items-center gap-3"
                >
                  <Check className="w-4 h-4 text-[#38BDF8] shrink-0 stroke-[2.5]" />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUpdateAudienceItem(idx, e.target.value)}
                    className="flex-1 bg-transparent text-xs md:text-sm text-[#E2E8F0] focus:outline-none"
                    placeholder="Critério de identificação do comprador..."
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteAudienceItem(idx)}
                    className="text-[#94A3B8] hover:text-[#EF4444] p-1 transition-colors cursor-pointer"
                    title="Excluir item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* ANTI-PERSONA SECTION */}
            <div className="pt-3 border-t border-[#1E293B] space-y-2">
              <label className="text-[10px] font-bold text-[#A1A1A1] uppercase tracking-wider block">
                FRASE SINCERA DE CORTE (ANTI-PERSONA)
              </label>
              <input
                type="text"
                value={formData.antiPersonaPhrase || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    antiPersonaPhrase: e.target.value
                  })
                }
                placeholder="Ex: Se você só fica sentado 1h por dia, sinceramente, não precisa. Compra uma de R$ 200 e tá ótimo."
                className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>

          {/* TWO COLUMNS: PRÓS & CONTRAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* COL 1: PRÓS */}
            <div className="bg-[#0D111A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs md:text-sm font-bold text-[#22C55E] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ O que me surpreendeu (Pontos Fortes)</span>
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoGeneratePros}
                    className="text-[11px] font-bold text-[#22C55E] bg-[#22C55E]/10 hover:bg-[#22C55E]/25 border border-[#22C55E]/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    title="Gera 4 a 6 pontos fortes sinceros para o produto"
                  >
                    <Sparkles className="w-3 h-3 text-[#22C55E]" />
                    <span>Auto-Gerar Prós</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNewPro}
                    className="text-xs font-bold text-[#22C55E] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Adicionar</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {formData.pros.map((pro, idx) => (
                  <div
                    key={idx}
                    className="bg-[#07090F] border border-[#1E293B] rounded-xl px-3.5 py-2.5 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={pro}
                      onChange={(e) => handleUpdatePro(idx, e.target.value)}
                      className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                      placeholder="Ponto forte do produto..."
                    />
                    <button
                      type="button"
                      onClick={() => handleDeletePro(idx)}
                      className="text-[#94A3B8] hover:text-[#EF4444] p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* COL 2: CONTRAS */}
            <div className="bg-[#0D111A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs md:text-sm font-bold text-[#EF4444] flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>× O que poderia melhorar (Pontos de Atenção)</span>
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoGenerateCons}
                    className="text-[11px] font-bold text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/25 border border-[#EF4444]/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    title="Gera pontos de atenção sinceros que trazem credibilidade"
                  >
                    <Sparkles className="w-3 h-3 text-[#EF4444]" />
                    <span>Auto-Gerar Contras</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNewCon}
                    className="text-xs font-bold text-[#EF4444] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Adicionar</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {formData.cons.map((con, idx) => (
                  <div
                    key={idx}
                    className="bg-[#07090F] border border-[#1E293B] rounded-xl px-3.5 py-2.5 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={con}
                      onChange={(e) => handleUpdateCon(idx, e.target.value)}
                      className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                      placeholder="Ponto de atenção ou limitação..."
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteCon(idx)}
                      className="text-[#94A3B8] hover:text-[#EF4444] p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CARD: TEXTO DO VEREDITO DO ESPECIALISTA */}
          <div className="bg-[#0D111A] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white block">
                Texto do Veredito do Especialista
              </label>
              <button
                type="button"
                onClick={handleAutoGenerateVerdict}
                className="text-[11px] font-bold text-[#60A5FA] bg-[#3B82F6]/10 hover:bg-[#3B82F6]/25 border border-[#3B82F6]/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                title="Gera um veredito equilibrado de especialista aprovando a compra"
              >
                <Sparkles className="w-3 h-3 text-[#38BDF8]" />
                <span>Auto-Gerar Veredito</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={formData.verdict || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  verdict: e.target.value
                })
              }
              placeholder="Ex: Pelo preço promocional, é sem dúvidas um dos melhores investimentos da categoria..."
              className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl p-4 text-xs md:text-sm text-[#E2E8F0] placeholder-[#555] focus:outline-none focus:border-[#3B82F6] resize-none leading-relaxed"
            />
          </div>

          {/* PROMPT GENERATOR FOR LOVABLE, GOOGLE AI STUDIO & CLAUDE */}
          <div className="bg-[#0D111A] border border-[#2563EB]/40 rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#60A5FA] bg-[#1E3A8A]/60 border border-[#3B82F6]/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#38BDF8]" />
                    <span>Exportar com 1 Clique para IAs Construtoras</span>
                  </span>
                </div>
                <h4 className="text-sm md:text-base font-bold text-white">
                  Criar Página no Lovable ou Google AI Studio
                </h4>
                <p className="text-xs text-[#94A3B8] max-w-xl leading-relaxed">
                  Ao clicar, o prompt completo de alta conversão é <strong className="text-white">copiado automaticamente</strong> para sua área de transferência e a plataforma é aberta pronta para você colar e criar a página em segundos!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {/* LOVABLE BUTTON */}
                <button
                  type="button"
                  onClick={handleOpenLovable}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#C026D3] hover:from-[#6D28D9] hover:to-[#A21CAF] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-purple-500/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <span className="text-sm">🚀</span>
                  <span>Abrir no Lovable</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>

                {/* GOOGLE AI STUDIO BUTTON */}
                <button
                  type="button"
                  onClick={handleOpenGoogleAIStudio}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#1E40AF] via-[#2563EB] to-[#38BDF8] hover:from-[#1D4ED8] hover:to-[#0284C7] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-blue-500/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <span className="text-sm">✨</span>
                  <span>Abrir no Google AI Studio</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>

                {/* VER TODAS AS OPÇÕES */}
                <button
                  type="button"
                  onClick={() => setShowAiPromptModal(true)}
                  className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#334155] text-[#E2E8F0] hover:text-white border border-[#334155] font-semibold px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#F5C542]" />
                  <span>Outras IAs / Ver Prompt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 4: AVALIAÇÕES (DEPOIMENTOS & FOTOS REAIS DE COMPRADORES)
         ========================================================================= */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* HEADER CARD */}
          <div className="bg-[#0D111A] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Depoimentos & Fotos Reais de Compradores
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Adicione fotos de clientes. Ao colar o link da foto, o depoimento e nome são
                  gerados automaticamente!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Colar Fotos em Lote */}
                <button
                  type="button"
                  onClick={() => setShowBatchPhotosModal(true)}
                  className="flex items-center gap-2 bg-[#1E293B] hover:bg-[#334155] text-white border border-[#334155] font-semibold px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <Upload className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>Colar Fotos em Lote</span>
                </button>

                {/* Auto-Gerar Todos */}
                <button
                  type="button"
                  onClick={handleAutoGenerateAllTestimonials}
                  className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#334155] text-white border border-[#334155] font-semibold px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F5C542]" />
                  <span>Auto-Gerar Todos ({formData.testimonials.length})</span>
                </button>

                {/* Novo Depoimento */}
                <button
                  type="button"
                  onClick={handleAddNewTestimonial}
                  className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Depoimento</span>
                </button>
              </div>
            </div>
          </div>

          {/* LISTA DE DEPOIMENTOS EM CARDS ESTRUTURADOS */}
          <div className="space-y-4">
            {formData.testimonials.map((t, idx) => {
              const hasPhoto = Boolean(t.photo && t.photo.trim().length > 0);
              return (
                <div
                  key={t.id || idx}
                  className="bg-[#0D111A] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-4 transition-colors"
                >
                  {/* Card Header Row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="bg-[#1E293B] border border-[#3B82F6]/50 text-[#60A5FA] font-bold text-xs px-2.5 py-1 rounded-lg">
                        Avaliação #{idx + 1}
                      </span>
                      {hasPhoto && (
                        <span className="text-[#22C55E] text-xs font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Foto anexada</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleGenerateSingleTestimonialText(idx)}
                        className="flex items-center gap-1.5 text-[#60A5FA] hover:text-white text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#60A5FA]" />
                        <span>Gerar Texto IA</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTestimonial(idx)}
                        className="text-[#EF4444] hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Excluir Avaliação"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Inputs Grid: Nome, Nota, Foto */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Nome */}
                    <div className="md:col-span-3 space-y-1.5">
                      <label className="text-[10px] font-bold text-[#A1A1A1] uppercase tracking-wider block">
                        NOME
                      </label>
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => updateTestimonial(idx, { name: e.target.value })}
                        placeholder="Ex: Marcos R."
                        className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6] transition-colors"
                      />
                    </div>

                    {/* Nota */}
                    <div className="md:col-span-3 space-y-1.5">
                      <label className="text-[10px] font-bold text-[#A1A1A1] uppercase tracking-wider block">
                        NOTA (1 A 5)
                      </label>
                      <select
                        value={t.rating || 5}
                        onChange={(e) => updateTestimonial(idx, { rating: Number(e.target.value) })}
                        className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl px-4 py-3 text-xs md:text-sm font-bold text-[#F5C542] focus:outline-none focus:border-[#3B82F6] transition-colors cursor-pointer"
                      >
                        <option value={5} className="bg-[#0D111A] text-[#F5C542]">
                          ★★★★★ (5 Estrelas)
                        </option>
                        <option value={4} className="bg-[#0D111A] text-[#F5C542]">
                          ★★★★☆ (4 Estrelas)
                        </option>
                        <option value={3} className="bg-[#0D111A] text-[#F5C542]">
                          ★★★☆☆ (3 Estrelas)
                        </option>
                        <option value={2} className="bg-[#0D111A] text-[#F5C542]">
                          ★★☆☆☆ (2 Estrelas)
                        </option>
                        <option value={1} className="bg-[#0D111A] text-[#F5C542]">
                          ★☆☆☆☆ (1 Estrela)
                        </option>
                      </select>
                    </div>

                    {/* Foto Link com Preview */}
                    <div className="md:col-span-6 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-[#A1A1A1] uppercase tracking-wider">
                          FOTO REAL DO PRODUTO (LINK)
                        </span>
                        <span className="text-[#38BDF8] font-medium">Auto-preenche ao colar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={t.photo || ''}
                          onChange={(e) => handlePhotoUrlChange(idx, e.target.value)}
                          placeholder="https://... Cole o link da foto do produto"
                          className="flex-1 bg-[#07090F] border border-[#1E293B] rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6] transition-colors truncate"
                        />
                        <div className="w-11 h-11 rounded-xl bg-[#07090F] border border-[#1E293B] overflow-hidden flex items-center justify-center shrink-0">
                          {t.photo && t.photo.trim() ? (
                            <img
                              src={t.photo.trim()}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-[#475569]" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Textarea: Texto do Depoimento */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-[#A1A1A1] uppercase tracking-wider">
                        TEXTO DO DEPOIMENTO SINCERO
                      </span>
                      <span className="text-[#94A3B8] font-medium">
                        {t.text?.length || 0} caracteres
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={t.text}
                      onChange={(e) => updateTestimonial(idx, { text: e.target.value })}
                      placeholder="Depoimento sincero relatando a experiência real de compra..."
                      className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl p-4 text-xs md:text-sm text-[#E2E8F0] placeholder-[#555] focus:outline-none focus:border-[#3B82F6] resize-none leading-relaxed transition-colors"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* EXPORTAR PARA IA BUILDERS (LOVABLE & GOOGLE AI STUDIO) */}
          <div className="bg-gradient-to-r from-[#1E1035] via-[#0D111A] to-[#0B1A3A] border border-[#7C3AED]/30 rounded-2xl p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base">🚀</span>
                <h4 className="text-sm font-bold text-white">
                  Criar Página no Lovable ou Google AI Studio com 1 Clique
                </h4>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Copie o prompt com todos os depoimentos e dados estruturados e abra o Lovable ou Google AI Studio diretamente.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenLovable}
                className="flex items-center gap-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold px-3.5 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>🚀 Lovable</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </button>

              <button
                type="button"
                onClick={handleOpenGoogleAIStudio}
                className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-3.5 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>✨ Google Studio IA</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </button>

              <button
                type="button"
                onClick={() => setShowAiPromptModal(true)}
                className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#334155] text-[#D4D4D4] hover:text-white border border-[#334155] font-semibold px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F5C542]" />
                <span>Ver Prompt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 5: DÚVIDAS / FAQ (MATCHING USER SCREENSHOT EXACTLY)
         ========================================================================= */}
      {step === 5 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* HEADER CARD */}
          <div className="bg-[#0D111A] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 text-[#38BDF8]">
                  <div className="w-7 h-7 rounded-xl bg-[#0284C7]/15 border border-[#38BDF8]/30 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-[#38BDF8]" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Perguntas Frequentes & Quebra de Objeções (FAQ)
                  </h3>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed max-w-2xl">
                  Responda às dúvidas sinceras dos visitantes antes de clicarem no link de compra. Essa
                  seção é crucial para aumentar a confiança e a conversão.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {/* Auto-Gerar FAQs com IA */}
                <button
                  type="button"
                  onClick={() => {
                    const productName = formData.productName || 'o produto';
                    const aiGeneratedFaqs: FAQItem[] = [
                      {
                        id: 'faq-' + Date.now() + '-1',
                        question: `O ${productName} funciona mesmo ou é só marketing?`,
                        answer: `Funciona de verdade! O produto entrega exatamente o que promete em testes reais de uso diário, com materiais resistentes e performance consistente comprovada por centenas de clientes.`
                      },
                      {
                        id: 'faq-' + Date.now() + '-2',
                        question: 'Quanto tempo demora a entrega e o frete?',
                        answer: 'O envio é imediato via transportadora oficial. Para a maioria das capitais e regiões metropolitanas a entrega ocorre entre 2 a 6 dias úteis com código de rastreamento completo.'
                      },
                      {
                        id: 'faq-' + Date.now() + '-3',
                        question: 'O produto é 100% original com nota fiscal e garantia?',
                        answer: 'Sim! Comprando pelo link oficial indicado nesta página, você recebe o produto genuíno, lacrado de fábrica, com nota fiscal em seu nome e garantia total do fabricante.'
                      },
                      {
                        id: 'faq-' + Date.now() + '-4',
                        question: 'Se eu não gostar ou me arrepender, posso devolver?',
                        answer: 'Com certeza! Você tem garantia incondicional de 30 dias para testar no seu ritmo. Se por qualquer motivo não gostar, a devolução é 100% gratuita com reembolso integral.'
                      }
                    ];
                    setFormData({ ...formData, faq: aiGeneratedFaqs });
                  }}
                  className="flex items-center gap-2 bg-[#131B2E] hover:bg-[#1C2744] text-[#93C5FD] border border-[#3B82F6]/40 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F5C542]" />
                  <span>Auto-Gerar FAQs com IA</span>
                </button>

                {/* Adicionar Pergunta */}
                <button
                  type="button"
                  onClick={() => {
                    const newFaqItem: FAQItem = {
                      id: 'faq-' + Date.now(),
                      question: '',
                      answer: ''
                    };
                    setFormData({ ...formData, faq: [...formData.faq, newFaqItem] });
                  }}
                  className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Adicionar Pergunta</span>
                </button>
              </div>
            </div>

            {/* ATALHOS RÁPIDOS: ADICIONE OBJEÇÕES POPULARES EM 1 CLIQUE */}
            <div className="pt-2 border-t border-[#1E293B] space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs text-[#E2E8F0] font-bold">
                <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Atalhos Rápidos: Adicione objeções populares em 1 clique:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  {
                    icon: '📦',
                    label: 'Original & Nota Fiscal',
                    question: 'O produto é 100% original e acompanha nota fiscal?',
                    answer: 'Sim! Comprando pelo link oficial indicado nesta página, você recebe o produto genuíno, lacrado, com nota fiscal eletrônica e garantia de fábrica.'
                  },
                  {
                    icon: '🚚',
                    label: 'Prazo & Rastreamento',
                    question: 'Quanto tempo demora a entrega?',
                    answer: 'O envio é imediato via transportadora oficial. Para a maioria das capitais e regiões metropolitanas a entrega ocorre entre 2 a 6 dias úteis com código de rastreamento completo.'
                  },
                  {
                    icon: '🛡️',
                    label: 'Devolução & Garantia 30 Dias',
                    question: 'Se eu não gostar, posso devolver?',
                    answer: 'Com certeza! Você tem garantia incondicional de 30 dias para testar no seu ritmo. Se por qualquer motivo não gostar, a devolução é 100% gratuita.'
                  },
                  {
                    icon: '💳',
                    label: 'Parcelamento até 12x / Pix',
                    question: 'Quais são as formas de pagamento disponíveis?',
                    answer: 'Você pode pagar via Pix com desconto e aprovação imediata ou parcelar em até 12x no cartão de crédito em ambiente criptografado e seguro.'
                  },
                  {
                    icon: '🔧',
                    label: 'Facilidade de Uso & Suporte',
                    question: 'É fácil de usar / instalar? Tem suporte?',
                    answer: 'Muito simples e intuitivo! Acompanha manual passo a passo em português e suporte direto com a equipe oficial para qualquer dúvida técnica.'
                  }
                ].map((shortcut, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => {
                      const exists = formData.faq.some((f) => f.question === shortcut.question);
                      if (!exists) {
                        const newFaq: FAQItem = {
                          id: 'faq-' + Date.now() + '-' + sIdx,
                          question: shortcut.question,
                          answer: shortcut.answer
                        };
                        setFormData({ ...formData, faq: [...formData.faq, newFaq] });
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131B2A] hover:bg-[#1E293B] border border-[#24334A] text-xs text-[#E2E8F0] hover:text-white transition-all cursor-pointer hover:border-[#3B82F6]/60"
                  >
                    <span>{shortcut.icon}</span>
                    <span className="font-medium">{shortcut.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LISTA DE CARDS DE FAQ */}
          <div className="space-y-4">
            {formData.faq.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-[#0B0E17] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-4 shadow-sm"
              >
                {/* Item Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-xs md:text-sm font-bold text-white truncate">
                      {item.question || `Pergunta #${idx + 1}`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        faq: formData.faq.filter((_, i) => i !== idx)
                      });
                    }}
                    title="Excluir Pergunta"
                    className="text-[#EF4444] hover:bg-red-500/10 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Field 1: Pergunta */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#A1A1A1] uppercase tracking-wider block">
                    PERGUNTA / DÚVIDA DO COMPRADOR *
                  </label>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const updated = [...formData.faq];
                      updated[idx].question = e.target.value;
                      setFormData({ ...formData, faq: updated });
                    }}
                    placeholder="Ex: A massagem funciona mesmo ou é só marketing?"
                    className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl px-4 py-3 text-xs md:text-sm font-bold text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                {/* Field 2: Resposta */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                      RESPOSTA SINCERA E CONVINCENTE *
                    </label>
                    <span className="text-[10px] text-[#8E8E8E] font-mono">
                      {item.answer?.length || 0} caracteres
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={item.answer}
                    onChange={(e) => {
                      const updated = [...formData.faq];
                      updated[idx].answer = e.target.value;
                      setFormData({ ...formData, faq: updated });
                    }}
                    placeholder="Escreva uma resposta transparente, quebrando o medo do visitante e transmitindo segurança..."
                    className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl px-4 py-3 text-xs md:text-sm text-[#D4D4D4] placeholder-[#555] focus:outline-none focus:border-[#3B82F6] resize-none leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* DASHED BOTTOM BUTTON: + ADICIONAR MAIS UMA PERGUNTA FREQUENTE */}
          <button
            type="button"
            onClick={() => {
              const newFaqItem: FAQItem = {
                id: 'faq-' + Date.now(),
                question: '',
                answer: ''
              };
              setFormData({ ...formData, faq: [...formData.faq, newFaqItem] });
            }}
            className="w-full border-2 border-dashed border-[#1E293B] hover:border-[#3B82F6] bg-[#070A12]/50 hover:bg-[#0E1626]/60 text-[#CBD5E1] hover:text-white rounded-2xl py-4 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Adicionar Mais uma Pergunta Frequente</span>
          </button>

          {/* EXPORTAR PARA IA BUILDERS (LOVABLE & GOOGLE AI STUDIO) */}
          <div className="bg-gradient-to-r from-[#1E1035] via-[#0D111A] to-[#0B1A3A] border border-[#7C3AED]/30 rounded-2xl p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base">🚀</span>
                <h4 className="text-sm font-bold text-white">
                  Criar Página no Lovable ou Google AI Studio com 1 Clique
                </h4>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Copie o PRD completo com a Página de Review + Quiz Interativo baseado no produto e abra no Lovable ou Google AI Studio.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenLovable}
                className="flex items-center gap-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold px-3.5 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>🚀 Lovable</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </button>

              <button
                type="button"
                onClick={handleOpenGoogleAIStudio}
                className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-3.5 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>✨ Google Studio IA</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </button>

              <button
                type="button"
                onClick={() => setShowAiPromptModal(true)}
                className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#334155] text-[#D4D4D4] hover:text-white border border-[#334155] font-semibold px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F5C542]" />
                <span>Ver Prompt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          BOTTOM STICKY BAR FOR SAVE & ACTIONS
         ========================================================================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#1F1F1F] p-4 z-40 md:pl-72">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#2E2E2E] bg-[#141414] hover:bg-[#1E1E1E] text-xs font-semibold text-white transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Passo Anterior</span>
              </button>
            )}

            {step < 5 && (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-xs font-bold text-white border border-[#3B82F6]/50 transition-all cursor-pointer"
              >
                <span>Próximo Passo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-black font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-green-500/20 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>Salvar & Publicar Review</span>
            </button>
          </div>
        </div>
      </div>
    </>
    )}

      {/* =========================================================================
          BATCH PHOTOS MODAL (COLAR FOTOS EM LOTE)
         ========================================================================= */}
      {showBatchPhotosModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F1420] border border-[#1E293B] rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-[#38BDF8]">
                <div className="w-8 h-8 rounded-xl bg-[#0284C7]/20 border border-[#38BDF8]/40 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-[#38BDF8]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Colar Fotos em Lote</h3>
                  <p className="text-xs text-[#94A3B8]">
                    Cole uma URL de imagem por linha para preencher as avaliações
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBatchPhotosModal(false)}
                className="text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-[#1E293B] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#A1A1A1] uppercase tracking-wider block">
                LINKS DAS FOTOS (UMA POR LINHA)
              </label>
              <textarea
                rows={5}
                value={batchPhotosText}
                onChange={(e) => setBatchPhotosText(e.target.value)}
                placeholder="https://images.unsplash.com/photo-1580481077197-28564f51952f&#10;https://images.unsplash.com/photo-1505797149-43b0069ec26b&#10;https://images.unsplash.com/photo-1518640467707"
                className="w-full bg-[#07090F] border border-[#1E293B] rounded-xl p-3 text-xs font-mono text-white placeholder-[#555] focus:outline-none focus:border-[#3B82F6] resize-none"
              />
            </div>

            {/* Sugestões Rápidas de Fotos Reais de Unboxing */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#A1A1A1] uppercase tracking-wider block">
                OU ESCOLHA UM PACOTE PRÉ-CARREGADO DE FOTOS REAIS:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBatchPhotosText(
                      'https://images.unsplash.com/photo-1580481077197-28564f51952f?auto=format&fit=crop&w=400&q=80\nhttps://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=400&q=80\nhttps://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80\nhttps://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=400&q=80'
                    );
                  }}
                  className="p-2.5 rounded-xl bg-[#07090F] border border-[#1E293B] hover:border-[#3B82F6] text-left text-xs text-white transition-all cursor-pointer"
                >
                  <span className="font-bold block text-white">🪑 Casa & Escritório</span>
                  <span className="text-[10px] text-[#94A3B8]">4 fotos reais unboxing</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBatchPhotosText(
                      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80\nhttps://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80\nhttps://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80\nhttps://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=400&q=80'
                    );
                  }}
                  className="p-2.5 rounded-xl bg-[#07090F] border border-[#1E293B] hover:border-[#3B82F6] text-left text-xs text-white transition-all cursor-pointer"
                >
                  <span className="font-bold block text-white">🎧 Tech & Eletrônicos</span>
                  <span className="text-[10px] text-[#94A3B8]">4 fotos reais unboxing</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBatchPhotosModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[#1E293B] text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleBatchPhotosSubmit}
                className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Aplicar Fotos aos Depoimentos</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PROMPT IA BUILDER MODAL (LOVABLE, GOOGLE AI STUDIO, CLAUDE, CHATGPT)
         ========================================================================= */}
      {showAiPromptModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0F1420] border border-[#1E293B] rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    Exportar Prompt para IAs Construtoras
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    Gere sua página completa no Lovable, Google AI Studio, Claude ou ChatGPT
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiPromptModal(false)}
                className="text-[#64748B] hover:text-white p-2 rounded-xl hover:bg-[#1E293B] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction Banner */}
            <div className="bg-[#07090F] border border-[#1E293B] rounded-2xl p-4 flex items-start gap-3">
              <span className="text-lg">💡</span>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Ao clicar em qualquer botão abaixo, o <strong className="text-white">prompt completo de alta conversão é copiado automaticamente</strong> para a sua área de transferência e o site correspondente é aberto em uma nova aba. Se o campo não preencher sozinho, basta pressionar <strong className="text-[#38BDF8] font-mono">Ctrl+V</strong> (ou <strong className="text-[#38BDF8] font-mono">Cmd+V</strong> no Mac).
              </p>
            </div>

            {/* PRIMARY FEATURED PLATFORMS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LOVABLE CARD */}
              <div className="bg-gradient-to-br from-[#1E1035] via-[#140B24] to-[#0D111A] border border-[#7C3AED]/40 hover:border-[#7C3AED] rounded-2xl p-5 space-y-4 shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚀</span>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">Lovable.dev</h4>
                      <span className="text-[10px] text-[#C084FC] font-semibold">Web App & Landing Pages</span>
                    </div>
                  </div>
                  <span className="bg-[#7C3AED]/20 border border-[#7C3AED]/50 text-[#C084FC] text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Recomendado
                  </span>
                </div>

                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Abre o Lovable com o prompt injetado diretamente na criação de novos projetos React + Tailwind.
                </p>

                <button
                  type="button"
                  onClick={handleOpenLovable}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#C026D3] hover:from-[#6D28D9] hover:to-[#A21CAF] text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-lg shadow-purple-500/25 transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>🚀 Abrir e Colar no Lovable</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80 ml-1" />
                </button>
              </div>

              {/* GOOGLE AI STUDIO CARD */}
              <div className="bg-gradient-to-br from-[#0B1A3A] via-[#08132B] to-[#0D111A] border border-[#2563EB]/40 hover:border-[#3B82F6] rounded-2xl p-5 space-y-4 shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">Google AI Studio</h4>
                      <span className="text-[10px] text-[#60A5FA] font-semibold">Gemini Build / Studio IA</span>
                    </div>
                  </div>
                  <span className="bg-[#2563EB]/20 border border-[#3B82F6]/50 text-[#60A5FA] text-[10px] font-bold px-2 py-0.5 rounded-md">
                    100% Gratuito
                  </span>
                </div>

                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Abre o <strong>ai.studio/build</strong>. O prompt é copiado: basta colar (Ctrl+V) no campo <em>"Describe an app"</em>.
                </p>

                <button
                  type="button"
                  onClick={handleOpenGoogleAIStudio}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#1E40AF] via-[#2563EB] to-[#38BDF8] hover:from-[#1D4ED8] hover:to-[#0284C7] text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-lg shadow-blue-500/25 transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>✨ Abrir no Google AI Studio</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80 ml-1" />
                </button>
              </div>
            </div>

            {/* OTHER PLATFORMS ROW */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                OUTRAS PLATAFORMAS & CHATBOTS
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={handleOpenClaude}
                  className="flex items-center justify-center gap-2 bg-[#1E293B]/70 hover:bg-[#334155] border border-[#334155] text-white font-semibold py-2.5 px-3 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <span>🤖 Claude.ai</span>
                  <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                </button>

                <button
                  type="button"
                  onClick={handleOpenChatGPT}
                  className="flex items-center justify-center gap-2 bg-[#1E293B]/70 hover:bg-[#334155] border border-[#334155] text-white font-semibold py-2.5 px-3 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <span>💬 ChatGPT</span>
                  <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                </button>

                <button
                  type="button"
                  onClick={handleOpenV0}
                  className="flex items-center justify-center gap-2 bg-[#1E293B]/70 hover:bg-[#334155] border border-[#334155] text-white font-semibold py-2.5 px-3 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <span>▲ v0 by Vercel</span>
                  <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                </button>
              </div>
            </div>

            {/* PROMPT PREVIEW BOX */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  VISUALIZAR PROMPT COMPLETO GERADO
                </label>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="text-xs font-bold text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedPrompt && copiedTarget === 'manual' ? 'Copiado!' : 'Copiar Apenas o Texto'}</span>
                </button>
              </div>

              <div className="bg-[#07090F] border border-[#1E293B] rounded-2xl p-4 font-mono text-xs text-[#CBD5E1] whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed select-all">
                {generatedPrompt}
              </div>
            </div>

            {/* ---------------------------------
                EXPORTAÇÃO OPCIONAL (RECURSO SECUNDÁRIO)
                --------------------------------- */}
            <div className="pt-5 border-t border-[#1E293B] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📄</span>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      EXPORTAÇÃO OPCIONAL — HTML INDEPENDENTE
                    </h4>
                    <span className="text-[10px] text-gray-400">
                      Recurso secundário (executado exclusivamente no navegador/memória)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-[#1E293B] text-gray-300 px-2 py-0.5 rounded">
                  Opcional
                </span>
              </div>

              {/* Required Explanatory Notice */}
              <div className="p-3.5 rounded-2xl bg-[#080B12] border border-[#1E293B] text-xs text-[#94A3B8] leading-relaxed">
                <p className="italic font-medium text-gray-300">
                  "Use esta opção somente se quiser levar a página para uma hospedagem própria. O foco principal do Review Sincero continua sendo a geração do PRD/PROMPT para plataformas de IA."
                </p>
              </div>

              {/* Action Buttons: [ GERAR HTML ] [ COPIAR HTML ] [ BAIXAR HTML ] */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleGenerateHtml}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#2A374A] border border-[#334155] text-white text-xs font-bold transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <Code className="w-4 h-4 text-[#F5C542]" />
                  <span>GERAR HTML</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyHtml}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#2A374A] border border-[#334155] text-white text-xs font-bold transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <Copy className="w-4 h-4 text-blue-400" />
                  <span>{copiedHtml ? 'COPIADO COM SUCESSO!' : 'COPIAR HTML'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadHtml}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#2A374A] border border-[#334155] text-white text-xs font-bold transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>BAIXAR HTML</span>
                </button>
              </div>

              {/* Notice regarding Tailwind CDN */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                <span className="font-bold shrink-0">💡 Nota Técnica:</span>
                <span className="text-[11px] leading-relaxed text-amber-200/90">
                  O HTML gerado é totalmente autônomo, não exige login e não é salvo no banco. O estilo visual utiliza o CDN oficial do Tailwind CSS e fontes Google, requerendo conexão ativa com a internet para renderização completa.
                </span>
              </div>

              {/* Generated HTML Preview Box if Generated */}
              {generatedHtmlContent && (
                <div className="space-y-2 pt-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold text-[#F5C542] uppercase">
                      Código HTML Gerado (Memória Local):
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Zero registros no banco de dados
                    </span>
                  </div>
                  <pre className="p-3 bg-black/70 border border-[#1E293B] rounded-xl text-[10px] font-mono text-gray-300 max-h-36 overflow-y-auto leading-relaxed">
                    {generatedHtmlContent.slice(0, 1000)}...
                  </pre>
                </div>
              )}

              {/* Google Sites (Opção Complementar) */}
              <div className="p-3.5 rounded-2xl bg-[#090D18] border border-blue-900/30 text-xs text-gray-400 space-y-1.5">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Google Sites (Opção Complementar)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-gray-400">
                  Caso deseje utilizar no Google Sites, utilize o recurso de <em>"Incorporar Código"</em> (iframe/embed) e cole o HTML gerado. Note que o Google Sites possui limitações técnicas estruturais e renderiza o conteúdo encapsulado em iframe. O foco recomendado do Review Sincero continua sendo a geração de PRD/PROMPT para plataformas de IA.
                </p>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1E293B]">
              <button
                type="button"
                onClick={() => setShowAiPromptModal(false)}
                className="bg-[#1E293B] hover:bg-[#334155] text-[#E2E8F0] font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          FLOATING TOAST NOTIFICATION
         ========================================================================= */}
      {toastMessage && (
        <div className={`fixed bottom-24 right-6 z-50 max-w-md ${toastMessage.type === 'error' ? 'bg-[#180A0A] border-red-500/60 shadow-red-500/25' : 'bg-[#0F1420] border-[#3B82F6]/60 shadow-blue-500/25'} border rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-300`}>
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl ${toastMessage.type === 'error' ? 'bg-red-500/20 border-red-500/40' : 'bg-[#2563EB]/20 border-[#3B82F6]/40'} border flex items-center justify-center shrink-0 text-lg`}>
              {toastMessage.type === 'lovable' && '🚀'}
              {toastMessage.type === 'google-studio' && '✨'}
              {toastMessage.type === 'claude' && '🤖'}
              {toastMessage.type === 'chatgpt' && '💬'}
              {toastMessage.type === 'v0' && '▲'}
              {toastMessage.type === 'copy' && '📋'}
              {toastMessage.type === 'error' && '⚠️'}
            </div>
            <div className="space-y-1.5 flex-1">
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{toastMessage.title}</span>
                {toastMessage.type !== 'error' && <Check className="w-3.5 h-3.5 text-[#22C55E] stroke-[3]" />}
              </h5>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                {toastMessage.desc}
              </p>
              {toastMessage.action && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={toastMessage.action.onClick}
                    className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow transition-colors cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{toastMessage.action.label}</span>
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-[#64748B] hover:text-white p-1 rounded-md hover:bg-[#1E293B] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* FLOATING ACTION NOTIFICATION TOAST */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#0F172A] border border-[#3B82F6]/60 rounded-2xl p-4 shadow-2xl shadow-blue-500/20 flex items-center gap-3 text-white text-xs max-w-md">
            <div className="w-8 h-8 rounded-xl bg-[#2563EB]/20 border border-[#3B82F6]/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div className="flex-1 font-medium leading-tight">
              {actionToast.message}
            </div>
            <button
              type="button"
              onClick={() => setActionToast(null)}
              className="text-[#64748B] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          FULL REVIEW PREVIEW MODAL
         ========================================================================= */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto bg-[#080808] border border-[#2A2A2A] rounded-3xl overflow-hidden shadow-2xl">
            <div className="sticky top-0 z-50 bg-[#121212] border-b border-[#2A2A2A] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#22C55E]" />
                <span className="text-xs font-bold text-white">Visualização em Tempo Real</span>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-xs font-bold text-[#A1A1A1] hover:text-white bg-[#1A1A1A] border border-[#2A2A2A] px-3.5 py-1.5 rounded-xl"
              >
                Fechar Preview
              </button>
            </div>
            <ReviewRenderer review={formData} isPreview={true} />
          </div>
        </div>
      )}
    </div>
  );
};
