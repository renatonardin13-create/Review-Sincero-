import React from 'react';
import {
  Bell,
  X,
  CheckCheck,
  GraduationCap,
  Sparkles,
  Rocket,
  Layers,
  ArrowRight,
  ExternalLink,
  Clock
} from 'lucide-react';
import { SystemNotification } from '../types';
import { markNotificationAsRead, markAllNotificationsAsRead, acknowledgeSystemVersion } from '../services/notificationService';

interface NotificationsCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  readMap: Record<string, boolean>;
  onNavigate: (view: string, targetId?: string) => void;
}

export const NotificationsCenterModal: React.FC<NotificationsCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  readMap,
  onNavigate
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !readMap[n.id]).length;

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead(notifications.map((n) => n.id));
    acknowledgeSystemVersion();
  };

  const handleNotificationClick = (notif: SystemNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.type === 'update') {
      acknowledgeSystemVersion();
    }
    onClose();
    if (notif.targetView === 'academia') {
      onNavigate('academia', notif.targetId);
    } else {
      onNavigate(notif.targetView || 'dashboard', notif.targetId);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return <GraduationCap className="w-4 h-4 text-[#F5C542]" />;
      case 'module':
        return <Layers className="w-4 h-4 text-blue-400" />;
      case 'update':
        return <Rocket className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#F5C542]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#111115] border border-[#262630] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-[#16161C] border-b border-[#24242E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative p-2 rounded-xl bg-[#F5C542]/10 border border-[#F5C542]/30 text-[#F5C542]">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F5C542] text-black text-[10px] font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Central de Notificações</span>
                {unreadCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5C542]/20 text-[#F5C542] font-black">
                    {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-gray-400">
                Avisos de novas aulas, atualizações e lançamentos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-2.5 py-1.5 rounded-lg bg-[#22222A] hover:bg-[#2C2C36] text-[11px] font-bold text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Marcar todas como lidas"
              >
                <CheckCheck className="w-3.5 h-3.5 text-[#F5C542]" />
                <span className="hidden sm:inline">Marcar lidas</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#22222A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-2">
              <Bell className="w-10 h-10 text-gray-600 mx-auto" />
              <p className="font-bold text-sm text-gray-300">Nenhuma notificação por enquanto</p>
              <p className="text-xs text-gray-500">
                Fique atento! Novas aulas e novidades do sistema aparecerão aqui.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isRead = !!readMap[notif.id];

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                    isRead
                      ? 'bg-[#141418] border-[#22222A] opacity-75 hover:opacity-100 hover:border-[#333]'
                      : 'bg-[#1A1A22] border-[#F5C542]/30 shadow-md shadow-[#F5C542]/5 hover:border-[#F5C542]/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isRead
                          ? 'bg-[#202028] text-gray-400'
                          : 'bg-[#F5C542]/15 border border-[#F5C542]/40 text-[#F5C542]'
                      }`}
                    >
                      {getIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-black tracking-tight truncate ${
                            isRead ? 'text-gray-300' : 'text-[#F5C542]'
                          }`}
                        >
                          {notif.title}
                        </span>
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#F5C542] shrink-0 animate-pulse" />
                        )}
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-[10px]">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(notif.createdAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short'
                            })}
                          </span>
                        </span>

                        <span className="inline-flex items-center gap-1 text-[#F5C542] font-black group-hover:translate-x-1 transition-transform">
                          <span>{notif.ctaText || 'VER AGORA'}</span>
                          <ArrowRight className="w-3 h-3 stroke-[3]" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#121216] border-t border-[#20202A] text-center">
          <p className="text-[10px] text-gray-500">
            As notificações são atualizadas em tempo real pela plataforma Review Sincero.
          </p>
        </div>
      </div>
    </div>
  );
};
