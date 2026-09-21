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
  Search,
  Scale,
  Calculator,
  Trophy,
  Crown,
  User,
  Users,
  Film,
  LogIn,
  LogOut,
  GraduationCap,
  Bell,
  Target
} from 'lucide-react';
import { AuthUser, ADMIN_EMAIL } from '../types';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onNewReview: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  currentUser?: AuthUser | null;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
  unreadNotifsCount?: number;
  onOpenNotifications?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  onNewReview,
  mobileOpen,
  setMobileOpen,
  currentUser,
  onOpenAuthModal,
  onLogout,
  unreadNotifsCount = 0,
  onOpenNotifications
}) => {
  const isAdmin =
    currentUser?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
  const isAdminArea = currentView === 'admin' && isAdmin;

  // Public Navigation Items: Dashboard, Criar Review, Academia & Aulas, Templates, Produtos Campeões
  const publicNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Criar Review', icon: PlusCircle, action: onNewReview },
    { id: 'academia', label: 'Academia & Aulas', icon: GraduationCap, badge: 'AULAS' },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'campeoes', label: 'Produtos Campeões', icon: Trophy, badge: 'TOP' },
    { id: 'quiz', label: 'Quiz de Vendas', icon: Target }
  ];

  // Admin Navigation Items (Only when inside administrative area /admin)
  const adminPrincipalItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reviews', label: 'Meus Reviews', icon: FileText },
    { id: 'create', label: 'Criar Review', icon: PlusCircle, action: onNewReview },
    { id: 'academia', label: 'Academia & Aulas', icon: GraduationCap, badge: 'AULAS' },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'quiz', label: 'Quiz de Vendas', icon: Target }
  ];

  const adminFerramentasItems = [
    { id: 'campeoes', label: 'Produtos Campeões', icon: Trophy, badge: 'TOP' },
    { id: 'settings', label: 'Perfil & Config', icon: User },
    {
      id: 'login',
      label: 'Tela de Login',
      icon: LogIn,
      badge: 'NOVA',
      action: () => setCurrentView('login')
    }
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
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {/* ADMIN ENVIRONMENT: Full Master Controls */}
          {isAdminArea ? (
            <>
              {/* ADMIN SECTION */}
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-black tracking-wider text-[#F5C542] uppercase flex items-center gap-1.5">
                  <Crown className="w-3 h-3" />
                  <span>ADMINISTRAÇÃO MASTER</span>
                </span>
                <div className="space-y-0.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('admin');
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group cursor-pointer bg-[#2A2208] text-[#F5C542] border border-[#F5C542]/50 shadow-md shadow-[#F5C542]/10"
                  >
                    <Crown className="w-4 h-4 text-[#F5C542]" />
                    <span className="truncate">Área Administrativa</span>
                    <span className="ml-auto text-[9px] bg-[#F5C542] text-black font-black px-1.5 py-0.5 rounded uppercase">
                      ADM
                    </span>
                  </button>
                </div>
              </div>

              {/* PRINCIPAL SECTION (ADMIN) */}
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold tracking-wider text-[#666666] uppercase">
                  PRINCIPAL
                </span>
                <div className="space-y-0.5 pt-1">
                  {adminPrincipalItems.map((item, idx) => {
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
                        {(item as any).badge && (
                          <span className="ml-auto text-[9px] bg-[#F5C542]/20 text-[#F5C542] font-black px-1.5 py-0.5 rounded uppercase">
                            {(item as any).badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FERRAMENTAS SECTION (ADMIN) */}
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold tracking-wider text-[#666666] uppercase">
                  FERRAMENTAS
                </span>
                <div className="space-y-0.5 pt-1">
                  {adminFerramentasItems.map((item, idx) => {
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
                        {item.id === 'campeoes' ? (
                          <span className="text-sm leading-none shrink-0">🏆</span>
                        ) : (
                          <Icon className="w-4 h-4 text-[#777] group-hover:text-[#F5C542] transition-colors" />
                        )}
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
            </>
          ) : (
            /* PUBLIC ENVIRONMENT (/usuario) - Clean, essential public navigation */
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-bold tracking-wider text-[#666666] uppercase">
                NAVEGAÇÃO
              </span>
              <div className="space-y-0.5 pt-1">
                {publicNavItems.map((item, idx) => {
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
                      {item.id === 'campeoes' ? (
                        <span className="text-sm leading-none shrink-0">🏆</span>
                      ) : (
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-[#F5C542]' : 'text-[#777] group-hover:text-white'
                          }`}
                        />
                      )}
                      <span className="truncate">{item.label}</span>
                      {(item as any).badge && (
                        <span className={`ml-auto text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                          item.id === 'campeoes'
                            ? 'bg-[#22C55E]/20 text-[#22C55E]'
                            : 'bg-[#F5C542]/20 text-[#F5C542]'
                        }`}>
                          {(item as any).badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Footer Area */}
        <div className="p-3 border-t border-[#1F1F1F] bg-[#0A0A0A] space-y-2">
          {onOpenNotifications && (
            <button
              type="button"
              onClick={onOpenNotifications}
              className="w-full py-2 px-3 rounded-xl bg-[#14141A] hover:bg-[#1C1C24] border border-[#22222E] hover:border-[#F5C542]/40 text-xs font-bold text-gray-300 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#F5C542]" />
                <span>Notificações</span>
              </div>
              {unreadNotifsCount > 0 && (
                <span className="bg-[#F5C542] text-black font-black text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>
          )}

          {/* Administrative Footer Details (ONLY in /admin) */}
          {isAdminArea && (
            <>
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="w-full p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer bg-[#1C1809] border-[#F5C542]/30 hover:border-[#F5C542]"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 bg-[#F5C542] text-black">
                  👑
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white truncate">
                      {currentUser ? currentUser.name.split(' ')[0] : 'Renato'}
                    </span>
                    <span className="text-[8px] font-black px-1.5 py-0.2 rounded uppercase bg-[#F5C542] text-black">
                      ADMIN
                    </span>
                  </div>
                  <p className="text-[9px] text-[#8E8E8E] truncate">
                    {currentUser?.email || ADMIN_EMAIL}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('login')}
                className="w-full py-1.5 px-3 rounded-xl bg-[#141414] hover:bg-[#1C1C1C] border border-[#222] hover:border-[#F5C542]/30 text-[10px] font-semibold text-[#A1A1A1] hover:text-[#F5C542] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogIn className="w-3 h-3" />
                <span>Alternar Conta / Login Administrativo</span>
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full py-1.5 px-3 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-500/30 text-[10px] font-semibold text-red-400 hover:text-red-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sair da Conta (Logout)</span>
                </button>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
};
