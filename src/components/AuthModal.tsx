import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Crown,
  User,
  CheckCircle2,
  AlertCircle,
  Zap
} from 'lucide-react';
import { AuthUser, ADMIN_EMAIL } from '../types';
import {
  loginWithGoogleAccount,
  loginWithEmailAccount
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

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; role: 'admin' | 'user' } | null>(null);

  const isInputAdmin = emailInput.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase().trim();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsSubmitting(true);
    const cleanEmail = emailInput.trim().toLowerCase();
    const isAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase().trim();

    setTimeout(() => {
      const user = loginWithEmailAccount(
        cleanEmail,
        nameInput.trim() || (isAdmin ? 'Renato Nardin' : undefined)
      );

      setFeedback({
        text: isAdmin
          ? 'Identificado como Administrador Master! Acesso total ativado.'
          : mode === 'signup'
          ? 'Usuário Comum cadastrado com sucesso!'
          : 'Identificado como Usuário Comum! Acesso liberado.',
        role: isAdmin ? 'admin' : 'user'
      });

      setTimeout(() => {
        onUserChanged(user);
        setIsSubmitting(false);
        onClose();
      }, 700);
    }, 500);
  };

  const handleGoogleLogin = (customEmail?: string, customName?: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const user = loginWithGoogleAccount(customEmail, customName);
      const isAdmin = user.role === 'admin';

      setFeedback({
        text: isAdmin
          ? 'Google Auth: Administrador Master autenticado!'
          : 'Google Auth: Usuário Comum autenticado!',
        role: isAdmin ? 'admin' : 'user'
      });

      setTimeout(() => {
        onUserChanged(user);
        setIsSubmitting(false);
        onClose();
      }, 700);
    }, 400);
  };

  const handleQuickPreset = (target: 'admin' | 'user') => {
    if (target === 'admin') {
      setEmailInput(ADMIN_EMAIL);
      setNameInput('Renato Nardin');
      setPasswordInput('admin2026Master');
    } else {
      setEmailInput('usuario.comum@gmail.com');
      setNameInput('Lucas Aluno');
      setPasswordInput('comum123456');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-[420px] bg-[#11141D] border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden">
        
        {/* Top Metallic Highlight Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-[#F5C542]/50 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#64748B] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#2C2F38] via-[#151821] to-[#0D0F16] border border-white/20 shadow-lg flex items-center justify-center p-0.5">
            <div className="w-full h-full rounded-[14px] bg-[#10131B] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-[#F5C542]" />
            </div>
          </div>
          <h3 className="mt-2 text-xs font-extrabold tracking-widest text-white/90 uppercase flex items-center gap-1">
            <span>Review</span>
            <span className="text-[#F5C542]">Sincero</span>
          </h3>
        </div>

        {/* Heading */}
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {mode === 'signin' ? (
              <>
                Welcome{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C542] via-[#EAB308] to-[#CA8A04]">
                  Back
                </span>
              </>
            ) : (
              <>
                Create{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C542] via-[#EAB308] to-[#CA8A04]">
                  Account
                </span>
              </>
            )}
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            {mode === 'signin'
              ? 'Sign in to continue your review journey'
              : 'Cadastre-se para acessar as ferramentas'}
          </p>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mb-4 p-3 rounded-2xl border text-xs flex items-center gap-2.5 animate-in fade-in ${
              feedback.role === 'admin'
                ? 'bg-[#231A05] border-[#F5C542]/50 text-[#FCD34D]'
                : 'bg-[#0B2117] border-[#10B981]/50 text-[#6EE7B7]'
            }`}
          >
            {feedback.role === 'admin' ? (
              <Crown className="w-4 h-4 text-[#F5C542] shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            )}
            <span className="font-medium">{feedback.text}</span>
          </div>
        )}

        {/* Live Admin Recognition Pill */}
        {emailInput && (
          <div className="mb-3">
            {isInputAdmin ? (
              <div className="p-2 rounded-xl bg-[#211A06] border border-[#F5C542]/40 flex items-center justify-between text-[10px] text-[#F5C542]">
                <div className="flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-[#F5C542]" />
                  <span className="font-bold">E-mail Administrativo Detectado</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-[#F5C542] text-black font-extrabold text-[8px] uppercase">
                  Admin Master
                </span>
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-[#131B2A] border border-[#3B82F6]/30 flex items-center justify-between text-[10px] text-[#93C5FD]">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#60A5FA]" />
                  <span>Perfil de Usuário Comum</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#93C5FD] font-bold text-[8px] uppercase">
                  Acesso Grátis
                </span>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#CBD5E1] block">
                Full Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8]">
                  <User className="w-3 h-3" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-[#181C26] border border-white/10 rounded-xl pl-11 pr-3 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#F5C542]/60 transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#CBD5E1] block">
              Email Address
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8]">
                <Mail className="w-3 h-3" />
              </div>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#181C26] border border-white/10 rounded-xl pl-11 pr-3 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#F5C542]/60 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#CBD5E1] block">
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8]">
                <Lock className="w-3 h-3" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#181C26] border border-white/10 rounded-xl pl-11 pr-10 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#F5C542]/60 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#64748B] hover:text-white cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !emailInput.trim()}
            className="w-full relative group overflow-hidden rounded-xl py-3 px-4 font-semibold text-xs text-white transition-all shadow-md cursor-pointer mt-1 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#241E15] via-[#7F612B] to-[#C79A45] group-hover:from-[#2F271B] group-hover:via-[#997635] group-hover:to-[#DBAA4E] transition-all" />
            <div className="absolute inset-0 border border-white/20 rounded-xl" />
            <div className="relative z-10 flex items-center justify-center gap-2 text-[#FFF7ED]">
              <span>{isSubmitting ? 'Autenticando...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </form>

        {/* Social Options */}
        <div className="mt-4">
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-white/10" />
            <span className="absolute bg-[#11141D] px-2 text-[10px] text-[#64748B]">
              or continue with
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mt-3">
            <button
              type="button"
              onClick={() => handleGoogleLogin(ADMIN_EMAIL, 'Renato Nardin')}
              disabled={isSubmitting}
              title="Entrar com Google (Admin Master)"
              className="h-10 rounded-xl bg-[#181C26] border border-white/10 hover:border-white/20 flex items-center justify-center transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.5 0 12.8s.6 4.5 1.6 6.4l3.7-2.9c0-.6 0-1 0-1.6z"/>
                <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16.4C3.5 20.2 7.4 23.5 12 23.5z"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleGoogleLogin('usuario.github@gmail.com', 'GitHub User')}
              disabled={isSubmitting}
              title="Entrar com GitHub (Usuário Comum)"
              className="h-10 rounded-xl bg-[#181C26] border border-white/10 hover:border-white/20 flex items-center justify-center transition-all cursor-pointer text-white/80"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('admin')}
              title="Preencher Admin Master"
              className="h-10 rounded-xl bg-[#181C26] border border-white/10 hover:border-[#0A66C2]/40 flex items-center justify-center transition-all cursor-pointer text-[#0A66C2] font-bold text-xs"
            >
              <span className="font-extrabold text-sm tracking-tighter">in</span>
            </button>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="mt-4 text-center">
          {mode === 'signin' ? (
            <p className="text-[11px] text-[#94A3B8]">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-semibold text-[#F5C542] hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-[11px] text-[#94A3B8]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="font-semibold text-[#F5C542] hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
