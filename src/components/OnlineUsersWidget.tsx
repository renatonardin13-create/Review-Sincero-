import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Sparkles } from 'lucide-react';
import { initPresenceTracker, PresenceState } from '../services/presenceService';

export const OnlineUsersWidget: React.FC = () => {
  const [presence, setPresence] = useState<PresenceState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    activeSessionCount: 148,
    reviewsCreatingCount: 86,
    quizzesCreatingCount: 62
  });

  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    const cleanup = initPresenceTracker((newState) => {
      setPresence(newState);
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 1200);
      return () => clearTimeout(timer);
    });
    return cleanup;
  }, []);

  const count = presence.activeSessionCount || 148;

  return (
    <div className="relative group">
      <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#151515] border transition-all duration-500 shadow-inner text-xs text-white cursor-pointer ${
        highlight ? 'border-[#F5C542] bg-[#1A1A1A] shadow-[#F5C542]/10 shadow-lg' : 'border-[#2A2A2A] hover:border-[#3A3A3A]'
      }`}>
        <div className="relative flex items-center justify-center">
          <span className={`w-2.5 h-2.5 rounded-full ${presence.isOnline ? 'bg-[#22C55E]' : 'bg-amber-500'} animate-ping absolute opacity-75`} />
          <span className={`w-2.5 h-2.5 rounded-full ${presence.isOnline ? 'bg-[#22C55E]' : 'bg-amber-500'} relative`} />
        </div>
        
        <Users className="w-4 h-4 text-[#F5C542]" />

        <div className="flex items-center gap-1.5 font-medium whitespace-nowrap">
          {presence.isOnline ? (
            <span className="text-[#A1A1A1] text-xs flex items-center gap-1">
              <span className={`font-bold text-white text-sm transition-transform duration-300 ${highlight ? 'scale-110 text-[#F5C542]' : ''}`}>
                {count}
              </span>
              <span>pessoas online agora</span>
            </span>
          ) : (
            <span className="text-[#A1A1A1] text-[11px]">Modo offline</span>
          )}
        </div>
      </div>

      {/* Hover Card / Popover with live stats */}
      <div className="absolute top-full left-0 mt-2 hidden group-hover:block z-50 w-64 p-3.5 rounded-2xl bg-[#141414] border border-[#2A2A2A] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#222222]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-xs font-bold text-white">Atividade Ao Vivo</span>
          </div>
          <span className="text-[10px] text-[#A1A1A1] font-mono">Real-time</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#A1A1A1]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F5C542]" />
              Gerando Reviews
            </span>
            <span className="font-bold text-white">{presence.reviewsCreatingCount || Math.floor(count * 0.58)}</span>
          </div>

          <div className="flex items-center justify-between text-[#A1A1A1]">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Criando Quizzes
            </span>
            <span className="font-bold text-white">{presence.quizzesCreatingCount || Math.floor(count * 0.42)}</span>
          </div>

          <div className="pt-2 border-t border-[#222222] text-[10px] text-[#A1A1A1]/80 text-center flex items-center justify-center gap-1">
            <span>⚡ Flutuação contínua de usuários ativos</span>
          </div>
        </div>
      </div>
    </div>
  );
};


