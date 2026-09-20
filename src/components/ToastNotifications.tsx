import React, { useState, useEffect } from 'react';
import { Bell, ExternalLink, Sparkles, X, BookOpen, CheckCircle2 } from 'lucide-react';
import { SystemUpdate, AuthUser } from '../types';
import { subscribeSystemUpdates, subscribeToNotificationReads, markUpdateAsRead } from '../services/systemUpdateService';

interface ToastNotificationsProps {
  currentUser?: AuthUser | null;
}

interface ToastItem {
  id: string;
  title: string;
  message: string;
  version?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  createdAt: string;
}

export const ToastNotifications: React.FC<ToastNotificationsProps> = ({ currentUser }) => {
  const [activeToasts, setActiveToasts] = useState<ToastItem[]>([]);
  const [readMap, setReadMap] = useState<Record<string, string>>({});

  useEffect(() => {
    let unsubReads = () => {};
    if (currentUser?.id) {
      unsubReads = subscribeToNotificationReads(currentUser.id, (map) => {
        setReadMap(map);
      });
    }

    const unsubUpdates = subscribeSystemUpdates((items) => {
      const published = items.filter(u => u.published);
      // Find unread items
      const unread = published.filter(u => !readMap[u.id]);
      
      // If there are unread updates, trigger toast for the most recent unread ones (up to 2)
      if (unread.length > 0) {
        const topToasts: ToastItem[] = unread.slice(0, 2).map(u => ({
          id: u.id,
          title: u.title,
          message: u.message,
          version: u.version,
          imageUrl: u.imageUrl,
          ctaText: u.ctaText,
          ctaUrl: u.ctaUrl,
          createdAt: u.createdAt
        }));
        
        setActiveToasts(topToasts);
      }
    });

    return () => {
      unsubUpdates();
      unsubReads();
    };
  }, [currentUser, readMap]);

  const handleDismiss = async (toastId: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== toastId));
    if (currentUser?.id) {
      await markUpdateAsRead(currentUser.id, toastId);
    }
  };

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-[380px] w-full px-4 sm:px-0 pointer-events-none">
      {activeToasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#141416]/95 border border-[#2A2A2E] rounded-2xl p-4 shadow-2xl backdrop-blur-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 group"
        >
          {/* Glowing accent background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5C542]/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />

          <div className="flex items-start justify-between gap-3 relative z-10 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#F5C542]/20 text-[#F5C542] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#222] text-[#F5C542] border border-[#333]">
                  {toast.version ? `Versão ${toast.version}` : 'Novo Tutorial / Material'}
                </span>
                <h4 className="font-bold text-white text-sm mt-1 leading-tight">{toast.title}</h4>
              </div>
            </div>

            <button
              onClick={() => handleDismiss(toast.id)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#222] transition-colors cursor-pointer shrink-0"
              title="Dispensar alerta"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed mb-3 line-clamp-2 relative z-10">
            {toast.message}
          </p>

          {toast.imageUrl && toast.imageUrl.trim() ? (
            <div className="mb-3 rounded-xl overflow-hidden border border-[#2A2A2E] h-28 relative z-10">
              <img src={toast.imageUrl.trim()} alt={toast.title} className="w-full h-full object-cover" />
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-2 relative z-10 pt-1 border-t border-[#222]">
            <span className="text-[10px] text-gray-500">
              Liberado recentemente
            </span>

            <div className="flex items-center gap-2">
              {toast.ctaUrl && (
                <a
                  href={toast.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] text-xs font-bold transition-all shadow-md shadow-[#F5C542]/10 cursor-pointer"
                  onClick={() => handleDismiss(toast.id)}
                >
                  <span>{toast.ctaText || 'Acessar agora'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <button
                onClick={() => handleDismiss(toast.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#222] hover:bg-[#2A2A2E] text-gray-300 text-xs font-bold transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Entendi</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
