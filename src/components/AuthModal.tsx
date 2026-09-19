import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Crown,
  User,
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { AuthUser, ADMIN_EMAIL } from '../types';
import {
  loginWithGoogleAccount,
  loginWithEmailAccount,
  DEFAULT_ADMIN_USER,
  DEFAULT_FREE_USER
} from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser;
  onUserChanged: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged
}) => {
  if (!isOpen) return null;

  const [emailInput, setEmailInput] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleLoginGoogleClick = (presetEmail?: string, presetName?: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const user = loginWithGoogleAccount(presetEmail, presetName);
      onUserChanged(user);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const user = loginWithEmailAccount(emailInput, nameInput);
      onUserChanged(user);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const isCurrentAdmin = currentUser.role === 'admin';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#101010] border border-[#2A2A2A] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5C542]/15 border border-[#F5C542]/30 flex items-center justify-center text-[#F5C542]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Controle de Acesso & Login</h2>
              <p className="text-xs text-[#8E8E8E]">
                Separação entre Usuário Comum e Administrador
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#777] hover:text-white hover:bg-[#222] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Account Banner */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
            isCurrentAdmin
              ? 'bg-[#1C1809] border-[#F5C542]/40 text-[#F5C542]'
              : 'bg-[#131B2A] border-[#2563EB]/40 text-[#38BDF8]'
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shrink-0 ${
                isCurrentAdmin
                  ? 'bg-[#F5C542] text-black shadow-md shadow-[#F5C542]/20'
                  : 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
              }`}
            >
              {isCurrentAdmin ? '👑' : '👤'}
            </div>
            <div className="space-y-0.5 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-black/40 border border-current">
                  {isCurrentAdmin ? 'ADMINISTRADOR MASTER' : 'USUÁRIO COMUM (GRÁTIS)'}
                </span>
              </div>
              <p className="text-xs font-bold text-white truncate">{currentUser.email}</p>
              <p className="text-[10px] text-[#A1A1A1]">
                {isCurrentAdmin
                  ? 'Liberado: Todas as ferramentas + Gestão de Aulas & Banners'
                  : 'Liberado: Área de Membros + Ferramentas de Criação de Review'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick 1-Click Role Switcher Presets */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-[#A1A1A1] uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#F5C542]" />
            <span>Alternar Perfil em 1 Clique para Teste:</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Admin Preset Button */}
            <button
              type="button"
              onClick={() => handleLoginGoogleClick(ADMIN_EMAIL, 'Renato Nardin')}
              disabled={isSubmitting}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
                  ? 'bg-[#2A2208] border-[#F5C542] shadow-lg shadow-[#F5C542]/10'
                  : 'bg-[#151515] border-[#2E2E2E] hover:border-[#F5C542]/50 hover:bg-[#1C1A14]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#F5C542] text-black uppercase flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  <span>Admin Master</span>
                </span>
                {currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && (
                  <CheckCircle2 className="w-4 h-4 text-[#F5C542]" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-white">renatonardin13@gmail.com</p>
                <p className="text-[10px] text-[#A1A1A1] mt-0.5">
                  Acesso Total + Painel Administrativo
                </p>
              </div>
            </button>

            {/* Free User Preset Button */}
            <button
              type="button"
              onClick={() => handleLoginGoogleClick('usuario.aluno@gmail.com', 'Membro Aluno VIP')}
              disabled={isSubmitting}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                currentUser.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()
                  ? 'bg-[#121B2A] border-[#38BDF8] shadow-lg shadow-blue-500/10'
                  : 'bg-[#151515] border-[#2E2E2E] hover:border-[#38BDF8]/50 hover:bg-[#121926]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#2563EB] text-white uppercase flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>Usuário Comum</span>
                </span>
                {currentUser.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() && (
                  <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-white">usuario.aluno@gmail.com</p>
                <p className="text-[10px] text-[#A1A1A1] mt-0.5">
                  Acesso Gratuito à Área de Membros
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[#222]" />
          <span className="absolute bg-[#101010] px-3 text-[11px] text-[#666] uppercase font-bold">
            ou acesse com qualquer outro e-mail
          </span>
        </div>

        {/* Custom Email / Google Login Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#E0E0E0] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#A1A1A1]" />
              <span>Digite seu E-mail Google:</span>
            </label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="ex: seuemail@gmail.com"
              className="w-full bg-[#181818] border border-[#2E2E2E] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#F5C542] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !emailInput.trim()}
            className="w-full py-3 bg-[#F5C542] hover:bg-[#FFD95A] disabled:opacity-50 text-[#080808] font-black rounded-xl text-xs shadow-lg shadow-[#F5C542]/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Entrar com este E-mail</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>

        {/* Notice Info */}
        <div className="p-3 bg-[#151515] rounded-xl border border-[#222] text-[11px] text-[#8E8E8E] leading-relaxed">
          💡 <strong>Regra do Administrador:</strong> Qualquer acesso com o e-mail{' '}
          <strong className="text-[#F5C542]">{ADMIN_EMAIL}</strong> é automaticamente reconhecido
          como <strong>Administrador Master</strong>, desbloqueando a área administrativa e o painel
          de edição de aulas. Demais e-mails recebem acesso como <strong>Usuário Aluno Gratuito</strong>.
        </div>
      </div>
    </div>
  );
};
