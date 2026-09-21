import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, History } from 'lucide-react';
import { SystemUpdate } from '../types';

interface ActivityLogProps {
  updates: SystemUpdate[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ updates }) => {
  // Only show the last 5 updates
  const recentUpdates = updates.slice(0, 5);

  if (recentUpdates.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 w-80 bg-[#141416]/95 border border-[#2A2A2E] rounded-2xl shadow-2xl backdrop-blur-xl p-4">
      <div className="flex items-center gap-2 mb-3 text-gray-400">
        <History className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Atividade Recente</span>
      </div>
      <div className="space-y-3">
        <AnimatePresence>
          {recentUpdates.map((update) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-3 border-b border-[#222] pb-2 last:border-0 last:pb-0"
            >
              <div className="mt-1">
                <Clock className="w-3 h-3 text-[#F5C542]/60" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h5 className="text-xs font-bold text-white truncate">{update.title}</h5>
                <p className="text-[10px] text-gray-400 truncate">{update.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
