import React, { useState, useEffect } from 'react';
import { Review, AppSettings, TrendItem } from './types';
import { SAMPLE_REVIEWS, DEFAULT_SETTINGS } from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './components/Dashboard';
import { ReviewsList } from './components/ReviewsList';
import { TrendsView } from './components/TrendsView';
import { TemplatesView } from './components/TemplatesView';
import { SettingsView } from './components/SettingsView';
import { CreateReviewWizard } from './components/CreateReviewWizard';
import { ReviewRenderer } from './components/ReviewRenderer';
import { KeywordPlannerView } from './components/KeywordPlannerView';
import { TutorialView } from './components/TutorialView';
import { CompareProductsView } from './components/CompareProductsView';
import { TopProductsView } from './components/TopProductsView';
import { CommissionCalculatorModal } from './components/CommissionCalculatorModal';
import { X, ExternalLink, Download, ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);

  // LocalStorage state for reviews & settings
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('review_sincero_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_REVIEWS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('review_sincero_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  const [activeReviewForEdit, setActiveReviewForEdit] = useState<Review | null>(null);
  const [activeReviewForView, setActiveReviewForView] = useState<Review | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('review_sincero_items', JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('review_sincero_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  const handleSaveReview = (review: Review) => {
    const exists = reviews.some((r) => r.id === review.id);
    if (exists) {
      setReviews(reviews.map((r) => (r.id === review.id ? { ...review, updatedAt: new Date().toISOString() } : r)));
    } else {
      setReviews([review, ...reviews]);
    }
    setCurrentView('reviews');
    setActiveReviewForEdit(null);
  };

  const handleDeleteReview = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta review?')) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  const handleDuplicateReview = (review: Review) => {
    const duplicated: Review = {
      ...review,
      id: 'rev-' + Date.now(),
      productName: `${review.productName} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setReviews([duplicated, ...reviews]);
  };

  const handleUseTrend = (trend: TrendItem) => {
    const trendPlatform = (trend as any).platform || 'Mercado Livre';
    const trendImage = (trend as any).thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
    const trendAffiliateUrl = (trend as any).realUrl || '';

    const newRevFromTrend: Review = {
      id: 'rev-' + Date.now(),
      siteName: settings.siteName,
      author: settings.authorName,
      productName: trend.title,
      currentPrice: trend.suggestedPrice || 'R$ 199,90',
      oldPrice: '',
      affiliateUrl: trendAffiliateUrl,
      category: trend.category,
      platform: trendPlatform,
      description: trend.suggestedDescription || `Review completo e sincero sobre ${trend.title}, produto campeão de vendas e buscas na plataforma ${trendPlatform}.`,
      features: [
        'Alta procura no mercado brasileiro',
        `Tendência oficial e mais vendidos na ${trendPlatform}`,
        'Garantia de entrega e compra segura'
      ],
      mainImage: trendImage,
      images: [trendImage],
      pros: [
        'Produto em alta demanda com grande volume de buscas no Brasil',
        'Excelente custo-benefício comparado a concorrentes',
        `Disponibilidade imediata com entrega rápida na ${trendPlatform}`
      ],
      cons: [
        'Alta procura pode gerar oscilação pontual de estoque'
      ],
      audience: ['Consumidores que buscam qualidade com preço justo em ' + trend.title],
      experience: `Produto identificado e analisado através dos dados reais de tendências da plataforma ${trendPlatform}.`,
      howItWorks: `Disponível na ${trendPlatform} com pagamento facilitado e proteção ao comprador.`,
      faq: [
        { id: 'f1', question: 'O produto é original?', answer: `Recomendamos adquirir através do link oficial na ${trendPlatform} com vendedores bem avaliados.` },
        { id: 'f2', question: 'Como funciona a garantia e entrega?', answer: `Conta com garantia oficial da plataforma ${trendPlatform} com opção de devolução facilitada.` }
      ],
      scoreCriteria: { quality: 8.8, design: 8.6, practicality: 8.9, resources: 8.5, costBenefit: 9.2, experience: 8.8 },
      overallScore: 8.8,
      verdict: `Produto campeão na ${trendPlatform}, altamente recomendado para compra com excelente retorno em custo-benefício.`,
      testimonials: [],
      template: settings.defaultTemplate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Rascunho'
    };
    setActiveReviewForEdit(newRevFromTrend);
    setCurrentView('create');
  };

  const handleUseKeyword = (keyword: string) => {
    const formattedTitle = keyword
      .split(' ')
      .map((w) => (w.length > 2 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
      .join(' ');

    const newRevFromKeyword: Review = {
      id: 'rev-' + Date.now(),
      siteName: settings.siteName,
      author: settings.authorName,
      productName: formattedTitle,
      headline: `${formattedTitle} Vale a Pena? Análise Sincera & Preço Atualizado`,
      currentPrice: 'R$ 199,90',
      oldPrice: '',
      affiliateUrl: '',
      category: 'Tech',
      platform: 'Mercado Livre',
      description: `Review completo e aprofundado sobre ${formattedTitle}. Analisamos os principais diferenciais, prós e contras reais para ajudar você a decidir sua compra.`,
      features: [
        'Alto volume de busca e interesse no mercado',
        'Avaliações verificadas de compradores reais',
        'Garantia oficial e entrega rápida'
      ],
      mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
      ],
      pros: [
        'Excelente custo-benefício comparado aos concorrentes diretos',
        'Alta demanda com grande satisfação entre os consumidores',
        'Facilidade de uso e acabamento confiável'
      ],
      cons: [
        'Alta procura pode gerar oscilações de preço e estoque'
      ],
      audience: [`Consumidores que pesquisam por ${keyword} buscando qualidade e preço justo`],
      experience: `Análise elaborada a partir das buscas reais e dados de mercado para ${keyword}.`,
      howItWorks: 'Disponível nas principais plataformas com envio rápido e compra protegida.',
      faq: [
        {
          id: 'f1',
          question: `O ${formattedTitle} realmente funciona e vale o investimento?`,
          answer: `Sim, de acordo com as especificações e avaliações de mercado, entrega um ótimo desempenho para o seu segmento.`
        },
        {
          id: 'f2',
          question: 'Qual é o prazo de entrega e garantia?',
          answer: 'A garantia de fábrica padrão cobre eventuais defeitos e a entrega conta com rastreamento completo.'
        }
      ],
      scoreCriteria: {
        quality: 8.9,
        design: 8.7,
        practicality: 9.0,
        resources: 8.6,
        costBenefit: 9.3,
        experience: 8.9
      },
      overallScore: 8.9,
      verdict: `O ${formattedTitle} se destaca como uma excelente opção na categoria, altamente recomendado para compra informada.`,
      testimonials: [],
      template: settings.defaultTemplate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Rascunho'
    };

    setActiveReviewForEdit(newRevFromKeyword);
    setCurrentView('create');
  };

  const handleUseChampionProduct = (product: {
    productName: string;
    productPrice: string;
    productImage: string;
    productCategory: any;
    productDescription: string;
    affiliateLink: string;
  }) => {
    const newDraft: Review = {
      id: 'rev-' + Date.now(),
      siteName: settings.siteName,
      author: settings.authorName,
      productName: product.productName,
      headline: `${product.productName} Vale a Pena? Análise Sincera & Teste Real`,
      currentPrice: product.productPrice,
      oldPrice: '',
      affiliateUrl: product.affiliateLink,
      category: product.productCategory,
      platform: 'Mercado Livre',
      description: `${product.productDescription} Analisamos em detalhes o desempenho, durabilidade, satisfação de compradores e se vale cada centavo.`,
      features: [
        'Líder absoluto de vendas comprovado no Brasil',
        'Avaliações verificadas de compradores reais',
        'Envio rápido com garantia de satisfação e compra protegida'
      ],
      mainImage: product.productImage,
      images: [product.productImage],
      pros: [
        'Excelente custo-benefício comprovado por milhares de usuários',
        'Alta durabilidade e acabamento confiável',
        'Facilidade de uso no dia a dia'
      ],
      cons: [
        'Devido à alta procura, o estoque promocional pode esgotar rapidamente'
      ],
      audience: ['Consumidores exigentes que buscam a melhor opção do mercado sem arriscar o dinheiro'],
      experience: `Nossa equipe analisou os feedbacks e especificações técnicas de ${product.productName} para produzir este veredito sincero.`,
      howItWorks: 'Produto oficial disponível nas principais plataformas com entrega rápida e nota fiscal.',
      faq: [
        {
          id: 'f1',
          question: `O ${product.productName} é original e confiável?`,
          answer: `Sim, recomendamos adquirir apenas através do link oficial de vendedores certificados para garantir a garantia de fábrica e nota fiscal.`
        },
        {
          id: 'f2',
          question: 'Em quanto tempo recebo o produto?',
          answer: 'O envio é realizado com rastreamento oficial e entrega rápida para todo o território nacional.'
        }
      ],
      scoreCriteria: {
        quality: 9.3,
        design: 9.0,
        practicality: 9.4,
        resources: 9.1,
        costBenefit: 9.6,
        experience: 9.3
      },
      overallScore: 9.4,
      verdict: `O ${product.productName} é o produto campeão da categoria e entrega tudo o que promete com nota máxima dos compradores.`,
      testimonials: [],
      template: settings.defaultTemplate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Rascunho'
    };

    setActiveReviewForEdit(newDraft);
    setCurrentView('create');
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex font-sans selection:bg-[#F5C542] selection:text-[#080808]">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onNewReview={() => {
          setActiveReviewForEdit(null);
          setCurrentView('create');
        }}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Layout Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <Topbar
          onNewReview={() => {
            setActiveReviewForEdit(null);
            setCurrentView('create');
          }}
          onOpenMobile={() => setMobileOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          authorName={settings.authorName}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <Dashboard
              reviews={reviews}
              settings={settings}
              onNewReview={() => {
                setActiveReviewForEdit(null);
                setCurrentView('create');
              }}
              onEditReview={(rev) => {
                setActiveReviewForEdit(rev);
                setCurrentView('create');
              }}
              onViewReview={(rev) => setActiveReviewForView(rev)}
              onDuplicateReview={handleDuplicateReview}
              onDeleteReview={handleDeleteReview}
              setCurrentView={setCurrentView}
            />
          )}

          {currentView === 'campeoes' && (
            <TopProductsView
              onUseProductForReview={handleUseChampionProduct}
              onSwitchToComparator={(title) => setCurrentView('comparar')}
            />
          )}

          {currentView === 'comparar' && (
            <CompareProductsView
              onSwitchToGenerator={() => {
                setActiveReviewForEdit(null);
                setCurrentView('create');
              }}
            />
          )}

          {currentView === 'tutorial' && (
            <TutorialView
              onNavigateTo={(viewId) => setCurrentView(viewId)}
              onNewReview={() => {
                setActiveReviewForEdit(null);
                setCurrentView('create');
              }}
            />
          )}

          {currentView === 'reviews' && (
            <ReviewsList
              reviews={reviews}
              onNewReview={() => {
                setActiveReviewForEdit(null);
                setCurrentView('create');
              }}
              onEditReview={(rev) => {
                setActiveReviewForEdit(rev);
                setCurrentView('create');
              }}
              onViewReview={(rev) => setActiveReviewForView(rev)}
              onDuplicateReview={handleDuplicateReview}
              onDeleteReview={handleDeleteReview}
            />
          )}

          {currentView === 'create' && (
            <CreateReviewWizard
              initialReview={activeReviewForEdit}
              onSave={handleSaveReview}
              onCancel={() => {
                setActiveReviewForEdit(null);
                setCurrentView('dashboard');
              }}
              onSwitchToTrends={() => setCurrentView('trends')}
            />
          )}

          {currentView === 'trends' && (
            <TrendsView
              onUseTrend={handleUseTrend}
              onSwitchToGenerator={(platform) => {
                setActiveReviewForEdit(null);
                setCurrentView('create');
              }}
            />
          )}

          {currentView === 'keyword-planner' && (
            <KeywordPlannerView
              onUseKeywordForReview={handleUseKeyword}
            />
          )}

          {currentView === 'templates' && (
            <TemplatesView
              defaultTemplate={settings.defaultTemplate}
              onSelectDefaultTemplate={(tpl) => setSettings({ ...settings, defaultTemplate: tpl })}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView settings={settings} onSaveSettings={setSettings} initialTab="general" />
          )}

          {currentView === 'settings-banners' && (
            <SettingsView settings={settings} onSaveSettings={setSettings} initialTab="banners" />
          )}
        </main>
      </div>

      {/* Commission Calculator Modal */}
      <CommissionCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onNewReview={() => {
          setActiveReviewForEdit(null);
          setCurrentView('create');
        }}
      />

      {/* Full Review Modal Viewer */}
      {activeReviewForView && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="sticky top-0 z-50 bg-[#0D0D0D] border-b border-[#2A2A2A] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveReviewForView(null)}
                className="flex items-center gap-2 text-xs font-semibold text-[#A1A1A1] hover:text-white bg-[#151515] border border-[#2A2A2A] px-4 py-2 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Fechar Preview</span>
              </button>
              <span className="text-xs text-[#F5C542] font-semibold bg-[#F5C542]/10 px-3 py-1 rounded-full border border-[#F5C542]/20">
                Modo Visualização Oficial
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const rev = activeReviewForView;
                  setActiveReviewForView(null);
                  setActiveReviewForEdit(rev);
                  setCurrentView('create');
                }}
                className="bg-[#151515] hover:bg-[#1C1C1C] border border-[#2A2A2A] text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                Editar Review
              </button>
            </div>
          </div>

          <div className="bg-[#080808]">
            <ReviewRenderer review={activeReviewForView} />
          </div>
        </div>
      )}
    </div>
  );
}
