import React, { useState, useEffect } from 'react';
import { Review, AppSettings, TrendItem, AuthUser, ADMIN_EMAIL } from './types';
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
import { TutorialView } from './components/TutorialView';
import { CompareProductsView } from './components/CompareProductsView';
import { TopProductsView } from './components/TopProductsView';
import { AdminPanelView } from './components/AdminPanelView';
import { AccessRestrictedView } from './components/AccessRestrictedView';
import { AuthModal } from './components/AuthModal';
import { LoginView } from './components/LoginView';
import { getStoredUser, saveStoredUser, logoutUser } from './services/authService';
import { X, ExternalLink, Download, ArrowLeft } from 'lucide-react';

const VIEW_TO_PATH: Record<string, string> = {
  'dashboard': '/aluno',
  'tutorial': '/tutorial',
  'reviews': '/reviews',
  'create': '/create',
  'templates': '/templates',
  'campeoes': '/produtos-campeoes',
  'comparar': '/comparar-produtos',
  'trends': '/analisar-tendencias',
  'settings': '/settings',
  'admin': '/adm',
  'settings-banners': '/adm/banners',
  'login': '/login'
};

const PATH_TO_VIEW: Record<string, string> = {
  '/aluno': 'dashboard',
  '/': 'dashboard',
  '/tutorial': 'tutorial',
  '/reviews': 'reviews',
  '/create': 'create',
  '/templates': 'templates',
  '/produtos-campeoes': 'campeoes',
  '/comparar-produtos': 'comparar',
  '/analisar-tendencias': 'trends',
  '/settings': 'settings',
  '/adm': 'admin',
  '/admin': 'admin',
  '/adm/banners': 'settings-banners',
  '/login': 'login'
};

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Auth User State & Role Verification
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getStoredUser());

  const isAdmin =
    currentUser?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();

  const handleUserChange = (user: AuthUser | null) => {
    setCurrentUser(user);
    saveStoredUser(user);
  };

  // Synchronize state currentView with URL pathname
  useEffect(() => {
    const handleUrlSync = () => {
      const path = window.location.pathname;
      const user = getStoredUser();

      if (!user) {
        if (path !== '/login') {
          window.history.replaceState(null, '', '/login');
        }
        setCurrentView('login');
        return;
      }

      const userIsAdmin = user.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();

      if (path === '/login' || path === '/') {
        window.history.replaceState(null, '', '/aluno');
        setCurrentView('dashboard');
        return;
      }

      if ((path === '/adm' || path === '/adm/banners' || path === '/admin') && !userIsAdmin) {
        window.history.replaceState(null, '', '/aluno');
        setCurrentView('dashboard');
        return;
      }

      const mappedView = PATH_TO_VIEW[path];
      if (mappedView) {
        setCurrentView(mappedView);
      } else {
        window.history.replaceState(null, '', '/aluno');
        setCurrentView('dashboard');
      }
    };

    handleUrlSync();

    window.addEventListener('popstate', handleUrlSync);
    return () => {
      window.removeEventListener('popstate', handleUrlSync);
    };
  }, [currentUser]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const expectedPath = VIEW_TO_PATH[currentView];

    if (expectedPath && currentPath !== expectedPath) {
      window.history.pushState(null, '', expectedPath);
    }
  }, [currentView]);

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setCurrentView('login');
  };

  // LocalStorage state for reviews & settings
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('review_sincero_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    const initialUser = getStoredUser();
    const fallbackUserId = initialUser?.id || 'usr-member-free';
    return SAMPLE_REVIEWS.map(r => ({ ...r, userId: r.userId || fallbackUserId }));
  });

  const userReviews = React.useMemo(() => {
    if (!currentUser || !currentUser.id) return [];
    return reviews.filter((r) => r.userId === currentUser.id);
  }, [reviews, currentUser]);

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

  // Fetch settings from server on mount and poll periodically so students see admin banners automatically
  useEffect(() => {
    const fetchSettings = () => {
      fetch('/api/settings')
        .then(res => {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return res.json();
          }
          throw new Error('Not JSON response');
        })
        .then(data => {
          if (data && data.success && data.settings) {
            setSettings(prev => ({
              ...prev,
              ...data.settings
            }));
          }
        })
        .catch(() => {
          // Fallback to localStorage if API is unavailable (e.g. Vercel static deployment)
          try {
            const saved = localStorage.getItem('review_sincero_settings');
            if (saved) {
              const parsed = JSON.parse(saved);
              setSettings(prev => ({ ...prev, ...parsed }));
            }
          } catch (e) {}
        });
    };

    fetchSettings();
    const interval = setInterval(fetchSettings, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('review_sincero_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('review_sincero_settings', JSON.stringify(newSettings));
      if (isAdmin) {
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSettings)
        }).then(res => {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) return res.json();
        }).catch(() => {});
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveReview = (review: Review) => {
    if (review.id && reviews.some((r) => r.id === review.id)) {
      const existing = reviews.find((r) => r.id === review.id);
      if (existing && existing.userId !== currentUser?.id) {
        alert("Erro de Permissão: Você não é o proprietário desta review!");
        return;
      }
    }

    const reviewWithUser = {
      ...review,
      userId: review.userId || currentUser?.id
    };
    const exists = reviews.some((r) => r.id === review.id);
    if (exists) {
      setReviews(reviews.map((r) => (r.id === review.id ? { ...reviewWithUser, updatedAt: new Date().toISOString() } : r)));
    } else {
      setReviews([reviewWithUser, ...reviews]);
    }
    setCurrentView('reviews');
    setActiveReviewForEdit(null);
  };

  const handleDeleteReview = (id: string) => {
    const existing = reviews.find((r) => r.id === id);
    if (existing && existing.userId !== currentUser?.id) {
      alert("Erro de Permissão: Você não é o proprietário desta review!");
      return;
    }

    if (confirm('Tem certeza que deseja excluir esta review?')) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  const handleDuplicateReview = (review: Review) => {
    if (review.userId !== currentUser?.id) {
      alert("Erro de Permissão: Você não é o proprietário desta review!");
      return;
    }

    const duplicated: Review = {
      ...review,
      id: 'rev-' + Date.now(),
      productName: `${review.productName} (Cópia)`,
      userId: currentUser?.id,
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
      status: 'Rascunho',
      userId: currentUser?.id
    };
    setActiveReviewForEdit(newRevFromTrend);
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
      status: 'Rascunho',
      userId: currentUser?.id
    };

    setActiveReviewForEdit(newDraft);
    setCurrentView('create');
  };

  if (currentView === 'login') {
    return (
      <LoginView
        currentUser={currentUser || undefined}
        settings={settings}
        onLoginSuccess={(user) => {
          handleUserChange(user);
          setCurrentView('dashboard');
        }}
        onCancel={() => setCurrentView('dashboard')}
      />
    );
  }

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
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
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
          currentUser={currentUser || undefined}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <Dashboard
              reviews={userReviews}
              settings={settings}
              currentUser={currentUser || undefined}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onNewReview={() => {
                setActiveReviewForEdit(null);
                setCurrentView('create');
              }}
              onEditReview={(rev) => {
                if (rev.userId !== currentUser?.id) {
                  alert("Erro de Permissão: Você não é o proprietário desta review!");
                  return;
                }
                setActiveReviewForEdit(rev);
                setCurrentView('create');
              }}
              onViewReview={(rev) => {
                if (rev.userId !== currentUser?.id) {
                  alert("Erro de Permissão: Você não é o proprietário desta review!");
                  return;
                }
                setActiveReviewForView(rev);
              }}
              onDuplicateReview={handleDuplicateReview}
              onDeleteReview={handleDeleteReview}
              setCurrentView={setCurrentView}
            />
          )}

          {currentView === 'admin' && (
            isAdmin ? (
              <AdminPanelView
                currentUser={currentUser!}
                settings={settings}
                onSaveSettings={handleSaveSettings}
                onOpenVideoManager={() => setCurrentView('tutorial')}
                onNavigateTo={setCurrentView}
              />
            ) : (
              <AccessRestrictedView
                currentUser={currentUser}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
                onGoToDashboard={() => setCurrentView('dashboard')}
              />
            )
          )}

          {currentView === 'campeoes' && (
            <TopProductsView
              currentUser={currentUser || undefined}
              onUseProductForReview={handleUseChampionProduct}
              onSwitchToComparator={(title) => setCurrentView('comparar')}
            />
          )}

          {currentView === 'comparar' && (
            <CompareProductsView
              onUseProductForReview={handleUseChampionProduct}
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
              currentUser={currentUser || undefined}
            />
          )}

          {currentView === 'reviews' && (
            <ReviewsList
              reviews={userReviews}
              onNewReview={() => {
                setActiveReviewForEdit(null);
                setCurrentView('create');
              }}
              onEditReview={(rev) => {
                if (rev.userId !== currentUser?.id) {
                  alert("Erro de Permissão: Você não é o proprietário desta review!");
                  return;
                }
                setActiveReviewForEdit(rev);
                setCurrentView('create');
              }}
              onViewReview={(rev) => {
                if (rev.userId !== currentUser?.id) {
                  alert("Erro de Permissão: Você não é o proprietário desta review!");
                  return;
                }
                setActiveReviewForView(rev);
              }}
              onDuplicateReview={handleDuplicateReview}
              onDeleteReview={handleDeleteReview}
            />
          )}

          {currentView === 'create' && (
            <CreateReviewWizard
              initialReview={activeReviewForEdit}
              settings={settings}
              userReviews={userReviews}
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

          {currentView === 'templates' && (
            <TemplatesView
              defaultTemplate={settings.defaultTemplate}
              onSelectDefaultTemplate={(tpl) => setSettings({ ...settings, defaultTemplate: tpl })}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView settings={settings} onSaveSettings={handleSaveSettings} initialTab="general" isAdmin={isAdmin} />
          )}

          {currentView === 'settings-banners' && (
            isAdmin ? (
              <SettingsView settings={settings} onSaveSettings={handleSaveSettings} initialTab="banners" isAdmin={isAdmin} />
            ) : (
              <AccessRestrictedView
                currentUser={currentUser}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
                onGoToDashboard={() => setCurrentView('dashboard')}
              />
            )
          )}
        </main>
      </div>

      {/* User Authentication & Role Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser || undefined}
        onUserChanged={handleUserChange}
      />

      {/* Full Review Modal Viewer */}
      {activeReviewForView && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="sticky top-0 z-50 bg-[#0D0D0D] border-b border-[#2A2A2A] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveReviewForView(null)}
                className="flex items-center gap-2 text-xs font-semibold text-[#A1A1A1] hover:text-white bg-[#151515] border border-[#2A2A2A] px-4 py-2 rounded-xl cursor-pointer"
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
                className="bg-[#151515] hover:bg-[#1C1C1C] border border-[#2A2A2A] text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
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
