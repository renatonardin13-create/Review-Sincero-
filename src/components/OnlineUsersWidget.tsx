import React, { useState, useEffect } from 'react';
import { Users, Activity } from 'lucide-react';

export const OnlineUsersWidget: React.FC = () => {
  const [onlineCount, setOnlineCount] = useState<number>(() => {
    // Generate realistic initial online count between 120 and 240
    return Math.floor(Math.random() * 121) + 120;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const next = prev + change;
        return next < 85 ? 95 : next > 350 ? 340 : next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#151515] border border-[#2A2A2A] shadow-inner text-xs text-white">
      <div className="relative flex items-center justify-center">
        <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping absolute opacity-75" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] relative" />
      </div>
      <Users className="w-4 h-4 text-[#F5C542]" />
      <div className="flex items-center gap-1 font-medium">
        <span className="font-bold text-white text-sm">{onlineCount}</span>
        <span className="text-[#A1A1A1] text-[11px] hidden lg:inline">alunos online agora</span>
        <span className="text-[#A1A1A1] text-[11px] lg:hidden">online</span>
      </div>
    </div>
  );
};
