import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  TrendingUp,
  LayoutTemplate,
  Settings,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Link2,
  DollarSign,
  Layers,
  Download,
  Store,
  Search,
  Scale,
  Percent,
  Package,
  User,
  Rocket,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onNewReview: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  onNewReview,
  mobileOpen,
  setMobileOpen
}) => {
  const principalItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tutorial', label: 'Tutorial & Guia', icon: BookOpen, badge: 'GRÁTIS' },
    { id: 'reviews', label: 'Meus Reviews', icon: FileText },
    { id: 'create', label: 'Criar Review', icon: PlusCircle, action: onNewReview },
    { id: 'keyword-planner', label: 'Planejador Palavras', icon: Search },
    { id: 'trends', label: 'Categorias & Trends', icon: Layers },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'settings', label: 'Exportar & Lojinha', icon: Download }
  ];

  const ferramentasItems = [
    { id: 'settings-banners', label: 'Banners em Slides', icon: DollarSign, badge: 'NOVO', action: () => setCurrentView('settings-banners') },
    { id: 'keyword-planner', label: 'Planejador de Palavras', icon: Search },
    { id: 'trends', label: 'Analisar Tendências', icon: TrendingUp },
    { id: 'comparar', label: 'Comparar Produtos', icon: Scale, action: () => setCurrentView('trends') },
    { id: 'comissoes', label: 'Calculadora Comissão', icon: Percent, action: () => setCurrentView('settings') },
    { id: 'trends', label: 'Produtos Campeões', icon: Package },
    { id: 'settings', label: 'Perfil & Config', icon: User }
  ];

  const handleNavClick = (item: { id: string; action?: () => void }) => {
    if (item.action) {
      item.action();
    } else {
      setCurrentView(item.id);
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#080808] border-r border-[#1F1F1F] flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#1F1F1F] flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setCurrentView('dashboard')}
          >
            <div className="w-8 h-8 rounded-xl bg-[#F5C542]/15 border border-[#F5C542]/30 flex items-center justify-center shadow-lg shadow-[#F5C542]/10">
              <Sparkles className="w-4 h-4 text-[#F5C542]" />
            </div>
            <div>
              <h1 className="font-extrabold text-white tracking-tight text-base flex items-center gap-1">
                <span>Review</span>
                <span className="text-[#F5C542]">Sincero</span>
              </h1>
              <p className="text-[9px] text-[#A1A1A1] uppercase tracking-wider font-bold">
                Review & Conversão
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-[#A1A1A1] hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {/* PRINCIPAL SECTION */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold tracking-wider text-[#666666] uppercase">
              PRINCIPAL
            </span>
            <div className="space-y-0.5 pt-1">
              {principalItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={idx}
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-[#181818] text-white border border-[#2E2E2E] shadow-sm'
                        : 'text-[#9A9A9A] hover:text-white hover:bg-[#121212]'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#F5C542]' : 'text-[#777] group-hover:text-white'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-[9px] bg-[#F5C542]/20 text-[#F5C542] font-black px-1.5 py-0.5 rounded uppercase">
                        {item.badge}
                      </span>
                    )}
                    {item.id === 'create' && !item.badge && (
                      <span className="ml-auto text-[9px] bg-[#F5C542]/20 text-[#F5C542] font-bold px-1.5 py-0.5 rounded">
                        IA
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FERRAMENTAS SECTION */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold tracking-wider text-[#666666] uppercase">
              FERRAMENTAS
            </span>
            <div className="space-y-0.5 pt-1">
              {ferramentasItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={idx}
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-[#181818] text-white border border-[#2E2E2E]'
                        : 'text-[#9A9A9A] hover:text-white hover:bg-[#121212]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#777] group-hover:text-[#F5C542] transition-colors" />
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-[9px] bg-[#22C55E]/20 text-[#22C55E] font-black px-1.5 py-0.5 rounded uppercase">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer Status */}
        <div className="p-3 border-t border-[#1F1F1F] bg-[#0A0A0A]">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#121212] border border-[#222]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[11px] text-[#A1A1A1] font-medium">Sistema 100% Online</span>
            </div>
            <span className="text-[9px] text-[#7E7E7E] font-mono">v3.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
