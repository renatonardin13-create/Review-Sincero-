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
import { CompareProductsView } from './components/CompareProductsView';
import { TopProductsView } from './components/TopProductsView';
import { AdminPanelView } from './components/AdminPanelView';
import { AccessRestrictedView } from './components/AccessRestrictedView';
import { AuthModal } from './components/AuthModal';
import { LoginView } from './components/LoginView';
import { getStoredUser, saveStoredUser, logoutUser } from './services/authService';
import { loadGlobalSettings, saveGlobalSettings } from './services/settingsService';
import { SettingsErrorBoundary } from './components/SettingsErrorBoundary';
import { ProductNotificationWidget } from './components/ProductNotificationWidget';
import { ToastNotifications } from './components/ToastNotifications';
import { AcademyView } from './components/AcademyView';
import { NotificationsCenterModal } from './components/NotificationsCenterModal';
import { subscribeToNotifications, getReadNotificationsMap, onNotificationReadsChanged } from './services/notificationService';
import { SystemNotification } from './types';
import { X, ExternalLink, Download, ArrowLeft } from 'lucide-react';

const VIEW_TO_PATH: Record<string, string> = {
  'dashboard': '/aluno',
  'reviews': '/reviews',
  'create': '/create',
  'templates': '/templates',
  'campeoes': '/produtos-campeoes',
  'comparar': '/comparar-produtos',
  'trends': '/analisar-tendencias',
  'settings': '/settings',
  'admin': '/adm',
  'login': '/login',
  'academia': '/academia'
};

const PATH_TO_VIEW: Record<string, string> = {
  '/aluno': 'dashboard',
  '/': 'dashboard',
  '/reviews': 'reviews',
  '/create': 'create',
  '/templates': 'templates',
  '/produtos-campeoes': 'campeoes',
  '/comparar-produtos': 'comparar',
  '/analisar-tendencias': 'trends',
  '/settings': 'settings',
  '/adm': 'admin',
  '/admin': 'admin',
  '/login': 'login',
  '/academia': 'academia'
};

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState<boolean>(false);
  const [targetLessonId, setTargetLessonId] = useState<string | undefined>(undefined);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [readNotifsMap, setReadNotifsMap] = useState<Record<string, boolean>>(() => getReadNotificationsMap());

  // Auth User State & Role Verification
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getStoredUser());

  const isAdmin =
    currentUser?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();

  // Escutar notificações do sistema em tempo real e status de lido/não lido
  useEffect(() => {
    const unsub = subscribeToNotifications((notifs) => {
      setNotifications(notifs);
    });
    const unsubReads = onNotificationReadsChanged(() => {
      setReadNotifsMap(getReadNotificationsMap());
    });
    return () => {
      unsub();
      unsubReads();
    };
  }, []);

  const unreadNotifsCount = notifications.filter((n) => !readNotifsMap[n.id]).length;

  const handleNavigateFromNotification = (view: string, targetId?: string) => {
    if (targetId) {
      setTargetLessonId(targetId);
    }
    setCurrentView(view);
  };

  const handleUserChange = (user: AuthUser | null) => {
    setCurrentUser(user);
    saveStoredUser(user);
  };

  // Synchronize state currentView with URL pathname
  useEffect(() => {
    const handleUrlSync = () => {
      const path = window.location.pathname;
      const user = getStoredUser();
      const userIsAdmin = user?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();

      // Rota de Admin: Login obrigatório apenas para o Administrador Master
      if (path === '/admin' || path === '/adm') {
        if (userIsAdmin) {
          setCurrentView('admin');
        } else {
          // Acesso restrito: exibe a tela de login administrativo
          setCurrentView('login');
        }
        return;
      }

      // Redirecionamentos de conveniência para a rota canônica /usuario
      if (path === '/' || path === '/aluno') {
        window.history.replaceState(null, '', '/usuario');
        setCurrentView('dashboard');
        return;
      }

      if (path === '/aluno/academia' || path === '/academia') {
        window.history.replaceState(null, '', '/usuario/academia');
        setCurrentView('academia');
        return;
      }

      // Se acessou tela de login manualmente
      if (path === '/login') {
        if (userIsAdmin) {
          window.history.replaceState(null, '', '/admin');
          setCurrentView('admin');
        } else {
          setCurrentView('login');
        }
        return;
      }

      // Demais rotas da plataforma: ACESSO LIVRE DIRETO PARA O USUÁRIO (SEM LOGIN, SEM CADASTRO, SEM SENHA)
      const mappedView = PATH_TO_VIEW[path];
      if (mappedView) {
        setCurrentView(mappedView);
      } else {
        window.history.replaceState(null, '', '/usuario');
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
    const fallbackUserId = initialUser?.id || 'local-visitor';
    return SAMPLE_REVIEWS.map(r => ({ ...r, userId: r.userId || fallbackUserId }));
  });

  // User reviews: guests without login access all their locally saved reviews
  const userReviews = React.useMemo(() => {
    if (!currentUser || !currentUser.id) {
      return reviews;
    }
    return reviews.filter(
      (r) => !r.userId || r.userId === currentUser.id || r.userId === 'local-visitor' || r.userId === 'usr-member-free'
    );
  }, [reviews, currentUser]);

  const canManageReview = (rev?: Review | null) => {
    if (!rev) return false;
    // Visitante na rota /usuario gerencia livremente os dados do seu próprio localStorage
    if (!currentUser) return true;
    if (isAdmin) return true;
    return !rev.userId || rev.userId === currentUser.id || rev.userId === 'local-visitor' || rev.userId === 'usr-member-free';
  };

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

  // Fetch global settings on mount and poll periodically
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const loaded = await loadGlobalSettings();
        if (loaded) {
          setSettings(prev => ({
            ...prev,
            ...loaded
          }));
        }
      } catch (e) {
        console.warn("[App] Could not load global settings:", e);
      }
    };

    fetchSettings();
    const interval = setInterval(fetchSettings, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('review_sincero_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  const handleSaveSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);

    if (isAdmin) {
      try {
        const res = await saveGlobalSettings(newSettings, currentUser);
        if (res.success) {
          alert("Configurações salvas e sincronizadas globalmente com sucesso!");
        } else {
          alert("Não foi possível sincronizar as configurações globais: " + (res.error || 'Erro desconhecido.'));
        }
      } catch (e: any) {
        console.error("[App] Erro ao sincronizar globalmente:", e);
        alert("Não foi possível sincronizar as configurações globais.");
      }
    } else {
      alert("Acesso negado. Apenas o administrador pode alterar as configurações globais.");
    }
  };

  const handleSaveReview = (review: Review) => {
    if (review.id && reviews.some((r) => r.id === review.id)) {
      const existing = reviews.find((r) => r.id === review.id);
      if (existing && !canManageReview(existing)) {
        alert("Erro de Permissão: Você não é o proprietário desta review!");
        return;
      }
    }

    const reviewWithUser = {
      ...review,
      userId: review.userId || (currentUser ? currentUser.id : 'local-visitor')
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
    if (existing && !canManageReview(existing)) {
      alert("Erro de Permissão: Você não é o proprietário desta review!");
      return;
    }

    if (confirm('Tem certeza que deseja excluir esta review?')) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  const handleDuplicateReview = (review: Review) => {
    if (!canManageReview(review)) {
      alert("Erro de Permissão: Você não é o proprietário desta review!");
      return;
    }

    const duplicated: Review = {
      ...review,
      id: 'rev-' + Date.now(),
      productName: `${review.productName} (Cópia)`,
      userId: currentUser?.id || 'local-visitor',
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
        unreadNotifsCount={unreadNotifsCount}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
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
          onNavigate={handleNavigateFromNotification}
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
                if (!canManageReview(rev)) {
                  alert("Erro de Permissão: Você não é o proprietário desta review!");
                  return;
                }
                setActiveReviewForEdit(rev);
                setCurrentView('create');
              }}
              onViewReview={(rev) => {
                if (!canManageReview(rev)) {
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

          {currentView === 'reviews' && (
            <ReviewsList
              reviews={userReviews}
              onNewReview={() => {
                setActiveReviewForEdit(null);
                setCurrentView('create');
              }}
              onEditReview={(rev) => {
                if (!canManageReview(rev)) {
                  alert("Erro de Permissão: Você não é o proprietário desta review!");
                  return;
                }
                setActiveReviewForEdit(rev);
                setCurrentView('create');
              }}
              onViewReview={(rev) => {
                if (!canManageReview(rev)) {
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

          {currentView === 'academia' && (
            <AcademyView
              currentUser={currentUser}
              initialLessonId={targetLessonId}
              onNavigateBack={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'settings' && (
            <SettingsErrorBoundary>
              <SettingsView settings={settings} onSaveSettings={handleSaveSettings} isAdmin={isAdmin} />
            </SettingsErrorBoundary>
          )}
        </main>
      </div>

      <ProductNotificationWidget intervalMinutes={settings.productNotificationIntervalMinutes || 5} />
      <ToastNotifications currentUser={currentUser} />

      {/* Global Notifications Center Modal */}
      <NotificationsCenterModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        readMap={readNotifsMap}
        onNavigate={handleNavigateFromNotification}
      />

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
