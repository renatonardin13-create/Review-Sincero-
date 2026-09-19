import React, { useState } from 'react';
import { Search, Bell, Plus, Menu, User, Sparkles } from 'lucide-react';

interface TopbarProps {
  onNewReview: () => void;
  onOpenMobile: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  authorName: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onNewReview,
  onOpenMobile,
  searchQuery,
  setSearchQuery,
  authorName
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#2A2A2A] px-4 md:px-8 flex items-center justify-between">
      {/* Left / Mobile toggle & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-xl bg-[#151515] border border-[#2A2A2A] text-[#A1A1A1] hover:text-white"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1A1]" />
          <input
            type="text"
            placeholder="Pesquisar reviews, produtos ou categorias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#A1A1A1] focus:outline-none focus:border-[#F5C542] transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-[#151515] border border-[#2A2A2A] text-[#A1A1A1] hover:text-white hover:border-[#2A2A2A] transition-colors"
            title="Notificações"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F5C542]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#151515] border border-[#2A2A2A] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
                <h4 className="font-semibold text-white text-sm">Notificações</h4>
                <span className="text-[11px] bg-[#F5C542]/10 text-[#F5C542] px-2 py-0.5 rounded-full font-medium">
                  1 nova
                </span>
              </div>
              <div className="py-3 space-y-3">
                <div className="p-2.5 rounded-xl bg-[#0D0D0D] border border-[#2A2A2A]">
                  <p className="text-xs text-white font-medium">Sistema atualizado</p>
                  <p className="text-[11px] text-[#A1A1A1] mt-0.5">
                    Novos templates de conversão e IA aprimorada disponíveis.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile indicator */}
        <div className="hidden md:flex items-center gap-3 pl-3 border-l border-[#2A2A2A]">
          <div className="w-9 h-9 rounded-xl bg-[#151515] border border-[#2A2A2A] flex items-center justify-center text-[#F5C542] font-semibold text-sm">
            {authorName ? authorName.charAt(0).toUpperCase() : 'C'}
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-white truncate max-w-[120px]">{authorName}</p>
            <p className="text-[10px] text-[#A1A1A1]">Editor Pro</p>
          </div>
        </div>

        {/* CTA Nova Review */}
        <button
          onClick={onNewReview}
          className="flex items-center gap-2 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-[#F5C542]/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nova Review</span>
        </button>
      </div>
    </header>
  );
};
