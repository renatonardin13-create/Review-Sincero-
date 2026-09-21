import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { initPresenceTracker } from '../services/presenceService';

export const OnlineUsersWidget: React.FC = () => {
  const [presence, setPresence] = useState({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    activeSessionCount: 0
  });

  useEffect(() => {
    const cleanup = initPresenceTracker(setPresence);
    return cleanup;
  }, []);

  const count = presence.activeSessionCount;
  const personText = count === 1 ? 'pessoa' : 'pessoas';

  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#151515] border border-[#2A2A2A] shadow-inner text-xs text-white">
      <div className="relative flex items-center justify-center">
        <span className={`w-2.5 h-2.5 rounded-full ${presence.isOnline ? 'bg-[#22C55E]' : 'bg-amber-500'} animate-ping absolute opacity-75`} />
        <span className={`w-2.5 h-2.5 rounded-full ${presence.isOnline ? 'bg-[#22C55E]' : 'bg-amber-500'} relative`} />
      </div>
      <Users className="w-4 h-4 text-[#F5C542]" />
      <div className="flex items-center gap-1 font-medium overflow-hidden h-4">
        {presence.isOnline ? (
          <span className="text-[#A1A1A1] text-[11px] whitespace-nowrap">
            <span className="font-bold text-white text-sm mr-1">{count}</span>
            {personText} usando agora
          </span>
        ) : (
          <span className="text-[#A1A1A1] text-[11px]">Modo offline</span>
        )}
      </div>
    </div>
  );
};

