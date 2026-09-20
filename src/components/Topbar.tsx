import React, { useState, useEffect } from 'react';
import { Search, Bell, Plus, Menu, User, Sparkles, Crown, ShieldCheck, LogIn } from 'lucide-react';
import { AuthUser, ADMIN_EMAIL } from '../types';
import { subscribeSystemUpdates, subscribeToNotificationReads } from '../services/systemUpdateService';
import { SystemUpdatesModal } from './SystemUpdatesModal';
import { OnlineUsersWidget } from './OnlineUsersWidget';

interface TopbarProps {
  onNewReview: () => void;
  onOpenMobile: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  authorName: string;
  currentUser?: AuthUser;
  onOpenAuthModal?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onNewReview,
  onOpenMobile,
  searchQuery,
  setSearchQuery,
  authorName,
  currentUser,
  onOpenAuthModal
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isAdmin =
    currentUser?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();

  useEffect(() => {
    let unreadMap: Record<string, string> = {};

    const unsubUpdates = subscribeSystemUpdates((items) => {
      const published = items.filter(u => u.published);
      calculateUnread(published, unreadMap);
    });

    let unsubReads = () => {};
    if (currentUser?.id) {
      unsubReads = subscribeToNotificationReads(currentUser.id, (map) => {
        unreadMap = map;
        subscribeSystemUpdates((items) => {
          const published = items.filter(u => u.published);
          calculateUnread(published, unreadMap);
        });
      });
    }

    function calculateUnread(published: any[], map: Record<string, string>) {
      const count = published.filter(u => !map[u.id]).length;
      setUnreadCount(count);
    }

    return () => {
      unsubUpdates();
      unsubReads();
    };
  }, [currentUser]);

  return (
    <>
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
          {/* Online Users Widget */}
          <div className="hidden md:block">
            <OnlineUsersWidget />
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#151515] border border-[#2A2A2A] text-[#A1A1A1] hover:text-white hover:border-[#2A2A2A] transition-colors cursor-pointer"
              title="Central de Notificações"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#F5C542] text-black text-[10px] font-black shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* User Account / Profile Badge with 1-Click Role Switcher */}
          <button
            type="button"
            onClick={onOpenAuthModal}
            className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border transition-all cursor-pointer ${
              isAdmin
                ? 'bg-[#1C1809] border-[#F5C542]/40 hover:border-[#F5C542]'
                : 'bg-[#121926] border-[#2563EB]/40 hover:border-[#2563EB]'
            }`}
            title="Clique para alternar usuário ou fazer login"
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                isAdmin
                  ? 'bg-[#F5C542] text-black shadow-md shadow-[#F5C542]/20'
                  : 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
              }`}
            >
              {isAdmin ? '👑' : '👤'}
            </div>

            <div className="text-left hidden md:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate max-w-[130px]">
                  {currentUser ? currentUser.name.split(' ')[0] : authorName}
                </span>
                <span
                  className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                    isAdmin
                      ? 'bg-[#F5C542] text-black'
                      : 'bg-[#2563EB] text-white'
                  }`}
                >
                  {isAdmin ? 'ADMIN' : 'ALUNO'}
                </span>
              </div>
              <p className="text-[10px] text-[#A1A1A1] truncate max-w-[140px]">
                {currentUser?.email || ADMIN_EMAIL}
              </p>
            </div>
          </button>

          {/* CTA Nova Review */}
          <button
            onClick={onNewReview}
            className="flex items-center gap-2 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-black px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-[#F5C542]/10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Nova Review</span>
          </button>
        </div>
      </header>

      <SystemUpdatesModal
        currentUser={currentUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
