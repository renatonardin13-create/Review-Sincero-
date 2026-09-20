import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, ExternalLink, Sparkles, X, Clock, ShieldCheck } from 'lucide-react';
import { SystemUpdate, AuthUser } from '../types';
import { subscribeSystemUpdates, subscribeToNotificationReads, markUpdateAsRead } from '../services/systemUpdateService';

interface SystemUpdatesModalProps {
  currentUser?: AuthUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SystemUpdatesModal: React.FC<SystemUpdatesModalProps> = ({
  currentUser,
  isOpen,
  onClose
}) => {
  const [updates, setUpdates] = useState<SystemUpdate[]>([]);
  const [readMap, setReadMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsubUpdates = subscribeSystemUpdates((items) => {
      setUpdates(items.filter(u => u.published));
    });

    let unsubReads = () => {};
    if (currentUser?.id) {
      unsubReads = subscribeToNotificationReads(currentUser.id, (map) => {
        setReadMap(map);
      });
    }

    return () => {
      unsubUpdates();
      unsubReads();
    };
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSelectUpdate = async (item: SystemUpdate) => {
    if (currentUser?.id && !readMap[item.id]) {
      await markUpdateAsRead(currentUser.id, item.id);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!currentUser?.id) return;
    for (const item of updates) {
      if (!readMap[item.id]) {
        await markUpdateAsRead(currentUser.id, item.id);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#121214] border border-[#27272a] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5C542]/10 border border-[#F5C542]/20 text-[#F5C542] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Central de Notificações & Atualizações</h3>
              <p className="text-xs text-gray-400">Acompanhe as últimas novidades e melhorias do Review Sincero</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl bg-[#1c1c21] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions bar */}
        <div className="px-6 py-3 bg-[#18181b]/50 border-b border-[#27272a] flex items-center justify-between text-xs">
          <span className="text-gray-400">
            {updates.filter(u => !readMap[u.id]).length} não lida(s)
          </span>
          {updates.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-[#F5C542] hover:underline font-semibold cursor-pointer"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 divide-y divide-[#27272a]/40">
          {updates.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#1e1e24] flex items-center justify-center text-gray-500 mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-gray-400 text-sm">Nenhuma atualização publicada no momento.</p>
            </div>
          ) : (
            updates.map((item) => {
              const isRead = !!readMap[item.id];
              return (
                <div 
                  key={item.id} 
                  onClick={() => handleSelectUpdate(item)}
                  className={`pt-4 first:pt-0 transition-all cursor-pointer rounded-2xl p-4 ${isRead ? 'bg-[#151518]/40 opacity-80' : 'bg-[#18181b] border border-[#27272a] shadow-lg'}`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#27272a] text-[#F5C542] flex items-center justify-center font-bold text-xs shrink-0 font-mono mt-0.5">
                      {item.version}
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm md:text-base">{item.title}</h4>
                          {!isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#F5C542] animate-pulse" />
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{item.message}</p>

                      {item.imageUrl && item.imageUrl.trim() ? (
                        <div className="mt-2 rounded-xl overflow-hidden border border-[#27272a] max-h-60 bg-black">
                          <img src={item.imageUrl.trim()} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      ) : null}

                      {item.ctaUrl && (
                        <div className="pt-2">
                          <a
                            href={item.ctaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5C542] hover:bg-[#FFD95A] text-black font-bold text-xs rounded-xl transition-all shadow-md"
                          >
                            <span>{item.ctaText || 'Saiba mais'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#18181b] border-t border-[#27272a] text-center text-xs text-gray-500">
          Review Sincero • Sincronizado via Firebase Firestore & Auth
        </div>
      </div>
    </div>
  );
};
