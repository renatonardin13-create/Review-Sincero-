import React, { useState } from 'react';
import { 
  Send, 
  Globe, 
  Copy, 
  Download, 
  Check, 
  Link as LinkIcon, 
  ShieldCheck, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Review } from '../types';

interface ReviewPublishPanelProps {
  review: Review;
  onStatusChange: (status: Review['status']) => void;
  onDownloadHtml: () => void;
  onPreviewPublic: () => void;
  isValidToPublish: boolean;
}

export const ReviewPublishPanel: React.FC<ReviewPublishPanelProps> = ({
  review,
  onStatusChange,
  onDownloadHtml,
  onPreviewPublic,
  isValidToPublish
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const publicSlug = review.slug || review.id;
  const publicUrl = `${window.location.origin}/review/${publicSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-[#121214] border border-[#27272a] rounded-3xl p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Publicação & Exportação</h3>
            <p className="text-xs text-[#A1A1A1]">Gerencie a publicação web e exporte o código HTML independente</p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
          review.status === 'Publicado' 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-[#F5C542]/10 text-[#F5C542] border-[#F5C542]/20'
        }`}>
          {review.status}
        </span>
      </div>

      {/* Workflow Status Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
          Etapa do Fluxo Profissional *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(['Rascunho', 'Em revisão', 'Aprovado', 'Publicado', 'Arquivado'] as Review['status'][]).map((st) => (
            <button
              key={st}
              type="button"
              disabled={st === 'Publicado' && !isValidToPublish}
              onClick={() => onStatusChange(st)}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                review.status === st
                  ? 'bg-[#F5C542] text-[#080808] border-[#F5C542] shadow-md'
                  : 'bg-[#18181b] border-[#27272a] text-gray-400 hover:text-white hover:border-[#3f3f46] disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Link Preview & Actions */}
      <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-3">
        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <LinkIcon className="w-3.5 h-3.5 text-[#F5C542]" />
          <span>Link Público da Review Page</span>
        </label>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={publicUrl}
            className="flex-1 bg-[#121214] border border-[#27272a] text-gray-300 text-xs font-mono rounded-xl px-3.5 py-2.5 focus:outline-none"
          />

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>

          <button
            type="button"
            onClick={onPreviewPublic}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#F5C542]/10 hover:bg-[#F5C542]/20 border border-[#F5C542]/30 text-[#F5C542] text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Abrir Page</span>
          </button>
        </div>
      </div>

      {/* Standalone HTML Export */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-white">Exportação HTML Independente</h4>
          <p className="text-[11px] text-gray-400">
            Gera um arquivo HTML completo sem necessidade de banco de dados ou login do visitante.
          </p>
        </div>

        <button
          type="button"
          onClick={onDownloadHtml}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold transition-all cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 text-[#F5C542]" />
          <span>Baixar HTML Independente</span>
        </button>
      </div>
    </div>
  );
};
