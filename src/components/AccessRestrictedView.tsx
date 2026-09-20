import React from 'react';
import { ShieldAlert, Lock, Crown, ArrowLeft, LogIn, CheckCircle2 } from 'lucide-react';
import { AuthUser, ADMIN_EMAIL } from '../types';

interface AccessRestrictedViewProps {
  currentUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onGoToDashboard: () => void;
}

export const AccessRestrictedView: React.FC<AccessRestrictedViewProps> = ({
  currentUser,
  onOpenAuthModal,
  onGoToDashboard
}) => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-6 animate-in fade-in duration-300">
      <div className="bg-[#121212] border border-[#2E2E2E] rounded-3xl p-8 md:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#EF4444]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] shadow-lg shadow-[#EF4444]/10">
          <Lock className="w-8 h-8" />
        </div>

        {/* Title and Explanation */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 text-xs font-bold text-[#EF4444] uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Acesso Restrito ao Administrador</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Painel Administrativo Exclusivo
          </h2>
          <p className="text-sm text-[#A1A1A1] max-w-md mx-auto leading-relaxed">
            Esta seção é reservada exclusivamente para a conta de <strong className="text-white">Administrador Master</strong> ({ADMIN_EMAIL}).
          </p>
        </div>

        {/* Current User Status Box */}
        <div className="p-4 rounded-2xl bg-[#181818] border border-[#262626] text-left flex items-center justify-between gap-4">
          <div className="space-y-0.5 overflow-hidden">
            <span className="text-[11px] font-bold text-[#777] uppercase tracking-wider">
              Seu perfil atual:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white truncate">
                {currentUser?.name || 'Visitante Não Autenticado'}
              </span>
              <span className="text-[10px] bg-[#2563EB]/20 text-[#38BDF8] border border-[#2563EB]/30 font-bold px-2 py-0.5 rounded-full uppercase">
                {currentUser ? 'Usuário Comum (Grátis)' : 'Sem Login'}
              </span>
            </div>
            <p className="text-xs text-[#8E8E8E] truncate">{currentUser?.email || 'Nenhum e-mail conectado'}</p>
          </div>
        </div>

        {/* Free Plan Features Available */}
        <div className="p-4 rounded-2xl bg-[#141414] border border-[#222222] text-left space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>Funcionalidades disponíveis no seu acesso gratuito:</span>
          </h4>
          <ul className="text-xs text-[#A1A1A1] space-y-1.5 list-disc list-inside">
            <li>Geração completa de Reviews com Inteligência Artificial</li>
            <li>Calculadora de Comissões e Lucro Real</li>
            <li>Comparador de Produtos e Catálogo de Campeões</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onGoToDashboard}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#333] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </button>

          <button
            type="button"
            onClick={onOpenAuthModal}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#F5C542] hover:bg-[#F5C542]/90 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#F5C542]/20 cursor-pointer transition-transform active:scale-95"
          >
            <Crown className="w-4 h-4" />
            <span>Entrar como Administrador</span>
          </button>
        </div>
      </div>
    </div>
  );
};
