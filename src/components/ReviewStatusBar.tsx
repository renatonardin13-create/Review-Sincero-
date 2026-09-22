import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Eye, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Save, 
  RotateCcw, 
  Send, 
  FileText,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { Review } from '../types';

interface ReviewStatusBarProps {
  review: Review;
  viewport: 'desktop' | 'tablet' | 'mobile';
  onViewportChange: (vp: 'desktop' | 'tablet' | 'mobile') => void;
  onSave: () => void;
  onRegenerateWithAi?: () => void;
  onPublish: () => void;
  onBack: () => void;
  isValidated: boolean;
}

export const ReviewStatusBar: React.FC<ReviewStatusBarProps> = ({
  review,
  viewport,
  onViewportChange,
  onSave,
  onRegenerateWithAi,
  onPublish,
  onBack,
  isValidated
}) => {
  const getStatusBadge = () => {
    switch (review.status) {
      case 'Publicado':
        return {
          label: 'PUBLICADO',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        };
      case 'Aprovado':
        return {
          label: 'APROVADO',
          color: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
        };
      case 'Em revisão':
        return {
          label: 'EM REVISÃO',
          color: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
        };
      case 'Arquivado':
        return {
          label: 'ARQUIVADO',
          color: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
        };
      case 'Rascunho':
      default:
        return {
          label: 'RASCUNHO',
          color: 'bg-[#F5C542]/10 text-[#F5C542] border-[#F5C542]/20'
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <div className="sticky top-0 z-40 bg-[#0D0D0D]/95 border-b border-[#2A2A2A] backdrop-blur-md px-4 md:px-6 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Title & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-white text-sm md:text-base truncate max-w-xs md:max-w-md">
                {review.productName || 'Review Sem Título'}
              </h2>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border uppercase ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Review Page Profissional • ID: <span className="font-mono text-gray-300">{review.id}</span>
            </p>
          </div>
        </div>

        {/* Center Viewport Toggle Buttons */}
        <div className="flex items-center justify-center bg-[#141414] border border-[#27272a] rounded-xl p-1 self-center">
          <button
            type="button"
            onClick={() => onViewportChange('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-[#F5C542] text-[#080808] shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => onViewportChange('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === 'tablet'
                ? 'bg-[#F5C542] text-[#080808] shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => onViewportChange('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-[#F5C542] text-[#080808] shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onSave}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-gray-200 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#F5C542]" />
            <span>Salvar Rascunho</span>
          </button>

          {onRegenerateWithAi && (
            <button
              type="button"
              onClick={onRegenerateWithAi}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-gray-200 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Regenerar IA</span>
            </button>
          )}

          <button
            type="button"
            onClick={onPublish}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer ${
              isValidated
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
                : 'bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] shadow-[#F5C542]/10'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{review.status === 'Publicado' ? 'Atualizar Publicação' : 'Publicar Review'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
